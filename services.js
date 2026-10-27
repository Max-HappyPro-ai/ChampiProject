// Cache borné partagé par les requêtes d'un même processus, jamais de données utilisateur.
export function cachedFetch(fetchUpstream, now=Date.now) {
 const cache=new Map();
 return async (url,options)=>{
  const key=String(url),old=cache.get(key);
  if(old && old.expires>now())return (await old.promise).clone();
  if(cache.size>=500)cache.delete(cache.keys().next().value);
  const entry={expires:Infinity};
  entry.promise=(async()=>{
   try{
    const response=await fetchUpstream(url,options);
    // Consommer le corps avant stockage pour ne pas conserver de flux réseau ouverts.
    const buffered=new Response(await response.text(),{status:response.status,headers:response.headers});
    const ttl=response.ok?(new URL(url).hostname==='api.open-meteo.com'?30*60*1000:24*60*60*1000):response.status===429?60*1000:0;
    entry.expires=now()+ttl;
    if(!ttl)cache.delete(key);
    return buffered;
   }catch(error){cache.delete(key);throw error;}
  })();
  cache.set(key,entry);
  return (await entry.promise).clone();
 };
}
export async function searchPlaces(name,fetchUpstream){
 const url=new URL('https://geo.api.gouv.fr/communes');
 url.search=new URLSearchParams({nom:name,fields:'nom,code,centre,departement,region',boost:'population',limit:'6'});
 try{
  const r=await fetchUpstream(url,{signal:AbortSignal.timeout(15000)});
  if(r.ok){
   const communes=await r.json();
   if(!Array.isArray(communes))throw Error('Invalid communes response');
   const results=communes.filter(c=>Array.isArray(c.centre?.coordinates)&&c.centre.coordinates.length===2).map(c=>({id:`fr-${c.code}`,name:c.nom,latitude:c.centre.coordinates[1],longitude:c.centre.coordinates[0],elevation:null,admin2:c.departement?.nom,admin1:c.region?.nom,country:'France'}));
   if(results.length)return Response.json({results,source:'API Découpage administratif · geo.api.gouv.fr'});
  }
 }catch{/* Une panne du géocodage français ne bloque pas le fournisseur international. */}
 const fallback=new URL('https://geocoding-api.open-meteo.com/v1/search');
 fallback.search=new URLSearchParams({name,count:'6',language:'fr',format:'json'});
 return fetchUpstream(fallback,{signal:AbortSignal.timeout(15000)});
}
