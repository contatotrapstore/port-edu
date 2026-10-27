const repositories=['openai/codex','anthropics/claude-code','google-gemini/gemini-cli','microsoft/autogen'];
export function validateEngine(engine){if(!['codex','claude'].includes(engine))throw Error('Invalid engine');return engine;}
export function selectCandidates(items,used,now=Date.now()){
 const seen=new Set(used);
 return items.filter(item=>{
  const time=Date.parse(item.publishedAt);
  if(item.prerelease||!Number.isFinite(time)||time>now||now-time>14*86400000||!repositories.some(repo=>item.url.startsWith(`https://github.com/${repo}/releases/tag/`))||seen.has(item.url))return false;
  seen.add(item.url);return true;
 }).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,6);
}
export async function research(used=[]){
 const results=await Promise.allSettled(repositories.map(async repo=>{
  const response=await fetch(`https://api.github.com/repos/${repo}/releases/latest`,{headers:{Accept:'application/vnd.github+json','User-Agent':'EDevsHub-Content-Studio'},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('source_unavailable');
  const entries=[await response.json()];
  return entries.filter(r=>!r.draft).map(r=>({title:String(r.name||r.tag_name).slice(0,200),url:r.html_url,publishedAt:r.published_at,body:String(r.body||'').slice(0,6000),prerelease:r.prerelease,publisher:repo,fetchedAt:new Date().toISOString()}));
 }));
 if(results.every(r=>r.status==='rejected'))throw Error('sources_unavailable');
 return selectCandidates(results.flatMap(r=>r.status==='fulfilled'?r.value:[]),used).slice(0,2);
}
