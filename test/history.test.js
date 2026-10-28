import {test} from 'node:test';
import assert from 'node:assert/strict';
import {archiveForecasts,previousForecast} from '../public/history.js';
import {forecast} from '../public/forecast.js';
import {buildAlert} from '../public/alerts.js';
function data(){return {daily:{time:Array.from({length:51},(_,i)=>new Date(Date.UTC(2026,8,i+1)).toISOString().slice(0,10)),temperature_2m_max:Array(51).fill(18),temperature_2m_min:Array(51).fill(10),precipitation_sum:Array(51).fill(3),weather_code:Array(51).fill(3)}};}
test('retrospective view includes seven past days, today and fourteen future days',()=>{const days=forecast(data(),'2026-10-06',{includePast:true});assert.equal(days.length,22);assert.equal(days[0].horizon,-7);assert.equal(days.at(-1).horizon,14);assert.equal(days.filter(d=>d.horizon===0).length,1);assert.equal(forecast(data(),'2026-10-06').length,14);});
test('historical scores never trigger future alerts',()=>{assert.equal(buildAlert({id:'p',name:'Lieu'},[{date:'2026-10-01',horizon:-5,score:100},{date:'2026-10-06',horizon:0,score:100}],'2026-10-06'),null);});
test('archiving records only forecasts, preserves first consultation and isolates places',()=>{const days=[{date:'2026-10-07',horizon:1,score:70},{date:'2026-10-05',horizon:-1,score:90}];const records=archiveForecasts([],'p',days,'2026-10-06T10:00:00Z','2026-10-06');const again=archiveForecasts(records,'p',[{...days[0],score:80}],'2026-10-06T12:00:00Z','2026-10-06');assert.equal(again.length,1);assert.equal(previousForecast(again,'p','2026-10-07').score,70);assert.equal(previousForecast(again,'other','2026-10-07'),null);assert.equal(previousForecast(again,'p','2026-10-05'),null);});
test('archives older than sixty days are pruned',()=>{assert.equal(archiveForecasts([{issuedAt:'2026-01-01T00:00:00Z'}],'p',[],'2026-10-06T10:00:00Z','2026-10-06').length,0);});
