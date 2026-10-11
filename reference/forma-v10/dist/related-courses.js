import {courses,normalize} from './model.js';

const ignoredWords=new Set(['curso','cursos','de','del','el','la','los','las','y','con','para','en','al','un','una','por','como','trabajo','formacion','introduccion','inicial','basico','basicos','basicas','primeros','pasos','esenciales','tecnicas','herramientas','practica','practicas','taller','buenas']);
const tokens=value=>new Set(normalize(value).split(/[^a-z0-9]+/).filter(word=>word.length>2&&!ignoredWords.has(word)));
const overlap=(a,b)=>[...a].filter(word=>b.has(word)).length;
const features=course=>({title:tokens(course.title),skills:tokens((course.skills||[]).join(' '))});

// Course content is the primary signal; institutional level and review volume are not inputs.
export function findRelatedCourses(current,{catalog=courses,limit=3}={}){
  if(!current||!Number.isInteger(limit)||limit<1)return [];
  const source=features(current),seen=new Set([current.id]);
  return catalog.filter(course=>{
    if(!course.id||seen.has(course.id))return false;
    seen.add(course.id);return true;
  }).map(course=>{
    const candidate=features(course);
    const affinity=8*overlap(source.title,candidate.title)
      +6*overlap(source.skills,candidate.skills)
      +2*(overlap(source.title,candidate.skills)+overlap(source.skills,candidate.title))
      +(current.category&&course.category===current.category?5:0);
    return {course,affinity,format:Number(course.mode===current.mode),difficulty:Number(course.difficulty===current.difficulty)};
  }).filter(item=>item.affinity>0)
    .sort((a,b)=>b.affinity-a.affinity||b.format-a.format||b.difficulty-a.difficulty||a.course.title.localeCompare(b.course.title,'es')||a.course.id.localeCompare(b.course.id))
    .slice(0,limit).map(item=>item.course);
}
