import {learningByCourse} from './course-learning.js';
// All records below are fictional demonstration data, never member evaluations.
export const dimensions = [
  {key:'experience',name:'Experiencia de estudiantes',weight:30,description:'Opiniones de cursantes verificados, con ajuste por cantidad y antigüedad.'},
  {key:'teaching',name:'Propuesta formativa',weight:25,description:'Programa, objetivos, carga horaria, evaluación y docentes documentados.'},
  {key:'verification',name:'Respaldo institucional',weight:20,description:'Identidad, pertenencia a la Cámara y documentación revisada y vigente.'},
  {key:'currency',name:'Información y actualización',weight:15,description:'Oferta vigente, fichas completas y condiciones claras para quien se inscribe.'},
  {key:'activity',name:'Trayectoria formativa',weight:10,description:'Actividad reciente y certificaciones trazables; ponderación acotada para no premiar sólo el tamaño.'},
];
export const levels = [
  {key:'desarrollo',name:'Base formativa',shortName:'Base',ordinal:1,min:0,max:49,tone:'blue',description:'Propuesta evaluada, con oportunidades de mejora documentadas.'},
  {key:'consolidado',name:'Solidez formativa',shortName:'Solidez',ordinal:2,min:50,max:69,tone:'teal',description:'Sostiene una propuesta documentada y una experiencia formativa consistente.'},
  {key:'destacado',name:'Distinción formativa',shortName:'Distinción',ordinal:3,min:70,max:84,tone:'purple',description:'Muestra resultados sólidos en las distintas dimensiones de la evaluación.'},
  {key:'referente',name:'Referente formativo',shortName:'Referente',ordinal:4,min:85,max:100,tone:'green',description:'Alcanza el umbral más alto y reúne evidencia suficiente y revisión institucional.'},
];
export const institutions = [
 {id:'horizonte',name:'Instituto Horizonte',initials:'IH',city:'CABA',province:'CABA',since:2012,courses:48,certificates:1840,reviews:126,rating:4.8,verified:true,complete:true,reviewed:true,scores:{experience:92,teaching:90,verification:100,currency:92,activity:75},description:'Formación práctica en herramientas digitales y gestión, con acompañamiento docente y proyectos aplicados.',specialty:'Tecnología y gestión'},
 {id:'aula-sur',name:'Aula Sur Formación',initials:'AS',city:'La Plata',province:'Buenos Aires',since:2017,courses:24,certificates:760,reviews:64,rating:4.6,verified:true,complete:true,reviewed:true,scores:{experience:82,teaching:78,verification:90,currency:82,activity:61},description:'Cursos orientados a desarrollar habilidades para el trabajo y la gestión de pequeños negocios.',specialty:'Administración y negocios'},
 {id:'nexo',name:'Nexo Escuela Digital',initials:'NE',city:'Córdoba',province:'Córdoba',since:2020,courses:12,certificates:410,reviews:38,rating:4.7,verified:true,complete:true,reviewed:true,scores:{experience:88,teaching:85,verification:92,currency:95,activity:45},description:'Aprendizaje digital a través de talleres, ejercicios guiados y proyectos de portfolio.',specialty:'Tecnología y comunicación'},
 {id:'oficios',name:'Centro de Oficios del Río',initials:'OR',city:'Rosario',province:'Santa Fe',since:2015,courses:18,certificates:925,reviews:47,rating:4.2,verified:true,complete:true,reviewed:true,scores:{experience:62,teaching:66,verification:75,currency:54,activity:67},description:'Formación en oficios con prácticas de taller y recorridos progresivos de aprendizaje.',specialty:'Oficios y servicios'},
 {id:'puentes',name:'Instituto Puentes',initials:'IP',city:'Mendoza',province:'Mendoza',since:2025,courses:5,certificates:48,reviews:4,rating:4.8,verified:true,complete:false,reviewed:false,scores:{experience:null,teaching:75,verification:90,currency:80,activity:20},description:'Una institución que está incorporando su propuesta y documentando su actividad en la red.',specialty:'Idiomas y habilidades'},
 {id:'taller',name:'Taller Abierto Formación',initials:'TA',city:'Mar del Plata',province:'Buenos Aires',since:2023,courses:8,certificates:120,reviews:18,rating:3.7,verified:true,complete:true,reviewed:true,scores:{experience:40,teaching:42,verification:60,currency:32,activity:25},description:'Una propuesta de talleres de servicios y comunicación que está fortaleciendo su información y acompañamiento.',specialty:'Comunicación y servicios'},
];
const entries = [
 ['excel-horizonte','Excel para el trabajo','Tecnología','horizonte','Online',40,8,58000,4.8,54,'Inicial','Organizá datos, creá fórmulas y construí reportes útiles para tu trabajo.',['Planillas y organización de datos','Fórmulas y funciones','Tablas dinámicas y gráficos','Proyecto de aplicación']],
 ['excel-aula','Excel y gestión administrativa','Administración','aula-sur','Online',32,8,42000,4.5,26,'Inicial','Aplicá Excel a tareas administrativas, presupuestos y seguimiento de operaciones.',['Herramientas de Excel','Registros administrativos','Presupuestos','Reportes de gestión']],
 ['marketing-nexo','Marketing digital y redes sociales','Comunicación','nexo','Online',60,12,89000,4.7,24,'Inicial','Diseñá una estrategia de contenidos y aprendé a medir sus resultados.',['Estrategia digital','Contenido y redes sociales','Campañas y audiencias','Medición de resultados']],
 ['sueldos-aula','Liquidación de sueldos','Administración','aula-sur','Híbrida',48,12,76000,4.6,31,'Intermedio','Practicá la confección de recibos y el cálculo de conceptos salariales.',['Conceptos remunerativos','Cálculo de haberes','Descuentos y aportes','Práctica de liquidación']],
 ['electricidad-rio','Electricidad domiciliaria','Oficios','oficios','Presencial',96,24,125000,4.3,28,'Inicial','Aprendé fundamentos de instalaciones y seguridad mediante prácticas de taller.',['Herramientas y seguridad','Circuitos eléctricos','Instalaciones básicas','Práctica supervisada']],
 ['ingles-puentes','Inglés para atención al público','Idiomas','puentes','Online',36,12,45000,null,0,'Inicial','Desarrollá recursos de conversación para situaciones de atención y servicio.',['Presentaciones','Consultas habituales','Resolución de situaciones','Práctica conversacional']],
 ['datos-horizonte','Análisis de datos con Power BI','Tecnología','horizonte','Online',48,12,98000,4.9,42,'Intermedio','Convertí datos en reportes visuales que ayuden a tomar decisiones.',['Preparación de datos','Modelado','Visualización','Proyecto de tablero']],
 ['programacion-nexo','Introducción a la programación','Tecnología','nexo','Online',72,16,112000,4.6,19,'Inicial','Desarrollá pensamiento lógico y construí tus primeros programas.',['Lógica y algoritmos','Variables y estructuras','Funciones','Proyecto integrador']],
 ['refrigeracion-rio','Refrigeración y aire acondicionado','Oficios','oficios','Presencial',80,20,132000,4.1,16,'Inicial','Conocé los componentes, el mantenimiento y el diagnóstico de equipos.',['Principios de refrigeración','Componentes','Mantenimiento','Diagnóstico en taller']],
 ['rrhh-horizonte','Asistente de Recursos Humanos','Administración','horizonte','Híbrida',60,16,84000,4.7,30,'Inicial','Incorporá herramientas para colaborar en procesos de gestión de personas.',['Administración de personal','Selección','Capacitación','Documentación y procesos']],
 ['community-taller','Community manager: primeros pasos','Comunicación','taller','Online',24,6,29000,3.7,13,'Inicial','Organizá publicaciones y desarrollá una rutina de gestión de redes.',['Perfil y audiencia','Calendario de contenidos','Publicación','Indicadores básicos']],
 ['pasteleria-rio','Pastelería: técnicas esenciales','Gastronomía','oficios','Presencial',48,12,95000,4.4,21,'Inicial','Aprendé técnicas, preparaciones y buenas prácticas en un entorno de taller.',['Buenas prácticas','Masas y batidos','Cremas y rellenos','Presentación']],
 ['emprender-aula','Herramientas para emprender','Administración','aula-sur','Online',20,5,32000,4.5,17,'Inicial','Ordená tu idea de negocio, sus costos y la relación con tus clientes.',['Modelo de negocio','Costos','Clientes','Plan de acción']],
 ['portugues-puentes','Portugués para el trabajo','Idiomas','puentes','Presencial',48,16,64000,null,0,'Inicial','Practicá vocabulario y conversaciones habituales del entorno laboral.',['Comunicación cotidiana','Vocabulario laboral','Atención y reuniones','Práctica oral']],
 ['diseno-nexo','Diseño de contenido con Canva','Comunicación','nexo','Online',16,4,24000,4.8,12,'Inicial','Creá piezas visuales y aplicá criterios de composición y consistencia.',['Composición','Identidad visual','Piezas para redes','Proyecto de contenido']],
 ['atencion-taller','Atención al cliente y ventas','Administración','taller','Híbrida',20,5,28000,3.8,10,'Inicial','Desarrollá recursos de comunicación para la atención y el seguimiento comercial.',['Escucha activa','Conversación comercial','Gestión de consultas','Seguimiento']],
];
export const courses=entries.map(([id,title,category,institution,mode,hours,weeks,price,rating,reviews,difficulty,description,modules])=>({id,title,category,institution,mode,hours,weeks,price,rating,reviews,difficulty,description,modules,...learningByCourse[id],certificate:'Certificado emitido por la Cámara',updated:'Septiembre 2026'}));
// Demonstration brand assets. Replace with the member's authorized logo and links.
institutions.forEach((institution,index)=>{
 institution.logo={asset:'./assets/institute-logo-atlas.png',column:index%3,row:Math.floor(index/3),demo:true};
 institution.socials={instagram:null,facebook:null,linkedin:null,youtube:null};
});
export const sampleVideo={provider:'youtube',id:'lgIWIPDJuPo',title:'Excel: Getting Started',author:'LearnFree',url:'https://www.youtube.com/watch?v=lgIWIPDJuPo',demo:true};
courses.forEach(course=>{
 course.cover=course.category==='Oficios'?'./assets/technical-workshop.png':'./assets/digital-learning.png';
 course.coverAlt=course.category==='Oficios'?'Escena ilustrativa de una práctica de taller':'Escena ilustrativa de aprendizaje online';
 course.video=course.id.startsWith('excel-')?sampleVideo:null;
});
export const categories=[...new Set(courses.map(c=>c.category))];
export const provinces=[...new Set(institutions.map(i=>i.province))];
export const getInstitution=id=>institutions.find(i=>i.id===id);
export const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function assessment(i){
 if(!i.complete||!i.reviewed||i.reviews<10||dimensions.some(d=>!Number.isFinite(i.scores[d.key])))return {score:null,key:'sin-evaluar',name:'En evaluación',shortName:'En evaluación',ordinal:null,tone:'gray'};
 const score=Math.round(dimensions.reduce((total,d)=>total+i.scores[d.key]*d.weight/100,0));
 let level=[...levels].reverse().find(l=>score>=l.min);
 if(level.key==='referente'&&(i.reviews<30||i.scores.teaching<80))level=levels[2];
 return {...level,score};
}
export function findCourses({q='',category='',mode='',province='',level='',duration='',sort='relevance'}={}){
 const aliases={computacion:'tecnologia',informatica:'tecnologia',virtual:'online',remoto:'online',ingles:'ingles',programar:'programacion'};
 const stopwords=new Set(['curso','cursos','de','del','para','en','el','la','los','las','aprender']);
 const words=normalize(q).split(/\s+/).filter(w=>w&&!stopwords.has(w)).map(w=>aliases[w]||w);
 return courses.map(c=>{
   const i=getInstitution(c.institution),a=assessment(i);
   const title=normalize(c.title),skills=normalize(c.skills.join(' ')),outcomes=normalize([...c.outcomes,c.project].join(' ')),modules=normalize(c.modules.join(' '));
   const haystack=normalize([c.title,c.category,c.description,skills,outcomes,modules,i.name,i.city,i.province,c.mode].join(' '));
   // Institutional scores do not influence relevance, including ties or the unfiltered catalogue.
   const relevance=words.reduce((n,w)=>n+(title.includes(w)?8:skills.includes(w)?6:outcomes.includes(w)?4:modules.includes(w)?3:haystack.includes(w)?1:0),0);
   return {c,i,a,relevance,matches:words.every(w=>haystack.includes(w))};
 }).filter(({c,i,a,matches})=>matches&&(!category||c.category===category)&&(!mode||c.mode===mode)&&(!province||i.province===province)&&(!level||a.key===level)&&(!duration||(duration==='short'?c.hours<=40:c.hours>40)))
 .sort((a,b)=>sort==='price'?a.c.price-b.c.price:sort==='rating'?(b.c.rating??-1)-(a.c.rating??-1):sort==='level'?(b.a.score??-1)-(a.a.score??-1):b.relevance-a.relevance||a.c.title.localeCompare(b.c.title,'es'))
 .map(({c})=>c);
}
