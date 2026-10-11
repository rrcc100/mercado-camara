import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
export const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
export const secretsFile = new URL(
  "../../.secrets/camara.json",
  import.meta.url,
);
export const allowedKeys = [
  "HOST_CAMARA",
  "USER_CAMARA",
  "PASS_CAMARA",
  "DB_CAMARA_SOCIOS",
  "DB_CAMARA_CURSOS",
  "CAMARA_DB_HOST",
  "CAMARA_DB_PORT",
  "CAMARA_DB_NAME",
  "CAMARA_DB_USER",
  "CAMARA_DB_PASSWORD",
  "CAMARA_DB_SSL",
  "CAMARA_DB_AUTH_PLUGIN",
];
export async function loadConfig() {
  let values;
  try {
    values = JSON.parse(await readFile(secretsFile, "utf8"));
  } catch {
    throw Object.assign(new Error("No se pudo leer .secrets/camara.json"), {
      code: "LOCAL_CONFIG_UNAVAILABLE",
    });
  }
  const port = Number(values.CAMARA_DB_PORT || 3306);
  if (
    !["", "mysql_native_password", "caching_sha2_password"].includes(
      values.CAMARA_DB_AUTH_PLUGIN || "",
    )
  )
    throw Object.assign(new Error(), { code: "AUTH_PLUGIN_HINT_INVALID" });
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw Object.assign(new Error("Puerto inválido"), {
      code: "LOCAL_CONFIG_INVALID",
    });
  const sslValue = (values.CAMARA_DB_SSL || "false").toLowerCase();
  if (!["true", "false", "1", "0"].includes(sslValue))
    throw Object.assign(new Error("SSL inválido"), {
      code: "LOCAL_CONFIG_INVALID",
    });
  const ssl = ["true", "1"].includes(sslValue)
    ? { rejectUnauthorized: true }
    : undefined;
  const common = {
    port,
    ssl,
    connectTimeout: 10000,
    multipleStatements: false,
    enableKeepAlive: false,
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings: true,
    decimalNumbers: false,
    timezone: "Z",
    flags: "-LOCAL_FILES",
  };
  const legacyAccount = {
    host: values.HOST_CAMARA,
    user: values.USER_CAMARA,
    password: values.PASS_CAMARA,
  };
  const canonicalAccount = {
    host: values.CAMARA_DB_HOST,
    user: values.CAMARA_DB_USER,
    password: values.CAMARA_DB_PASSWORD,
  };
  const targets = [
    {
      alias: "socios",
      databaseKey: "DB_CAMARA_SOCIOS",
      options: {
        ...common,
        ...legacyAccount,
        database: values.DB_CAMARA_SOCIOS,
      },
    },
    {
      alias: "cursos",
      databaseKey: "DB_CAMARA_CURSOS",
      options: {
        ...common,
        ...legacyAccount,
        database: values.DB_CAMARA_CURSOS,
      },
    },
    {
      alias: "historica",
      databaseKey: "CAMARA_DB_NAME",
      options: {
        ...common,
        ...canonicalAccount,
        database: values.CAMARA_DB_NAME,
      },
    },
  ];
  for (const target of targets)
    if (
      ["host", "user", "password", "database"].some((k) => !target.options[k])
    )
      throw Object.assign(
        new Error(`Configuración incompleta: ${target.alias}`),
        { code: "LOCAL_CONFIG_INCOMPLETE" },
      );
  return targets;
}
// Error messages from mysql2 may contain users, hosts, SQL or connection details.
export function safeError(error) {
  const code = /^[A-Z0-9_]+$/.test(error?.code ?? "")
    ? error.code
    : "AUDIT_ERROR";
  return {
    code,
    errno: Number.isInteger(error?.errno) ? error.errno : null,
    sqlState: /^[A-Z0-9]{5}$/.test(error?.sqlState ?? "")
      ? error.sqlState
      : null,
  };
}
