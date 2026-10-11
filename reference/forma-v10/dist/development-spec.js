// Development brief only. This module does not calculate or change demo ratings.
export function renderDevelopmentSpec() {
  document.querySelector('#main').innerHTML = `
  <div class="page development-spec">
    <div class="breadcrumb"><a href="#/propuesta">Propuesta del proyecto</a><span>/</span><span>Guía para desarrollo</span></div>
    <div class="page-heading"><span class="eyebrow">ESPECIFICACIÓN FUNCIONAL · 5 OCT 2026</span><h1>Guía para desarrollo del portal.</h1><p>Requisitos de evaluación institucional y autogestión del socio: completar su perfil público, gestionar las consultas recibidas y decidir qué cursos publicar.</p></div>
    <div class="notice"><strong>Para implementar en el sitio definitivo y la autogestión del socio.</strong> Esta guía documenta los requisitos del producto. Los pesos y umbrales de evaluación requieren validación de la Cámara. El prototipo usa datos ficticios: no gestiona perfiles reales, no captura leads y no cambia la publicación de cursos en el sistema de autogestión.</div>
    <nav class="spec-navigation" aria-label="Temas de la guía"><button class="button secondary" data-spec-section="spec-architecture">Backend y base de datos</button><button class="button secondary" data-spec-section="spec-evaluation">Evaluación institucional</button><button class="button" data-spec-section="spec-self-service">Autogestión del socio</button></nav>

    <section id="spec-architecture" class="section content-panel"><h2>Arquitectura y origen de los datos</h2><p><strong>El portal tendrá un backend propio, independiente del backend del Observatorio.</strong> Su alojamiento y proveedor de infraestructura todavía están por definir. La publicación de este prototipo en Sites no determina dónde se alojará el backend definitivo.</p><p><strong>Los datos de los socios provendrán de la base de datos que utiliza el sistema de la Cámara.</strong> El backend del portal deberá conectarse a esa base mediante un acceso autorizado y conservar los identificadores institucionales existentes. Esa base es la fuente de referencia para los socios; los informes o copias del Observatorio no la reemplazan.</p><ul>
      <li><strong>Portal público:</strong> consulta la API de su backend. El navegador no se conecta directamente a la base de la Cámara ni recibe sus credenciales.</li>
      <li><strong>Integración con autogestión:</strong> coordinar con el equipo del sistema de la Cámara cómo se leen y actualizan los perfiles, los cursos y su estado de publicación, manteniendo un mismo identificador por socio y curso.</li>
      <li><strong>Datos nuevos:</strong> definir con ese equipo dónde se persistirán leads, opiniones, evidencias y los campos adicionales del portal. Su ubicación física está pendiente; deberán permanecer vinculados a los registros del sistema de la Cámara.</li>
      <li><strong>Decisiones pendientes:</strong> alojamiento del backend, tecnología, conexión y permisos sobre la base, y responsabilidades de mantenimiento. El funcionamiento del portal no debe depender del backend del Observatorio.</li>
    </ul><p>Antes de implementar, validar el esquema real y las relaciones entre socios, cursos y certificados. Esta documentación no configura una conexión ni modifica la base productiva.</p></section>

    <section id="spec-evaluation" class="section content-panel"><h2>01 · Evaluación progresiva: comportamiento esperado</h2><p>Una institución nueva puede alcanzar un buen nivel por su preparación verificada. A medida que reúne evidencia, adquieren más peso la experiencia de sus alumnos y la actividad certificada.</p><ul>
      <li>La antigüedad institucional y la fecha de alta en el portal no otorgan puntos ni determinan por sí solas la etapa.</li>
      <li>Permitir una evaluación inicial favorable sin exigir opiniones previas. Revisar la calidad y vigencia de la evidencia, no sólo la carga de archivos o campos.</li>
      <li>Distinguir siempre el nivel institucional, la etapa de evaluación y las estrellas provenientes de opiniones reales.</li>
      <li>Incorporar antecedentes comprobables que la Cámara ya posea, aunque la institución sea nueva en el portal.</li>
      <li>Conservar la afinidad con la búsqueda como criterio principal de ordenamiento. El sello aporta información de confianza.</li>
    </ul></section>

    <section class="section"><h2>02 · Ponderaciones propuestas</h2><p>Evaluar cada dimensión en una escala de 0 a 100 con una rúbrica verificable. Los siguientes pesos suman 100% en cada etapa.</p>
      <div class="table-wrap spec-table" role="region" aria-label="Ponderaciones por etapa" tabindex="0"><table>
        <caption>Pesos de referencia para el piloto; no son el cálculo activo del prototipo.</caption>
        <thead><tr><th scope="col">Dimensión</th><th scope="col">Evaluación inicial</th><th scope="col">Primeras experiencias</th><th scope="col">Experiencia suficiente</th></tr></thead>
        <tbody>
          <tr><th scope="row">Documentación institucional verificada</th><td>30%</td><td>15%</td><td>10%</td></tr>
          <tr><th scope="row">Propuesta pedagógica: docentes, contenidos, prácticas y evaluación</th><td>40%</td><td>30%</td><td>20%</td></tr>
          <tr><th scope="row">Información completa: precios, modalidades, requisitos y condiciones</th><td>30%</td><td>15%</td><td>10%</td></tr>
          <tr><th scope="row">Experiencia de alumnos verificados</th><td>0%</td><td>25%</td><td>40%</td></tr>
          <tr><th scope="row">Actividad certificada por la Cámara</th><td>0%</td><td>15%</td><td>20%</td></tr>
        </tbody><tfoot><tr><th scope="row">Total</th><td>100%</td><td>100%</td><td>100%</td></tr></tfoot>
      </table></div>
      <p class="spec-table-hint">Deslizá la tabla hacia los lados para ver todas las etapas.</p>
      <p class="spec-note">El precio aporta por estar informado con claridad, no por ser alto o bajo. Informar modalidades y canales suma por transparencia. La cantidad de seguidores no integra este modelo. Los certificados reflejan actividad; no equivalen a alumnos únicos ni a satisfacción.</p>
    </section>

    <section class="section"><h2>03 · Etapas y transición</h2><div class="roadmap">
      <article class="content-panel"><span class="eyebrow">01 · EVALUACIÓN INICIAL</span><h3>Preparación verificada</h3><p>Requiere documentación vigente, propuesta pedagógica e información revisadas por la Cámara. No exige reseñas ni certificados anteriores. Puede alcanzar Distinción formativa.</p></article>
      <article class="content-panel"><span class="eyebrow">02 · PRIMERAS EXPERIENCIAS</span><h3>Empiezan a pesar los resultados</h3><p>Referencia para el piloto: una edición finalizada y unas 10 opiniones verificadas. Aumentar progresivamente el peso de la experiencia y de la actividad certificada.</p></article>
      <article class="content-panel"><span class="eyebrow">03 · EXPERIENCIA SUFICIENTE</span><h3>Evidencia de varias ediciones</h3><p>Referencia para el piloto: al menos dos ediciones y unas 30 opiniones verificadas. Revisar también la cobertura de respuestas para contemplar grupos pequeños.</p></article>
    </div><div class="content-panel spec-block"><h3>Reglas de transición que debe resolver el motor</h3><ul>
      <li>Usar evidencia comprobada, no meses desde la inscripción. El paso del tiempo activa revisiones de vigencia.</li>
      <li>Interpolar los pesos entre las etapas: pasar de 9 a 10 opiniones no debe reemplazar todos los pesos de golpe.</li>
      <li>Configurar y versionar la regla de avance, el período de evidencia, los mínimos y la cobertura. La fórmula de avance se definirá en el piloto antes de activar el cálculo público.</li>
      <li>No convertir una dimensión sin datos en cero, inventar valores ni redistribuir sus pesos silenciosamente. Una ausencia debe tener un motivo y un estado visible.</li>
      <li>Si todavía no hay evidencia suficiente, mostrar la etapa inicial y la fecha de revisión. Si venció documentación o falta información requerida, marcar revisión pendiente según la política de vigencia.</li>
      <li>No volver automáticamente a los pesos iniciales para ocultar opiniones negativas o evidencia retirada. Conservar historial y someter esas situaciones a revisión.</li>
    </ul></div></section>

    <section class="section"><h2>04 · Cálculo y publicación del nivel</h2>
      <div class="content-panel"><p><strong>Puntaje = suma de (nota de cada dimensión × peso vigente / 100).</strong> Calcular sólo cuando las dimensiones con peso mayor que cero tengan evidencia válida. Guardar los pesos efectivos utilizados y conservar decimales para el cálculo; redondear sólo al mostrar.</p>
        <p>Ejemplo inicial: documentación 95, pedagogía 90 e información 100 producen <strong>94,5 puntos</strong>. Puede mostrarse como <strong>Distinción formativa · Evaluación inicial</strong>; nunca como una valoración de 4,7 estrellas.</p>
        <ul><li>Reservar Referente formativo para evidencia sostenida y suficiente, además del puntaje y la calidad pedagógica mínimos que apruebe la Cámara. No otorgarlo sólo por documentación.</li>
        <li>Mantener separados <code>puntaje</code>, <code>nivel</code>, <code>etapa</code> y <code>estado de revisión</code>. Un buen puntaje inicial no expresa la misma evidencia que uno respaldado por alumnos.</li>
        <li>La actividad certificada debe tener rendimientos decrecientes y un tope configurable, con registros depurados y períodos comparables. Duplicar cursos o certificados no debe duplicar el nivel.</li>
        <li>Recalcular al aprobar evidencia, actualizar opiniones o certificados, vencer documentación o cambiar de metodología. Cada resultado debe poder reproducirse y revisarse.</li></ul>
      </div>
    </section>

    <section class="section"><h2>05 · Qué debe ver quien busca un curso</h2><div class="two-col">
      <div class="content-panel spec-example"><span class="eyebrow">EJEMPLO · SOCIO NUEVO</span><h3>Distinción formativa</h3><strong class="spec-phase">Evaluación inicial</strong><p>Propuesta y documentación verificadas por la Cámara.</p><p>Aún sin opiniones de alumnos.</p></div>
      <div class="content-panel spec-example"><span class="eyebrow">EJEMPLO · CON EXPERIENCIA</span><h3>Distinción formativa</h3><strong class="spec-phase">Evaluación respaldada por alumnos</strong><p>Experiencia verificada en distintas ediciones.</p><p><strong>★ 4,7</strong> · 38 opiniones verificadas</p></div>
    </div><p class="spec-note">Ejemplos ilustrativos, no evaluaciones reales. Mostrar la fecha de revisión y el acceso al fundamento del sello. El logo de la Cámara acompaña el sello institucional; las estrellas y su cantidad corresponden a opiniones. En la ficha del curso, las opiniones deben ser de ese curso.</p>
    <div class="content-panel spec-block"><h3>Búsqueda y cursos relacionados</h3><p>Mantener relevancia y filtros como criterio principal. Al final de cada ficha mostrar cursos relacionados por tema y habilidades; usar modalidad y nivel de dificultad para desempatar. Excluir el curso actual y los duplicados. El nivel institucional, la cantidad de reseñas y la antigüedad no deben determinar estas recomendaciones. Mostrar nivel y etapa juntos, con las opiniones por separado. No presentar puntajes de distintas etapas como equivalentes. Antes de activar el nuevo modelo, adaptar el orden explícito por nivel para comparar dentro de la misma etapa e informar ese criterio.</p></div></section>

    <section class="section"><h2>06 · Datos y responsabilidades de desarrollo</h2>
      <details open><summary>Guardar evidencia, metodología e historial</summary><ul>
        <li><strong>Institución y revisión:</strong> identificador estable, evidencia asociada, estado, responsable, fecha de aprobación y vencimiento.</li>
        <li><strong>Rúbrica:</strong> dimensión, criterio, nota, evidencia que la justifica y estado de verificación. Usar <code>null</code> para datos ausentes; el cero es una evaluación válida, no un dato faltante.</li>
        <li><strong>Experiencia:</strong> ediciones finalizadas, alumnos elegibles, invitaciones, opiniones verificadas, cobertura de respuesta y período. Una opinión por inscripción comprobable.</li>
        <li><strong>Actividad:</strong> certificados válidos, período y referencias internas para deduplicar y conciliar con los registros de la Cámara. Su cantidad no necesita mostrarse en el portal público.</li>
        <li><strong>Resultado:</strong> etapa, pesos efectivos, notas, puntaje, nivel, estado de revisión, fecha de cálculo, versión de metodología y motivos de cambio.</li>
        <li><strong>Configuración:</strong> pesos, umbrales de nivel, mínimos de evidencia, interpolación, tratamiento de reseñas escasas, tope de actividad, vigencia y calendario de revisión.</li>
      </ul></details>
      <details><summary>Implementar el circuito de evaluación</summary><ol>
        <li>Portal del socio: presentar y actualizar programas, docentes, documentación y condiciones de los cursos.</li>
        <li>Panel de la Cámara: revisar evidencia, solicitar correcciones y aprobar con responsable y fecha. Permitir que el socio pida revisión de errores.</li>
        <li>Opiniones: invitar a todos los alumnos elegibles desde el portal o la Cámara, sin selección de alumnos satisfechos por parte del instituto. No retirar opiniones por ser negativas.</li>
        <li>Servicio de cálculo: leer evidencia validada, aplicar una versión de reglas y conservar el resultado con su historial. El socio no puede asignarse notas ni alterar pesos.</li>
        <li>API pública: devolver sólo nivel, etapa, estado, fecha y fundamentos autorizados, además de agregados de opiniones. Excluir documentación privada, datos personales y conteos internos de certificados.</li>
        <li>Interfaz: actualizar tarjetas, fichas, perfiles y cursos relacionados con el mismo contrato de datos; ofrecer un desglose comprensible y la fecha de revisión.</li>
      </ol></details>
    </section>

    <section class="section"><h2>07 · Criterios de aceptación</h2><div class="content-panel"><ol>
      <li><strong>Socio nuevo bien preparado:</strong> con evidencia inicial completa y aprobada obtiene un nivel favorable sin reseñas; puede llegar a Distinción, no a Referente.</li>
      <li><strong>Sin documentación suficiente:</strong> muestra En evaluación o Revisión pendiente, sin puntaje inventado.</li>
      <li><strong>Sólo pasa el tiempo:</strong> cumplir seis meses no cambia los pesos ni empeora el nivel si la evidencia sigue vigente.</li>
      <li><strong>Se incorporan opiniones:</strong> aumenta gradualmente su peso; ninguna reseña se cuenta dos veces ni se confunde con una nota de aprobación del curso.</li>
      <li><strong>Historial previo comprobado:</strong> se considera aunque la fecha de alta en el portal sea reciente.</li>
      <li><strong>Grupos pequeños o sin respuestas:</strong> no equivalen a mala calidad; se muestra la cobertura y el estado de evidencia correspondiente.</li>
      <li><strong>Evidencia negativa:</strong> afecta el resultado según las reglas, sin reiniciar la institución como nueva para mejorar su ponderación.</li>
      <li><strong>Dos etapas distintas:</strong> las tarjetas y los perfiles identifican la etapa y no presentan sus puntajes como equivalentes.</li>
      <li><strong>Cambio de metodología:</strong> conserva los cálculos anteriores y permite explicar el cambio de nivel. Ninguna configuración admite pesos que no sumen 100%.</li>
    </ol></div></section>

    <section class="section content-panel spec-decisions"><h2>08 · Decisiones para cerrar con la Cámara</h2><p>Validar la rúbrica de cada dimensión, los porcentajes, los umbrales de nivel, la fórmula de transición, el ajuste por pocas reseñas, los criterios para grupos pequeños, el período de actividad y la vigencia de documentos. Definir también los requisitos sostenidos de Referente y el tratamiento de evidencia vencida o invalidada.</p><p>Probar con instituciones de distintas antigüedades, tamaños y especialidades. Migrar el modelo actual sólo después de revisar los resultados del piloto; no trasladar automáticamente las notas ficticias del prototipo a socios reales.</p></section>

    <section id="spec-self-service" class="section"><span class="eyebrow">SISTEMA DE AUTOGESTIÓN EXISTENTE</span><h2>09 · Autogestión del socio</h2><p>Incorporar tres áreas al sistema de la Cámara donde el socio ya administra su institución: <strong>Mi perfil público</strong>, <strong>Mis leads</strong> y <strong>Mis cursos en el portal</strong>. Reutilizar su cuenta y su identificador institucional, coordinando la integración con el backend propio del portal.</p>

      <article class="content-panel spec-block"><h3>9.1 · Mi perfil público: completar los datos faltantes</h3><p>Precargar los datos disponibles en la base y permitir completar, corregir y actualizar todos los campos necesarios para el perfil y las fichas del portal. Mostrar qué información falta, qué campos son obligatorios y cuáles son opcionales, su estado de revisión y una vista previa de cómo se publicarán.</p><ul>
        <li><strong>Identidad y presentación:</strong> nombre público de la institución, logo autorizado, descripción, especialidades o áreas de formación y antecedentes institucionales.</li>
        <li><strong>Ubicación y contacto público:</strong> provincia, localidad, sedes o domicilio de atención, sitio web, correo de consultas, teléfono y WhatsApp institucional.</li>
        <li><strong>Redes sociales:</strong> enlaces de Instagram, Facebook, LinkedIn y YouTube. Validar formato y dominio; no inventar cuentas ni exigir una red que el socio no utiliza.</li>
        <li><strong>Material audiovisual:</strong> fotografías, video institucional, presentación de los cursos y clases de muestra, con indicación de autoría o autorización de uso.</li>
        <li><strong>Datos de cada curso:</strong> título, categoría, descripción, objetivos, dirigido a, resultados de aprendizaje, habilidades, programa, requisitos, docentes, modalidad, sede cuando corresponda, duración en horas y semanas, fechas de inicio, horarios, cupos o disponibilidad, precio total, moneda, formas de pago y condiciones.</li>
        <li><strong>Evaluación y certificado:</strong> trabajo práctico, forma de evaluación y requisitos de aprobación. El certificado lo emite la Cámara; el socio completa las condiciones aplicables al curso, no modifica al emisor.</li>
      </ul><p>Antes de desarrollar, conciliar este inventario con el esquema real de la base: identificar campos existentes, vacíos y nuevos, sus validaciones y el responsable de cada dato. No se afirma que todos estos campos estén ausentes hoy. Guardar los avances como borrador y señalar exactamente qué falta para publicar.</p><p>Distinguir los datos destinados al portal de los documentos de evaluación, contactos administrativos y notas internas. Estos últimos permanecen privados. Completar el perfil no concede automáticamente puntos ni aprueba evidencias del ranking.</p></article>

      <article class="content-panel spec-block"><h3>9.2 · Mis leads: ver y gestionar las consultas recibidas</h3><p>Crear una sección privada donde cada socio vea las consultas de personas interesadas en sus cursos. Un lead es una consulta enviada y guardada con éxito; una visita a la ficha o un clic en WhatsApp no equivalen por sí solos a un lead identificado.</p><ul>
        <li><strong>Listado:</strong> fecha y hora, curso consultado, nombre del interesado, canal de contacto informado, origen de la consulta y estado de seguimiento. Permitir filtrar por curso, fecha y estado.</li>
        <li><strong>Detalle:</strong> mensaje completo, datos de contacto proporcionados, curso e institución destinatarios y registro de seguimiento. Mantener accesibles los leads de cursos desactivados.</li>
        <li><strong>Seguimiento:</strong> estados propuestos Nuevo, En seguimiento, Inscripto y Cerrado, con notas internas y fecha de actualización. Marcar Inscripto requiere confirmación del socio o del sistema de inscripción; no inferirlo de un clic.</li>
        <li><strong>Captura:</strong> el formulario público de consulta debe informar que se comparte la información con el instituto elegido, registrar la aceptación correspondiente y confirmar el envío sólo después de guardar. Evitar duplicar leads ante reintentos de la misma solicitud.</li>
        <li><strong>Asignación y acceso:</strong> asociar cada consulta al curso y al socio correctos en el servidor. Cada socio accede sólo a sus leads; no exponer datos de interesados, mensajes ni notas de seguimiento en el portal público.</li>
      </ul><p>El botón de consulta del prototipo es ilustrativo. El formulario real y el almacenamiento de leads forman parte del desarrollo pendiente. Un enlace directo a una red o mensajería no permite recuperar automáticamente conversaciones externas.</p></article>

      <article class="content-panel spec-block"><h3>9.3 · Mis cursos en el portal: activar y desactivar</h3><p>Mostrar al socio el listado de sus cursos con título, modalidad, estado de publicación, fecha de última actualización y acciones <strong>Activar en el portal</strong> y <strong>Desactivar del portal</strong>. La publicación en este buscador debe ser un estado propio, separado de la existencia del curso en la base.</p><ul>
        <li><strong>Activar:</strong> validar en el servidor la pertenencia del curso, los campos obligatorios completos, la oferta vigente y las aprobaciones requeridas. Si falta algo, mostrar los motivos concretos. La Cámara debe definir qué cambios necesitan revisión antes de publicarse.</li>
        <li><strong>Desactivar:</strong> retirar el curso del buscador, los filtros y sus conteos, el perfil público del instituto y las recomendaciones de cursos relacionados. Conservar su registro, contenido, certificados, opiniones e historial de leads.</li>
        <li><strong>Enlace directo:</strong> una ficha desactivada debe mostrar que el curso no está disponible en el portal y ofrecer volver al catálogo. No permitir nuevas consultas o inscripciones desde esa ficha ni por llamadas directas a la API.</li>
        <li><strong>Reactivar:</strong> volver a comprobar los requisitos y reutilizar el mismo identificador, URL e historial; no crear una copia del curso ni reiniciar su reputación.</li>
        <li><strong>Sincronización:</strong> usar el mismo estado de publicación en todas las pantallas y actualizar índices de búsqueda y cachés. Mostrar el cambio como completado cuando esté aplicado; informar si queda pendiente o falla.</li>
        <li><strong>Trazabilidad:</strong> registrar quién activó o desactivó, cuándo y el estado anterior. La autorización debe validarse en el backend: un socio no puede modificar cursos de otro.</li>
      </ul></article>

      <article class="content-panel spec-block"><h3>9.4 · Datos de integración y criterios de aceptación</h3><p>Persistir el perfil público y sus borradores vinculados al socio, el estado de publicación de cada curso y su historial, y los leads con curso, socio destinatario, mensaje, contacto, origen, estado y fechas. Separar estas entidades de la evaluación institucional y de las tablas históricas de certificados.</p><ol>
        <li>El socio ingresa con su cuenta, ve los datos existentes y una lista de campos faltantes; puede guardar un borrador y previsualizar lo que se mostrará al público.</li>
        <li>Los campos públicos aprobados se reflejan en el portal. Documentación privada, datos administrativos, leads y notas internas nunca se incluyen en la respuesta pública.</li>
        <li>Una consulta enviada correctamente aparece una sola vez en Mis leads del socio destinatario, vinculada al curso correspondiente. Otro socio no puede leerla ni cambiarla.</li>
        <li>Un curso incompleto o sin las aprobaciones necesarias no se activa; la pantalla explica qué se debe completar o revisar.</li>
        <li>Al desactivar, el curso deja de aparecer en búsqueda, conteos, perfil y relacionados. Su enlace directo informa la indisponibilidad y el servidor rechaza nuevas consultas.</li>
        <li>Al reactivar, se conservan identificadores, opiniones, certificados y leads. Ninguna de estas acciones borra el curso de la base de autogestión.</li>
      </ol><p><strong>Definir con la Cámara antes de producción:</strong> campos obligatorios y opcionales por modalidad, permisos de edición, cambios sujetos a aprobación, vigencia de la oferta, estados de seguimiento de leads y plazos de conservación. Estos parámetros deben quedar documentados y ser configurables.</p></article>
    </section>
    <p class="spec-return"><a class="text-link" href="#/propuesta">Volver a la propuesta del proyecto</a></p>
  </div>`;
  document.querySelectorAll('[data-spec-section]').forEach(button=>{
    button.onclick=()=>document.getElementById(button.dataset.specSection)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  });
}
