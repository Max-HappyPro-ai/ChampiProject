export const MODEL_VERSION='2026-10-28-episodes-v1';
export function archiveForecasts(records,placeId,days,issuedAt,today){
 const cutoff=Date.parse(today)-60*86400000;
 const retained=records.filter(r=>Date.parse(r.issuedAt)>=cutoff);
 for(const d of days.filter(d=>d.horizon>=1&&d.horizon<=14)){
  if(!retained.some(r=>r.placeId===placeId&&r.date===d.date&&r.issueDate===today&&r.model===MODEL_VERSION))retained.push({placeId,date:d.date,score:d.score,issuedAt,issueDate:today,model:MODEL_VERSION,horizon:d.horizon,features:{rain12mm:d.water,maxTemperature12Mean:d.temp,relativeHumidity:d.humid,episode:d.episode||null,contributions:d.contributions}});
 }
 return retained;
}
export function previousForecast(records,placeId,date){
 return records.filter(r=>r.placeId===placeId&&r.date===date&&r.issueDate<date).sort((a,b)=>b.issuedAt.localeCompare(a.issuedAt))[0]||null;
}
