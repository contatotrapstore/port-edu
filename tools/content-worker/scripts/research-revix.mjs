// Pauta do Revix: encontros dos próximos dias pela view pública events_public (chave pública do app).
// Cada evento vira uma fonte com link https próprio (revix.app.br/e/<id>), exigido pela validação do rascunho.
export async function revixEvents(env,transport=fetch,now=new Date()){
 const base=env.REVIX_SUPABASE_URL,key=env.REVIX_SUPABASE_ANON_KEY;
 if(!base||!key)return [];
 const until=new Date(now.getTime()+10*86400000);
 const url=new URL('/rest/v1/events_public',base);
 url.searchParams.set('select','id,title,starts_at,city,category_name,confirmed_count,is_free,price_info,organizer_name');
 url.searchParams.set('and',`(starts_at.gte.${now.toISOString()},starts_at.lte.${until.toISOString()})`);
 url.searchParams.set('order','starts_at.asc');url.searchParams.set('limit','12');
 let rows;
 try{const r=await transport(url,{headers:{apikey:key,Authorization:'Bearer '+key},signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error();rows=await r.json();}
 catch{throw Error('sources_unavailable');}
 if(!Array.isArray(rows))return [];
 const quando=d=>new Date(d).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',weekday:'long',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
 return rows.filter(e=>/^[0-9a-f-]{8,40}$/i.test(String(e.id))&&e.title).map(e=>({
  url:`https://revix.app.br/e/${e.id}`,
  title:String(e.title).slice(0,160),
  body:[quando(e.starts_at),e.city,e.category_name,e.organizer_name&&'por '+e.organizer_name,e.confirmed_count>0?e.confirmed_count+' confirmados':null,e.is_free?'gratuito':e.price_info].filter(Boolean).join(' · ').slice(0,400),
  publishedAt:e.starts_at,publisher:'Revix',fetchedAt:now.toISOString(),
 }));
}
