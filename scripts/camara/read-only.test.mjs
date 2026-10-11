import { test } from "node:test";
import assert from "node:assert/strict";
import { assertReadQuery, quote } from "./connection.mjs";
import { queriesFor } from "./queries.mjs";
import { safeError } from "./config.mjs";

test("all checked-in plans accept only SELECT/CTE; no client-supplied SQL", () => {
  const targets = ["socios", "cursos", "historica"].map((alias) => ({
    alias,
    options: { database: `test_${alias}` },
  }));
  for (const { alias } of targets) {
    const queries = queriesFor(alias, targets);
    assert.equal(new Set(queries.map(([label]) => label)).size, queries.length);
    for (const [, sql] of queries)
      assert.doesNotThrow(() => assertReadQuery(sql));
  }
});
test("rejects writes, stacked statements, locking, routines and exports", () => {
  for (const sql of [
    "DELETE FROM x",
    "WITH a AS (SELECT 1) DELETE FROM x",
    "SELECT 1; DROP TABLE x",
    "SELECT * FROM x FOR UPDATE",
    "SELECT 1 INTO OUTFILE 'x'",
    "SELECT SLEEP(3)",
    "SELECT 1 /* comment */",
    "CALL proc()",
  ])
    assert.throws(() => assertReadQuery(sql));
  assert.throws(() => quote("db` JOIN private"));
});
test("driver error redaction drops SQL, host, account and passwords", () => {
  assert.deepEqual(
    safeError({
      code: "ER_ACCESS_DENIED_ERROR",
      errno: 1045,
      sqlState: "28000",
      message: "password example",
      sql: "private",
      host: "private",
    }),
    { code: "ER_ACCESS_DENIED_ERROR", errno: 1045, sqlState: "28000" },
  );
  assert.equal(
    safeError({ code: "private.example: password" }).code,
    "AUDIT_ERROR",
  );
});
