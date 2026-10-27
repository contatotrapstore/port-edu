const repositories=['openai/codex','anthropics/claude-code','google-gemini/gemini-cli','microsoft/autogen','github/github-mcp-server','microsoft/playwright-mcp','modelcontextprotocol/typescript-sdk','vercel/ai','huggingface/transformers','openai/openai-python','anthropics/anthropic-sdk-python'];
export function validateEngine(engine){if(!['codex','claude'].includes(engine))throw Error('Invalid engine');return engine;}
export function impactScore(item){
 const lines=(item.title+'\n'+item.body).split(/\n/).filter(line=>/\b(vulnerabilit\w*|security advisory|remote code execution|credential leak|data loss|deprecat\w*)\b/i.test(line)||!/^\s*[-*]?\s*(fix(?:ed|es|ing)?|chore|docs|ci|test|deps|refactor|bump)(?:[(:!\s])/i.test(line));
 const text=lines.join(' ').toLowerCase();
 const developer=/\b(mcp|api|model|agent|codex|claude|gemini|inference|tool|coding|reasoning|context|token|browser|deployment)\b/.test(text);
 const substantive=/\b(introduc(?:e|es|ing)|launch(?:ed)?|new|add(?:ed|s)? support|feat(?:ure)?|breaking|deprecat\w*|security advisory|vulnerabilit\w*|pricing|latency|multimodal|streaming|structured output|tool calling)\b/.test(text);
 if(!developer||!substantive)return 0;
 let score=4;
 if(/\b(model|mcp|api|tool calling|structured output)\b/.test(text))score+=2;
 if(/\b(pricing|cost|latency|context window|breaking|vulnerabilit\w*|deprecat\w*)\b/.test(text))score+=2;
 return score;
}
export function selectCandidates(items,used,now=Date.now()){
 const seen=new Set(used);
 return items.filter(item=>{
  const time=Date.parse(item.publishedAt);
  if(item.prerelease||!Number.isFinite(time)||time>now||now-time>14*86400000||!repositories.some(repo=>item.url.startsWith(`https://github.com/${repo}/releases/tag/`))||seen.has(item.url))return false;
  if(impactScore(item)<4)return false;seen.add(item.url);return true;
 }).map(item=>({...item,editorialImpactScore:impactScore(item),popularityVerified:false})).sort((a,b)=>b.editorialImpactScore-a.editorialImpactScore||Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,6);
}
export async function research(used=[]){
 const results=await Promise.allSettled(repositories.map(async repo=>{
  const response=await fetch(`https://api.github.com/repos/${repo}/releases?per_page=5`,{headers:{Accept:'application/vnd.github+json','User-Agent':'EDevsHub-Content-Studio'},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('source_unavailable');
  const entries=await response.json();
  return entries.filter(r=>!r.draft).map(r=>({title:String(r.name||r.tag_name).slice(0,200),url:r.html_url,publishedAt:r.published_at,body:String(r.body||'').slice(0,6000),prerelease:r.prerelease,publisher:repo,fetchedAt:new Date().toISOString()}));
 }));
 if(results.every(r=>r.status==='rejected'))throw Error('sources_unavailable');
 return selectCandidates(results.flatMap(r=>r.status==='fulfilled'?r.value:[]),used).slice(0,2);
}
