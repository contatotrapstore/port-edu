import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseEnv} from 'node:util';
import {spawn} from 'node:child_process';
import pg from 'pg';
import {research,articleSources} from './research.mjs';
import {revixEvents} from './research-revix.mjs';
import {enqueueDaily,claimResearch,saveGeneratedDraft} from './research-queue.mjs';
import {subscriptionEnv,validateDraft} from './draft-generation.mjs';
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const env=parseEnv(fs.readFileSync(path.join(repo,'.env.local'),'utf8'));
const url=new URL(env.CONTENT_DATABASE_URL);for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
const pool=new pg.Pool({connectionString:url.href,ssl:{rejectUnauthorized:true,ca:env.CONTENT_DATABASE_CA},max:2,statement_timeout:15000,connectionTimeoutMillis:10000});
const NOVIDADE='Escolha a mudança de maior impacto prático para devs e vibe coders: MCPs, APIs, modelos, agentes e ferramentas de desenvolvimento. Explique o que muda, quem consegue usar agora, um caso concreto e um limite. Não faça notícia de correção pequena.';
const EDUCATIVO='Não houve notícia com sinal suficiente de impacto. Crie um tutorial ou comparação educativa útil para devs e vibe coders sobre MCPs, APIs e agentes, sem apresentar como lançamento ou tendência e sem repetir temas recentes.';
// Dia da semana em Brasília (0 = domingo) e data local, para o calendário da marca
function hoje(tz='America/Sao_Paulo'){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',weekday:'short'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return {data:`${p.year}-${p.month}-${p.day}`,dia:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday)};}
function generate(root,input,format){
 const file=path.join(root,`input-${format}.json`),out=path.join(root,`draft-${format}.json`);
 fs.writeFileSync(file,JSON.stringify({...input,format}));
 return new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,[path.join(repo,'tools/content-worker/scripts/generate-child.mjs'),file,out],{cwd:root,env:subscriptionEnv(process.env),windowsHide:true,stdio:'ignore'});
  child.once('error',reject);child.once('close',code=>code===0?resolve(JSON.parse(fs.readFileSync(out,'utf8'))):reject(Error('generation_failed')));
 });
}
let run;
try{
 await enqueueDaily(pool);run=await claimResearch(pool);
 if(run){
  const recent=(await pool.query('select p.topic,r.source_refs from content_studio.posts p join content_studio.revisions r on r.id=p.active_revision_id where p.brand_id=$1 order by p.created_at desc limit 30',[run.brand_id])).rows;
  const used=recent.flatMap(r=>r.source_refs);
  const brand=(await pool.query('select handle,guidelines from content_studio.brands where id=$1',[run.brand_id])).rows[0]||{handle:'edevshub',guidelines:{}},g=brand.guidelines||{};
  const {data,dia}=hoje();
  // pauta planejada do dia (calendário em brands.guidelines.plan) tem prioridade sobre a pesquisa
  const plano=g.plan?.[data];
  // dia já agendado à mão: fecha a rodada sem gerar nada (não gasta a assinatura)
  if(plano?.skip||g.production==='manual-only'){await pool.query("update content_studio.research_runs set state='succeeded',lease_token=null,lease_until=null where id=$1 and lease_token=$2 and state='running'",[run.id,run.lease_token]);console.log(JSON.stringify({researched:false,skipped:data}));run=null;}
  else{
  let sources,topic;
  if(plano){sources=await articleSources(plano.sources||[]);topic=plano.topic;}
  else if(g.research?.source==='revix-events'){sources=(await revixEvents(env)).filter(s=>!used.includes(s.url));topic=(sources.length?g.research?.topic:g.research?.fallback_topic)||'Crie um conteúdo útil para o público da marca.';}
  else{sources=await research(used);topic=sources.length?NOVIDADE:EDUCATIVO;}
  const marca=brand.handle==='edevshub'?undefined:{name:g.name||brand.handle,about:g.about,audience:g.audience,tone:g.tone,rules:g.rules,cta:g.cta,hashtags:g.hashtags};
  // formatos do dia: plano > cadência da marca > só carrossel (comportamento antigo)
  const cad=g.cadence||{carousel:[0,1,2,3,4,5,6]};
  const formatos=(plano?.formats||['reel','carousel'].filter(f=>(cad[f]||[]).includes(dia)));
  if(!formatos.length)formatos.push('carousel');
  const root=path.join(repo,'output/conteudo/research',run.id);fs.mkdirSync(root,{recursive:true});
  const input={engine:run.engine,brand:marca,topic,sources,recentTopics:recent.map(r=>r.topic),angle:plano?.angle};
  const drafts=[];
  for(const format of formatos){
   const generated=await generate(root,input,format);
   drafts.push({format,draft:{...validateDraft(generated,sources.map(s=>s.url)),generation:generated.generation}});
  }
  const db=await pool.connect();
  try{await db.query('begin');const posts=[];
   for(const [i,d] of drafts.entries())posts.push(await saveGeneratedDraft(db,run,d.draft,sources,{format:d.format,finish:i===drafts.length-1}));
   await db.query('commit');console.log(JSON.stringify({researched:true,posts,formats:formatos,planned:!!plano,published:false}));
  }catch(e){await db.query('rollback');throw e;}finally{db.release();}
  }
 }
}catch(e){
 if(run)await pool.query("update content_studio.research_runs set state='failed',error_code=$3,lease_token=null,lease_until=null where id=$1 and lease_token=$2 and state='running'",[run.id,run.lease_token,['sources_unavailable','generation_failed'].includes(e.message)?e.message:'research_failed']).catch(()=>{});
 console.error('Pesquisa interrompida; confira sessão, fontes e limite. Nenhuma publicação.');process.exitCode=1;
}finally{await pool.end();}
