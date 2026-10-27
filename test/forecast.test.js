import {test} from 'node:test';
import assert from 'node:assert/strict';
import {forecast} from '../public/forecast.js';
function fixture(){return {daily:{time:Array.from({length:30},(_,i)=>new Date(Date.UTC(2026,9,i+1)).toISOString().slice(0,10)),temperature_2m_max:Array(30).fill(18),temperature_2m_min:Array(30).fill(10),precipitation_sum:Array(30).fill(4),weather_code:Array(30).fill(3)}};}
test('windows stay between one and fourteen days',()=>{const result=forecast(fixture(),'2026-10-15');assert.equal(result.length,14);assert.equal(result[0].horizon,1);assert.equal(result.at(-1).horizon,14);});
test('frost reduces suitability',()=>{const normal=fixture(),cold=fixture();cold.daily.temperature_2m_min.fill(-2);assert.ok(forecast(cold,'2026-10-15')[0].score<forecast(normal,'2026-10-15')[0].score);});
test('missing precipitation excludes unsupported windows',()=>{const d=fixture();d.daily.precipitation_sum.fill(null);assert.equal(forecast(d,'2026-10-15').length,0);});

test('tomorrow and day after tomorrow use twelve preceding days',()=>{const result=forecast(fixture(),'2026-10-15');assert.equal(result[0].date,'2026-10-16');assert.equal(result[1].date,'2026-10-17');assert.equal(result[0].water,48);assert.equal(result[0].historicalDays,11);assert.equal(result[0].forecastDays,1);assert.equal(result.at(-1).historicalDays,0);});
test('rain twelve days earlier affects tomorrow but target-day rain does not',()=>{const d=fixture();d.daily.precipitation_sum.fill(0);d.daily.precipitation_sum[3]=25;d.daily.precipitation_sum[15]=100;const result=forecast(d,'2026-10-15');assert.equal(result[0].water,25);assert.equal(result[1].water,100);});
test('insufficient historical coverage excludes early windows',()=>{const d=fixture();for(const key of Object.keys(d.daily))d.daily[key]=d.daily[key].slice(5);assert.equal(forecast(d,'2026-10-15')[0].horizon,3);});

test('hail is informative without an unsupported penalty or bonus',()=>{
 const normal=fixture(),hail=fixture();hail.daily.weather_code[10]=96;
 const a=forecast(normal,'2026-10-15')[0],b=forecast(hail,'2026-10-15')[0];
 assert.equal(b.hail,true);assert.equal(b.contributions.hail,0);assert.equal(b.score,a.score);
});
test('hail on candidate day is not classified as an earlier trigger',()=>{
 const d=fixture();d.daily.weather_code[15]=99;
 const days=forecast(d,'2026-10-15');assert.equal(days[0].hail,false);assert.equal(days[1].hail,true);
});
test('contributions reproduce the displayed bounded score',()=>{
 for(const day of forecast(fixture(),'2026-10-15'))assert.equal(day.score,Math.min(100,Math.max(0,Object.values(day.contributions).reduce((a,b)=>a+b,0))));
});

test('rain contribution does not collapse above the old arbitrary 80 mm boundary',()=>{
 const a=fixture(),b=fixture();a.daily.precipitation_sum.fill(80/12);b.daily.precipitation_sum.fill(81/12);
 const x=forecast(a,'2026-10-15')[0],y=forecast(b,'2026-10-15')[0];
 assert.equal(x.contributions.rain,40);assert.equal(y.contributions.rain,40);assert.ok(y.score>=x.score);
});
