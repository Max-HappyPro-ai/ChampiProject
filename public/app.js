import {normalizeOutcome,makeObservation,compareOutings,summarizeOutings} from '/feedback.js';
import {archiveForecasts,previousForecast} from '/history.js';
import {fetchWeather,weatherDate} from '/weather-client.js';
import {buildAlert,unsentAlerts} from '/alerts.js';
import {forecast} from '/forecast.js';
const $=id=>document.getElementById(id);
let places=[];try{places=JSON.parse(localStorage.getItem('sous-bois-places')||'[]');if(!Array.isArray(places))places=[];}catch{}
let selected=places[0]?.id,version=0;
let archived=[],outcomes={};
try{archived=JSON.parse(localStorage.getItem('sous-bois-archive')||'[]');if(!Array.isArray(archived))archived=[];}catch{}
try{outcomes=JSON.parse(localStorage.getItem('sous-bois-outcomes')||'{}');if(!outcomes||typeof outcomes!=='object'||Array.isArray(outcomes))outcomes={};}catch{}
function saveHistory(){try{localStorage.setItem('sous-bois-archive',JSON.stringify(archived));localStorage.setItem('sous-bois-outcomes',JSON.stringify(outcomes));}catch{$('status').textContent+=' · Historique non sauvegardé : stockage du navigateur indisponible.';}}

const fmt=date=>new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(date));
function node(tag,text,className){const n=document.createElement(tag);n.textContent=text;if(className)n.className=className;return n;}
function persist(){try{localStorage.setItem('sous-bois-places',JSON.stringify(places));}catch{$('status').textContent='Stockage local indisponible : les lieux seront perdus à la fermeture.';}}
const loadedDays=new Map();
let placeToday=new Map();
function render(){
 $('places').replaceChildren();
 for(const p of places){const row=node('div','','place'+(p.id===selected?' active':'')),b=node('button',p.name),del=node('button','×');b.append(node('small',`${p.latitude.toFixed(3)}, ${p.longitude.toFixed(3)} · ${p.elevation==null?'altitude à déterminer':Math.round(p.elevation)+' m'}`));b.onclick=()=>{selected=p.id;render();load();};del.setAttribute('aria-label',`Supprimer ${p.name}`);del.onclick=()=>{places=places.filter(x=>x.id!==p.id);if(selected===p.id)selected=places[0]?.id;persist();render();load();};row.append(b,del);$('places').append(row);}
 $('refresh').hidden=!selected;
 renderFeedback();
 queueMicrotask(checkAll);
}
const weatherCache=new Map();
async function weather(p){
 const old=weatherCache.get(p.id);
 if(old && Date.now()-old.time<30*60*1000)return old.promise;
 const promise=fetchWeather(p);
 weatherCache.set(p.id,{time:Date.now(),promise});
 try{return await promise;}catch(e){weatherCache.delete(p.id);throw e;}
}
async function api(path){
 let r;try{r=await fetch(path);}catch{throw Error('Impossible de joindre l’application. Vérifiez votre connexion.');}
 let data;try{data=await r.json();}catch{throw Error(`Réponse inattendue du serveur (HTTP ${r.status}). Vérifiez le déploiement.`);}
 if(!r.ok)throw Error(data.error||`Service indisponible (HTTP ${r.status}). Réessayez plus tard.`);
 return data;
}
$('search-form').onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;$('results').textContent='Recherche…';try{const d=await api('/api/search?name='+encodeURIComponent($('query').value));$('results').replaceChildren();if(!d.results?.length)$('results').textContent='Aucun lieu trouvé. Saisissez uniquement le nom de la commune, par exemple Brassac, puis choisissez le département.';for(const r of d.results||[]){const b=node('button',`${r.name}, ${[r.admin2,r.admin1,r.country].filter(Boolean).join(' · ')} · ${r.elevation==null?'altitude déterminée par la météo':Math.round(r.elevation)+' m'}`,'result');b.onclick=()=>{const id=`${r.latitude},${r.longitude}`;if(!places.some(p=>p.id===id))places.push({id,name:r.name,latitude:r.latitude,longitude:r.longitude,elevation:r.elevation??null});selected=id;persist();render();load();$('results').replaceChildren();};$('results').append(b);}}catch(e){$('results').textContent=e.message;}finally{b.disabled=false;}};
async function load(){const v=++version,p=places.find(x=>x.id===selected);$('summary').replaceChildren();$('days').replaceChildren();if(!p){$('place-title').textContent='Votre prochaine sortie';$('status').textContent='Ajoutez votre premier coin de forêt pour consulter ses conditions.';return;}$('place-title').textContent=p.name;$('status').textContent='Lecture des conditions météo…';try{const d=await weather(p);if(v!==version)return;const today=weatherDate(d),days=forecast(d,today,{includePast:true});$('status').textContent=`Actualisé à ${new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})} · Altitude du modèle : ${Math.round(d.elevation)} m`;archived=archiveForecasts(archived,p.id,days,new Date().toISOString(),today);saveHistory();loadedDays.set(p.id,days);placeToday.set(p.id,today);renderFeedback();const best=days.filter(d=>d.horizon>=1).reduce((a,b)=>!a||b.score>a.score?b:a,null);const box=node('div','','summary');box.append(node('strong',best?.score>=60?`À surveiller vers le ${fmt(best.date)}`:'Pas de signal favorable marqué'));box.append(node('p','Indice exploratoire non validé. Les dates indiquent des conditions propices possibles, pas une poussée prévue avec certitude.'));$('summary').append(box);for(const day of days){
 if(day.horizon===-7||day.horizon===0||day.horizon===1)$('days').append(node('h3',day.horizon===-7?'Les 7 jours passés — recalcul rétrospectif':day.horizon===0?'Aujourd’hui — estimation en cours de journée':'Les 14 prochains jours'));
 const row=node('div','','day'),date=node('div',fmt(day.date)),detail=node('div',`${day.water} mm sur les 12 jours précédents · ${day.temp} °C max. moy. · humidité ${day.humid??'—'} %${day.shock?' · refroidissement':''}${day.hail?' · signal de grêle dans les 12 jours précédents (sans bonus ni pénalité)':''}`),score=node('div',`${day.score}/100`);const meter=node('div','','meter'),bar=node('i');bar.style.width=day.score+'%';meter.append(bar);detail.append(node('small',` · ${day.historicalDays} jours passés + ${day.forecastDays} jours prévus`));detail.append(meter);
 const explanation=node('details');explanation.append(node('summary','Détail du calcul expérimental'));
 const c=day.contributions;
 detail.append(node('p',day.episode?`${day.episode.type} repéré le ${fmt(day.episode.date)} : ${day.episode.age} jours avant cette date. Maintien sur 72 h dans le modèle. ${day.episode.status}. Hypothèse pour le cèpe de Bordeaux ; sol non mesuré.`:'Aucun épisode correspondant au délai de 10–15 jours repéré. Cela ne prouve pas une absence de cèpes ; la météo seule ne confirme pas une nouvelle poussée.')); explanation.append(node('p',`Pluie : +${c.rain} · Température : +${c.temperature} · Humidité : +${c.humidity} · Séquence météo à 10–15 jours : +${c.cooling} · Gel : ${c.frost} · Grêle : 0. Total borné entre 0 et 100. Seuils provisoires, sans validation prédictive.`));detail.append(explanation);
 if(day.horizon<=0){
 detail.append(node('p',day.horizon<0?'Recalcul avec les données disponibles aujourd’hui : ce score ne reproduit pas ce que l’application prévoyait à l’époque.':'Estimation du jour : certaines données restent prévues.'));
 const saved=previousForecast(archived,p.id,day.date);
 detail.append(node('p',saved?`Prévision archivée avant cette date : ${saved.score}/100, consultée le ${fmt(saved.issueDate)} (modèle ${saved.model}).`:'Aucune prévision antérieure archivée pour cette date dans ce navigateur.'));
 const label=node('label','Votre sortie ce jour-là'),select=node('select');
 select.setAttribute('aria-label',`Résultat de votre sortie du ${fmt(day.date)}`);
 for(const [value,text] of [['','Sortie non renseignée'],['absent','Sortie effectuée : aucun cèpe trouvé'],['present','Sortie effectuée : cèpes trouvés']]){const option=node('option',text);option.value=value;select.append(option);}
 const key=JSON.stringify([p.id,day.date]);select.value=normalizeOutcome(outcomes[key])?.result||'';select.onchange=()=>{if(select.value)outcomes[key]={...normalizeOutcome(outcomes[key]),result:select.value,retrospective:{score:day.score,model:'2026-10-28-episodes-v1'},recordedAt:new Date().toISOString()};else delete outcomes[key];saveHistory();renderFeedback();};label.append(select);detail.append(label);
 }
 score.append(node('small',` · ${day.horizon>0?'J+'+day.horizon:day.horizon===0?'Aujourd’hui':'J'+day.horizon}, fiabilité non évaluée`));row.append(date,detail,score);$('days').append(row);}if(!days.length)$('status').textContent='Données insuffisantes pour établir une fenêtre.';}catch(e){if(v===version)$('status').textContent=e.message;}}
function localToday(){const now=new Date();return new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);}
function renderFeedback(){
 const p=places.find(p=>p.id===selected),today=placeToday.get(selected)||localToday();
 $('feedback-place').textContent=p?`Lieu sélectionné : ${p.name} (${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)})`:'Sélectionnez ou ajoutez un lieu pour tenir votre carnet.';
 $('outing-save').disabled=!p;$('outing-date').max=today;
 if(!$('outing-date').value)$('outing-date').value=today;
 $('feedback-summary').replaceChildren();$('feedback-rows').replaceChildren();
 if(!p)return;
 const rows=compareOutings(archived,outcomes,p.id,loadedDays.get(p.id)||[]);
 const names={archived:'Prévisions réellement archivées avant la sortie',reported:'Scores renseignés de mémoire, non vérifiés',retrospective:'Recalculs rétrospectifs',none:'Sorties sans score comparable'};
 if(!rows.length)$('feedback-summary').append(node('p','Aucune sortie renseignée pour ce lieu.'));
 for(const g of summarizeOutings(rows).filter(g=>g.total))$('feedback-summary').append(node('p',`${names[g.source]} : ${g.total} sortie(s) ; ${g.highAbsent} indice(s) ≥ 60 sans découverte ; ${g.lowPresent} découverte(s) malgré un indice < 60.`));
 if(rows.length)$('feedback-summary').append(node('p','Bilan descriptif uniquement : ni probabilité de pousse, ni corrélation statistique validée. Les espèces, durées de prospection, échéances et versions du modèle peuvent différer.'));
 for(const r of rows){
  const article=node('article','','feedback-row');article.append(node('strong',`${fmt(r.date)} — ${r.observation.result==='absent'?'aucun cèpe trouvé':'cèpes trouvés'}`));
  article.append(node('p',`${r.score===null?'Indice inconnu':r.score+'/100'} · ${names[r.source]}${r.issueDate?' · prévision consultée le '+fmt(r.issueDate):''}${r.model?' · modèle '+r.model:''}`));
  if(r.observation.reportedScore!=null&&r.source==='archived')article.append(node('p',`Indice déclaré en complément : ${r.observation.reportedScore}/100. Le bilan utilise l’archive.`));
  if(r.observation.minutes)article.append(node('p',`Effort déclaré : ${r.observation.minutes} minutes.`));
  if(r.mismatch==='high-absent')article.append(node('p','Écart à examiner : conditions météo favorables, mais aucune découverte lors de cette sortie.','feedback-warning'));
  if(r.mismatch==='low-present')article.append(node('p','Écart à examiner : découverte malgré un faible indice.','feedback-warning'));
  const edit=node('button','Modifier'),del=node('button','Supprimer');
  edit.onclick=()=>{const o=r.observation;$('outing-date').value=r.date;$('outing-result').value=o.result;$('outing-score').value=o.reportedScore??'';$('outing-minutes').value=o.minutes??'';$('outing-species').value=o.species||'unknown';$('outing-habitat').value=o.habitat||'unknown';$('outing-form').scrollIntoView({behavior:'smooth'});};
  del.onclick=()=>{delete outcomes[JSON.stringify([p.id,r.date])];saveHistory();renderFeedback();load();};article.append(edit,del);$('feedback-rows').append(article);
 }
}
$('outing-form').onsubmit=e=>{
 e.preventDefault();const p=places.find(p=>p.id===selected);if(!p)return;
 try{const date=$('outing-date').value;outcomes[JSON.stringify([p.id,date])]=makeObservation({result:$('outing-result').value,date,today:placeToday.get(p.id)||localToday(),reportedScore:$('outing-score').value,minutes:$('outing-minutes').value,species:$('outing-species').value,habitat:$('outing-habitat').value,retrospective:loadedDays.get(p.id)?.find(d=>d.date===date&&d.horizon<=0)});saveHistory();renderFeedback();load();$('outing-status').textContent='Sortie ajoutée au carnet en mémoire ; sa conservation dépend du stockage de ce navigateur.';}catch(error){$('outing-status').textContent=error.message;}
};
$('export-outings').onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),places,outcomes,forecasts:archived},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a','');a.href=url;a.download='sous-bois-carnet.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('refresh').onclick=()=>{weatherCache.clear();load();checkAll();};
let notificationsEnabled=false,sent={};
try{notificationsEnabled=localStorage.getItem('sous-bois-notifications')==='true';sent=JSON.parse(localStorage.getItem('sous-bois-sent')||'{}');if(!sent||Array.isArray(sent)||typeof sent!=='object')sent={};}catch{}
function notificationStatus(){
 const supported='Notification' in window && window.isSecureContext;
 $('notifications').disabled=!supported;
 $('notifications').textContent=notificationsEnabled?'Désactiver les notifications':'Activer les notifications';
 $('notification-status').textContent=!supported?'Notifications non disponibles dans ce navigateur ou sans connexion HTTPS. Les alertes restent visibles ci-dessous.':Notification.permission==='denied'?'Notifications bloquées dans les réglages du navigateur. Les alertes restent visibles ci-dessous.':notificationsEnabled&&Notification.permission==='granted'?'Notifications activées pendant l’utilisation de l’application.':'Notifications désactivées. Les alertes restent visibles ci-dessous.';
}
$('notifications').onclick=async()=>{
 if(notificationsEnabled){notificationsEnabled=false;}else{
  try{notificationsEnabled=await Notification.requestPermission()==='granted';}catch{notificationsEnabled=false;}
 }
 try{localStorage.setItem('sous-bois-notifications',String(notificationsEnabled));}catch{}
 notificationStatus();checkAll();
};
let scanning=false,rescan=false;
async function checkAll(){
 if(scanning){rescan=true;return;}
 scanning=true;
 const snapshot=[...places],alerts=[],failures=[];
 $('alerts-status').textContent=snapshot.length?'Vérification des conditions de tous vos lieux…':'Ajoutez un lieu pour commencer la veille.';
 try{
  for(const p of snapshot){
   try{const d=await weather(p);if(!places.some(x=>x.id===p.id))continue;const today=weatherDate(d),days=forecast(d,today);if(!days.length)throw Error('Données insuffisantes');const a=buildAlert(p,days,today);if(a)alerts.push(a);}
   catch{if(places.some(x=>x.id===p.id))failures.push(p.name);}
  }
  $('alerts').replaceChildren();
  for(const a of alerts){if(!places.some(p=>p.id===a.placeId))continue;const box=node('article','','alert-item');box.append(node('strong',a.title),node('p',a.body));const b=node('button','Voir les conditions');b.onclick=()=>{selected=a.placeId;render();load();$('place-title').scrollIntoView({behavior:'smooth'});};box.append(b);$('alerts').append(box);}
  if(snapshot.length)$('alerts-status').textContent=`${alerts.length} lieu(x) à surveiller. ${failures.length?'Vérification impossible pour : '+failures.join(', ')+'. Aucune conclusion pour ces lieux.':'Dernière vérification : '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'.'}`;
  if(notificationsEnabled && 'Notification' in window && Notification.permission==='granted'){
   for(const a of unsentAlerts(alerts,sent)){
    try{const n=new Notification(a.title,{body:a.body,tag:a.key});n.onclick=()=>{window.focus();selected=a.placeId;render();load();n.close();};sent[a.key]=Date.now();}catch{$('notification-status').textContent='Ce navigateur ne permet pas cet affichage de notification. Consultez les alertes ci-dessus.';}
   }
   sent=Object.fromEntries(Object.entries(sent).filter(([,time])=>Date.now()-time<30*86400000));
   try{localStorage.setItem('sous-bois-sent',JSON.stringify(sent));}catch{}
  }
 }finally{scanning=false;if(rescan){rescan=false;queueMicrotask(checkAll);}}
}
notificationStatus();render();load();
setInterval(()=>{if(document.visibilityState==='visible'){load();checkAll();}},30*60*1000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){notificationStatus();load();checkAll();}});
