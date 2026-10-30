import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {publicationTick} from '../scripts/publication-queue.mjs';
import {fingerprint} from '../../../src/lib/content/publication-policy.mjs';
test('database to simulated Meta: disabled, approved schedule, complete, no replay',async()=>{
 const db=new PGlite();try{
 await db.exec('create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);');
 for(const name of ['20261027001716_content_studio_foundation.sql','20261027022714_content_research_pipeline.sql','20261027030509_content_instagram_connection.sql','20261027030945_content_publication_controls.sql','20261027035131_publisher_runtime_verified.sql'])await db.exec(fs.readFileSync(new URL('../../../supabase/migrations/'+name,import.meta.url),'utf8'));
 let requests=[],id=100;
 const deps={api:async(e,p,m)=>{requests.push({e,p,m});return m==='POST'?{id:String(id++)}:{status_code:'FINISHED'};},sign:async key=>'https://media.example.test/'+key};
 assert.equal((await publicationTick(db,deps)).state,'disabled');assert.equal(requests.length,0);
 await db.query("insert into content_studio.instagram_connections(brand_id,account_id,username,token_ciphertext,expires_at) select id,'17841416428564956','edevshub','test-only',now()+interval '30 days' from content_studio.brands");
 const post=(await db.query("insert into content_studio.posts(brand_id,topic,state) select id,'Test','review' from content_studio.brands returning id")).rows[0].id;
 const rev=(await db.query("insert into content_studio.revisions(post_id,brief,slides,caption,content_hash) values($1,'{}','[\"a\",\"b\"]','Test',$2) returning id",[post,'a'.repeat(64)])).rows[0].id;
 await db.query('update content_studio.posts set active_revision_id=$1 where id=$2',[rev,post]);
 for(const slide of [1,2])await db.query("insert into content_studio.assets(revision_id,kind,object_key,sha256,provenance) values($1,'mp4',$2,$3,$4)",[rev,`test/${slide}.mp4`,'a'.repeat(64),JSON.stringify({slide,qa:'loop-layout-determinism-passed'})]);
 const hash=fingerprint((await db.query('select * from content_studio.assets')).rows);
 await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values('test',$1,'review.recorded',$2)",[post,JSON.stringify({revisionId:rev,decision:'approved',assetFingerprint:hash})]);
 await db.query("insert into content_studio.schedules(account_id,revision_id,local_date,local_time,slot_id,state,asset_fingerprint) values('17841416428564956',$1,(now() at time zone 'America/Sao_Paulo')::date,(now() at time zone 'America/Sao_Paulo')::time,'principal','scheduled',$2)",[rev,hash]);
 await db.query('update content_studio.settings set publication_enabled=true');
 for(let i=0;i<6;i++)await publicationTick(db,deps);
 assert.equal(requests.filter(r=>r.e.endsWith('/media_publish')).length,1);
 assert.equal((await db.query('select state from content_studio.posts')).rows[0].state,'published');
 assert.equal((await db.query('select state from content_studio.schedules')).rows[0].state,'completed');
 assert.equal((await db.query('select state from content_studio.publications')).rows[0].state,'published');
 // A known container can still be reconciled after disabling, with GET only.
 await db.query("update content_studio.publications set state='unknown'");
 await db.query("update content_studio.posts set state='publishing_unknown'");
 await db.query("update content_studio.schedules set state='scheduled'");
 await db.query('update content_studio.settings set publication_enabled=false');
 let reads=0;
 await publicationTick(db,{sign:async()=>{throw Error('no signed URLs needed');},api:async(e,p,m)=>{assert.equal(m,'GET');reads++;return {status_code:'PUBLISHED'};}});
 assert.equal(reads,1);assert.equal((await db.query('select state from content_studio.publications')).rows[0].state,'published');
 }finally{await db.close();}
});
// Post pronto da Revix: carrossel de JPEG nativos, sem rótulo de IA, Collab recusado pela Meta e refeito sem convite
test('database to simulated Meta: imported image carousel publishes once and records the dropped collab',async()=>{
 const db=new PGlite();try{
  await db.exec('create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);');
  const dir=new URL('../../../supabase/migrations/',import.meta.url);
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.sql')).sort())await db.exec(fs.readFileSync(new URL(f,dir),'utf8'));
  const ACCOUNT='17841400000000001';
  const brand=(await db.query("select id from content_studio.brands where handle='revix'")).rows[0].id;
  await db.query("insert into content_studio.instagram_connections(brand_id,account_id,username,token_ciphertext,expires_at) values($1,$2,'revix.app','test-only',now()+interval '30 days')",[brand,ACCOUNT]);
  const post=(await db.query("insert into content_studio.posts(brand_id,topic,state) values($1,'Importado','review') returning id",[brand])).rows[0].id;
  const brief={text:'Post pronto',format:'carousel',production:'manual-only',ai_generated:false,collaborators:['formula.foto']};
  const rev=(await db.query("insert into content_studio.revisions(post_id,brief,slides,caption,content_hash) values($1,$2,'[\"capa\",\"carro\"]','Legenda',$3) returning id",[post,JSON.stringify(brief),'a'.repeat(64)])).rows[0].id;
  await db.query('update content_studio.posts set active_revision_id=$1 where id=$2',[rev,post]);
  for(const slide of [1,2])await db.query("insert into content_studio.assets(revision_id,kind,object_key,sha256,provenance) values($1,'jpg',$2,$3,$4)",[rev,`${rev}/imp-0${slide}.jpg`,'a'.repeat(64),JSON.stringify({format:'carousel',slide,width:1080,height:1350,publish:true,qa:'image-checked'})]);
  await db.query("insert into content_studio.assets(revision_id,kind,object_key,sha256,provenance) values($1,'png',$2,$3,$4)",[rev,`${rev}/capa.png`,'a'.repeat(64),JSON.stringify({slide:1})]);
  const hash=fingerprint((await db.query('select * from content_studio.assets where revision_id=$1',[rev])).rows);
  await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values('test',$1,'review.recorded',$2)",[post,JSON.stringify({revisionId:rev,decision:'approved',assetFingerprint:hash})]);
  await db.query("insert into content_studio.schedules(account_id,revision_id,local_date,local_time,slot_id,state,asset_fingerprint) values($1,$2,(now() at time zone 'America/Sao_Paulo')::date,(now() at time zone 'America/Sao_Paulo')::time,'principal','scheduled',$3)",[ACCOUNT,rev,hash]);
  await db.query('update content_studio.settings set publication_enabled=true where brand_id=$1',[brand]);
  let requests=[],id=500;
  const api=async(e,p,m)=>{requests.push({e,p,m});
   if(m==='POST'&&p.collaborators){const err=Error('instagram_request_rejected');Object.defineProperty(err,'provider',{enumerable:false,value:{code:100,subcode:null,text:'Invalid collaborators'}});throw err;}
   return m==='POST'?{id:String(id++)}:{status_code:'FINISHED',permalink:'https://www.instagram.com/p/x/'};};
  const deps={api,sign:async key=>'https://media.example.test/'+key,brand:{id:brand,handle:'revix',account:ACCOUNT}};
  for(let i=0;i<6;i++)await publicationTick(db,deps);
  const posts=requests.filter(r=>r.m==='POST');
  assert.deepEqual(posts.slice(0,2).map(r=>r.p),[{image_url:`https://media.example.test/${rev}/imp-01.jpg`,is_carousel_item:'true'},{image_url:`https://media.example.test/${rev}/imp-02.jpg`,is_carousel_item:'true'}]);
  assert.equal(posts[2].p.collaborators,'["formula.foto"]');
  assert.deepEqual(posts[3].p,{media_type:'CAROUSEL',children:'500,501',caption:'Legenda'});
  assert.equal(posts.filter(r=>r.e.endsWith('/media_publish')).length,1);
  assert.ok(requests.every(r=>!String(r.p?.image_url||'').endsWith('.png')));
  const pub=(await db.query('select state,provider_container_ids from content_studio.publications')).rows[0];
  assert.equal(pub.state,'published');assert.equal(pub.provider_container_ids.collaboratorsDropped,true);
  assert.deepEqual(pub.provider_container_ids.warnings,[{code:'collaborators_rejected',collaborators:['formula.foto'],providerCode:100,providerSubcode:null}]);
  const done=(await db.query("select metadata from content_studio.events where action='publication.complete'")).rows[0].metadata;
  assert.equal(done.warnings[0].code,'collaborators_rejected');
  assert.equal((await db.query('select state from content_studio.posts')).rows[0].state,'published');
 }finally{await db.close();}
});
