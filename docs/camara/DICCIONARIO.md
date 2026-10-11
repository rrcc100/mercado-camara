# Diccionario físico relevante

Metadatos consultados el 2026-10-07T18:08:57.065Z. Tipos y nulabilidad físicos; no son permisos de publicación. Se omiten columnas personales, credenciales y notas privadas innecesarias. Ningún valor individual fue exportado. PRI = clave primaria; MUL = índice no único. Ver [matriz semántica](MAPEO-PORTAL.md) para transformaciones y dudas.

Las columnas CreatedBy/ModifiedBy, cuando listadas, son referencias técnicas; no se expone su valor. Los nombres de columnas de contacto describen disponibilidad, sin incluir contactos.

## socios

### socios

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| id | int | NO | PRI | — |
| nombre | varchar(120) | NO | — | utf8mb3_spanish_ci |
| razonsocial | varchar(120) | YES | — | utf8mb3_spanish_ci |
| localidad | varchar(50) | NO | — | utf8mb3_spanish_ci |
| provincia | varchar(50) | NO | — | utf8mb3_spanish_ci |
| provincia_cod | int | YES | — | — |
| whatsapp_insti | bigint | YES | — | — |
| mail_insti | varchar(150) | YES | — | utf8mb3_general_ci |
| web | varchar(200) | YES | — | utf8mb3_spanish_ci |
| facebook | varchar(200) | YES | — | utf8mb3_spanish_ci |
| instagram | varchar(200) | YES | — | utf8mb3_spanish_ci |
| youtube | varchar(200) | YES | — | utf8mb3_general_ci |
| twitter | varchar(200) | YES | — | utf8mb3_general_ci |
| linkedin | varchar(200) | YES | — | utf8mb3_general_ci |
| fecha_alta | date | YES | — | — |
| fecha_baja | date | YES | — | — |
| rubro | int | YES | — | — |
| categoria | int | YES | — | — |
| estado | tinyint(1) | YES | — | — |
| textoweb | text | YES | — | utf8mb3_spanish_ci |
| coordenadas | varchar(50) | YES | — | utf8mb3_spanish_ci |
| mailcomercial | varchar(60) | YES | — | utf8mb3_spanish_ci |
| wscomercial | bigint | YES | — | — |
| pais | int | YES | — | — |

No se observó FK declarada en esta tabla.

### Users

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| Deleted | tinyint(1) | NO | — | — |
| OldId | longtext | YES | — | utf8mb4_0900_ai_ci |

No se observó FK declarada en esta tabla.

### CertificateHolders

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| PartnerId | char(36) | NO | — | ascii_general_ci |

No se observó FK declarada en esta tabla.

### Categories

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| Name | longtext | NO | — | utf8mb4_0900_ai_ci |
| MonthlyFee | decimal(65,30) | NO | — | — |
| Deleted | tinyint(1) | NO | — | — |

No se observó FK declarada en esta tabla.

## cursos

### Courses

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| PartnerId | char(36) | NO | MUL | ascii_general_ci |
| CertifyingInstitutionId | char(36) | NO | — | ascii_general_ci |
| CreatedAt | datetime(6) | NO | — | — |
| ModifiedAt | datetime(6) | YES | — | — |
| CreatedBy | longtext | YES | — | utf8mb4_0900_ai_ci |
| ModifiedBy | longtext | YES | — | utf8mb4_0900_ai_ci |
| Deleted | tinyint(1) | NO | — | — |

No se observó FK declarada en esta tabla.

### CourseVersions

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| CourseId | char(36) | NO | MUL | ascii_general_ci |
| Approved | tinyint(1) | NO | — | — |
| VersionNumber | int | NO | — | — |
| CreatedAt | datetime(6) | NO | — | — |
| ModifiedAt | datetime(6) | YES | — | — |
| CreatedBy | longtext | YES | — | utf8mb4_0900_ai_ci |
| ModifiedBy | longtext | YES | — | utf8mb4_0900_ai_ci |
| Deleted | tinyint(1) | NO | — | — |
| Status | int | NO | MUL | — |
| ExpirationDate | datetime(6) | YES | — | — |
| LastStatusUpdate | datetime(6) | YES | — | — |
| RequestDate | datetime(6) | YES | MUL | — |
| ValidatorId | char(36) | YES | — | ascii_general_ci |
| ExtraCertificateInformation | longtext | YES | — | utf8mb4_0900_ai_ci |
| CategoryId | char(36) | YES | MUL | ascii_general_ci |
| ObservedAt | datetime(6) | YES | — | — |
| UpdatedAt | datetime(6) | YES | — | — |
| OldId | longtext | YES | — | utf8mb4_0900_ai_ci |
| Active | tinyint(1) | NO | — | — |

FK declarada: CategoryId → CourseCategories.Id. FK declarada: CourseId → Courses.Id.

### CourseInformations

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| CourseVersionId | char(36) | NO | MUL | ascii_general_ci |
| Title | longtext | NO | — | utf8mb4_0900_ai_ci |
| EvaluationMethod | longtext | YES | — | utf8mb4_0900_ai_ci |
| TotalHours | decimal(65,30) | YES | — | — |
| Deleted | tinyint(1) | NO | — | — |
| Format | int | NO | — | — |
| Objectives | longtext | YES | — | utf8mb4_0900_ai_ci |
| RequiresExam | tinyint(1) | NO | — | — |
| CertifyingEntityId | char(36) | YES | — | ascii_general_ci |
| DestinedTo | longtext | YES | — | utf8mb4_0900_ai_ci |

FK declarada: CourseVersionId → CourseVersions.Id.

### CourseModules

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| CourseVersionId | char(36) | NO | MUL | ascii_general_ci |
| Title | longtext | NO | — | utf8mb4_0900_ai_ci |
| Content | longtext | NO | — | utf8mb4_0900_ai_ci |
| Deleted | tinyint(1) | NO | — | — |
| Order | int | NO | — | — |

FK declarada: CourseVersionId → CourseVersions.Id.

### CourseCategories

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| Title | longtext | NO | — | utf8mb4_0900_ai_ci |
| CreatedAt | datetime(6) | NO | — | — |
| ModifiedAt | datetime(6) | YES | — | — |
| CreatedBy | longtext | YES | — | utf8mb4_0900_ai_ci |
| ModifiedBy | longtext | YES | — | utf8mb4_0900_ai_ci |
| Deleted | tinyint(1) | NO | — | — |
| IconUrl | longtext | YES | — | utf8mb4_0900_ai_ci |

No se observó FK declarada en esta tabla.

### CourseTutors

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| TutorId | char(36) | NO | MUL | ascii_general_ci |
| CourseVersionId | char(36) | NO | MUL | ascii_general_ci |
| Deleted | tinyint(1) | NO | — | — |

FK declarada: CourseVersionId → CourseVersions.Id. FK declarada: TutorId → Tutors.Id.

### Tutors

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| PartnerId | char(36) | NO | — | ascii_general_ci |
| Deleted | tinyint(1) | NO | — | — |

No se observó FK declarada en esta tabla.

### FormationLevels

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| Deleted | tinyint(1) | NO | — | — |

No se observó FK declarada en esta tabla.

### TutorAcademicExperiences

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| TutorId | char(36) | NO | MUL | ascii_general_ci |
| Deleted | tinyint(1) | NO | — | — |
| FormationLevelId | char(36) | NO | MUL | ascii_general_ci |

FK declarada: FormationLevelId → FormationLevels.Id. FK declarada: TutorId → Tutors.Id.

### TutorProfessionalExperiences

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| TutorId | char(36) | NO | MUL | ascii_general_ci |
| Deleted | tinyint(1) | NO | — | — |

FK declarada: TutorId → Tutors.Id.

### ExtraTextsForCertificate

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| Id | char(36) | NO | PRI | ascii_general_ci |
| Deleted | tinyint(1) | NO | — | — |
| Content | longtext | NO | — | utf8mb4_0900_ai_ci |

No se observó FK declarada en esta tabla.

## historica

### socios

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| id | int | NO | PRI | — |
| nombre | varchar(120) | NO | — | utf8mb3_spanish_ci |
| razonsocial | varchar(120) | YES | — | utf8mb3_spanish_ci |
| localidad | varchar(50) | NO | — | utf8mb3_spanish_ci |
| provincia | varchar(50) | NO | — | utf8mb3_spanish_ci |
| provincia_cod | int | YES | — | — |
| whatsapp_insti | bigint | YES | — | — |
| mail_insti | varchar(150) | YES | — | utf8mb3_general_ci |
| web | varchar(200) | YES | — | utf8mb3_spanish_ci |
| facebook | varchar(200) | YES | — | utf8mb3_spanish_ci |
| instagram | varchar(200) | YES | — | utf8mb3_spanish_ci |
| youtube | varchar(200) | YES | — | utf8mb3_general_ci |
| twitter | varchar(200) | YES | — | utf8mb3_general_ci |
| linkedin | varchar(200) | YES | — | utf8mb3_general_ci |
| fecha_alta | date | YES | — | — |
| fecha_baja | date | YES | — | — |
| rubro | int | YES | — | — |
| categoria | int | YES | — | — |
| estado | tinyint(1) | YES | — | — |
| textoweb | text | YES | — | utf8mb3_spanish_ci |
| coordenadas | varchar(50) | YES | — | utf8mb3_spanish_ci |
| mailcomercial | varchar(60) | YES | — | utf8mb3_spanish_ci |
| wscomercial | bigint | YES | — | — |
| pais | int | YES | — | — |

No se observó FK declarada en esta tabla.

### cursos

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| id | int | NO | PRI | — |
| idsocio | int | NO | — | — |
| nombre | varchar(200) | NO | — | utf8mb3_spanish_ci |
| tipocurso | int | NO | — | — |
| horas | decimal(6,1) | YES | — | — |
| fecha_solicitud | date | YES | — | — |
| fecha_validacion | date | YES | — | — |
| estado | tinyint(1) | NO | — | — |
| fecha_vto | date | YES | — | — |
| programa | varchar(7) | YES | — | utf8mb3_spanish_ci |
| cv | varchar(7) | YES | — | utf8mb3_spanish_ci |
| observado | tinyint(1) | YES | — | — |
| categoria | int | YES | — | — |
| desaprobado | tinyint(1) | YES | — | — |
| inactivo | tinyint(1) | YES | — | — |
| mensaje_cert | int | NO | — | — |
| fecmod | date | YES | — | — |

No se observó FK declarada en esta tabla.

### categcur

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| id | int | NO | PRI | — |
| nombre | varchar(80) | NO | — | utf8mb3_general_ci |
| icono | varchar(50) | YES | — | utf8mb3_general_ci |

No se observó FK declarada en esta tabla.

### cat

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| id | double | YES | — | — |
| nombre | varchar(255) | YES | — | utf8mb3_general_ci |
| icono | varchar(255) | YES | — | utf8mb3_general_ci |

No se observó FK declarada en esta tabla.

### certificados

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| id | int | NO | PRI | — |
| idsocio | int | NO | — | — |
| fecha_solicitud | date | NO | — | — |
| idcurso | int | NO | — | — |
| fecha_finaliza | date | NO | — | — |
| estado | tinyint(1) | NO | — | — |
| fecha_validacion | date | YES | — | — |
| actanro | int | NO | — | — |
| newcourseid | varchar(100) | YES | — | utf8mb3_spanish_ci |

No se observó FK declarada en esta tabla.

### certifidise

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| id | int | NO | PRI | — |
| idsocio | int | NO | — | — |
| fecha_solicitud | date | NO | — | — |
| idcurso | int | NO | — | — |
| fecha_finaliza | date | NO | — | — |
| estado | tinyint(1) | NO | — | — |
| fecha_validacion | date | YES | — | — |
| actanro | int | NO | — | — |
| newcourseid | varchar(100) | YES | — | utf8mb3_spanish_ci |

No se observó FK declarada en esta tabla.

### certifisemi

| Columna | Tipo MySQL | Nullable | Índice | Collation |
|---|---|---|---|---|
| id | int | NO | PRI | — |
| idsocio | int | NO | — | — |
| fecha_solicitud | date | NO | — | — |
| idcurso | int | NO | — | — |
| fecha_finaliza | date | NO | — | — |
| estado | tinyint(1) | NO | — | — |
| fecha_validacion | date | YES | — | — |
| actanro | int | NO | — | — |
| newcourseid | varchar(100) | YES | — | utf8mb3_spanish_ci |

No se observó FK declarada en esta tabla.

## Fuera del alcance público

No se extraen valores de Users.Password, socios.clave/usuario, CUIT/DNI, datos de titulares, alumnos, documentos o notas internas. Los tutores tienen datos personales: su publicación requerirá autorización y campos seleccionados. La auditoría sólo contó relaciones. Los índices no prueban equivalencia semántica entre esquemas.
