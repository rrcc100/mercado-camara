# Ejecutar con Docker

Requiere Docker Desktop iniciado en modo **contenedores Linux**, con Docker Compose. No hace falta instalar Node ni pnpm en Windows para levantar la aplicación. Ejecutar desde la raíz de Mercado Cámara.

## Levantar la aplicación

```powershell
docker compose up -d --build --wait
```

Abrir [http://localhost:3010](http://localhost:3010). Se usa 3010 para convivir con los servidores locales y el Observatorio. El puerto se publica sólo en loopback. La primera construcción descarga Node 24 y las dependencias del lockfile; las siguientes reutilizan la caché.

```powershell
docker compose ps
docker compose logs -f frontend
docker compose down
```

`down` detiene y elimina los contenedores y la red de este proyecto, sin modificar el Observatorio ni los archivos locales. Después de cambios de código, repetir `up -d --build --wait`. La aplicación arranca en demo, con noindex; no necesita MySQL ni GraphQL para esta modalidad.

Para otro puerto, por ejemplo:

```powershell
$env:APP_PORT = "3020"
docker compose up -d --wait
```

El origen canónico predeterminado sigue ese puerto. Mantener las mismas variables al ejecutar los comandos siguientes, o guardarlas en un `.env` local ignorado por Git. Compose no lee `.env.local` automáticamente.

## Desarrollar con recarga automática

```powershell
docker compose -f compose.yaml -f compose.dev.yaml up -d --build --wait
docker compose -f compose.yaml -f compose.dev.yaml logs -f frontend
```

La dirección sigue siendo [http://localhost:3010](http://localhost:3010). Los cambios en `src/` y `public/` se reflejan desde Windows sin reconstruir. Se usa Next.js con Webpack y polling para detectar cambios de archivos montados en Docker Desktop. No cambia el stack Next.js 16 / React 19 / TypeScript; la construcción normal usa el compilador predeterminado.

Next permite los orígenes locales localhost y 127.0.0.1 para sus recursos de desarrollo, incluido el canal de recarga; no se habilitan comodines ni acceso desde la red local.

Sólo se montan las carpetas de código/recursos y la configuración TS/Next indicada en `compose.dev.yaml`, en lectura. Las dependencias y `.next` permanecen dentro del contenedor; no se reutilizan módulos de Windows en Linux. Cambios en package.json, el lockfile o pnpm-workspace.yaml requieren reconstruir. Para cambios de next.config.ts o tsconfig.json, reiniciar el servicio si Next no los recarga.

Para volver al build normal:

```powershell
docker compose -f compose.yaml -f compose.dev.yaml down
docker compose up -d --build --wait
```

## Auditoría de Cámara, opcional

El servicio `camara-audit` pertenece al perfil `tools` y no arranca con `docker compose up`. Es una CLI de desarrollo, no un backend ni un proceso permanente. Usa exclusivamente los scripts de lectura ya documentados en [la guía de auditoría](camara/OPERACION.md).

Requiere el archivo local `.secrets/camara.json` ya preparado; si no existe, el montaje falla y no se crea un directorio en su lugar. El secreto se monta en modo lectura únicamente en este servicio. Los reportes se guardan en `reports/camara-audit/`, ignorado por Git.

```powershell
docker compose build camara-audit
docker compose run --rm camara-audit connection
docker compose run --rm camara-audit metadata
docker compose run --rm camara-audit aggregate
```

Las últimas tres órdenes conectan con la base real autorizada. Las pruebas offline no conectan:

```powershell
docker compose run --rm --entrypoint node camara-audit --test scripts/camara/read-only.test.mjs
```

Una verificación desde Windows no garantiza acceso desde Docker: VPN, firewall y permisos por origen pueden afectar la conexión. Consultar el código de error sanitizado del reporte. No cambiar permisos de la base desde esta herramienta.

## Configuración e integración futura

Compose pasa sólo `DATA_SOURCE`, `SITE_URL`, `GRAPHQL_ENDPOINT`, `ALLOW_INDEXING` y `CONTENT_APPROVED` al frontend. Se pueden definir en la sesión de PowerShell o un `.env` local. No copiar credenciales MySQL a ese archivo para ejecutar la web. El secreto de auditoría queda separado.

Cuando exista la API GraphQL propia del portal, configurar el endpoint accesible **desde el contenedor**. `localhost` dentro del frontend representa ese contenedor; en Docker Desktop, un backend que corra en Windows puede ser alcanzable como `http://host.docker.internal:puerto/graphql`, pero el cliente actual sólo admite HTTP para loopback. Para ese caso se debe ofrecer un endpoint HTTPS válido o acordar expresamente el cambio de política local; no deshabilitar validaciones silenciosamente. No se configura el backend del Observatorio como API de Mercado Cámara.

No se agregan servicios MySQL ni C#: aún no son componentes implementados de este proyecto. Los comandos de Docker no migran, copian ni publican datos reales.

## Construcción y aislamiento

Dockerfile usa etapas separadas para dependencias, auditoría, desarrollo, compilación y runtime. La imagen final utiliza el [output standalone de Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), junto con public y .next/static, y corre con el usuario sin privilegios `node`. El proceso escucha en 0.0.0.0 dentro del contenedor para permitir el mapeo local del puerto.

`.dockerignore` es una lista permitida: `.secrets`, archivos `.env`, reportes, referencias, Git y node_modules locales no entran al contexto de construcción. El frontend no monta secretos ni carpetas de auditoría. La separación opcional se implementa mediante [perfiles de Compose](https://docs.docker.com/compose/how-tos/profiles/).

El healthcheck comprueba que Next responde en `/robots.txt`; no certifica conectividad de la futura API ni reglas de publicación. Para comprobar las rutas completas de la demo con Node instalado:

```powershell
$env:CHECK_ORIGIN = "http://127.0.0.1:3010"
$env:CHECK_CANONICAL_ORIGIN = "http://localhost:3010"
pnpm test:http
```
