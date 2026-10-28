export function buildAlert(place, days, today) {
 const favorable=days.filter(d=>d.horizon>=1&&d.horizon<=14&&d.score>=60).sort((a,b)=>a.date.localeCompare(b.date));
 if(!favorable.length)return null;
 const day=favorable[0];
 return {key:JSON.stringify([place.id,today]),placeId:place.id,date:day.date,title:`${place.name} : conditions à surveiller`,body:`Fenêtre possible le ${day.date} (J+${day.horizon}). Indice expérimental ${day.score}/100, sans garantie de poussée.`};
}
export function unsentAlerts(alerts,sent){return alerts.filter(a=>!Object.hasOwn(sent,a.key));}
