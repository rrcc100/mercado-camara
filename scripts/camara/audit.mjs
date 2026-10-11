import { mkdir, writeFile } from "node:fs/promises";
import { loadConfig, safeError } from "./config.mjs";
import { openReadOnly } from "./connection.mjs";
import { queriesFor } from "./queries.mjs";
const mode = process.argv[2] || "metadata";
if (!["connection", "metadata", "aggregate"].includes(mode))
  throw new Error("Modo inválido");
const report = {
  startedAt: new Date().toISOString(),
  mode,
  readOnly: true,
  sources: [],
  errors: [],
};
try {
  const targets = await loadConfig();
  for (const target of targets) {
    const source = {
      alias: target.alias,
      databaseKey: target.databaseKey,
      checkedAt: new Date().toISOString(),
      connection: null,
      tables: [],
      columns: [],
      keys: [],
    };
    report.sources.push(source);
    let session;
    try {
      session = await openReadOnly(target);
      source.connection = session.info;
      if (mode === "metadata") {
        source.tables = await session.select(
          "SELECT TABLE_NAME AS table_name, TABLE_TYPE AS table_type, ENGINE AS engine, TABLE_ROWS AS estimated_rows FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME",
        );
        source.columns = await session.select(
          "SELECT TABLE_NAME AS table_name, COLUMN_NAME AS column_name, COLUMN_TYPE AS column_type, DATA_TYPE AS data_type, IS_NULLABLE AS nullable, COLUMN_KEY AS column_key, CHARACTER_SET_NAME AS character_set, COLLATION_NAME AS collation_name, ORDINAL_POSITION AS position FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME, ORDINAL_POSITION",
        );
        source.keys = await session.select(
          "SELECT TABLE_NAME AS table_name, CONSTRAINT_NAME AS constraint_name, COLUMN_NAME AS column_name, ORDINAL_POSITION AS position, REFERENCED_TABLE_NAME AS referenced_table, REFERENCED_COLUMN_NAME AS referenced_column, CASE WHEN REFERENCED_TABLE_SCHEMA = DATABASE() THEN 'same' WHEN REFERENCED_TABLE_SCHEMA IS NULL THEN NULL ELSE 'external' END AS referenced_scope FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME, CONSTRAINT_NAME, ORDINAL_POSITION",
        );
      }
      if (mode === "aggregate") {
        source.metrics = {};
        for (const [label, sql] of queriesFor(target.alias, targets)) {
          try {
            source.metrics[label] = await session.select(sql);
          } catch (error) {
            source.metrics[label] = { error: safeError(error) };
            report.errors.push({
              source: source.alias,
              query: label,
              ...safeError(error),
            });
          }
          console.log(
            JSON.stringify({
              source: source.alias,
              query: label,
              result: source.metrics[label],
            }),
          );
        }
      }
      console.log(
        JSON.stringify({
          source: source.alias,
          connection: source.connection,
          tables: source.tables.map((t) => t.table_name),
        }),
      );
    } catch (error) {
      source.error = safeError(error);
      report.errors.push({ source: source.alias, ...source.error });
      console.log(
        JSON.stringify({ source: source.alias, error: source.error }),
      );
    } finally {
      if (session) {
        try {
          await session.close();
        } catch (error) {
          report.errors.push({
            source: source.alias,
            stage: "close",
            ...safeError(error),
          });
        }
      }
    }
  }
} catch (error) {
  report.errors.push(safeError(error));
  console.error(JSON.stringify(safeError(error)));
}
report.finishedAt = new Date().toISOString();
const dir = new URL("../../reports/camara-audit/", import.meta.url);
await mkdir(dir, { recursive: true });
await writeFile(
  new URL(`latest-${mode}.json`, dir),
  JSON.stringify(report, null, 2) + "\n",
);
await writeFile(
  new URL(`${report.startedAt.replace(/[:.]/g, "-")}-${mode}.json`, dir),
  JSON.stringify(report, null, 2) + "\n",
);
if (report.errors.length) process.exitCode = 1;
