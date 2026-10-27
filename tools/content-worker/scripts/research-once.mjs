import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseEnv} from 'node:util';
import {spawn} from 'node:child_process';
import pg from 'pg';
import {research} from './research.mjs';
import {enqueueDaily,claimResearch,saveGeneratedDraft} from './research-queue.mjs';
import {subscriptionEnv,validateDraft} from './draft-generation.mjs';
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const env=parseEnv(fs.readFileSync(path.join(repo,'.env.local'),'utf8'));
const url=new URL(env.CONTENT_DATABASE_URL);for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
const pool=new pg.Pool({connectionString:url.href,ssl:{rejectUnauthorized:true,ca:env.CONTENT_DATABASE_CA},max:2,statement_timeout:15000,connectionTimeoutMillis:10000});
let run;
try{
 await enqueueDaily(pool);run=await claimResearch(pool);
 if(run){
  const recent=(await pool.query('select p.topic,r.source_refs from content_studio.posts p join content_studio.revisions r on r.id=p.active_revision_id where p.brand_id=$1 order by p.created_at desc limit 30',[run.brand_id])).rows;
  const used=recent.flatMap(r=>r.source_refs);
  const sources=await research(used);
  const root=path.join(repo,'output/conteudo/research',run.id);fs.mkdirSync(root,{recursive:true});
  const input=path.join(root,'input.json'),output=path.join(root,'draft.json');
  fs.writeFileSync(input,JSON.stringify({engine:run.engine,topic:sources.length?'Escolha a mudança de maior impacto prático para devs e vibe coders: MCPs, APIs, modelos, agentes e ferramentas de desenvolvimento. Explique o que muda, quem consegue usar agora, um caso concreto e um limite. Não faça notícia de correção pequena.':'Não houve notícia com sinal suficiente de impacto. Crie um tutorial ou comparação educativa útil para devs e vibe coders sobre MCPs, APIs e agentes, sem apresentar como lançamento ou tendência e sem repetir temas recentes.',sources,recentTopics:recent.map(r=>r.topic)}));
  await new Promise((resolve,reject)=>{
   const child=spawn(process.execPath,[path.join(repo,'tools/content-worker/scripts/generate-child.mjs'),input,output],{cwd:root,env:subscriptionEnv(process.env),windowsHide:true,stdio:'ignore'});
   child.once('error',reject);child.once('close',code=>code===0?resolve():reject(Error('generation_failed')));
  });
  const generated=JSON.parse(fs.readFileSync(output,'utf8'));
  const draft={...validateDraft(generated,sources.map(s=>s.url)),generation:generated.generation};
  const db=await pool.connect();try{await db.query('begin');const post=await saveGeneratedDraft(db,run,draft,sources);await db.query('commit');console.log(JSON.stringify({researched:true,post,published:false}));}catch(e){await db.query('rollback');throw e;}finally{db.release();}
 }
}catch(e){
 if(run)await pool.query("update content_studio.research_runs set state='failed',error_code=$3,lease_token=null,lease_until=null where id=$1 and lease_token=$2 and state='running'",[run.id,run.lease_token,['sources_unavailable','generation_failed'].includes(e.message)?e.message:'research_failed']).catch(()=>{});
 console.error('Pesquisa interrompida; confira sessão, fontes e limite. Nenhuma publicação.');process.exitCode=1;
}finally{await pool.end();}
