# Inventario de fuentes y procedencia

## Archivos de antecedentes

Raíz indicada por el usuario: `C:\Users\marti\Desktop\Sistemas\datos-observatorio`. Lectura únicamente, sin ejecución de su backend ni modificaciones. La configuración local de Mercado Cámara es autónoma.

| Ruta relativa solicitada | Estado al cierre | SHA-256 de la copia disponible (sin secretos) |
|---|---|---|
| backend/.env | Leído mediante lista permitida; sólo configuración necesaria | — |
| backend/src/config/camaraDb.js | Disponible y revisado | 55be8eba22691fe0d0d540d55ea6b32ac0da9d17887225fd426de2374184e209 |
| backend/src/services/camaraSocios.service.js | No disponible en el checkout al cierre | — |
| backend/src/scripts/auditCamaraDb.js | Disponible y revisado | 494214c81c19404bb68a7e81a2922242873f9341ad8358988855faef9194c7e3 |
| backend/src/scripts/auditCamaraSocios.js | No disponible en el checkout al cierre | — |
| backend/src/scripts/auditCamaraCourses.js | No disponible en el checkout al cierre | — |
| backend/src/scripts/auditCamaraCertificateCategories.js | No disponible en el checkout al cierre | — |
| docs/camara-db-audit-runbook.md | Disponible y revisado | 0c9c322733b4de369ca295be9dc800e27199c0eca961108aab35050b5d8f5bd4 |
| docs/camara-course-alignment-runbook.md | No disponible en el checkout al cierre | — |

Los cinco archivos ausentes al cierre no se encontraron tampoco por nombre en la carpeta Sistemas. No se da por confirmado su enrutamiento vigente ni se exige recuperarlos para ejecutar esta herramienta. Las notas de antecedentes no reemplazan los resultados actuales del esquema. El config disponible al cierre usa CAMARA_DB_*; auditCamaraDb.js utiliza ese resolver y por tanto consulta la base histórica de esta configuración. No sirve como selector implícito de la base actual de cursos. El runbook es antecedente operativo, no evidencia de conexión actual.

La inspección inicial identificó variables de las dos familias: HOST_CAMARA/USER_CAMARA/PASS_CAMARA y CAMARA_DB_*. Se copiaron sólo las claves de config/camara.example.json; no se copió el .env entero ni se retiene un hash del secreto. Los valores físicos quedan fuera de este documento.

## Fuentes MySQL verificadas

Selección explícita propia: DB_CAMARA_SOCIOS → socios; DB_CAMARA_CURSOS → cursos; CAMARA_DB_NAME → historica. Las dos primeras usan la cuenta de la familia HOST_CAMARA; la tercera la de CAMARA_DB_*. Ver scripts/camara/config.mjs. Cada métrica de evidencia-2026-10-07.json identifica el alias de conexión.

Las consultas de cada alias se enumeran en scripts/camara/queries.mjs. Los cruces a histórica desde cursos/socios usan esquemas calificados resueltos de la configuración local: no dependen de USE ni de una base por defecto ambigua. La cuenta histórica no puede leer determinadas tablas actuales; esos cruces se realizan desde la cuenta que ya tenía permiso SELECT. No se alteraron privilegios.

## Inventario por metadatos

Se enumeraron todas las tablas/columnas/claves para descubrir candidatos. Sólo los grupos documentados en DICCIONARIO.md se usaron para análisis funcional; de los demás no se extrajeron registros. Estimaciones TABLE_ROWS no se usan como conteos exactos.

### socios

`AllowedUris`, `ApiKeys`, `Categories`, `CertificateHolders`, `RefreshTokens`, `RoleAssignments`, `Roles`, `UserChanges`, `Users`, `__EFMigrationsHistory`, `postulantes`, `postulantes_cur`, `socios`.

### cursos

`Comments`, `CourseCategories`, `CourseInformations`, `CourseModules`, `CourseTutors`, `CourseVersions`, `Courses`, `ExtraTextsForCertificate`, `FormationLevels`, `Notifications`, `Observations`, `TutorAcademicExperiences`, `TutorProfessionalExperiences`, `Tutors`, `__EFMigrationsHistory`.

### historica

`1alumnos_almagro`, `1alumnos_mercedes`, `1leads`, `aaregiones`, `actas_cert`, `actas_dise`, `actas_semi`, `agenda`, `alu_encuesta_rta`, `alu_encuestas_det`, `alu_encuestas_encab`, `cat`, `categcur`, `categorias`, `certificados`, `certifidise`, `certifisemi`, `ciudades`, `compras`, `consultasweb`, `contra_socio`, `contrato`, `cuentas`, `cursos`, `cursos_obs`, `datos`, `datos_alumnos`, `deuda`, `encuesta_rta`, `encuestas_det`, `encuestas_encab`, `gestiones`, `i_acciones`, `i_area_gestion`, `i_atencion`, `i_estados`, `i_leads`, `i_leads_asesores`, `i_objetivos`, `i_origen`, `i_paises`, `i_provincias`, `i_tipocons`, `i_valoracion`, `mensajes`, `noticias`, `paises`, `paises_coniva`, `peru`, `postulantes`, `postulantes_cur`, `postulantes_obs`, `provee`, `rubros`, `rubros_not`, `socio_induccion`, `socios`, `socios_baja`, `tipificaciones`, `tmp_ids`, `usuarios`, `usuarios_roles`, `usuarios_roles_det`, `vista_certificados` (vista), `vista_certificados1` (vista), `vista_socios` (vista), `ws_socios`, `x_acciones`, `x_alumnos`, `x_alumnos2`, `x_asesores`, `x_campanias`, `x_campanias_det`, `x_carreras`, `x_casos`, `x_caus`, `x_ciudades`, `x_comisiones`, `x_estados`, `x_leads`, `x_leads_asesores`, `x_liquidacion_cuat`, `x_liquidacion_cuat_det`, `x_mov_cen`, `x_mov_cuenta`, `x_mov_tipo`, `x_mov_tipo_g`, `x_movimientos`, `x_objetivos`, `x_origen`, `x_situaciones`.

## Exclusiones

No se leyeron filas de alumnos, encuestas, CRM, leads, tokens, claves, archivos/documentos o titulares de certificados. Las tablas de tutores sólo aportan metadatos y conteos de vínculo. Certificaciones se analizan mediante conteos, estados y relaciones, sin nombres, emails ni documentos. No se descargó material audiovisual ni archivos referenciados.
