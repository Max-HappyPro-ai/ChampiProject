// L'API publique Open-Meteo accepte les requêtes CORS sans clé.
// Accès direct pour éviter de mutualiser tous les visiteurs derrière l'hébergeur.
export async function fetchWeather(place,fetchImpl=fetch) {
 const url=new URL('https://api.open-meteo.com/v1/forecast');
 url.search=new URLSearchParams({latitude:String(place.latitude),longitude:String(place.longitude),daily:'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',hourly:'relative_humidity_2m',past_days:'14',forecast_days:'16',timezone:'auto'});
 let response;
 try{response=await fetchImpl(url,{signal:AbortSignal.timeout(15000)});}
 catch{throw Error('Impossible de joindre la météo depuis votre navigateur. Vérifiez votre connexion ou les extensions de blocage, puis réessayez.');}
 if(response.status===429)throw Error('Open-Meteo limite actuellement les requêtes de votre connexion. Patientez avant de réactualiser.');
 if(!response.ok)throw Error(`La météo est temporairement indisponible (HTTP ${response.status}). Réessayez plus tard.`);
 const data=await response.json();
 if(!data.daily?.time?.length || !data.hourly?.time?.length)throw Error('Les données météo reçues sont incomplètes. Réessayez plus tard.');
 return data;
}
