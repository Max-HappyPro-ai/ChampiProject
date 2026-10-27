// Heuristique exploratoire, sans calibration sur des observations de poussées.
export function forecast(data,today) {
 const d=data.daily;
 return d.time.flatMap((date,i)=>{
  const horizon=Math.round((Date.parse(date)-Date.parse(today))/86400000);
  if(horizon<1||horizon>14||i<12)return [];
  const rain=d.precipitation_sum.slice(i-12,i);
  const temps=d.temperature_2m_max.slice(i-12,i);
  const mins=d.temperature_2m_min.slice(i-12,i);
  if([...rain,...temps,...mins].some(v=>v==null))return [];
  const water=rain.reduce((a,b)=>a+b,0);
  const avg=temps.reduce((a,b)=>a+b,0)/temps.length;
  const humidity=(data.hourly?.time||[]).flatMap((t,j)=>t.startsWith(date)&&data.hourly.relative_humidity_2m[j]!=null?[data.hourly.relative_humidity_2m[j]]:[]);
  const humid=humidity.length?humidity.reduce((a,b)=>a+b,0)/humidity.length:null;
  const shock=d.temperature_2m_max.slice(i-12,i).some((t,j,a)=>j>0&&t!=null&&a[j-1]!=null&&a[j-1]-t>=5);
  const hail=d.weather_code.slice(i-3,i+1).some(c=>c===96||c===99);
  let score=(water>=20&&water<=80?40:water>=10?22:0)+(avg>=12&&avg<=24?30:avg>=8&&avg<=28?12:0)+(humid>=75?20:humid>=60?10:0)+(shock?10:0);
  if(mins.some(t=>t<=0))score-=40;
  if(hail)score-=15;
  score=Math.max(0,Math.min(100,score));
  const historicalDays=d.time.slice(i-12,i).filter(t=>t<today).length;
  return [{date,horizon,historicalDays,forecastDays:12-historicalDays,score,water:Math.round(water),temp:Math.round(avg),humid:humid===null?null:Math.round(humid),shock,hail,confidence:horizon<=7?'Modérée':'Faible'}];
 });
}
