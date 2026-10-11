# Arquitectura de la primera versión

## Renderizado y límites de confianza

App Router con Server Components para portada, catálogo, fichas, instituciones y categorías. El pequeño componente de video es cliente para cargar y desmontar el iframe bajo demanda. Formularios GET y enlaces nativos funcionan sin JavaScript. La aplicación usa `lang=es-AR`, encabezados semánticos, labels, ruta de navegación, skip link, foco visible y movimiento reducido.

Flujo: navegador → páginas de Next.js → repositorio de servidor → API GraphQL propia del portal → servicios C# → MySQL del sistema de la Cámara. No se agregan endpoints REST. Los únicos recursos HTTP de metadatos son robots, sitemap, icono y recursos de Next. El navegador no recibe credenciales de MySQL.

`DATA_SOURCE=demo` es el valor predeterminado. La selección reside en un módulo `server-only`. `DATA_SOURCE=graphql` exige `GRAPHQL_ENDPOINT`; las consultas usan POST y variables. Una falla HTTP, GraphQL, timeout o contrato inválido produce un error recuperable. Nunca hay fallback silencioso a la demo. El adaptador rechaza registros `demo=true`.

Los DTO se validan con Zod. Los campos públicos están explícitamente enumerados: no se publican documentos, opiniones individuales, contactos privados, notas internas ni conteos de certificados. Los slugs existentes se mantienen al reactivar. Slug desconocido: 404 real. Curso conocido y temporalmente retirado: 200 con pantalla de indisponibilidad y noindex, sin acciones de consulta; no se confunde con una eliminación permanente. Una futura baja definitiva deberá acordar 410/404 sin borrar la historia de negocio.

La primera integración no usa caché de datos persistente (`cache: no-store`) ni prerender de fichas. React `cache` sólo deduplica dentro del render. Esto prioriza coherencia de publicación hasta acordar eventos de invalidación. El despliegue debe conservar los status/cabeceras y no introducir un caché público de HTML sin la invalidación descrita en la guía de backend.

## SEO y ambiente

Cada ruta tiene título, descripción, Open Graph y canonical propio. `SITE_URL` es un origen configurable, sin rutas ni credenciales. Su valor local predeterminado es `http://localhost:3000`; nunca se usa el dominio del prototipo como dominio productivo.

Para permitir indexación deben cumplirse **todas** las condiciones:

- `NODE_ENV=production`.
- `DATA_SOURCE=graphql`.
- `CONTENT_APPROVED=true`, luego de revisar contenido real y autorizaciones.
- `ALLOW_INDEXING=true`.
- `SITE_URL` con HTTPS y dominio público válido.

El gate comprueba configuración; no reemplaza la revisión editorial y técnica. Hasta entonces cada página contiene `noindex` y el proxy añade `X-Robots-Tag: noindex, follow`. Sitemap vacío y sin anuncio en robots. Robots permite el rastreo para que los motores puedan leer noindex: bloquear rastreo y esperar que lean la directiva son objetivos incompatibles. Esta decisión sigue la [guía oficial de Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Las rutas limpias de categorías representan áreas editoriales indexables cuando se habilite producción. Búsquedas, filtros, ordenamientos y paginación con query string llevan noindex y canonical a la ruta base; no entran al sitemap. El sitemap futuro enumera sólo URLs de registros públicos activos y categorías aprobadas. `/el-sello` permanece noindex hasta validar la política. No se fabrican fechas `lastModified`.

Course, Organization y BreadcrumbList se generan sólo para registros reales y cuando el ambiente es indexable. No se publican AggregateRating ni Review. No se garantiza la obtención de resultados enriquecidos. La configuración de metadata se apoya en la [documentación de Next.js](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

`htmlLimitedBots: /.*/` resuelve metadata antes de enviar la respuesta, de forma que las búsquedas de slugs inexistentes puedan devolver un 404 real. Sin `loading.tsx` ni Suspense alrededor de la resolución de identidad. Mantener las comprobaciones HTTP ante cambios en streaming.

## Búsqueda y recomendación

El repositorio demo busca sin diacríticos, con alias y conjunción de términos. Pondera título (8), habilidades (6), resultados/proyecto (4), módulos (3) y el resto del texto (1). Filtra sólo publicados. Desempate alfabético y por ID estable. Los niveles se pueden filtrar, pero no influyen en relevancia. Precio nulo significa consultar; aparece al final cuando se ordena por precio.

Relacionados: similitud de título y habilidades; categoría como señal secundaria; modalidad y dificultad resuelven empates antes del orden alfabético. Máximo tres, sin curso actual, duplicados, inactivos ni falsos relacionados sin coincidencias. La API deberá conservar estas garantías, aunque su algoritmo evolucione.

En el contrato inicial la página tiene 9 elementos. Los listados de instituciones, oferta institucional y slugs son arrays para esta primera etapa; deberán convertirse a conexiones paginadas antes de escalar a una base grande. Ese cambio debe versionarse junto con el frontend y el sitemap por lotes.

## Recursos y rendimiento

Se conservaron el logo y el contenido original. Los dos fondos se convirtieron de PNG (~2 MB cada uno) a WebP (~92 KB y ~119 KB) y el atlas de logos se dividió en seis archivos pequeños. El logo oficial queda intacto. `next/image` sirve variantes optimizadas con dimensiones y `sizes`. Open Sans usa WOFF2 locales desde Fontsource; no hay petición a Google Fonts en build ni en navegación.

El contrato de imágenes admite de momento rutas controladas `/assets/…` del frontend. Antes de recibir archivos reales: acordar almacenamiento y autorización, generar variantes y establecer una lista de hosts HTTPS en `next/image` y Zod. No abrir dominios remotos arbitrarios. El atlas de categorías queda disponible como recurso de referencia optimizado; las tarjetas actuales identifican el área con color e iconos.

Faltan métricas de campo, auditoría de accesibilidad externa y pruebas de carga con la API real. No se hizo afirmación de puntuación Lighthouse ni de Core Web Vitals de producción.

## Ajustes tras el relevamiento real

El frontend admite campos opcionales y nunca asigna modalidad, horas, precio, logo, certificado o evaluación por omisión. Las categorías públicas llegan desde el repositorio; las seis categorías del prototipo sólo pertenecen a demo. Los módulos preservan título, contenido y orden. La ubicación de la institución no sustituye una sede de cursada. Fundación y alta como socio son conceptos separados.

Las herramientas MySQL viven en scripts/camara y leen .secrets/camara.json; no forman parte de Next ni de GraphQL y no se empaquetan como un backend. La evidencia versionable y las transformaciones están en docs/camara. La auditoría no cambia DATA_SOURCE ni CONTENT_APPROVED.
