import http from 'node:http';
import {readFile} from 'node:fs/promises';
const endpoints = { search: 'https://geocoding-api.open-meteo.com/v1/search', weather: 'https://api.open-meteo.com/v1/forecast' };
http.createServer(async (req,res) => {
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
      const response=await fetch(upstream,{signal:AbortSignal.timeout(15000)});
      if(!response.ok) throw new Error('Météo indisponible');
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(await response.text());return;
    }
    const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/forecast.js':'forecast.js','/alerts.js':'alerts.js'};
    const file=files[url.pathname];
    if(!file) {res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8'}).end(await readFile(new URL(`./public/${file}`,import.meta.url)));
  } catch {res.writeHead(502,{'Content-Type':'application/json'}).end(JSON.stringify({error:'Service météo indisponible. Réessayez plus tard.'}));}
}).listen(process.env.PORT||3000,'0.0.0.0');
