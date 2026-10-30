// Trusted local worker. Renders one queued revision; never calls Meta or publishes.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseEnv} from 'node:util';
import {createHash} from 'node:crypto';
import {spawn,spawnSync} from 'node:child_process';
import pg from 'pg';
import {createClient} from '@supabase/supabase-js';
import {createRenderQueue} from './queue.mjs';
import {composeProject} from './composer.mjs';
import {subscriptionEnv} from './draft-generation.mjs';
import {motionItem} from '../motion/from-revision.mjs';
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const env=parseEnv(fs.readFileSync(path.join(repo,'.env.local'),'utf8'));
const url=new URL(env.CONTENT_DATABASE_URL);for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
const pool=new pg.Pool({connectionString:url.href,ssl:{rejectUnauthorized:true,ca:env.CONTENT_DATABASE_CA},max:3,statement_timeout:15000,connectionTimeoutMillis:10000});
const queue=createRenderQueue(pool);
let job,timer,child,lost=false;
function stopChild(){if(child?.pid&&child.exitCode===null){if(process.platform==='win32')spawnSync('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});else child.kill();}}
function run(exe,args,cwd,extraEnv={}){return new Promise((resolve,reject)=>{
 if(lost)return reject(Error('lease_lost'));
 child=spawn(exe,args,{cwd,env:{...subscriptionEnv(process.env),...extraEnv},windowsHide:true,stdio:['ignore','pipe','pipe']});
 child.stdout.on('data',()=>{});child.stderr.on('data',()=>{});
 const timeout=setTimeout(()=>{stopChild();reject(Error('render_timeout'));},20*60*1000);
 child.once('error',()=>{clearTimeout(timeout);reject(Error('process_start_failed'));});
 child.once('close',code=>{clearTimeout(timeout);if(code!==0||lost)reject(Error('render_failed'));else resolve();});
});}
try{
 job=await queue.claim();
 if(!job){console.log('Nenhum render pendente.');}
 else{
  let checking=false;
  timer=setInterval(async()=>{if(checking)return;checking=true;try{if(!await queue.heartbeat(job.id,job.lease_token)){lost=true;stopChild();}}catch{lost=true;stopChild();}finally{checking=false;}},25000);
  const revision=(await pool.query('select slides,brief from content_studio.revisions where id=$1',[job.revision_id])).rows[0];
  const format=Object.hasOwn(revision.brief||{},'format')?revision.brief.format:'carousel';
  if(!['carousel','reel','story'].includes(format))throw Error('invalid_format');
  const vertical=format!=='carousel';
  const root=vertical?path.join(repo,'output/conteudo',`job-${job.id}-${job.attempts}`):composeProject(job,revision.slides),render=path.join(repo,'tools/content-worker/scripts/render.mjs');
  let verticalQa;
  const voiceFile=path.join(repo,'.env.elevenlabs.local');
  const voiceEnv=fs.existsSync(voiceFile)?parseEnv(fs.readFileSync(voiceFile,'utf8')):{};
  const allowedVoice=new Set(['ELEVENLABS_API_KEY','ELEVENLABS_VOICE_ID','ELEVENLABS_MODEL_ID','ELEVENLABS_VOICE_NAME','CONTENT_VOICE_PROVIDER']);
  const privateVoiceEnv=Object.fromEntries(Object.entries(voiceEnv).filter(([key])=>allowedVoice.has(key)));
  if(vertical){
   // Motor de motion v3: cenas sincronizadas à voz, trilha exclusiva, efeitos variados e loudness único
   fs.mkdirSync(root,{recursive:true});
   fs.writeFileSync(path.join(root,'content.json'),JSON.stringify({series:'RADAR IA',items:[motionItem({...revision,id:job.revision_id},format,{id:'post'})]}));
   await run(process.execPath,[path.join(repo,'tools/content-worker/motion/produce.mjs'),'--project',root],repo,privateVoiceEnv);
   const result=JSON.parse(fs.readFileSync(path.join(root,'qa.json'),'utf8')).find(r=>r.id==='post'),file=result?.files?.[0];
   verticalQa={...result?.provenance,qa:result?.qa,format,width:file?.probe?.streams?.find(s=>s.codec_name==='h264')?.width,height:file?.probe?.streams?.find(s=>s.codec_name==='h264')?.height,duration:file?.duration,lufs:file?.lufs,true_peak:file?.true_peak};
   if(verticalQa.qa!=='vertical-layout-audio-passed'||verticalQa.width!==1080||verticalQa.height!==1920||!Number.isFinite(verticalQa.duration)||verticalQa.duration<3||verticalQa.duration>(format==='story'?60:90))throw Error('vertical_qa_failed');
  }else{
   for(const mode of ['stills','cues','qa']){await run(process.execPath,[render,'--project',root,'--mode',mode],repo);console.log('Concluído: '+mode);}
   await run(path.join(repo,'tools/content-worker/.venv/Scripts/python.exe'),[path.join(root,'scripts/musica.py')],root);
   await run(process.execPath,[render,'--project',root,'--mode','video'],repo);
  }
  if(lost)throw Error('lease_lost');
  const storage=createClient(env.NEXT_PUBLIC_CONTENT_SUPABASE_URL,env.CONTENT_SUPABASE_STORAGE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  const assets=[];
  for(let slide=1;slide<=(vertical?1:revision.slides.length);slide++)for(const kind of ['mp4','png']){
   const id=String(slide).padStart(2,'0'),file=vertical?path.join(root,'post',`slide-${id}.${kind}`):path.join(root,'resultados',kind==='png'?'estatico':'',`slide-${id}.${kind}`),data=fs.readFileSync(file);
   const hash=createHash('sha256').update(data).digest('hex'),key=`${job.revision_id}/${job.id}-${job.attempts}-${id}-${hash.slice(0,16)}.${kind}`;
   if(lost)throw Error('lease_lost');
   const {error}=await storage.storage.from('content-studio').upload(key,data,{contentType:kind==='mp4'?'video/mp4':'image/png',upsert:false});
   if(error)throw Error('upload_failed');
   assets.push({kind,key,hash,slide});
  }
  const db=await pool.connect();
  try{await db.query('begin');
   const current=(await db.query('select p.id from content_studio.posts p where p.active_revision_id=$1 for update',[job.revision_id])).rows[0];
   if(!current||lost)throw Error('revision_changed');
   const valid=await createRenderQueue(db).finish(job.id,job.lease_token);if(!valid)throw Error('lease_lost');
   if((await db.query('select id from content_studio.assets where revision_id=$1 limit 1',[job.revision_id])).rows.length)throw Error('assets_already_exist');
   for(const asset of assets)await db.query('insert into content_studio.assets(revision_id,kind,object_key,sha256,provenance) values($1,$2,$3,$4,$5)',[job.revision_id,asset.kind,asset.key,asset.hash,JSON.stringify(vertical?{...verticalQa,slide:1,jobId:job.id,template:'motion-v3'}:{slide:asset.slide,jobId:job.id,template:'storyboard-v2',width:1080,height:1350,qa:'loop-layout-determinism-passed'})]);
   await db.query("update content_studio.posts set state='review' where id=$1",[current.id]);
   await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values('local-worker',$1,'render.completed',$2)",[current.id,JSON.stringify({revisionId:job.revision_id,jobId:job.id,assets:assets.length})]);
   await db.query('commit');console.log(JSON.stringify({rendered:true,assets:assets.length,published:false}));
  }catch(error){await db.query('rollback');throw error;}finally{db.release();}
 }
}catch{
 stopChild();
 if(job)await pool.query("update content_studio.jobs set state='failed',lease_token=null,lease_until=null,error=$3 where id=$1 and lease_token=$2 and state='running'",[job.id,job.lease_token,JSON.stringify({code:lost?'lease_lost':'local_worker_failed'})]).catch(()=>{});
 console.error('Render interrompido. Nenhuma publicação realizada. Confira o job e a instalação local.');process.exitCode=1;
}finally{clearInterval(timer);await pool.end();}
