import {test} from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createServer} from '../server.js';
async function request(t,upstream,path='/api/search?name=Paris'){
 const server=createServer(upstream);server.listen(0,'127.0.0.1');await once(server,'listening');t.after(()=>new Promise(resolve=>server.close(resolve)));return fetch(`http://127.0.0.1:${server.address().port}${path}`);
}
test('search forwards city and returns results',async t=>{
 const r=await request(t,async url=>{assert.equal(url.hostname,'geo.api.gouv.fr');assert.equal(url.searchParams.get('nom'),'Paris');return Response.json([{nom:'Paris',code:'75056',centre:{coordinates:[2.35,48.85]}}]);});
 assert.equal(r.status,200);assert.equal((await r.json()).results[0].name,'Paris');
});
test('upstream quota is distinguished from client connectivity',async t=>{const r=await request(t,async()=>new Response('',{status:429}));assert.equal(r.status,429);assert.equal((await r.json()).code,'UPSTREAM_429');});
test('upstream access denial is reported',async t=>{const r=await request(t,async()=>new Response('',{status:403}));assert.equal(r.status,502);assert.equal((await r.json()).code,'UPSTREAM_403');});
test('DNS errors produce safe server connection error',async t=>{const r=await request(t,async()=>{throw new TypeError('fetch failed',{cause:{code:'EAI_AGAIN'}});});assert.equal(r.status,502);assert.equal((await r.json()).code,'UPSTREAM_CONNECTION');});
test('timeouts are reported separately',async t=>{const r=await request(t,async()=>{throw new DOMException('timeout','TimeoutError');});assert.equal(r.status,504);assert.equal((await r.json()).code,'UPSTREAM_TIMEOUT');});
