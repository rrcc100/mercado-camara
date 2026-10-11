import {assessment,levels} from './model.js';

const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const chamberLogo=(className='')=>`<img class="chamber-logo ${className}" src="./assets/camara-argentina-logo.png" width="1600" height="642" alt="Cámara Argentina para la Formación Profesional y la Capacitación Laboral">`;

export function levelCredential(level,{compact=false,href='#/niveles',institution=''}={}){
  const pending=!level.ordinal;
  const ordinal=pending?'—':['I','II','III','IV'][level.ordinal-1];
  const title=pending?'Evaluación pendiente':level.name;
  const accessible=`${institution?institution+': ':''}${level.name}${pending?'':', nivel '+level.ordinal+' de 4'}. Ver criterios del sello formativo`;
  const brand=`<span class="credential-brand">${chamberLogo()}<span>Sello de Desarrollo Formativo</span></span>`;
  const emblem=`<span class="credential-emblem" aria-hidden="true"><svg class="credential-book" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v16M3 4c4-1 6 0 9 2 3-2 5-3 9-2v14c-4-1-6 0-9 2-3-2-5-3-9-2Z"/></svg><strong>${ordinal}</strong></span>`;
  if(compact)return `<a class="formative-credential compact ${pending?'pending':''}" href="${safe(href)}" aria-label="${safe(accessible)}">${emblem}<span class="credential-identity"><span class="credential-label">Nivel institucional · ejemplo</span><strong>${safe(title)}</strong><span class="credential-mini-steps" aria-hidden="true">${levels.map(l=>`<span class="${!pending&&l.ordinal<=level.ordinal?'filled':''}"></span>`).join('')}</span></span>${chamberLogo('compact-chamber')}</a>`;
  return `<section class="formative-credential full ${pending?'pending':''}" aria-label="${safe(accessible)}"><div class="credential-topline"><span>DESARROLLO FORMATIVO</span><span>Propuesta · ejemplo</span></div><div class="credential-main">${emblem}<div><span class="credential-label">Nivel institucional</span><h3>${safe(title)}</h3><span class="credential-count">${pending?'Sin nivel asignado':`Nivel ${level.ordinal} de 4`}</span></div></div><div class="credential-scale" aria-label="${pending?'Evidencia insuficiente para asignar un nivel':'Escala institucional: '+level.ordinal+' de 4'}">${levels.map(l=>`<span class="${!pending&&l.ordinal<=level.ordinal?'filled':''} ${l.ordinal===level.ordinal?'current':''}"><i aria-hidden="true"></i><span>${l.shortName}</span></span>`).join('')}</div><p class="credential-description">${pending?'Falta evidencia suficiente. Este estado no implica una valoración negativa.':safe(level.description)}</p><div class="credential-footer">${brand}<a href="${safe(href)}">Ver criterios</a></div></section>`;
}

export const institutionCredential=(institution,compact=true)=>levelCredential(assessment(institution),{compact,href:compact?`#/instituto/${institution.id}`:'#/niveles',institution:institution.name});
