import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const endpoints = { search: 'https://geocoding-api.open-meteo.com/v1/search', weather: 'https://api.open-meteo.com/v1/forecast' };
export function createServer(fetchUpstream=fetch) {
return http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      const kind=url.pathname.slice(5);
      if (!endpoints[kind]) {res.writeHead(404).end();return;}
      const upstream=new URL(endpoints[kind]);
      if(kind==='search') {
        const name=url.searchParams.get('name')?.trim();
        if(!name || name.length>120) {res.writeHead(400).end('Lieu invalide');return;}
        upstream.search=new URLSearchParams({name,count:'6',language:'fr',format:'json'});
      } else {
        const lat=Number(url.searchParams.get('latitude')),lon=Number(url.searchParams.get('longitude'));
        if(!url.searchParams.has('latitude') || !url.searchParams.has('longitude') || !Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180) {res.writeHead(400).end('Coordonnées invalides');return;}
        upstream.search=new URLSearchParams({latitude:String(lat),longitude:String(lon),daily:'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',hourly:'relative_humidity_2m',past_days:'14',forecast_days:'16',timezone:'auto'});
      }
      const response=await fetchUpstream(upstream,{signal:AbortSignal.timeout(15000)});
      if(!response.ok) {
        console.error(JSON.stringify({event:'upstream_http_error',service:kind,status:response.status}));
        const message=response.status===429
          ? 'Le service Open-Meteo a atteint sa limite de requêtes. Réessayez plus tard.'
          : response.status===403
          ? 'Le service Open-Meteo refuse l’accès depuis le serveur. Une vérification de l’hébergement est nécessaire.'
          : 'Le service Open-Meteo est temporairement indisponible. Réessayez plus tard.';
        res.writeHead(response.status===429?429:502,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify({error:message,code:`UPSTREAM_${response.status}`}));return;
      }
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(await response.text());return;
    }
    const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/forecast.js':'forecast.js','/alerts.js':'alerts.js'};
    const file=files[url.pathname];
    if(!file) {res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8'}).end(await readFile(new URL(`./public/${file}`,import.meta.url)));
  } catch(error) {
    console.error(JSON.stringify({event:'request_failed',type:error.name,code:error.cause?.code||error.code||'UNKNOWN'}));
    const timeout=error.name==='TimeoutError';
    res.writeHead(timeout?504:502,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify({error:timeout?'Le service Open-Meteo met trop de temps à répondre. Réessayez.':'Le serveur ne parvient pas à joindre Open-Meteo. Réessayez plus tard.',code:timeout?'UPSTREAM_TIMEOUT':'UPSTREAM_CONNECTION'}));
  }
});
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)createServer().listen(process.env.PORT||3000,'0.0.0.0');
