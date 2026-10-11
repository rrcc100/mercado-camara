# Integración del backend · borrador v0.2 · contrastado con auditoría del 07/10/2026

## Responsabilidades y fuente de verdad

Stack solicitado: **C# / .NET 9, API GraphQL y MySQL**. Es un backend propio de Mercado Cámara, independiente del Observatorio. No hay servidor C# ni integración MySQL en el runtime del portal. Sí existe una herramienta local independiente de auditoría de lectura, ver [relevamiento real](camara/README.md). El alojamiento sigue pendiente.

La base utilizada por el sistema de la Cámara es la fuente de socios, cursos y certificados. Se verificaron tres esquemas con lectura y agregados. Ver [matriz de origen y transformaciones](camara/MAPEO-PORTAL.md); siguen pendientes la relación de PartnerId, enums oficiales, fuente maestra de socios y autorización editorial. No inferir tablas a partir del prototipo ni crear otra identidad de socio. Acordar con el equipo dónde persistir los campos nuevos, leads, evidencias y opiniones; aquí no se decidió una segunda base ni una modificación de tablas existentes.

El backend debe separar resolvers GraphQL, servicios de aplicación/dominio y adaptadores de persistencia. Usar consultas parametrizadas, paginación en MySQL, transacciones para cambios compuestos y DataLoader o carga por lotes para evitar N+1. Elegir biblioteca GraphQL y proveedor MySQL compatibles tras revisar el stack del equipo; esta entrega no fija paquetes NuGet ni inventa un esquema ORM.

Al 7/10/2026, .NET 9 está en mantenimiento y su soporte termina el **10/11/2026**, según la [política oficial de Microsoft](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core). Se conserva el stack pedido; antes de poner en producción, acordar actualización y soporte del runtime. No se cambió a otra versión por cuenta propia.

## Contrato ejecutable del frontend

`docs/contrato.graphql` es SDL propuesto, no el esquema de una API existente. Las ocho consultas públicas de `src/data/graphql/repository.ts` coinciden con él. `src/domain/catalog.ts` valida su respuesta en ejecución y aporta los tipos TypeScript. Regenerar tipos desde el esquema aprobado cuando exista; hasta entonces los validadores y el SDL deben cambiar juntos.

Ejemplo de consulta con variables:

```graphql
query Catalog($filter: CatalogFilterInput!) {
  catalog(filter: $filter) {
    total
    page
    pageSize
    provinces
    items {
      id
      slug
      title
      status
      institution {
        id
        name
      }
    }
  }
}
```

```json
{
  "filter": {
    "q": "excel",
    "mode": "ONLINE",
    "province": "CABA",
    "sort": "relevance",
    "page": 1
  }
}
```

El adaptador actual pide todos los campos de presentación en la consulta; este ejemplo abreviado sólo explica la forma. El endpoint puede ser `/graphql`; no agregar un controlador REST paralelo para estos recursos.

| Operación pública              | Reglas                                                                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `catalog`                      | Sólo `PUBLISHED`; filtros conjuntivos, total antes de paginar, orden determinista, 9 por página. Provincias derivadas de la oferta activa, no de registros desactivados. |
| `course(slug)`                 | `null` para desconocido/borrador privado; `UNAVAILABLE` sólo para un curso que ya fue público y conserva URL.                                                            |
| `institutions` / `institution` | Sólo perfiles aprobados para publicación; sin datos administrativos.                                                                                                     |
| `institutionCourses`           | Pertenencia a la institución solicitada y sólo oferta activa.                                                                                                            |
| `relatedCourses`               | Máximo 3, sin repetidos/inactivos/actual, afinidad por tema/habilidades. El nivel institucional no interviene.                                                           |
| `categories` | Categorías aprobadas y asociadas con oferta publicada, ID estable y slug persistido. |
| `publishedSlugs`               | Sólo slugs públicos activos; fuente para sitemap. Evitar enumerar borradores.                                                                                            |

Valores contractuales: categorías dinámicas desde GraphQL (las seis áreas anteriores son sólo demo); modalidad `ONLINE`, `HYBRID`, `ONSITE` o null hasta confirmar Format; dificultad libre confirmada o null; moneda ISO de tres letras o null; redes `Instagram`, `Facebook`, `LinkedIn`, `YouTube`; `duration=short` hasta 40 h inclusive, `long` más de 40; `sort=relevance|price|duration`. Strings vacíos en filtros equivalen a ausencia. Validar entradas en backend y limitar q a 160 caracteres, página a 1–10.000, tamaño a 9. No ordenar por niveles de etapas distintas.

Precios: `null` si no se conoce, cero sólo para gratuidad real. `price: Float` es exclusivamente una representación pública de lectura en unidades de la moneda informada; C# y MySQL deben usar decimal con precisión acordada. No sirve como contrato de cobro. Antes de pagos, adoptar importe/moneda decimal explícitos. Fechas: ISO 8601 en UTC en la API, presentación localizada. `reviewedAt=null` significa ausencia, no una fecha fabricada.

Medios: por ahora sólo assets locales controlados del frontend y videos YouTube con ID válido. Debe acordarse almacenamiento de imágenes reales y ampliar el contrato/allowlist. No publicar el logo ficticio de una institución como reemplazo silencioso de uno faltante. La ficha definitiva debe recibir docentes, sedes, fechas, horarios, cupos y condiciones validados; el SDL de borrador de curso todavía no cubre todo ese inventario y se debe extender antes de autogestión.

Los arrays de instituciones, cursos por institución y slugs son límites de esta primera versión. Para catálogos grandes: conexiones por cursor, paginación de sitemap y límites de complejidad, cambiando las operaciones de consumo coordinadamente. No descargar toda la base al navegador ni hacer filtros productivos sobre fixtures.

## Configuración y fallas

Configurar en `.env.local` o secretos del alojamiento: `DATA_SOURCE=graphql`, `GRAPHQL_ENDPOINT`, `SITE_URL`. Ninguna variable secreta lleva prefijo `NEXT_PUBLIC_`. La API pública de lectura no requiere en este borrador una clave de servicio; si el equipo exige una, guardarla sólo en servidor e implementar su rotación. No incrustar secretos en URL ni documentación.

Transporte actual: POST JSON, variables, HTTPS (HTTP sólo en loopback para desarrollo), timeout de 8 segundos, `cache: no-store`. Las respuestas se validan con Zod; datos demo de una fuente marcada real, errores GraphQL, HTTP no exitoso y respuestas inválidas fallan sin fallback. Los logs del servidor deben registrar correlación/código, sin cuerpos con datos personales. La interfaz muestra un mensaje recuperable sin errores internos ni SQL.

En el backend: errores GraphQL con `extensions.code` (`BAD_USER_INPUT`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `SERVICE_UNAVAILABLE`) y correlation ID. Las mutaciones de negocio devuelven `errors { field code availability message }`; no responder éxito con errores parciales. No revelar mensajes de drivers ni información de otras instituciones.

## Identidad y autogestión

Reutilizar la cuenta del socio y su identificador del sistema existente. Elegir SSO/OIDC o el mecanismo aprobado por ese equipo. No confiar en `institutionId` recibido del navegador para autorizar. Los resolvers de `myProfile`, `myLeads`, `myCourses` y todas las mutaciones privadas derivan institución/permisos de la sesión y comprueban propiedad de cada recurso.

Roles a confirmar: visitante público, socio editor de su institución y revisor de Cámara. El socio nunca modifica la rúbrica, el emisor del certificado, una opinión ajena o su evaluación. Separar borradores privados de la vista pública aprobada. Si la sesión usa cookies: HttpOnly, Secure, SameSite adecuado y protección CSRF para mutaciones. CORS sólo para orígenes acordados, sin comodines con credenciales. Consultas privadas siempre no-store y sin prerender.

El SDL incluye propuestas de `saveMyProfileDraft`, `saveMyCourseDraft`, `setCoursePublication`, `createLead` y `updateMyLead`. **Ninguna está implementada ni se llama desde la UI actual.** No habilitar botones antes de cerrar permisos, persistencia, validaciones e idempotencia.

## Leads y consistencia

`createLead` resuelve institución a partir del curso en servidor, verifica publicación vigente dentro de la transacción, registra consentimiento (versión, destinatario y fecha) y usa una clave de idempotencia con restricción única. Validar límites de texto, email, rate limit y política antispam. La transacción debe guardar antes de devolver un recibo. Repetir una clave con la misma solicitud devuelve el mismo resultado; con otro contenido genera conflicto. Un timeout después del commit debe poder reintentarse sin duplicados.

No guardar leads por visitar, pulsar WhatsApp o cargar un video. El formulario futuro identifica a la institución que recibirá el contacto. Acordar retención, acceso, exportación y supresión de datos personales. Las notas internas y estados sólo se leen con autorización. Los estados son Nuevo, En seguimiento, Inscripto y Cerrado; Inscripto necesita confirmación, nunca inferencia de un clic.

## Publicación, reactivación e invalidación

Publicar exige propiedad, obligatorios por modalidad, vigencia y aprobaciones. `expectedRevision` evita sobreescrituras concurrentes. La desactivación no elimina el curso maestro ni certificados, opiniones o leads: retira de catálogo, conteos, facets, perfil, relacionados y sitemap. La URL estable responde indisponibilidad y la API rechaza nuevas consultas, incluso si un visitante conserva HTML anterior.

Persistir auditoría actor/instante/estado anterior/nuevo/revisión. Para una futura caché: emitir un evento transaccional/outbox `CoursePublicationChanged` después del commit; invalidar curso, institución, búsquedas afectadas, relacionados y sitemap mediante una tarea autenticada y reintentable. Nunca declarar `applied=true` mientras índices requeridos no reflejen la publicación. Mantener lecturas sin caché hasta que este mecanismo esté probado.

Reactivar revisa requisitos otra vez, usando el mismo ID, slug e historial. No reiniciar reputación ni duplicar institución para eludir evidencia previa.

## Acuerdos necesarios para conectar

Acceso y esquema MySQL; catálogo de IDs y propiedad de campos; proveedor de identidad y permisos; campos obligatorios y aprobaciones; alojamiento y conectividad; contrato final y paginación; almacenamiento de medios, leads y documentos; política de opiniones y sello; observabilidad/backups; plan de soporte .NET. Ninguno se da por resuelto con la demo.
