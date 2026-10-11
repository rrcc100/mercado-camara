# Producto, evaluación y autogestión

Este documento conserva requisitos acordados para la siguiente etapa. La UI pública está implementada; la autogestión y el cálculo de evaluación son trabajo futuro. La guía fuente completa se conserva sin modificaciones en `reference/forma-v10/dist/development-spec.js`.

## Evaluación progresiva

La fórmula fija de `model.js` pertenece al prototipo antiguo. No se usa ni se tradujo a TypeScript. La UI consume un resultado del repositorio: nivel, etapa, fundamento, fecha de revisión y versión metodológica. En la demo las asignaciones son ilustrativas, sin puntajes ni reseñas verificadas.

| Dimensión                   | Inicio | Primeras experiencias | Evidencia suficiente |
| --------------------------- | -----: | --------------------: | -------------------: |
| Documentación y respaldo    |     30 |                    15 |                   10 |
| Propuesta formativa         |     40 |                    30 |                   20 |
| Información y actualización |     30 |                    15 |                   10 |
| Experiencia de alumnos      |      0 |                    25 |                   40 |
| Actividad y certificaciones |      0 |                    15 |                   20 |

Pesos propuestos, pendientes de validación. Cada columna suma 100. Una institución nueva bien preparada puede alcanzar Distinción con evidencia inicial aprobada; Referente requiere experiencia real suficiente y sostenida. Datos faltantes son `null`, no cero. En evaluación es un estado fuera de los cuatro niveles.

La etapa depende de evidencia disponible, incluidas experiencias previas comprobables; no de meses desde el alta ni antigüedad institucional. Ejemplos en discusión: una cohorte y 10 opiniones para primeras experiencias, dos cohortes y 30 para evidencia suficiente. **No son umbrales aprobados.** Calibrar una transición gradual sin saltos arbitrarios, ajustes por pocas reseñas, cobertura de respuesta, vigencia, grupos pequeños y períodos de actividad.

Certificaciones de Cámara con peso relevante, deduplicadas, válidas y trazables. Evitar premiar sólo el volumen o tamaño; la cantidad puede mantenerse interna. Precio, redes o seguidores no son calidad académica. No comparar puntajes de etapas diferentes como si fueran equivalentes.

Guardar evidencias, rúbrica por criterio, notas, estado de verificación, revisor, fecha, vencimiento, pesos efectivos, nivel, etapa, metodología versionada y motivos de cambio. Recalcular por evidencia nueva, invalidada o vencida y conservar resultados anteriores reproducibles. Permitir revisión de errores. No reiniciar una institución como nueva para eludir antecedentes negativos.

Opiniones: invitaciones a todos los alumnos elegibles, una por inscripción comprobable, conciliación con cohortes, prevención de duplicados y conflictos. No permitir al socio seleccionar sólo satisfechos ni borrar opiniones por ser negativas. Mostrar estrellas y cantidad por separado del sello; en la ficha, opiniones del curso correspondiente. No hay reseñas reales cargadas en esta entrega.

Antes de activar el cálculo: validar fórmula de interpolación, rúbricas, umbrales, cobertura mínima, controles antifraude, requisitos de Referente, vigencia y tratamiento de evidencia negativa. Hacer piloto con instituciones de tamaños y antigüedades variados.

## Mi perfil público

Reutilizar el sistema de autogestión y cuenta existentes. Precargar de la base de Cámara y mostrar campos faltantes, obligatorios/opcionales, revisión, borrador y vista previa. El inventario ya fue contrastado con tres esquemas: ver [matriz de campos y disponibilidad](camara/MAPEO-PORTAL.md). La fuente maestra y el vínculo de autenticación siguen pendientes.

- Institución: nombre público, logo autorizado, descripción, especialidades, antecedentes, provincia/localidad, sedes, web, contactos autorizados, redes, fotos y video con autoría/permisos.
- Curso: título, categoría, descripción, objetivos, destinatarios, resultados, habilidades, módulos, requisitos, docentes, modalidad, sede, horas/semanas, fechas, horarios, disponibilidad, precio total/moneda, formas de pago y condiciones.
- Evaluación: proyecto, evaluación y requisitos de aprobación. Verificar con Cámara la oferta y el emisor del certificado de cada versión. El socio no puede autoasignarse esa autorización. Hasta confirmarlo, mostrar certificación pendiente.

Separar documentos privados, contactos administrativos y notas del contenido público. Completar un campo no aprueba evidencia ni eleva automáticamente el nivel. No inventar redes faltantes. Validar HTTPS y dominio de cada red.

## Mis leads

Listado privado por socio con fecha, curso, contacto, origen y estado; filtros, detalle, mensaje y seguimiento. Estados propuestos: Nuevo, En seguimiento, Inscripto, Cerrado. Guardar notas internas y fechas. Acceso exclusivo de la institución destinataria y roles autorizados de Cámara.

Un lead existe después del envío guardado correctamente. El formulario identifica destinatario y consentimiento. Deduplicar reintentos, conservar leads de cursos inactivos y confirmar inscripción sólo con evidencia del socio/sistema. Una visita o un enlace a mensajería no registra automáticamente a una persona ni permite recuperar sus conversaciones.

## Mis cursos en el portal

Listado con título, modalidad, estado de publicación, última actualización y activar/desactivar/reactivar. Publicación separada de la existencia del registro maestro. El backend comprueba propiedad, campos y aprobaciones; describe exactamente lo que falta.

Desactivar retira inmediatamente de búsqueda, conteos, filtros, perfil, relacionados y sitemap. URL directa indica indisponibilidad y no acepta nuevas consultas, incluyendo peticiones directas a GraphQL. Se conservan historial, leads, opiniones y certificados. Reactivar mantiene ID y URL y vuelve a validar. Auditar quién, cuándo y cambios. Manejar pendientes/fallas sin un éxito ficticio.

## Aceptación para la siguiente etapa

1. Socio bien preparado puede recibir Distinción inicial sin reseñas; sin evidencia suficiente queda En evaluación, no cero.
2. El tiempo solo no cambia la etapa. Opiniones y certificaciones no se duplican; grupos pequeños no equivalen a mala calidad.
3. Niveles siempre identifican etapa; antecedentes y versiones se conservan y explican.
4. Socio autenticado ve sus datos precargados, guarda borrador y previsualiza. Datos privados nunca aparecen en consultas públicas.
5. Lead confirmado existe una sola vez en el socio correcto; otro socio no puede leerlo ni modificarlo.
6. Curso incompleto o ajeno no se publica. Desactivar afecta todas las superficies y rechaza nuevas consultas. Reactivar conserva identidad e historia.
7. Acordar obligatorios, aprobaciones, roles, plazos de conservación, política de opiniones y revisión antes de producción.
