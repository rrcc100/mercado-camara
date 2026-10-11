import { readFile, mkdir, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { allowedKeys, secretsFile, safeError } from "./config.mjs";
try {
  const path = process.argv[2];
  if (!path) throw Object.assign(new Error(), { code: "SOURCE_PATH_REQUIRED" });
  const env = parseEnv(await readFile(path, "utf8"));
  const selected = Object.fromEntries(
    allowedKeys.map((key) => [key, env[key] ?? ""]),
  );
  await mkdir(new URL("../../.secrets/", import.meta.url), { recursive: true });
  await writeFile(secretsFile, JSON.stringify(selected, null, 2) + "\n", {
    flag: "wx",
    mode: 0o600,
  });
  console.log(
    "Configuración mínima copiada a .secrets/camara.json. No se mostraron valores ni se copió el .env completo.",
  );
} catch (error) {
  console.error(JSON.stringify(safeError(error)));
  process.exitCode = 1;
}
