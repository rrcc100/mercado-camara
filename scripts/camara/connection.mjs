import mysql from "mysql2/promise";
import { safeError } from "./config.mjs";
export function assertReadQuery(sql) {
  // Only checked-in SELECT/CTE statements are accepted. No arbitrary SQL CLI.
  if (
    !/^\s*(SELECT|WITH)\b/i.test(sql) ||
    /;|--|\/\*|\b(INSERT|UPDATE|DELETE|REPLACE|CREATE|ALTER|DROP|TRUNCATE|CALL|GRANT|REVOKE|INTO|OUTFILE|DUMPFILE|FOR\s+UPDATE|LOCK|SLEEP|BENCHMARK|GET_LOCK)\b/i.test(
      sql,
    )
  )
    throw Object.assign(new Error("Consulta fuera del modo lectura"), {
      code: "READ_ONLY_QUERY_REJECTED",
    });
}
export const quote = (value) => {
  if (!/^[\w-]+$/.test(value))
    throw Object.assign(new Error(), { code: "UNSAFE_IDENTIFIER" });
  return `\`${value}\``;
};
export async function openReadOnly(target) {
  const connection = await mysql.createConnection(target.options);
  try {
    await connection.query("SET SESSION TRANSACTION READ ONLY");
    await connection.query("START TRANSACTION READ ONLY");
    const [settings] = await connection.query(
      "SELECT @@session.transaction_read_only AS transaction_read_only, @@version AS server_version",
    );
    if (Number(settings[0].transaction_read_only) !== 1)
      throw Object.assign(new Error(), { code: "READ_ONLY_NOT_CONFIRMED" });
    let privileges = {
      verified: false,
      readOnlyAccount: null,
      broadPrivileges: null,
    };
    try {
      const [grants] = await connection.query("SHOW GRANTS");
      const clauses = grants.map((row) => String(Object.values(row)[0]));
      const sets = clauses.map((line) =>
        /^GRANT (.+?) ON /i.exec(line)?.[1]?.split(/,\s*/),
      );
      privileges = {
        verified: true,
        readOnlyAccount:
          sets.every(
            (set) =>
              set &&
              set.every((p) =>
                /^(SELECT|SHOW VIEW|USAGE)(\s*\([^)]*\))?$/i.test(p),
              ),
          ) && clauses.every((c) => !/WITH GRANT OPTION/i.test(c)),
        broadPrivileges: clauses.some((c) =>
          /\b(ALL PRIVILEGES|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|GRANT OPTION)\b/i.test(
            c,
          ),
        ),
      };
    } catch {
      /* permission to inspect grants may be absent; never log raw grants */
    }
    return {
      info: {
        connected: true,
        readOnlyTransaction: true,
        serverVersion: settings[0].server_version,
        tlsConfigured: !!target.options.ssl,
        privileges,
      },
      async select(sql, params = []) {
        assertReadQuery(sql);
        const [rows] = await connection.query(
          {
            sql: sql.replace(
              /\bSELECT\b/gi,
              "SELECT /*+ MAX_EXECUTION_TIME(20000) */",
            ),
            timeout: 25000,
          },
          params,
        );
        return rows;
      },
      async close() {
        try {
          await connection.rollback();
        } finally {
          await connection.end();
        }
      },
    };
  } catch (error) {
    await connection.end();
    throw Object.assign(
      new Error("Fallo seguro de conexión"),
      safeError(error),
    );
  }
}
