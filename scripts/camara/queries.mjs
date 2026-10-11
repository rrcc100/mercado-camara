import { quote } from "./connection.mjs";
export const latestCte = `WITH ranked AS (
 SELECT v.Id, v.CourseId, v.VersionNumber, v.Status, v.Approved, v.Active, v.CategoryId, v.RequestDate, v.ExpirationDate, v.OldId,
 ROW_NUMBER() OVER (PARTITION BY v.CourseId ORDER BY v.VersionNumber DESC, v.CreatedAt DESC, v.Id DESC) AS rn
 FROM CourseVersions v JOIN Courses c ON c.Id=v.CourseId AND c.Deleted=0 WHERE v.Deleted=0
), latest AS (SELECT * FROM ranked WHERE rn=1)`;
const present = (c) => `NULLIF(TRIM(CAST(${c} AS CHAR)), '') IS NOT NULL`;
// Compare validated legacy numeric IDs as numbers, independent of schema collation.
const legacyId = (c) =>
  `(CASE WHEN TRIM(${c}) REGEXP '^[0-9]{1,10}$' THEN CAST(TRIM(${c}) AS UNSIGNED) ELSE NULL END)`;
function completeness(table, fields, where = "1=1") {
  return `SELECT COUNT(*) AS total, ${fields.map((c) => `SUM(${quote(c)} IS NULL) AS ${quote(c + "_null")}, SUM(${present(quote(c))}) AS ${quote(c + "_filled")}`).join(", ")} FROM ${quote(table)} WHERE ${where}`;
}
const memberFields = [
  "nombre",
  "localidad",
  "provincia",
  "provincia_cod",
  "textoweb",
  "web",
  "facebook",
  "instagram",
  "youtube",
  "linkedin",
  "twitter",
  "mail_insti",
  "whatsapp_insti",
  "fecha_alta",
  "fecha_baja",
];
const memberQueries = [
  [
    "member_states",
    "SELECT estado, COUNT(*) AS total, SUM(fecha_baja IS NULL) AS without_end_date, SUM(fecha_alta IS NOT NULL) AS with_start_date FROM socios GROUP BY estado ORDER BY estado",
  ],
  ["member_completeness", completeness("socios", memberFields)],
  [
    "member_current_completeness",
    completeness("socios", memberFields, "fecha_baja IS NULL"),
  ],
  [
    "member_duplicates",
    "SELECT COUNT(*) AS repeated_name_groups, COALESCE(SUM(n-1),0) AS repeated_name_excess FROM (SELECT COUNT(*) n FROM socios WHERE NULLIF(TRIM(nombre),'') IS NOT NULL GROUP BY LOWER(TRIM(nombre)) HAVING COUNT(*)>1) d",
  ],
  [
    "member_link_quality",
    "SELECT COUNT(*) AS total, SUM(NULLIF(TRIM(web),'') IS NOT NULL AND TRIM(web) NOT REGEXP '^https://') AS web_without_https, SUM(NULLIF(TRIM(instagram),'') IS NOT NULL AND TRIM(instagram) NOT REGEXP '^https://(www[.])?instagram[.]com/') AS instagram_unvalidated, SUM(COALESCE(whatsapp_insti,0)>0) AS positive_whatsapp, SUM(NULLIF(TRIM(textoweb),'') IS NOT NULL AND textoweb REGEXP '<[^>]+>') AS textoweb_with_html FROM socios",
  ],
];
export function queriesFor(alias, targets) {
  if (
    alias !== "historica" &&
    targets.some(
      (t) =>
        t.options.host !== targets[0].options.host ||
        t.options.port !== targets[0].options.port,
    )
  )
    throw Object.assign(new Error(), {
      code: "CROSS_SOURCE_HOSTS_UNSUPPORTED",
    });
  const schemas = Object.fromEntries(
    targets.map((t) => [t.alias, quote(t.options.database)]),
  );
  const s = schemas.socios,
    h = schemas.historica;
  if (alias === "socios")
    return [
      ...memberQueries,
      [
        "users_bridge",
        "SELECT COUNT(*) AS total, SUM(Deleted=0) AS not_deleted, SUM(NULLIF(TRIM(OldId),'') IS NOT NULL) AS with_old_id, SUM(TRIM(OldId) REGEXP '^[0-9]+$') AS numeric_old_id, COUNT(DISTINCT NULLIF(TRIM(OldId),'')) AS distinct_old_ids FROM Users",
      ],
      [
        "users_to_members",
        `SELECT COUNT(*) AS users, SUM(s.id IS NOT NULL) AS member_match, SUM(s.id IS NULL AND NULLIF(TRIM(u.OldId),'') IS NOT NULL) AS unmatched_old_id, SUM(u.Deleted=0 AND s.id IS NOT NULL AND s.fecha_baja IS NULL) AS active_match FROM Users u LEFT JOIN socios s ON ${legacyId("u.OldId")}=s.id`,
      ],
      [
        "users_duplicate_bridge",
        "SELECT COUNT(*) AS duplicated_old_ids, COALESCE(SUM(n-1),0) AS excess_users FROM (SELECT COUNT(*) n FROM Users WHERE NULLIF(TRIM(OldId),'') IS NOT NULL AND Deleted=0 GROUP BY TRIM(OldId) HAVING COUNT(*)>1) d",
      ],
      [
        "members_reverse_copy",
        `SELECT COUNT(*) AS historical_members, SUM(s.id IS NULL) AS missing_current_copy FROM ${h}.socios h LEFT JOIN socios s ON s.id=h.id`,
      ],
      [
        "members_cross_copy",
        `SELECT COUNT(*) AS current_rows, SUM(h.id IS NULL) AS missing_in_historical, SUM(h.id IS NOT NULL AND NOT(s.nombre <=> h.nombre)) AS names_differ, SUM(h.id IS NOT NULL AND NOT(s.provincia <=> h.provincia)) AS provinces_differ, SUM(h.id IS NOT NULL AND NOT(s.fecha_baja <=> h.fecha_baja)) AS end_dates_differ FROM socios s LEFT JOIN ${h}.socios h ON h.id=s.id`,
      ],
    ];
  if (alias === "cursos")
    return [
      [
        "legacy_owner_recovery",
        `${latestCte} SELECT COUNT(*) AS latest_versions, SUM(hc.id IS NOT NULL) AS legacy_course_match, SUM(hs.id IS NOT NULL) AS historical_owner_match, SUM(cs.id IS NOT NULL) AS current_copy_owner_match, SUM(hc.id IS NOT NULL AND hs.id IS NULL) AS missing_historical_owner, SUM(hs.fecha_baja IS NOT NULL) AS ended_historical_owner, SUM(hc.id IS NULL) AS without_legacy_bridge FROM latest l LEFT JOIN ${h}.cursos hc ON ${legacyId("l.OldId")}=hc.id LEFT JOIN ${h}.socios hs ON hs.id=hc.idsocio LEFT JOIN ${s}.socios cs ON cs.id=hc.idsocio`,
      ],
      [
        "legacy_owner_ambiguity",
        `${latestCte}, bridges AS (SELECT c.PartnerId,hc.idsocio FROM latest l JOIN Courses c ON c.Id=l.CourseId JOIN ${h}.cursos hc ON ${legacyId("l.OldId")}=hc.id) SELECT (SELECT COUNT(*) FROM (SELECT PartnerId FROM bridges GROUP BY PartnerId HAVING COUNT(DISTINCT idsocio)>1) a) AS partners_with_multiple_old_owners, (SELECT COUNT(*) FROM (SELECT idsocio FROM bridges GROUP BY idsocio HAVING COUNT(DISTINCT PartnerId)>1) b) AS old_owners_with_multiple_partners`,
      ],
      [
        "latest_dates",
        `${latestCte} SELECT COUNT(*) AS total, SUM(ExpirationDate IS NULL) AS null_expiration, SUM(RequestDate IS NULL) AS null_request FROM latest`,
      ],
      ...["certificados", "certifidise", "certifisemi"].map((table) => [
        `${table}_modern_bridge`,
        `SELECT COUNT(*) AS with_new_course_id, SUM(EXISTS(SELECT 1 FROM Courses c WHERE c.Id=(CASE WHEN f.newcourseid REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN CONVERT(f.newcourseid USING ascii) COLLATE ascii_general_ci ELSE NULL END))) AS matches_course_id, SUM(EXISTS(SELECT 1 FROM CourseVersions v WHERE v.Id=(CASE WHEN f.newcourseid REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN CONVERT(f.newcourseid USING ascii) COLLATE ascii_general_ci ELSE NULL END))) AS matches_version_id FROM ${h}.${table} f WHERE NULLIF(TRIM(f.newcourseid),'') IS NOT NULL`,
      ]),
      [
        "course_counts",
        "SELECT (SELECT COUNT(*) FROM Courses) AS courses, (SELECT COUNT(*) FROM Courses WHERE Deleted=0) AS courses_not_deleted, (SELECT COUNT(*) FROM CourseVersions) AS versions, (SELECT COUNT(*) FROM CourseVersions WHERE Deleted=0) AS versions_not_deleted, (SELECT COUNT(*) FROM CourseInformations WHERE Deleted=0) AS informations, (SELECT COUNT(*) FROM CourseModules WHERE Deleted=0) AS modules, (SELECT COUNT(*) FROM CourseCategories WHERE Deleted=0) AS categories",
      ],
      [
        "latest_states",
        `${latestCte} SELECT Status, Approved, Active, COUNT(*) AS total, SUM(ExpirationDate IS NOT NULL AND ExpirationDate < UTC_TIMESTAMP()) AS expiration_in_past FROM latest GROUP BY Status,Approved,Active ORDER BY Status,Approved,Active`,
      ],
      [
        "latest_quality",
        `${latestCte} SELECT COUNT(*) AS latest_versions, SUM(Approved=1 AND Active=1) AS administrative_candidates, SUM(CategoryId IS NULL) AS without_category, SUM(NOT EXISTS (SELECT 1 FROM CourseInformations i WHERE i.CourseVersionId=l.Id AND i.Deleted=0)) AS without_information, SUM(NOT EXISTS (SELECT 1 FROM CourseModules m WHERE m.CourseVersionId=l.Id AND m.Deleted=0)) AS without_modules, SUM(NOT EXISTS (SELECT 1 FROM CourseTutors t WHERE t.CourseVersionId=l.Id AND t.Deleted=0)) AS without_tutor, SUM(RequestDate IS NULL) AS without_request_date, SUM(NULLIF(TRIM(OldId),'') IS NOT NULL) AS with_old_id FROM latest l`,
      ],
      [
        "info_completeness",
        completeness(
          "CourseInformations",
          [
            "Title",
            "TotalHours",
            "Format",
            "Objectives",
            "DestinedTo",
            "EvaluationMethod",
            "CertifyingEntityId",
          ],
          "Deleted=0",
        ),
      ],
      [
        "latest_info_completeness",
        `${latestCte} SELECT COUNT(*) AS info_rows, SUM(${present("i.Title")}) AS title_filled, SUM(i.TotalHours>0) AS positive_hours, SUM(i.TotalHours=0) AS zero_hours, SUM(i.TotalHours<0) AS negative_hours, SUM(i.TotalHours IS NULL) AS null_hours, MIN(i.TotalHours) AS min_hours, MAX(i.TotalHours) AS max_hours, SUM(${present("i.Objectives")}) AS objectives_filled, SUM(${present("i.DestinedTo")}) AS destined_to_filled, SUM(${present("i.EvaluationMethod")}) AS evaluation_filled, SUM(i.Objectives REGEXP '<[^>]+>') AS objectives_with_html, SUM(i.DestinedTo REGEXP '<[^>]+>') AS audience_with_html, SUM(i.CertifyingEntityId IS NOT NULL) AS with_certifying_entity FROM latest l JOIN CourseInformations i ON i.CourseVersionId=l.Id AND i.Deleted=0`,
      ],
      [
        "candidate_info_completeness",
        `${latestCte} SELECT COUNT(*) AS info_rows, SUM(i.TotalHours>0) AS positive_hours, SUM(${present("i.Objectives")}) AS objectives_filled, SUM(${present("i.DestinedTo")}) AS destined_to_filled, SUM(${present("i.EvaluationMethod")}) AS evaluation_filled FROM latest l JOIN CourseInformations i ON i.CourseVersionId=l.Id AND i.Deleted=0 WHERE l.Approved=1 AND l.Active=1`,
      ],
      [
        "format_codes",
        `${latestCte} SELECT i.Format AS format_code, COUNT(*) AS total FROM latest l JOIN CourseInformations i ON i.CourseVersionId=l.Id AND i.Deleted=0 GROUP BY i.Format ORDER BY i.Format`,
      ],
      [
        "categories",
        `${latestCte} SELECT cc.Title AS category_label, COUNT(*) AS total FROM latest l LEFT JOIN CourseCategories cc ON cc.Id=l.CategoryId AND cc.Deleted=0 GROUP BY cc.Title ORDER BY total DESC`,
      ],
      [
        "module_completeness",
        completeness(
          "CourseModules",
          ["Title", "Content", "Order"],
          "Deleted=0",
        ),
      ],
      [
        "module_quality",
        "SELECT COUNT(*) AS total, SUM(Content REGEXP '<[^>]+>') AS content_with_html FROM CourseModules WHERE Deleted=0",
      ],
      [
        "duplicate_info",
        "SELECT COUNT(*) AS versions_with_multiple_info, COALESCE(SUM(n-1),0) AS excess_info_rows FROM (SELECT COUNT(*) n FROM CourseInformations WHERE Deleted=0 GROUP BY CourseVersionId HAVING COUNT(*)>1) d",
      ],
      [
        "duplicate_version_number",
        "SELECT COUNT(*) AS duplicated_version_numbers, COALESCE(SUM(n-1),0) AS excess FROM (SELECT COUNT(*) n FROM CourseVersions WHERE Deleted=0 GROUP BY CourseId,VersionNumber HAVING COUNT(*)>1) d",
      ],
      [
        "duplicate_module_order",
        "SELECT COUNT(*) AS duplicate_order_groups FROM (SELECT COUNT(*) n FROM CourseModules WHERE Deleted=0 GROUP BY CourseVersionId,`Order` HAVING COUNT(*)>1) d",
      ],
      [
        "orphan_children",
        "SELECT (SELECT COUNT(*) FROM Courses c WHERE Deleted=0 AND NOT EXISTS (SELECT 1 FROM CourseVersions v WHERE v.CourseId=c.Id AND v.Deleted=0)) AS courses_without_version, (SELECT COUNT(*) FROM CourseVersions v LEFT JOIN Courses c ON c.Id=v.CourseId WHERE c.Id IS NULL) AS versions_without_course, (SELECT COUNT(*) FROM CourseInformations i LEFT JOIN CourseVersions v ON v.Id=i.CourseVersionId WHERE v.Id IS NULL) AS info_without_version",
      ],
      [
        "partner_bridge",
        `SELECT COUNT(*) AS courses, COUNT(DISTINCT c.PartnerId) AS distinct_partners, SUM(u.Id IS NULL) AS partner_without_user, SUM(u.Deleted=1) AS deleted_user, SUM(u.Id IS NOT NULL AND s.id IS NULL) AS user_without_member, SUM(s.id IS NOT NULL) AS member_matched, SUM(s.fecha_baja IS NOT NULL) AS ended_members FROM Courses c LEFT JOIN ${s}.Users u ON u.Id=c.PartnerId LEFT JOIN ${s}.socios s ON ${legacyId("u.OldId")}=s.id WHERE c.Deleted=0`,
      ],
      [
        "partner_historical_bridge",
        `SELECT COUNT(*) AS courses, SUM(u.Id IS NOT NULL) AS user_matched, SUM(hs.id IS NOT NULL) AS historic_member_matched, SUM(hs.fecha_baja IS NOT NULL) AS ended_historic_members FROM Courses c LEFT JOIN ${s}.Users u ON u.Id=c.PartnerId LEFT JOIN ${h}.socios hs ON ${legacyId("u.OldId")} =hs.id WHERE c.Deleted=0`,
      ],
      [
        "migration_status_comparison",
        `${latestCte} SELECT l.Status,l.Approved,l.Active,hc.estado,hc.inactivo,hc.desaprobado,hc.observado,COUNT(*) AS total FROM latest l JOIN ${h}.cursos hc ON ${legacyId("l.OldId")}=hc.id GROUP BY l.Status,l.Approved,l.Active,hc.estado,hc.inactivo,hc.desaprobado,hc.observado`,
      ],
      [
        "certifying_info_references",
        `${latestCte} SELECT COUNT(*) AS infos, SUM(i.CertifyingEntityId=c.CertifyingInstitutionId) AS same_certifying_reference, SUM(i.CertifyingEntityId IS NOT NULL) AS with_entity FROM latest l JOIN Courses c ON c.Id=l.CourseId JOIN CourseInformations i ON i.CourseVersionId=l.Id AND i.Deleted=0`,
      ],
      [
        "legacy_course_bridge",
        `${latestCte} SELECT COUNT(*) AS versions, SUM(NULLIF(TRIM(l.OldId),'') IS NOT NULL) AS with_old_id, SUM(TRIM(l.OldId) REGEXP '^[0-9]+$') AS numeric_old_id, SUM(hc.id IS NOT NULL) AS legacy_match, SUM(hc.id IS NOT NULL AND hs.id IS NOT NULL AND hc.idsocio<>hs.id) AS institution_mismatch FROM latest l JOIN Courses c ON c.Id=l.CourseId LEFT JOIN ${h}.cursos hc ON ${legacyId("l.OldId")}=hc.id LEFT JOIN ${s}.Users u ON u.Id=c.PartnerId LEFT JOIN ${s}.socios hs ON ${legacyId("u.OldId")}=hs.id`,
      ],
      [
        "duplicate_old_course_id",
        `${latestCte} SELECT COUNT(*) AS duplicate_old_ids, COALESCE(SUM(n-1),0) AS excess FROM (SELECT COUNT(*) n FROM latest WHERE NULLIF(TRIM(OldId),'') IS NOT NULL GROUP BY TRIM(OldId) HAVING COUNT(*)>1) d`,
      ],
      [
        "certifying_references",
        `SELECT COUNT(*) AS courses, COUNT(DISTINCT c.CertifyingInstitutionId) AS distinct_certifying_ids, SUM(u.Id IS NOT NULL) AS matching_user, SUM(c.CertifyingInstitutionId=c.PartnerId) AS same_as_partner FROM Courses c LEFT JOIN ${s}.Users u ON u.Id=c.CertifyingInstitutionId WHERE c.Deleted=0`,
      ],
    ];
  if (alias === "historica")
    return [
      ...memberQueries,
      [
        "legacy_course_completeness",
        completeness("cursos", [
          "nombre",
          "horas",
          "programa",
          "cv",
          "categoria",
          "fecha_validacion",
          "fecha_vto",
          "fecmod",
        ]),
      ],
      [
        "legacy_course_states",
        "SELECT estado, inactivo, desaprobado, observado, COUNT(*) AS total FROM cursos GROUP BY estado,inactivo,desaprobado,observado ORDER BY total DESC",
      ],
      [
        "legacy_type_codes",
        "SELECT tipocurso, COUNT(*) AS total FROM cursos GROUP BY tipocurso ORDER BY tipocurso",
      ],
      [
        "legacy_relations",
        "SELECT COUNT(*) AS total, SUM(s.id IS NULL) AS without_member, SUM(cc.id IS NULL) AS without_category, SUM(c.horas<=0) AS nonpositive_hours FROM cursos c LEFT JOIN socios s ON s.id=c.idsocio LEFT JOIN categcur cc ON cc.id=c.categoria",
      ],
      [
        "legacy_duplicate_titles",
        "SELECT COUNT(*) AS duplicate_title_groups, COALESCE(SUM(n-1),0) AS excess FROM (SELECT COUNT(*) n FROM cursos WHERE NULLIF(TRIM(nombre),'') IS NOT NULL GROUP BY idsocio,LOWER(TRIM(nombre)) HAVING COUNT(*)>1) d",
      ],
      [
        "category_id_overlap",
        "SELECT (SELECT COUNT(*) FROM categcur) AS thematic_categories, (SELECT COUNT(*) FROM cat) AS legacy_cat_rows, COUNT(*) AS id_overlap, SUM(NOT(a.nombre<=>b.nombre)) AS different_labels FROM categcur a JOIN cat b ON b.id=a.id",
      ],
      ...["certificados", "certifidise", "certifisemi"].flatMap((table) => [
        [
          `${table}_states`,
          `SELECT estado, COUNT(*) AS total, SUM(fecha_validacion IS NOT NULL) AS with_validation_date, SUM(NULLIF(TRIM(newcourseid),'') IS NOT NULL) AS with_new_course_id FROM ${table} GROUP BY estado ORDER BY estado`,
        ],
        [
          `${table}_relations`,
          `SELECT COUNT(*) AS total, SUM(c.id IS NULL) AS missing_legacy_course, SUM(s.id IS NULL) AS missing_member, SUM(c.id IS NOT NULL AND c.idsocio<>f.idsocio) AS course_member_mismatch, SUM(NULLIF(TRIM(f.newcourseid),'') IS NOT NULL) AS with_new_course_id FROM ${table} f LEFT JOIN cursos c ON c.id=f.idcurso LEFT JOIN socios s ON s.id=f.idsocio`,
        ],
      ]),
      [
        "certificate_id_namespace",
        "SELECT COUNT(*) AS id_overlap_cert_dise FROM certificados a JOIN certifidise b ON a.id=b.id",
      ],
    ];
  return [];
}
