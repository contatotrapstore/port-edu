const repositories=['openai/codex','anthropics/claude-code','google-gemini/gemini-cli','microsoft/autogen','github/github-mcp-server','microsoft/playwright-mcp','modelcontextprotocol/typescript-sdk','vercel/ai','huggingface/transformers','openai/openai-python','anthropics/anthropic-sdk-python'];
// Blogs e changelogs oficiais (RSS/Atom): onde saem os lançamentos que viram pauta; GitHub releases continuam valendo
export const FEEDS=[
 {publisher:'GitHub',url:'https://github.blog/changelog/feed/'},
 {publisher:'OpenAI',url:'https://openai.com/news/rss.xml'},
 {publisher:'Google Developers',url:'https://developers.googleblog.com/feeds/posts/default'},
 {publisher:'Google',url:'https://blog.google/technology/ai/rss/'},
 {publisher:'Hugging Face',url:'https://huggingface.co/blog/feed.xml'},
 {publisher:'Vercel',url:'https://vercel.com/atom'},
 {publisher:'Cloudflare',url:'https://blog.cloudflare.com/rss/'},
];
const limpa=t=>String(t||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;|&rsquo;/g,"'").replace(/&quot;/g,'"').replace(/&#(\d+);/g,(m,n)=>String.fromCharCode(Number(n))).replace(/\s+/g,' ').trim();
const campo=(x,t)=>{const m=x.match(new RegExp('<'+t+'[^>]*>([\\s\\S]*?)</'+t+'>'));return m?m[1]:'';};
export function parseFeed(xml,publisher,fetchedAt=new Date().toISOString()){
 return [...String(xml).matchAll(/<(item|entry)[\s>][\s\S]*?<\/(?:item|entry)>/g)].map(m=>m[0]).map(x=>({
  title:limpa(campo(x,'title')).slice(0,200),
  url:(x.match(/<link[^>]*href="([^"]+)"/)||[])[1]||limpa(campo(x,'link')),
  publishedAt:new Date(Date.parse(limpa(campo(x,'pubDate')||campo(x,'published')||campo(x,'updated')))||0).toISOString(),
  body:limpa(campo(x,'description')||campo(x,'summary')||campo(x,'content')).slice(0,3000),
  publisher,official:true,fetchedAt,
 })).filter(i=>/^https:\/\//.test(i.url)&&i.title);
}
async function feedItems(){
 const r=await Promise.allSettled(FEEDS.map(async f=>{const x=await fetch(f.url,{headers:{'User-Agent':'Mozilla/5.0 EDevsHub-Content-Studio'},signal:AbortSignal.timeout(15000)});if(!x.ok)throw Error('feed');return parseFeed(await x.text(),f.publisher);}));
 return r.flatMap(v=>v.status==='fulfilled'?v.value:[]);
}
// texto do artigo escolhido (o resumo do feed é curto demais para o roteiro)
async function articleText(url){
 try{const x=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 EDevsHub-Content-Studio'},signal:AbortSignal.timeout(15000)});if(!x.ok)return '';const h=await x.text();const corpo=(h.match(/<article[\s\S]*?<\/article>/i)||h.match(/<main[\s\S]*?<\/main>/i)||[h])[0];return limpa(corpo).slice(0,6000);}catch{return '';}
}
// Pauta planejada: as páginas indicadas no calendário viram as fontes do rascunho
export async function articleSources(urls){
 const out=[];
 for(const url of urls.filter(u=>/^https:\/\//.test(u)).slice(0,4)){
  let title=url;try{const x=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 EDevsHub-Content-Studio'},signal:AbortSignal.timeout(15000)});if(x.ok){const h=await x.text();title=limpa((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||url).slice(0,200);}}catch{}
  const body=await articleText(url);
  if(body)out.push({title,url,publishedAt:new Date().toISOString(),body,publisher:new URL(url).hostname,official:true,fetchedAt:new Date().toISOString()});
 }
 if(!out.length)throw Error('sources_unavailable');
 return out;
}
export function validateEngine(engine){if(!['codex','claude'].includes(engine))throw Error('Invalid engine');return engine;}
export function impactScore(item){
 const lines=(item.title+'\n'+item.body).split(/\n/).filter(line=>/\b(vulnerabilit\w*|security advisory|remote code execution|credential leak|data loss|deprecat\w*)\b/i.test(line)||!/^\s*[-*]?\s*(fix(?:ed|es|ing)?|chore|docs|ci|test|deps|refactor|bump)(?:[(:!\s])/i.test(line));
 const text=lines.join(' ').toLowerCase();
 const developer=/\b(mcp|api|model|agent|codex|claude|gemini|inference|tool|coding|reasoning|context|token|browser|deployment)\b/.test(text);
 const substantive=/\b(introduc(?:e|es|ing)|launch(?:ed)?|new|generally available|now available|rolling out|public preview|you can now|add(?:ed|s)? support|feat(?:ure)?|breaking|deprecat\w*|security advisory|vulnerabilit\w*|pricing|latency|multimodal|streaming|structured output|tool calling)\b/.test(text);
 if(!developer||!substantive)return 0;
 let score=4;
 if(/\b(model|mcp|api|tool calling|structured output)\b/.test(text))score+=2;
 if(/\b(pricing|cost|latency|context window|breaking|vulnerabilit\w*|deprecat\w*)\b/.test(text))score+=2;
 return score;
}
// peso extra: fontes que o público acompanha e temas que ele procura (agentes, assistentes de código, MCP)
export function relevancia(item){
 let p=0;if(['GitHub','OpenAI','Google Developers','Google','Anthropic'].includes(item.publisher))p+=3;
 if(/\b(copilot|agents?|mcp|codex|claude|gemini|gpt|cursor|vibe ?coding)\b/i.test(item.title))p+=3;else if(/\b(copilot|agents?|mcp|codex|claude|gemini|gpt)\b/i.test(item.body))p+=1;
 return p;
}
export function selectCandidates(items,used,now=Date.now()){
 const seen=new Set(used);
 return items.filter(item=>{
  const time=Date.parse(item.publishedAt);
  const oficial=item.official&&FEEDS.some(f=>item.url.startsWith(new URL(f.url).origin));
  if(item.prerelease||!Number.isFinite(time)||time>now||now-time>(oficial?4:14)*86400000||!(oficial||repositories.some(repo=>item.url.startsWith(`https://github.com/${repo}/releases/tag/`)))||seen.has(item.url))return false;
  if(impactScore(item)<4)return false;seen.add(item.url);return true;
 }).map(item=>({...item,editorialImpactScore:impactScore(item)+relevancia(item),popularityVerified:false})).sort((a,b)=>b.editorialImpactScore-a.editorialImpactScore||Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,6);
}
export async function research(used=[]){
 const results=await Promise.allSettled(repositories.map(async repo=>{
  const response=await fetch(`https://api.github.com/repos/${repo}/releases?per_page=5`,{headers:{Accept:'application/vnd.github+json','User-Agent':'EDevsHub-Content-Studio'},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('source_unavailable');
  const entries=await response.json();
  return entries.filter(r=>!r.draft).map(r=>({title:String(r.name||r.tag_name).slice(0,200),url:r.html_url,publishedAt:r.published_at,body:String(r.body||'').slice(0,6000),prerelease:r.prerelease,publisher:repo,fetchedAt:new Date().toISOString()}));
 }));
 const feeds=await feedItems();
 if(results.every(r=>r.status==='rejected')&&!feeds.length)throw Error('sources_unavailable');
 const escolhidos=selectCandidates([...results.flatMap(r=>r.status==='fulfilled'?r.value:[]),...feeds],used).slice(0,3);
 for(const item of escolhidos)if(item.official){const texto=await articleText(item.url);if(texto.length>item.body.length)item.body=texto;}
 return escolhidos;
}
