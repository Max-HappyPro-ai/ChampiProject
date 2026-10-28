import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fetchWeather,weatherDate} from '../public/weather-client.js';
const place={latitude:43.6117,longitude:2.5097};
test('browser requests public weather directly with historical coverage and forecast',async()=>{
 const data={daily:{time:['2026-10-27']},hourly:{time:['2026-10-27T00:00']}};
 const result=await fetchWeather(place,async url=>{assert.equal(url.hostname,'api.open-meteo.com');assert.equal(url.searchParams.get('latitude'),'43.6117');assert.equal(url.searchParams.get('past_days'),'28');assert.equal(url.searchParams.get('forecast_days'),'16');return Response.json(data);});assert.deepEqual(result,data);
});
test('quota errors do not trigger another request or fallback',async()=>{let calls=0;await assert.rejects(()=>fetchWeather(place,async()=>{calls++;return new Response('',{status:429});}),/limite actuellement/);assert.equal(calls,1);});
test('network error explains browser connectivity failure',async()=>{await assert.rejects(()=>fetchWeather(place,async()=>{throw new TypeError('Failed to fetch');}),/depuis votre navigateur/);});
test('incomplete data are rejected',async()=>{await assert.rejects(()=>fetchWeather(place,async()=>Response.json({})),/incomplètes/);});

test('weather calendar follows place timezone rather than a fixed history index',()=>{assert.equal(weatherDate({utc_offset_seconds:7200},Date.parse('2026-10-28T23:30:00Z')),'2026-10-29');assert.equal(weatherDate({utc_offset_seconds:-7200},Date.parse('2026-10-28T00:30:00Z')),'2026-10-27');});
