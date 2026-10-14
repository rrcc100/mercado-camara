# Mercado Cámara — continuidad del proyecto

## Pedido actual del usuario (7 de octubre de 2026)
Convertir el prototipo Forma en una primera versión real. Priorizar el frontend con **Next.js 16, React 19 y TypeScript** y buenas prácticas SEO. El backend será **C# / .NET 9**, la API será **GraphQL (no REST)** y la base de datos **MySQL**. Por ahora documentar la integración del backend, sin inventar una conexión ya disponible.

El usuario autorizó crear un nuevo chat en el proyecto `C:\Users\marti\Desktop\Sistemas\mercado-camara` para continuar este trabajo. Esta carpeta estaba vacía antes de copiar estos antecedentes. No se trasladó el chat original: se crea otro con contexto y fuentes.

## Fuentes y estado actual
- Prototipo público de referencia: https://forma-camara-cursos.hmartini.chatgpt.site
- Proyecto Sites original: `appgprj_6ac1d8a405988191964986ac80502e53`.
- Última versión publicada: v10, commit `6a95e33d923cb539539e80a1e94ecb291ecb1b33`.
- Copia local de consulta: `reference/forma-v10/dist/` y su README. Contiene la aplicación estática completa y sus recursos visuales. No es aún el frontend Next.js.
- Origen: `C:\Users\marti\Desktop\Sistemas\datos-observatorio\prototypes\camara-forma`.
- No se copiaron Git, credenciales ni configuración de Sites. La nueva aplicación se desarrollará localmente; no modificar ni republicar el sitio de referencia por este pedido.
- No existe integración real con la base de socios. Los 16 cursos, las 6 instituciones, precios, opiniones y niveles mostrados son **ficticios**. Mantener esa distinción y no indexar datos de demostración en buscadores.

## Producto y alcance acordados
Portal de cursos de socios de la Cámara Argentina, con una experiencia de búsqueda inspirada en un marketplace como Mercado Libre. La afinidad de un curso con la búsqueda es el criterio principal; el nivel institucional aporta confianza, sin desplazar la relevancia.

Preservar e implementar como primera base funcional:
- Inicio y catálogo con búsqueda y filtros (categoría, modalidad, ubicación y los filtros pertinentes del prototipo).
- Ficha de curso con institución y logo visibles, descripción, objetivos, dirigido a, resultados/habilidades, programa, requisitos, duración, modalidad, precio y certificado emitido por la Cámara.
- Fichas institucionales, logo, descripción, ubicación, redes sociales y oferta activa. Los enlaces reales aún no están cargados: no inventarlos.
- Posibilidad de material audiovisual en la ficha/landing, con estados claros cuando no existe material.
- Sello institucional visual con el logo de la Cámara y una escala asociada a la capacitación.
- **Cursos relacionados al pie de cada curso. No incluir comparador**: el usuario reemplazó expresamente el comparador por recomendaciones relacionadas.
- Estados vacíos, navegación por teclado, diseño adaptable y enlaces compartibles propios de Next.js (sin depender de rutas con #).
- Documentación para programadores accesible como archivos versionados. Si se conserva una página de guía interna, excluirla de indexación.

No se pidió todavía implementar ni simular como reales pagos, matriculación, envío efectivo de leads, login o administración completa. Los controles pendientes de backend deben explicar su estado y no anunciar éxito sin persistencia real.

## Identidad visual
Referencia institucional: https://camaraargentina.com.ar/
El prototipo ya fue ajustado a la Cámara: turquesa #0ea7a5, azul petróleo #047490, derivado oscuro #075567, tinta #183f49, fondo #f5f9f9, bordes #d8e6e8 y Open Sans. Cabecera con logo oficial y Forma como marca secundaria, tarjetas claras, buscador protagonista, pie azul petróleo.

Recursos en `reference/forma-v10/dist/assets/`:
- `camara-argentina-logo.png`: logo oficial, conservar sin alterarlo. Fuente histórica https://camaraargentina.com.ar/wp-content/uploads/2023/08/logo.png (no se identificó licencia abierta).
- `institute-logo-atlas.png`: 6 logos ficticios, grilla 3 columnas / 2 filas.
- `digital-learning.png`, `technical-workshop.png`, `course-category-atlas.png`: ilustraciones generadas para el prototipo.
No hace falta generar nuevas imágenes para la migración. Optimizar su uso sin perder la identidad establecida.

## Modelo de evaluación institucional
Nombres actuales de la escala: Base formativa, Solidez formativa, Distinción formativa, Referente formativo. En evaluación es un estado separado; datos faltantes no equivalen a una mala nota.

**Distinguir la fórmula vieja del código de la política nueva documentada.** El prototipo todavía tiene una evaluación fija en `model.js`; no adoptarla automáticamente como especificación definitiva. La propuesta progresiva está explicada en `development-spec.js`.

Modelo progresivo de referencia (pesos aún sujetos a validación de la Cámara):
| Dimensión | Inicio | Primeras experiencias | Evidencia suficiente |
|---|---:|---:|---:|
| Documentación y respaldo | 30 | 15 | 10 |
| Propuesta formativa | 40 | 30 | 20 |
| Información y actualización | 30 | 15 | 10 |
| Experiencia de alumnos | 0 | 25 | 40 |
| Actividad y certificaciones | 0 | 15 | 20 |

Un socio nuevo puede alcanzar Distinción con documentación y propuesta revisadas. Referente requiere evidencia suficiente de experiencia real. La transición debe depender de evidencia disponible, no solamente de antigüedad. Ejemplos de umbrales en discusión: una cohorte y 10 opiniones; dos cohortes y 30 opiniones. Deben calibrarse, no presentarse como política aprobada. Transiciones graduales, historial auditable y ausencia de reinicios para eludir una evaluación previa.

Las certificaciones de la Cámara deben tener peso relevante, sin premiar solamente el tamaño de un socio. La cantidad puede permanecer interna. Precio, modalidades y redes aportan información al usuario; no convertir seguidores en calidad académica. La fórmula final, controles antifraude, alcance de las evaluaciones y umbrales requieren definición de la Cámara. En el frontend mostrar datos tipados de la fuente/adaptador; evitar duplicar la lógica definitiva de puntuación, que corresponde al backend.

## Cursos relacionados y búsqueda
`related-courses.js` contiene una propuesta ya verificada: similitud de título, habilidades y categoría; desempate por modalidad/dificultad y orden alfabético. Excluir el curso actual, duplicados e inactivos. Máximo 3 recomendaciones. El ranking institucional no debe influir en relevancia. Puede evolucionar el algoritmo conservando esas reglas.

## Backend y fuente de verdad — decisión explícita del usuario
- **El backend NO será el del Observatorio.** Será un backend propio de este portal, cuyo alojamiento todavía no está definido.
- Debe integrarse con la base de datos utilizada por el sistema de la Cámara: de allí salen socios, cursos y certificaciones. Confirmar esquema real y titularidad de cada campo con su equipo.
- Stack indicado: C# .NET 9 + GraphQL + MySQL. El navegador habla con la API, nunca directamente con MySQL ni con credenciales de base de datos.
- La autogestión y el sistema existentes deben conservar identificadores estables y coordinar autenticación/permisos. No crear una segunda identidad de socio sin un plan de integración.
- La ubicación concreta de leads, opiniones, documentos privados y campos nuevos se acordará con el equipo: no dar por decidido que habrá otra base o que se modificará una tabla existente.
- Si en el futuro se usan indicadores laborales del Observatorio, eso es una integración opcional, no una dependencia de este portal.
- Proponer un contrato GraphQL tipado y documentado, marcado como borrador hasta revisar el esquema real. Consultas con variables, errores, permisos, paginación, publicación/inactivación, invalidación de caché y configuración del endpoint deben quedar contemplados.
- Separar los datos ficticios del dominio y de las pantallas mediante un adaptador/repositorio. No ocultar fallas del backend real reemplazándolas silenciosamente por datos de demostración.

## Autogestión del socio — requisitos ya acordados
La guía para programadores debe preservar:
1. **Mi perfil público:** precargar lo disponible en la base de la Cámara e identificar campos faltantes. Logo, descripción, especialidades, ubicación/sedes, web, contactos autorizados, redes, fotos y videos; fichas de cursos con objetivos, destinatarios, resultados, programa, docentes, condiciones y evaluación. Revisar el esquema real antes de afirmar qué falta. Separar documentos privados de información pública. Completar campos no garantiza automáticamente subir de nivel.
2. **Mis leads:** listado privado por institución con fecha, curso, contacto, origen y estado; detalle y seguimiento. Estados propuestos: nuevo, en seguimiento, inscripto, cerrado. Registrar lead solamente tras envío guardado correctamente, no por visitar una ficha o pulsar WhatsApp. Deduplicar reintentos y documentar consentimiento y destinatario.
3. **Mis cursos en el portal:** activar, desactivar y reactivar sin borrar el registro maestro. Verificar propiedad, campos obligatorios y aprobaciones en backend. Desactivar retira de búsquedas, conteos, perfil, relacionados y sitemap; la URL directa indica indisponibilidad y no acepta nuevas consultas. Conservar historia, certificaciones, opiniones y leads. Mantener identificadores y URL estables al reactivar, con auditoría y coherencia de caché.
4. Falta acordar campos obligatorios, aprobaciones, permisos exactos y políticas: dejarlos como decisiones pendientes.

## SEO y calidad para esta primera implementación
- Next.js App Router y páginas públicas renderizadas en servidor; URLs legibles y estables por curso/institución/categoría.
- Metadata por página: title, description, canonical, Open Graph; un origen canónico configurado, sin hardcodear el dominio de Sites como producción del nuevo frontend.
- robots/sitemap controlados por ambiente y publicación. Bloquear indexación de la demo con noindex; habilitar indexación solamente cuando se configure un dominio y contenido real publicable.
- Evitar duplicados por filtros y combinaciones de búsqueda; política explícita para páginas de categorías frente a búsqueda con parámetros.
- Datos estructurados Course, Organization y BreadcrumbList únicamente cuando los datos publicados sean verdaderos. No inventar valoraciones verificadas ni prometer resultados enriquecidos en Google.
- Respuestas 404 reales para slugs inexistentes, accesibilidad, HTML semántico, imágenes optimizadas, tamaños reservados, buen rendimiento y navegación móvil.
- Verificar build, TypeScript y pruebas pertinentes de búsqueda, relacionados, visibilidad y protección de indexación. Revisar visualmente escritorio y móvil cuando haya servidor local.

## Archivos de referencia más útiles
- `dist/model.js`: datos ficticios, instituciones, cursos, filtros y fórmula antigua.
- `dist/course-learning.js`: objetivos, destinatarios, resultados, habilidades y proyectos para las 16 fichas.
- `dist/marketplace.js`: contenido y flujos del catálogo/fichas.
- `dist/credentials.js`: sello visual.
- `dist/related-courses.js`: recomendaciones.
- `dist/development-spec.js`: guía de arquitectura, evaluación progresiva y autogestión.
- `dist/chamber-theme.css` y demás estilos: referencia visual actual.

## Notas de trabajo
Continuar en este proyecto nuevo. No modificar archivos del Observatorio ni publicar en Sites sin un pedido específico. No solicitar otra aprobación para desarrollar el frontend local: el usuario ya lo autorizó. Si falta una decisión, progresar con lo independiente y dejar explícita la suposición. No usar subagentes salvo solicitud explícita o instrucción aplicable.

Runtime disponible en este equipo: Node v24.19.0, `C:\Users\marti\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`; pnpm `C:\Users\marti\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd`. Se puede consultar `load_workspace_dependencies` para rutas vigentes. Instalar versiones del stack indicado y conservar el lockfile. No se instaló ninguna dependencia en este proyecto todavía.

Fuentes oficiales ya consultadas: https://nextjs.org/docs/app/getting-started/installation ; https://nextjs.org/docs/app/getting-started/metadata-and-og-images ; https://developers.google.com/crawling/docs/faceted-navigation ; https://developers.google.com/search/docs/appearance/structured-data/course . Comprobar documentación cuando se necesiten detalles actuales.

## Continuidad después de la auditoría (07/10/2026)

Se conserva íntegro el alcance y stack anterior. Ya se implementó el frontend y se verificaron tres conexiones MySQL de lectura mediante herramientas propias en scripts/camara. Ver [auditoría y evidencia actual](camara/README.md). El secreto mínimo vive en .secrets/camara.json, ignorado y fuera del runtime web. No se modificó el Observatorio ni se importaron registros reales al catálogo. La API productiva sigue sin implementar.

El contrato v0.2 distingue curso/versiones, categorías dinámicas, módulos estructurados, valores faltantes y certificado/evaluación opcionales. PartnerId no coincide con Users.Id disponible; 16.909 cursos tienen vínculo legado recuperable y 2.660 no. newcourseid de certificados apunta a CourseVersions.Id. La copia maestra de socios, enums y autorización pública siguen pendientes. No adoptar Approved/Active como publicación. La mención anterior a credenciales no copiadas describía el estado inicial, previo a la autorización explícita de esta auditoría.

## Ejecución con Docker

Se incorporaron Dockerfile, compose.yaml, compose.dev.yaml y una lista permitida en .dockerignore. `docker compose up -d --build --wait` sirve la demo en localhost:3010. El frontend no monta secretos ni depende del Observatorio. Existe un servicio opcional de auditoría CLI en el perfil tools, con el secreto local montado en lectura. El modo de desarrollo usa recarga de código desde Windows; ver [operación Docker](DOCKER.md). No se implementaron servicios C# o MySQL nuevos ni cambió el stack acordado.

## Exploración visual desde localhost

Por pedido del usuario se creó `explore/marketplace-frontend` desde `localhost` (`c8bc4ec`) para acercar la experiencia a Mercado Libre, conservando los colores e identidad de Cámara. Incluye una primera propuesta de portada, búsqueda, catálogo en tarjetas/lista y ficha. Ver [alcance y recorridos de revisión](EXPLORACION-MARKETPLACE.md). Las decisiones de dominio, integración, publicación y demostración documentadas arriba siguen vigentes.

## Mejoras y valoraciones de ejemplo (11/10/2026)

El usuario aprobó implementar una portada más directa, sugerencias de búsqueda, lista inicial en resultados, tarjetas más simples, resumen útil de curso, vidriera institucional con búsqueda y filtros móviles accesibles. Autorizó estrellas y puntuación con datos de ejemplo claramente identificados. Se implementan cinco opiniones ficticias por curso valorado, distribución y promedio; un curso mantiene el estado sin opiniones. Las valoraciones no representan evidencia real ni cambian el sello institucional o la relevancia. El contrato propuesto v0.3 agrega campos nuevos pendientes de fuente y política de publicación.

**No hacer commits sin un pedido explícito del usuario.** El 14/10/2026 el usuario solicitó confirmar esta segunda iteración en `explore/marketplace-frontend`, sobre `3edf22d`. El push queda a su cargo.
