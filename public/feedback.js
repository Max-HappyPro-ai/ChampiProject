import {previousForecast,MODEL_VERSION} from './history.js';
export function normalizeOutcome(value){
 if(value==='absent'||value==='present')return {result:value};
 return value&&['absent','present'].includes(value.result)?value:null;
}
export function makeObservation({result,date,today,reportedScore='',minutes='',species='unknown',habitat='unknown',retrospective=null}){
 if(!['absent','present'].includes(result))throw Error('Indiquez si vous avez trouvé des cèpes.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date>today)throw Error('Choisissez une date de sortie valide, passée ou aujourd’hui.');
 const score=reportedScore===''?null:Number(reportedScore),effort=minutes===''?null:Number(minutes);
 if(score!==null&&(!Number.isFinite(score)||score<0||score>100))throw Error('Le score renseigné doit être compris entre 0 et 100.');
 if(effort!==null&&(!Number.isFinite(effort)||effort<=0||effort>1440))throw Error('La durée doit être comprise entre 1 et 1440 minutes.');
 return {result,reportedScore:score,minutes:effort,species,habitat,retrospective:retrospective?{score:retrospective.score,model:MODEL_VERSION}:null,recordedAt:new Date().toISOString()};
}
export function compareOutings(records,outcomes,placeId,days=[]){
 const rows=[];
 for(const [key,value] of Object.entries(outcomes)){
  let place,date;try{[place,date]=JSON.parse(key);}catch{continue;}
  const observation=normalizeOutcome(value);if(place!==placeId||!observation)continue;
  const archive=previousForecast(records,placeId,date),retro=days.find(d=>d.date===date&&d.horizon<=0)||observation.retrospective;
  const reported=observation.reportedScore;
  const source=archive?'archived':Number.isFinite(reported)?'reported':retro?'retrospective':'none';
  const score=source==='archived'?archive.score:source==='reported'?reported:source==='retrospective'?retro.score:null;
  rows.push({date,observation,source,score,model:archive?.model||retro?.model||null,issueDate:archive?.issueDate||null,mismatch:score===null?null:score>=60&&observation.result==='absent'?'high-absent':score<60&&observation.result==='present'?'low-present':'aligned'});
 }
 return rows.sort((a,b)=>b.date.localeCompare(a.date));
}
export function summarizeOutings(rows){
 return ['archived','reported','retrospective','none'].map(source=>{const group=rows.filter(r=>r.source===source);return {source,total:group.length,highAbsent:group.filter(r=>r.mismatch==='high-absent').length,lowPresent:group.filter(r=>r.mismatch==='low-present').length};});
}
