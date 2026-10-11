# Forma · Prototipo del buscador de cursos de la Cámara

Prototipo independiente del frontend y del backend del Observatorio. HTML, CSS y JavaScript nativo, sin dependencias de ejecución ni acceso a bases productivas. El nombre Forma es una marca de trabajo.

## Uso local

Desde este directorio:

```powershell
python -m http.server 5187 --bind 127.0.0.1 --directory dist
```

Abrir `http://127.0.0.1:5187/`. Los módulos JavaScript requieren servir los archivos por HTTP; no abrir `index.html` con `file://`.

## Recorridos

- `#/buscar`: búsqueda por términos, áreas, modalidad, provincia del instituto, horas y nivel. Orden por relevancia, valoración, nivel o precio.
- `#/curso/excel-horizonte`: ejemplo de ficha, programa y consulta simulada sin envío.
- `#/instituciones`: directorio de seis instituciones ficticias.
- `#/instituto/horizonte`: perfil, indicadores de ejemplo y desglose ponderado.
- `#/niveles`: metodología propuesta, requisitos y reglas de revisión.
- `#/propuesta`: relevamiento documental, campos faltantes, etapas e integración prevista.
- `#/propuesta/desarrollo`: guía de evaluación progresiva y autogestión del socio para el sitio definitivo; funcionalidades de documentación, aún no implementadas en los sistemas reales.

## Datos y metodología

### Versión para presentación · 5 de octubre de 2026

Esta iteración se revisó en el entorno local el 4 de octubre de 2026. El 5 de octubre el usuario solicitó publicarla en Sites con acceso público para compartirla con la comisión directiva. La experiencia actual incorpora cursos relacionados al pie de cada ficha, en reemplazo del comparador.

Al final de cada ficha aparecen hasta tres cursos relacionados, priorizados por coincidencias del título y las habilidades, seguidos por el área formativa. La modalidad y la dificultad resuelven empates. El nivel institucional, la antigüedad y el volumen de reseñas no influyen. Se excluyen el curso actual, duplicados y ofertas sin coincidencia temática. Si no hay coincidencias, se ofrece explorar el catálogo sin inventar recomendaciones. En celular las tarjetas se recorren horizontalmente; en escritorio se muestran en grilla. Los enlaces antiguos a `#/comparar` conducen al buscador. Se retiraron la selección, la barra y la página del comparador.

Pruebas de recomendaciones: `node --test tests/related-courses.test.mjs`.

El Sello de Desarrollo Formativo adopta el diseño de credencial, con la escala Base formativa, Solidez formativa, Distinción formativa y Referente formativo. En evaluación permanece fuera de la escala. Los umbrales y requisitos de evidencia anteriores siguen siendo una propuesta, sin reclasificar socios reales.

Se incorporó el logo oficial de la Cámara, sin alteraciones, desde https://camaraargentina.com.ar/wp-content/uploads/2023/08/logo.png, referenciado por https://camaraargentina.com.ar/. Se utiliza en la cabecera, las credenciales y la sección de certificación. La página oficial muestra copyright; no se identificó una licencia abierta. Los logos de los institutos siguen siendo ficticios.

Cada ficha incluye resultados de aprendizaje, habilidades, trabajo práctico, forma de evaluación y conocimientos previos específicos. Todos son ejemplos editoriales del catálogo ficticio y requieren validación del socio antes de uso real.

Las 16 fichas incorporan además las secciones Objetivos y Dirigido a, con contenido específico de demostración y accesos directos en la navegación de la ficha. Los destinatarios se distinguen de los requisitos de ingreso, que aparecen a continuación. Estos campos también requieren validación del socio al incorporar cursos reales.

La búsqueda considera título, habilidades, resultados, proyecto, programa y datos institucionales. La afinidad prioriza título, habilidades y resultados. El puntaje institucional no interviene en el orden por relevancia, ni en los empates: éstos se resuelven alfabéticamente. El orden explícito por nivel continúa disponible.

Prueba del comportamiento de búsqueda y de los requisitos de evidencia: `node --test tests/search-model.test.mjs`.

### Evolución visual del prototipo

La segunda versión usa tarjetas de catálogo en grilla, búsqueda permanente, navegación por categorías, perfiles de institutos con logos y accesos a Instagram, Facebook, LinkedIn y YouTube. Las marcas y fotografías fueron generadas como ejemplos; no representan a socios, sedes ni estudiantes reales.

Todas las fichas distinguen al instituto que dicta el curso de la Cámara que emite el certificado. El certificado se presenta sujeto a los requisitos de aprobación correspondientes.

Las redes tienen campos preparados en `model.js`; actualmente están vacíos porque las instituciones son ficticias. Los botones explican ese estado, sin enlazar cuentas inventadas. Al incorporar enlaces reales se aceptan únicamente URLs HTTPS del dominio de cada red.

Las fichas incorporan galería y un reproductor de video. Los dos cursos de Excel y la portada muestran un video público de ejemplo, “Excel: Getting Started”, de LearnFree, verificado mediante YouTube oEmbed. Se aclara su procedencia y que no corresponde a los institutos ni a la Cámara; el reproductor sólo carga al abrirse y se elimina al cerrar. El catálogo real debe reemplazarlo por material autorizado de los socios. No se implementó todavía carga de archivos ni un portal de edición para socios.

Los 16 cursos y las seis instituciones, precios, reseñas, verificaciones y puntajes son ficticios. No se clasificó a socios reales. No hay inscripciones, cobros, envío de consultas ni almacenamiento de datos personales.

Los únicos agregados tomados de informes existentes son 18.466 cursos y 137.601 registros de certificados, con corte del 1 de septiembre de 2026. Sus universos, limitaciones y archivos de origen se explican en la propuesta. No son una consulta en vivo ni un conteo de personas únicas.

Pesos iniciales para discusión: experiencia de estudiantes 30%, propuesta formativa 25%, respaldo institucional 20%, información y actualización 15%, trayectoria formativa 10%. Las dimensiones de ejemplo son entradas ilustrativas, no resultados calculados a partir de las reseñas o conteos ficticios. La rúbrica operativa y los ajustes estadísticos deberán validarse antes de producción.

La evaluación requiere evidencia completa, revisión y al menos diez opiniones; Referente exige además treinta opiniones y un mínimo de 80 en propuesta formativa. La falta de evidencia deja el perfil En evaluación, sin cero ni imputación de calidad negativa. Los valores no pretenden representar una acreditación oficial.

## Verificación realizada

- Sintaxis de ambos módulos JavaScript.
- Búsqueda sin acentos, múltiples filtros, sin resultados, orden de precios e identificadores únicos.
- Puntaje no asignado cuando falta evidencia y tope de nivel por cantidad insuficiente de opiniones.
- Navegación navegador: búsqueda, provincia y modalidad combinadas, ficha, diálogo y perfil institucional.
- Revisión visual en escritorio y móvil.
- WebMCP: registro, búsqueda válida, rechazo de entrada inválida y lectura del estado visible.

## Publicación

Sitio estático administrado por Sites, con acceso público solicitado por el usuario. `.openai/hosting.json` contiene exclusivamente la identidad del sitio y la carpeta pública `dist`. No incorporar secretos ni archivos del resto del Observatorio a este proyecto.

## Especificación para desarrollo: evaluación progresiva

La sección pública `#/propuesta/desarrollo`, accesible desde Propuesta y el pie de página, documenta el modelo solicitado el 5/10/2026 para que una institución nueva pueda alcanzar un nivel favorable por su preparación verificada. El contenido se mantiene en `dist/development-spec.js`.

Incluye pesos propuestos por etapa (documentación / pedagogía / información / experiencia / actividad certificada): inicial 30/40/30/0/0; primeras experiencias 15/30/15/25/15; experiencia suficiente 10/20/10/40/20. Documenta transición por evidencia en lugar de antigüedad, separación entre estrellas y sello, requisitos de datos e historial, estados de revisión, reglas de privacidad pública, criterios de aceptación y decisiones pendientes de validación con la Cámara.

Esta incorporación es documentación funcional, no una migración del cálculo de `model.js`. Los pesos fijos, umbrales y requisitos de reseñas descritos antes corresponden únicamente al motor de demostración existente. La nueva guía propone permitir Distinción en evaluación inicial y reservar Referente para evidencia sostenida. Antes de implementar en producción deben aprobarse rúbricas, interpolación, ajustes estadísticos, umbrales y vigencia; luego adaptar perfiles, tarjetas de cursos relacionados y orden explícito por nivel. Mantener relevancia como orden principal.

## Identidad visual de la Cámara · 5/10/2026

El refresco visual toma como referencia directa https://camaraargentina.com.ar/: azul petróleo `#047490`, turquesa `#0ea7a5` y tipografía Open Sans, verificados en los estilos de la página. El tema compartido está en `dist/chamber-theme.css`; utiliza tonos derivados más oscuros para texto y controles con contraste legible. La cabecera reúne el logo institucional sin modificaciones y la marca Forma con el descriptor «Cursos de la Cámara». El logo se repite en el pie institucional. La paleta alcanza buscador, filtros, tarjetas, fichas, sellos, perfiles y guía de desarrollo.

Se conservan los contenidos, la lógica de búsqueda, la metodología de demostración y los cursos relacionados. No se trasladan declaraciones de certificación ISO ni otros avales del sitio institucional al prototipo. Las fotografías y logos de los institutos siguen siendo ilustrativos.

## Autogestión del socio: requisitos para desarrollo

La sección 09 de `#/propuesta/desarrollo`, con acceso rápido «Autogestión del socio», documenta tres áreas a incorporar al sistema existente: Mi perfil público (precarga, campos faltantes, borradores y vista previa), Mis leads (consultas por curso con acceso exclusivo del socio, detalle y seguimiento) y Mis cursos en el portal (activar, desactivar y reactivar sin borrar datos ni historial).

Incluye inventario propuesto de campos institucionales y de cursos, separación público/privado, captura y asignación de leads, validaciones de publicación, consistencia entre búsqueda/perfiles/recomendaciones/enlaces directos, datos de integración y criterios de aceptación. El inventario debe contrastarse con el esquema real: no afirma que todos esos campos falten actualmente. La actualización agrega documentación; no implementa autogestión, consultas reales ni cambios de publicación en bases productivas.

## Backend y fuente de datos de socios

El portal definitivo tendrá un backend propio, independiente del backend del Observatorio. Su alojamiento, proveedor y tecnología todavía están por definir; publicar este prototipo en Sites no fija esa decisión.

El backend deberá conectarse mediante acceso autorizado a la base de datos que utiliza el sistema de la Cámara. Esa base es la fuente de referencia para los datos de los socios y sus relaciones con cursos y certificados. Los informes o copias del Observatorio no reemplazan esa fuente. El frontend consumirá únicamente la API del backend del portal, sin conexiones directas ni credenciales de base en el navegador.

La integración con la autogestión existente, los permisos de lectura/escritura y la persistencia de leads, opiniones, evidencias y campos nuevos se definirán con el equipo del sistema de la Cámara, conservando los identificadores institucionales. El funcionamiento del portal no dependerá del backend del Observatorio. Esta actualización corrige la propuesta y la guía técnica; no implementa conexiones ni altera sistemas productivos.
