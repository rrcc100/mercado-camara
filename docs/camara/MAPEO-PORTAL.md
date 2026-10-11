# Mapeo al portal y contrato propuesto

Base: consulta real del 07/10/2026, [resultados](RESULTADOS.md) y [diccionario físico](DICCIONARIO.md). El frontend no recibe filas MySQL ni metadatos internos. El futuro backend C# .NET 9 resolverá estas transformaciones y entregará GraphQL. No se construyó ese backend ni se eligió dónde guardar los campos nuevos.

Disponibilidad: **E** existe; **I** existe pero está incompleto/contiene inválidos; **A** no se identificó un campo dedicado en las tablas relevantes; **S** existe pero su semántica o relación no fue confirmada. Un campo A no es un I; S nunca se completa mediante una suposición. Los arrays vacíos y null de la API pública representan información pública no disponible; el detalle de la causa queda en `FieldIssue.availability` de la autogestión propuesta.

Alias: S = base socios; C = base cursos; H = histórica. Los conteos de cursos siguientes corresponden a las 19.569 últimas versiones no eliminadas de cursos no eliminados, salvo indicación contraria.

## Matriz de campos

| Campo del portal | Origen tabla/columna | Transformación | Disponibilidad | Dato nuevo o revisión requerida |
|---|---|---|---|---|
| institution.id / identidad autenticada | C.Courses.PartnerId; S.Users.Id/OldId; H.socios.id | ID público opaco y correspondencia explícita, con namespace | S: PartnerId no enlaza Users.Id | Confirmar directorio dueño, SSO y permisos; no crear segunda identidad |
| institution.name | S/H.socios.nombre | Trim; revisar nombres duplicados; elegir una fuente maestra | E: completos; 10 discrepancias entre copias | Confirmar nombre público y fuente |
| Razón social privada | S/H.socios.razonsocial | Conservar en dominio administrativo | E por esquema; no exportada | No confundir con nombre público |
| institution.description | S/H.socios.textoweb | Sanitizar HTML y convertir a texto preservando párrafos | I: 18 de 2.778 en S; sólo 8 sin baja | Socio completa presentación |
| institution.specialty | socios.rubro/categoria | No convertir códigos de rubro/cuota en especialidades sin catálogo confirmado | S | Especialidades públicas revisadas |
| institution.city / province | socios.localidad / provincia / provincia_cod / pais | Normalizar geografía sin perder texto original; validar país | I: provincia 2.777/2.778; texto de ubicación casi completo | Socio confirma ubicación y sedes |
| institution.memberSince | socios.fecha_alta | Fecha de membresía, si el equipo confirma ese alcance; conservar fecha civil | E por datos, S por alcance de negocio | No usar como fundación |
| institution.foundedYear | Sin columna identificada | null | A | Socio puede declarar año de fundación con revisión |
| Baja de institución | socios.fecha_baja / estado | Política explícita; reconciliar copias; no equiparar estado=1 a vigente | S: 9 discrepancias de baja; estado=1 en todas | Cámara decide vigencia y consecuencias públicas |
| institution.logo | Sin columna dedicada identificada | null; placeholder sin identidad inventada | A | Subir logo, acreditar uso y revisar |
| institution.website | socios.web | URL HTTPS validada; no convertir una cadena cualquiera en link | I: 955/2.778, 425 sin prefijo HTTPS | Socio corrige y confirma |
| institution.socials | socios.facebook/instagram/youtube/linkedin/twitter | Validar dominio y URL; omitir enlaces no confirmados | I: cobertura variable; Twitter fuera del conjunto UI actual | Confirmar cuentas; acordar soporte de otras redes |
| Contacto público | socios.mail_insti / whatsapp_insti; mailcomercial / wscomercial | Verificar destino, formato, país y autorización; WhatsApp como string, no número JS | E para contactos institucionales, S para permiso de publicación | Consentimiento del socio y canal de recepción; aún no expuestos por el DTO público |
| Dirección pública/sede | socios.direccion / coordenadas | Dirección administrativa no equivale a sede de cursada | S | Socio selecciona qué dirección publica y para qué curso |
| institution.assessment | Sin modelo del sello progresivo identificado | null hasta evaluación documentada | A | Rúbrica, evidencias, revisión y permiso de publicación de Cámara |
| course.id | C.Courses.Id | Identidad pública estable; no cambiar por cada versión | E: GUID PK | Slug público estable y registro de publicación nuevos |
| course.versionId / versionNumber | C.CourseVersions.Id / VersionNumber / CourseId | Versión seleccionada explícitamente para publicación | E; no números duplicados por curso | Política de versión pública frente a borradores |
| Vinculación histórica | C.CourseVersions.OldId → H.cursos.id | Validar entero; preservar namespace; uso interno | I: 16.909 con puente; 2.660 sin él | Reconciliar resto; no comparar GUIDs con enteros |
| course.institution | C.Courses.PartnerId; puente H.cursos.idsocio | Resolver propiedad con directorio confirmado; no fallback anónimo | S: recuperable en 16.909 por legado | Resolver propietario de todos antes de publicarlos o permitir edición |
| course.title | C.CourseInformations.Title (por CourseVersionId) | Texto seguro; trim; no título de Courses | E: 19.569/19.569 | Revisar redacción pública |
| course.category / categoryLabel | C.CourseVersions.CategoryId → CourseCategories.Id/Title | ID fuente estable; slug público persistido; etiqueta original; posible curación separada | I: 419 sin categoría; 86 categorías | Clasificación editorial y validación del socio |
| Áreas históricas | H.cursos.categoria → H.categcur.id/nombre; H.cat separado | Tabla de correspondencia explícita, nunca igualdad de IDs | S: 82 cursos sin categcur; 9 nombres difieren en IDs comunes con cat | Confirmar taxonomías y migración |
| Icono de categoría | C.CourseCategories.IconUrl; H.categcur.icono / H.cat.icono | Validar origen, ruta y permiso de uso; no es logo de institución | E por metadatos; cobertura de valores no medida | Acordar si se usan esos recursos o iconos propios del portal |
| course.mode | C.CourseInformations.Format | Mapear enum oficial a ONLINE/HYBRID/ONSITE; por ahora null | S: 4 códigos sin traducción confirmada | Obtener enum oficial; acordar casos fuera de estas tres opciones |
| course.hours | C.CourseInformations.TotalHours | Decimal a número público sólo si positivo, finito y validado | I: 19.563 positivos; 4 negativos; 2 nulos | Corregir inválidos y revisar extremos |
| course.weeks | Sin columna dedicada | null; nunca dividir horas por una carga semanal inventada | A | Duración calendario informada por socio |
| course.location | Sin sede de cursada identificada | null; no sustituir por ciudad de institución | A/S | Sede, dirección autorizada o modalidad online confirmada |
| Fechas, horarios y cupos | RequestDate / ExpirationDate NO son calendario académico | No mapear fechas administrativas como fecha de cursada | A | Socio aporta calendario y disponibilidad |
| course.price / currency | Sin precio de curso identificado | Ambos null; cero sólo si gratuidad confirmada; decimal en backend | A | Precio, moneda, vigencia y condiciones |
| course.difficulty | Sin campo identificado | null; FormationLevels no corresponde al curso | A | Socio informa dificultad bajo catálogo acordado |
| course.description | Sin resumen público de curso dedicado | null; no derivar automáticamente de notas internas | A | Socio redacta resumen |
| course.objectives | C.CourseInformations.Objectives | Sanitizar HTML, conservar contenido sin añadir promesas | I: 2.653 | Completar resto y revisar contenido |
| course.audience | C.CourseInformations.DestinedTo | Texto seguro dividido en párrafos/listas existentes; no inventar destinatarios | I: 2.605 | Completar destinatarios |
| course.modules | C.CourseModules.Id/Title/Content/Order/CourseVersionId | Objetos, no sólo títulos; ordenar Order e Id; texto seguro | I: 2.561 cursos con módulos; 7 órdenes duplicados | Completar programa y revisar orden |
| Programa histórico | H.cursos.programa (varchar(7)) | No tratar como contenido académico ni URL verificada | S | Confirmar referencia a archivo/indicador y acceso autorizado |
| course.evaluation | C.CourseInformations.EvaluationMethod / RequiresExam | Texto de método; RequiresExam no describe criterios completos | I: 2.632 métodos | Condiciones y criterios de aprobación |
| course.outcomes / skills | Sin campos dedicados | Arrays vacíos; no inferir a partir del título | A | Socio declara resultados observables y habilidades |
| course.project / prerequisites | Sin campos dedicados | null; ausencia de requisitos no significa «sin requisitos» | A | Completar cuando corresponda; distinguir no aplica de pendiente |
| Docentes públicos | C.CourseTutors → Tutors; experiencias y FormationLevels | Proyección mínima con autorización; no documentos/contactos/fecha de nacimiento | E vínculo en 19.415; S alcance público | Consentimiento, perfil y campos públicos; extensión futura del SDL |
| course.certificate | C.CertifyingInstitutionId / CourseInformations.CertifyingEntityId; antecedentes H.certificados/certifidise/certifisemi | Verificar emisor, modalidad de certificado, versión y condiciones; de lo contrario null | S: directorio de emisor no identificado | Cámara confirma oferta; el socio no se autoasigna emisor |
| Historial de certificaciones | H.(tabla,id), idsocio/idcurso/newcourseid/estado/fecha_validacion | Identidad compuesta; newcourseid → CourseVersions.Id → Courses.Id | E con relaciones incompletas | Reconciliar conflictos, revocación y estado; uso interno agregado |
| course.cover / video | No identificados en tablas relevantes | null; no usar logo/video demo en cursos reales | A | Subir material autorizado; validar formatos, derechos y almacenamiento |
| course.updatedAt | C.ModifiedAt / CourseVersions.UpdatedAt/ModifiedAt | Acordar fecha efectiva de actualización pública de todos los componentes | S | No presentar fecha de auditoría como actualización del curso |
| course.status | No existe estado del nuevo portal | Estado editorial propio, separado de Status/Approved/Active/Deleted | A | Autorización de socio + revisión, reglas y auditoría de publicación |
| Opiniones / nivel / conteos visibles | No existe modelo aprobado del portal | Vacío/null; certificados operativos no crean calificaciones | A/S | Diseño de evidencia, verificación, permisos y rúbrica |

## Formularios y autogestión

Hoy los únicos formularios del frontend son búsqueda/filtros GET. Ya usan categorías del repositorio (futuro GraphQL), no una taxonomía cerrada de seis áreas. Las fichas soportan null y arrays vacíos sin reemplazar por información inventada. No se implementó una administración ni guardado simulado.

El formulario futuro `Mi perfil` debe precargar sólo campos de la copia maestra confirmada. Nombre público, descripción, especialidades, logo, ubicación/sedes, web, redes y contactos autorizados requieren confirmación del socio. Mantener razón social, documentación, credenciales y notas privadas fuera del perfil público. Fecha de membresía y estados los administra Cámara. No permitir al socio asignarse nivel ni emisor de certificado.

`Mi curso` debe trabajar sobre courseId y versionId, con revisión de concurrencia. Precargar título, objetivos, destinatarios, módulos con contenido y orden, método de evaluación, horas válidas y categoría. Modalidad queda por confirmar hasta resolver Format. Pedir resumen, resultados/habilidades, requisitos, proyecto cuando aplique, calendario, sede, precio/moneda/condiciones y medios. Nunca completar ausencias con contenido generado presentado como información del socio.

Mostrar por campo:

| Estado privado propuesto | Significado | Acción |
|---|---|---|
| ABSENT_IN_SOURCE | Sin columna o modelo dedicado encontrado | Solicitar dato nuevo y acordar persistencia |
| INCOMPLETE | Campo existente nulo/vacío | Completar o confirmar «no aplica», si se admite |
| UNCONFIRMED | Código, semántica, relación o permiso no confirmado | Resolver con Cámara; no adivinar |
| INVALID | Valor presente pero no apto (horas negativas, enlace inseguro) | Corregir conservando trazabilidad |

Los obligatorios de publicación y su variación por modalidad deben acordarse; no se da por aprobado exigir todos los campos. Guardar borrador no implica publicar. `setCoursePublication` comprueba propiedad, socio vigente según política acordada, versión elegible, contenido revisado y permiso expreso del portal. Desactivar conserva historia, leads y certificaciones, y retira catálogo, relacionados, conteos y sitemap.

`Mis leads` conserva la propuesta previa: privado por socio, estados nuevo/en seguimiento/inscripto/cerrado, recibo sólo después de persistir y consentimiento. Las tablas CRM históricas no se importaron ni se asumieron como backend de Mercado Cámara.

## Reglas del contrato GraphQL v0.2

El [SDL](../contrato.graphql) y los validadores TS incluyen `versionId`, `versionNumber`, categorías dinámicas, módulos `{id,title,content,order}`, datos opcionales, certificado explícito `{label,issuerName,chamberIssued}`, `foundedYear` separado de `memberSince` y campos privados de completitud. No se implementaron resolvers ni mutaciones.

1. `Course.id` identifica el curso estable; `versionId` identifica lo que se está mostrando. El backend conserva los identificadores físicos y namespaces en su capa interna. Un curso sin propietario confirmado no produce un DTO público válido, que requiere Institution.
2. `categories` y `catalog.categories` devuelven categorías de oferta autorizada, con slugs persistidos y etiquetas confirmadas. Las seis demo sólo se sirven desde el repositorio ficticio; no migran categorías reales por coincidencia de título.
3. null no equivale a cero/gratis, presencial, sin requisitos, nivel base o curso no certificado. Arrays vacíos significan contenido no disponible. Precio informado necesita moneda; horas no positivas se invalidan. La UI distingue estas ausencias.
4. Mantener por separado estado administrativo, publicación, vigencia del socio, versión seleccionada y evidencia de certificado. Sólo `PUBLISHED` entra al catálogo. `UNAVAILABLE` conserva URL de una oferta previamente pública. Borradores privados devuelven null a la consulta pública.
5. Los textos públicos se entregan sanitizados como texto. No se exponen InternalNotes, claves, documentos, contactos privados, alumnado ni conteos sensibles de certificados.
6. `certificate=null` mientras no se confirme la oferta. Un certificado histórico emitido a alguien no demuestra derecho a prometer ese certificado para cualquier versión futura. `assessment=null` mientras no exista revisión conforme a la política aprobada.
7. Lecturas públicas con variables, validación Zod y fallas explícitas; sin fallback a demo. Las mutaciones propuestas requieren sesión, propiedad comprobada, expectedRevision e idempotencia. No autorizar con el puente parcial OldId sin validación del sistema de identidad.
8. Categorías/perfiles/sitemap hoy usan arrays de borrador. Con 19.569 cursos relevados se necesita paginación/límites de backend antes de una integración real; catalog ya pagina. No cargar la base completa al navegador.

Pendientes: enums oficiales; directorio de PartnerId/emisores; fuente maestra de socios; conflicto entre enlaces de certificados; almacenamiento de campos nuevos/medios; políticas editoriales/identidad; campos de calendario y docentes del SDL; moneda/condiciones; reglas definitivas del sello. El stack y las decisiones de [CONTEXTO-PROYECTO](../CONTEXTO-PROYECTO.md) se conservan.
