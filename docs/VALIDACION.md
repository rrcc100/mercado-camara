# Validación de la primera versión

Realizada el 7 de octubre de 2026, en Windows con Node 24.19 y pnpm 11.19.0. Fuente de datos: demostración local. Sin llamadas a MySQL ni a una API de Cámara.

## Comprobaciones automáticas

- `pnpm install --frozen-lockfile --offline`: instalación consistente con lockfile.
- `pnpm typecheck`: tipos y rutas correctos.
- `pnpm lint`: sin errores.
- `pnpm test`: 18 pruebas, 3 archivos, todas aprobadas.
- `pnpm build`: build de producción correcto con Next.js 16.3.8; páginas públicas SSR.
- `pnpm test:http`: 39 rutas HTTP comprobadas, además de robots, sitemap e imagen optimizada.

Las pruebas cubren contenido migrado; búsqueda sin acentos y en resultados/habilidades; combinación de filtros; orden y paginación; independencia del nivel institucional; relacionados sin duplicados/inactivos; desactivación en listados, perfil, conteos y sitemap; conservación de ID/slug; errores y validación del transporte GraphQL; ausencia de fallback; protección de indexación por ambiente.

La comprobación HTTP recorre las 16 fichas, los 6 perfiles, las 6 categorías y páginas principales. Verifica status 200, HTML con un h1, canonical sin parámetros, metadata noindex, X-Robots-Tag, ausencia de JSON-LD ficticio y de iframes precargados. Cuatro rutas inexistentes devuelven 404 real. Comprueba búsqueda Excel, segunda página, estado vacío, sitemap demo sin URLs y robots sin anuncio de sitemap.

## Revisión en navegador

Navegador integrado de Codex, escritorio y viewport móvil de 390 × 844:

- Portada, identidad de Cámara, buscador, imágenes, áreas y tarjetas.
- Búsqueda Excel: dos resultados; modalidad Online + provincia CABA: un resultado.
- Ficha Excel: datos de aprendizaje, programa, institución, certificado de ejemplo, consulta deshabilitada y relacionados.
- Video sin iframe inicial; abrir agrega uno, cerrar lo desmonta.
- Perfil Horizonte: identidad, estado de redes sin inventar enlaces y tres cursos activos.
- Envío de búsqueda con Enter, estado vacío y limpieza de filtros.
- Paginación: 1–9 y 10–16 sin pérdida de resultados.
- Sin desborde horizontal en portada, ficha, perfil y estado vacío móvil.

Capturas de la portada en `docs/qa/`. Los slugs con datos reales, auth, envíos y escritura de publicación requieren pruebas integradas cuando exista el backend.

## Pendiente antes de producción

1. Implementar y validar backend C# / .NET 9 y GraphQL contra esquema y permisos reales de MySQL; acordar plan de soporte del runtime.
2. Confirmar alojamiento, dominio canónico, identidad de socios y almacenamiento de campos nuevos.
3. Sustituir datos y medios de ejemplo por información autorizada y completa, incluidos docentes, fechas, horarios, sedes y condiciones.
4. Aprobar evaluación progresiva, rúbricas, umbrales, transiciones y controles de opiniones.
5. Implementar autogestión, consentimiento, idempotencia y leads persistidos; habilitar consultas sólo después.
6. Extender el contrato de medios y paginación para el volumen real; probar invalidación antes de introducir cachés persistentes.
7. Revisión editorial y de accesibilidad, pruebas de carga y seguridad de la API real. Activar indexación sólo tras aceptación del contenido y configuración productiva.

No se publicaron cambios en Sites ni se modificó el Observatorio. Las pruebas del adaptador usan respuestas simuladas; no acreditan conexión a una API existente.

## Auditoría de base real y ajustes del 07/10/2026

- Tres conexiones MySQL verificadas con cuentas y transacciones de lectura; corrida completa de agregados 18:15:36–18:15:56 UTC, sin errores finales. Ver docs/camara.
- Build de producción y TypeScript correctos después de los cambios de modelo y vistas; ESLint correcto.
- 22 pruebas de frontend aprobadas, incluyendo ficha completa sintética con datos ausentes, precio sin moneda y horas inválidas. No son registros importados de la Cámara.
- 3 pruebas offline de auditoría aprobadas: planes permitidos, rechazo de escrituras/exports/locks y errores sin secretos. No se probó ninguna escritura en MySQL.
- 39 comprobaciones HTTP aprobadas en http://127.0.0.1:3001: SSR, canonical, noindex, 404, categorías, paginación, estados vacíos, robots, sitemap e imágenes.
- Revisión visual de ficha de curso a tamaño de escritorio y programa en móvil 390×844; evidencia en docs/qa/curso-auditoria-escritorio.png y curso-auditoria-movil.png.
- Escaneo local de 62 archivos de código, documentación, configuración de ejemplo y JS del navegador: no se encontraron contraseñas ni hosts del secreto. El escaneo nunca imprime valores.
- La aplicación conserva DATA_SOURCE=demo; no se publicó contenido auditado, no se conectó el navegador a MySQL ni se habilitaron mutaciones.

Los archivos de antecedentes no disponibles al cierre figuran en docs/camara/FUENTES.md. Los enums y la relación PartnerId continúan pendientes; ninguna prueba de UI los confirma.

## Docker (07/10/2026)

- Docker Desktop con motor Linux: construcción desde el lockfile, arranque y healthcheck correctos en localhost:3010.
- Las 39 comprobaciones HTTP de la demo pasaron contra el frontend en contenedor, incluido canonical con puerto 3010 e imágenes optimizadas.
- La imagen final corre sin root y no contiene .secrets, scripts/camara ni el driver mysql2.
- Modo de desarrollo verificado con creación y edición de una ruta temporal: detectó ambos cambios sin reconstruir. La ruta se eliminó al terminar.
- Handshake WebSocket de recarga confirmado para localhost y 127.0.0.1, con orígenes locales explícitos.
- Imagen auxiliar camara-audit construida y sus 3 pruebas offline aprobadas dentro del contenedor. No se hicieron nuevas consultas a MySQL desde Docker en esta validación; su conectividad a la base dependerá de la red/origen autorizado.
- Los servicios existentes del Observatorio se mantuvieron sin cambios. Ver [guía Docker](DOCKER.md).

## Exploración marketplace desde localhost

- `pnpm lint`, `pnpm typecheck` y build de producción correctos. Las 22 pruebas existentes siguen aprobadas.
- 39 comprobaciones HTTP aprobadas contra el build final en `http://127.0.0.1:3020`: SSR, canonical, noindex, rutas, paginación, vacíos, 404 y recursos.
- Navegador: búsqueda Excel online en CABA devuelve un curso; retirar CABA conserva búsqueda y modalidad y devuelve dos. Cambio tarjetas/lista conserva filtros. Orden por precio muestra $42.000 antes de $58.000, ambos ejemplos ficticios.
- La página 2 conserva la vista de lista y muestra siete cursos; alternar a tarjetas mantiene página 2. Categoría Tecnología + Online mantiene la categoría al ordenar y quitar modalidad.
- Portada, tarjetas/lista y ficha revisadas en escritorio y móvil de 390 × 844, sin desborde horizontal de página. Navegación y accesos rápidos permiten desplazamiento horizontal dentro de sus propias filas. Filtros móviles inicialmente cerrados y expandibles.
- Ficha con precio/disponibilidad antes del programa en móvil; tres relacionados; consultas deshabilitadas. Imágenes del build final verificadas cargadas.
- Capturas en `docs/qa/marketplace-*.jpg`. No hubo nueva consulta a la base ni nueva construcción Docker para este cambio visual; los comandos Docker y el contrato de datos se conservan.

## Valoraciones y mejoras de navegación (11/10/2026)

- 28 pruebas aprobadas: consistencia de promedio/distribución/comentarios, rango 1–5, ausencia de valoraciones, separación demo/real y rechazo de valoraciones demo anidadas en GraphQL, además de las pruebas anteriores.
- TypeScript, ESLint y compilación de producción correctos. 39 verificaciones HTTP aprobadas en `http://127.0.0.1:3020`.
- Escritorio: sugerencia “Excel para el trabajo” elegida con flecha abajo y Enter devuelve un curso. Lista inicial confirmada y cambio a tarjetas conserva la búsqueda. Promedio de la ficha enlaza a distribución y cinco opiniones de ejemplo.
- Móvil 390 × 844: filtros inicialmente cerrados, barra de filtros y orden fija al desplazarse. Excel + Online mantiene dos filtros activos al ordenar por precio y presenta primero Excel y gestión administrativa.
- Perfil Horizonte: buscar Excel devuelve sólo Excel para el trabajo; sumar Administración produce un vacío explícito y “Ver toda su oferta” recupera los tres cursos propios.
- Ficha y opiniones revisadas en ambos tamaños, sin desborde horizontal en los recorridos comprobados. Las estrellas no tienen marcas de verificación y el curso sin opiniones conserva su estado vacío.
- Evidencias en `docs/qa/valoraciones-*.jpg`. Sin nueva auditoría MySQL, sin cambios en el Observatorio y sin reconstruir Docker. Para ver los cambios en contenedor se requiere el comando de reconstrucción documentado.
- Iteración desarrollada sobre `3edf22d`. El 14/10/2026 el usuario autorizó el commit y reservó el push para hacerlo personalmente.
