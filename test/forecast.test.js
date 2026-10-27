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
