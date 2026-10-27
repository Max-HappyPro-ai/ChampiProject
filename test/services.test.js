import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cachedFetch,searchPlaces} from '../services.js';
test('French commune search does not call Open-Meteo and does not invent altitude',async()=>{
 const result=await searchPlaces('Brassac',async url=>{assert.equal(url.hostname,'geo.api.gouv.fr');return Response.json([{nom:'Brassac',code:'81037',centre:{coordinates:[2.5,43.6]},departement:{nom:'Tarn'},region:{nom:'Occitanie'}}]);});
 const {results}=await result.json();assert.equal(results[0].latitude,43.6);assert.equal(results[0].admin2,'Tarn');assert.equal(results[0].elevation,null);
});
test('international fallback used when no French commune matches',async()=>{
 const calls=[];const result=await searchPlaces('Berlin',async url=>{calls.push(url.hostname);return Response.json(calls.length===1?[]:{results:[{name:'Berlin'}]});});assert.equal((await result.json()).results[0].name,'Berlin');assert.deepEqual(calls,['geo.api.gouv.fr','geocoding-api.open-meteo.com']);
});
test('cache deduplicates simultaneous requests and refreshes after expiry',async()=>{
 let calls=0,now=0;const fetch=cachedFetch(async()=>{calls++;return Response.json({ok:true});},()=>now);
 const url=new URL('https://api.open-meteo.com/v1/forecast?latitude=43');
 const responses=await Promise.all([fetch(url),fetch(url)]);assert.equal(calls,1);for(const r of responses)assert.deepEqual(await r.json(),{ok:true});now=30*60*1000+1;await fetch(url);assert.equal(calls,2);
});
test('429 cooldown prevents repeated calls without caching failure indefinitely',async()=>{let calls=0,now=0;const fetch=cachedFetch(async()=>{calls++;return new Response('',{status:429});},()=>now);const url='https://api.open-meteo.com/v1/forecast';await fetch(url);await fetch(url);assert.equal(calls,1);now=60001;await fetch(url);assert.equal(calls,2);});
