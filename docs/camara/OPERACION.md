# Operación local independiente

Desde la raíz de Mercado Cámara, Node 22+ (validado con 24.19), pnpm 11.19 y acceso de red al MySQL autorizado:

```powershell
pnpm install --frozen-lockfile
pnpm camara:test
pnpm camara:check
pnpm camara:metadata
pnpm camara:audit
```

No se ejecuta ni se importa código del Observatorio. `mysql2` es una devDependency propia con lockfile. No hace falta levantar Next.js para auditar, ni MySQL para compilar/explorar el frontend. Estos comandos no son un servicio HTTP ni una API alternativa.

También se puede ejecutar la CLI sin Node instalado en el host usando el servicio opcional `camara-audit` de Docker. Ver [comandos y montaje de secretos](../DOCKER.md). Ese servicio no se inicia al levantar el frontend.

## Secretos

La configuración ya quedó copiada en `.secrets/camara.json`, excluida por `.gitignore`. Se lee sólo desde `scripts/camara/config.mjs`; no es `.env.local`, no lleva NEXT_PUBLIC, no vive en public ni se importa en src. Mantener acceso local restringido al usuario en Windows; el modo 0600 solicitado por Node no sustituye las ACL de Windows.

Para otra máquina, copiar `config/camara.example.json` a `.secrets/camara.json` y completar de forma privada. Todos los valores de ejemplo están vacíos. Importación opcional de una sola vez desde un archivo autorizado:

```powershell
pnpm camara:import-config "C:\ruta-autorizada\backend\.env"
```

El importador copia sólo la lista permitida; nunca el .env completo. Usa creación exclusiva y **no sobrescribe** un secreto existente. No necesita la ruta fuente después. No imprimir el archivo, pasarlo como URL/argumentos de conexión ni compartirlo en un commit.

| Claves | Uso local |
|---|---|
| HOST_CAMARA / USER_CAMARA / PASS_CAMARA | Cuenta de socios y cursos |
| DB_CAMARA_SOCIOS | Destino socios |
| DB_CAMARA_CURSOS | Destino cursos actuales |
| CAMARA_DB_HOST / CAMARA_DB_USER / CAMARA_DB_PASSWORD | Cuenta histórica |
| CAMARA_DB_NAME | Destino histórico |
| CAMARA_DB_PORT | Puerto; vacío usa 3306 |
| CAMARA_DB_SSL | true/1 valida TLS; false/0/vacío reproduce configuración local sin TLS |
| CAMARA_DB_AUTH_PLUGIN | Pista validada; vacío/mysql_native_password/caching_sha2_password; mysql2 negocia |

Las dos familias y los tres nombres de base son explícitos y obligatorios; no hay sustitución de un destino por otro si falta una clave. En esta auditoría se encontraron y verificaron ambas familias. Revisar siempre metadatos antes de ejecutar agregados en una configuración nueva. Los cruces entre esquemas requieren que los alias se alojan en el mismo host y puerto; de lo contrario se rechazan con CROSS_SOURCE_HOSTS_UNSUPPORTED. No se soportan joins entre servidores distintos. Puerto y TLS son comunes a las tres conexiones en esta herramienta.

## Lectura y límites

Cada conexión ejecuta `SET SESSION TRANSACTION READ ONLY`, `START TRANSACTION READ ONLY` y verifica `@@session.transaction_read_only`. Inspecciona SHOW GRANTS en memoria sin imprimirlos; reporta si la cuenta es sólo lectura. Se cierra con ROLLBACK y desconexión, también ante error. No se hicieron pruebas de INSERT/UPDATE para comprobar privilegios.

Únicamente hay consultas SELECT/CTE fijas y metadatos; no se acepta SQL por CLI. Se bloquean múltiples sentencias, comentarios suministrados, escrituras, locks y exportación a archivos. El ejecutor añade un límite MySQL MAX_EXECUTION_TIME de 20 s a SELECT y un timeout cliente de 25 s; conexiones de 10 s. Son límites operativos, no un parser SQL general. La cuenta de lectura y la transacción constituyen controles adicionales. No hay migraciones, DDL, permisos, procedimientos ni un usuario de producción nuevo.

`queries.mjs` identifica cada agregado con etiqueta estable. Los cruces explícitos se ejecutan con la cuenta que ya dispone de SELECT; no se elevan permisos de MySQL. La ruta moderna de certificados convierte un GUID válido a ascii_general_ci para usar el índice, sin convertir el lado indexado. OldId se convierte a entero sólo si cumple el formato validado. Cambios de esquema/collation requieren revisar las consultas, no reparar automáticamente la base.

## Reportes y fallos

`reports/camara-audit/latest-connection.json`, `latest-metadata.json`, `latest-aggregate.json` y archivos fechados se generan localmente y están ignorados. Cada uno guarda inicio/fin UTC, alias, resultado de conexión, permisos, transacción y errores sanitizados. Nunca se escribe host, usuario, contraseña, nombre físico de base, SQL con configuración o filas de personas. La consola contiene resultados agregados (incluidas etiquetas de categorías), no un dump.

La salida 0 indica corrida completa; salida 1 indica fallo total o parcial. Los agregados que fallan quedan como `{error: {code, errno, sqlState}}`; **no equivalen a cero ni a ausencia del campo**. El script continúa con las consultas independientes. Errores frecuentes:

- LOCAL_CONFIG_UNAVAILABLE / INCOMPLETE: falta secreto o claves; no implica fallo de MySQL.
- ER_ACCESS_DENIED_ERROR / 1045: cuenta, origen o autenticación rechazados.
- ER_BAD_DB_ERROR / 1049: destino inexistente/inaccesible.
- ER_TABLEACCESS_DENIED_ERROR / 1142: falta SELECT en ese objeto; no alterar permisos desde la auditoría.
- ER_CANT_AGGREGATE_2COLLATIONS / 1267: unión de cadenas incompatible; revisar tipos/collation y namespace.
- PROTOCOL_SEQUENCE_TIMEOUT / ER_QUERY_TIMEOUT: consulta no completada; nunca registrar su resultado como cero.

En los intentos iniciales se observaron 1267 al comparar OldId con enteros convertidos a texto, y 1142 al cruzar desde la cuenta histórica a tablas actuales. Se corrigieron las comparaciones y el sentido de las conexiones. Un intento de comparación binaria sin índice excedió el límite y fue interrumpido; se sustituyó por conversión del valor de origen conservando el índice. La corrida final completa de 18:15:36–18:15:56 UTC no registró errores.

`docs/camara/evidencia-2026-10-07.json` es una selección revisada para documentación, con agregados y diccionario relevante. Para actualizarla, revisar primero el nuevo reporte y copiar únicamente información agregada/metadatos necesarios; no publicar reportes completos de otros sistemas por defecto. El frontend no lee ninguno de estos archivos. Los hashes de scripts en esa evidencia identifican la copia local documentada; la herramienta puede evolucionar después.

Si mañana no hay acceso, conservar el nuevo reporte de error y declarar fecha de la última consulta válida. La evidencia fechada de hoy no prueba acceso futuro ni permite afirmar que los conteos sigan vigentes. Se puede continuar trabajando con el diccionario y contrato sin el Observatorio.

Referencias técnicas: [transacciones MySQL](https://dev.mysql.com/doc/refman/8.0/en/commit.html), [mysql2](https://sidorares.github.io/node-mysql2/docs). Las reglas de negocio se basan en la evidencia y las decisiones documentadas, no en documentación del driver.
