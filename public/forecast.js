import {detectEpisodes,episodeForDate} from './episodes.js';
// Heuristique exploratoire, sans calibration sur des observations de poussées.
export function forecast(data,today,{includePast=false}={}) {
 const d=data.daily;
 const episodes=detectEpisodes(d,today);
 return d.time.flatMap((date,i)=>{
  const horizon=Math.round((Date.parse(date)-Date.parse(today))/86400000);
  if(horizon<(includePast?-7:1)||horizon>14||i<12)return [];
  const rain=d.precipitation_sum.slice(i-12,i);
  const temps=d.temperature_2m_max.slice(i-12,i);
  const mins=d.temperature_2m_min.slice(i-12,i);
  if([...rain,...temps,...mins].some(v=>v==null))return [];
  const water=rain.reduce((a,b)=>a+b,0);
  const avg=temps.reduce((a,b)=>a+b,0)/temps.length;
  const humidity=(data.hourly?.time||[]).flatMap((t,j)=>t.startsWith(date)&&data.hourly.relative_humidity_2m[j]!=null?[data.hourly.relative_humidity_2m[j]]:[]);
  const humid=humidity.length?humidity.reduce((a,b)=>a+b,0)/humidity.length:null;
  const shock=d.temperature_2m_max.slice(i-12,i).some((t,j,a)=>j>0&&t!=null&&a[j-1]!=null&&a[j-1]-t>=5);
  const hail=d.weather_code.slice(i-12,i).some(c=>c===96||c===99);
  const episode=episodeForDate(episodes,date);
  const contributions={
   rain:water>=20?40:water>=10?22:0,
   temperature:avg>=12&&avg<=24?30:avg>=8&&avg<=28?12:0,
   humidity:humid>=75?20:humid>=60?10:0,
   cooling:episode?10:0,
   frost:mins.some(t=>t<=0)?-40:0,
   // Pas de poids spécifique établi pour la grêle. Éviter un bonus
   // hydrique supplémentaire sans mesure séparée de son apport.
   hail:0
  };
  let score=Object.values(contributions).reduce((a,b)=>a+b,0);
  score=Math.max(0,Math.min(100,score));
  const historicalDays=d.time.slice(i-12,i).filter(t=>t<today).length;
  return [{date,horizon,episode,contributions,historicalDays,forecastDays:12-historicalDays,score,water:Math.round(water),temp:Math.round(avg),humid:humid===null?null:Math.round(humid),shock,hail,confidence:'Non évaluée'}];
 });
}
