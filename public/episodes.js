// Interprétation exploratoire de la vidéo Z0kErGRgYSo (5:26–6:24).
// Les seuils sur l'AIR ci-dessous sont des choix du prototype, pas des
// mesures du sol ni des valeurs chiffrées données par le vidéaste.
export function detectEpisodes(d,today) {
 const meanAt=i=>Number.isFinite(d.temperature_2m_max[i])&&Number.isFinite(d.temperature_2m_min[i])?(d.temperature_2m_max[i]+d.temperature_2m_min[i])/2:null;
 const episodes=[];
 for(let i=12;i+3<d.time.length;i++){
  const before=Array.from({length:3},(_,j)=>meanAt(i-3+j));
  const after=Array.from({length:4},(_,j)=>meanAt(i+j));
  const rain=d.precipitation_sum.slice(i-12,i+1);
  if([...before,...after,...rain].some(x=>!Number.isFinite(x)))continue;
  const baseline=before.reduce((a,b)=>a+b,0)/3;
  const change=after[0]-baseline;
  const wetEvent=d.precipitation_sum[i]+d.precipitation_sum[i-1]>=10;
  const wetBefore=rain.slice(0,-1).reduce((a,b)=>a+b,0)>=20;
  let type=null;
  if(change<=-3 && after.slice(1).every(t=>t<=baseline-1) && (wetEvent||wetBefore))type=wetEvent?'Refroidissement avec pluie':'Refroidissement sur période arrosée';
  if(baseline<8 && change>=3 && after.every(t=>t>=8&&t<=18) && wetEvent)type='Redoux pluvieux après froid';
  if(!type)continue;
  // Regrouper les jours consécutifs d'un même épisode sans décaler son début.
  if(episodes.length && Date.parse(d.time[i])-Date.parse(episodes.at(-1).date)<=3*86400000)continue;
  episodes.push({date:d.time[i],type,modeledConfirmationDate:d.time[i+3],status:d.time[i+3]<today?'Période passée dans le modèle météo':'Maintien encore partiellement prévu',basis:'Température de l’air et pluie ; état réel du sol inconnu'});
 }
 return episodes;
}
export function episodeForDate(episodes,date) {
 return episodes.map(e=>({...e,age:Math.round((Date.parse(date)-Date.parse(e.date))/86400000)})).filter(e=>e.age>=10&&e.age<=15).at(-1)||null;
}
