import {test} from 'node:test';
import assert from 'node:assert/strict';
import {automaticSchedule,publicationTick} from '../../../src/lib/content/publication-queue.mjs';
import {fingerprint} from '../../../src/lib/content/publication-policy.mjs';
test('automatic scheduling only selects carousel revisions',async()=>{
 let query='';await automaticSchedule({query:async sql=>{if(sql.includes('select *,'))return {rows:[{brand_id:'b'}]};query=sql;return {rows:[]};}});
 assert.match(query,/brief\s*->>\s*'format'/);assert.match(query,/'carousel'/);
});
for(const format of ['reel','story'])test(`queue propagates ${format} from revision through eligibility and provider`,async()=>{
 const assets=[{id:'a',sha256:'x',kind:'mp4',object_key:'v.mp4',provenance:{format,slide:1,width:1080,height:1920,duration:30,qa:'vertical-layout-audio-passed'}}];const hash=fingerprint(assets);let scheduleSQL='',provider=[];
 const db={query:async sql=>{
  if(sql.includes("state in ('publishing','unknown')"))return {rows:[]};
  if(sql.startsWith('select * from content_studio.settings'))return {rows:[{publication_enabled:true,publication_mode:'approved',brand_id:'b'}]};
  if(sql.startsWith('select health'))return {rows:[{health:'verified',expires_at:'2099-01-01'}]};
  if(sql.startsWith('select s.*,p.id')){scheduleSQL=sql;return {rows:[{id:'s',post_id:'p',revision_id:'r',active_revision_id:'r',format,slides:['a','b'],caption:'Text',asset_fingerprint:hash,approval_mode:'approved',due:false}]};}
  if(sql.startsWith('select id,sha256'))return {rows:assets};
  if(sql.startsWith('select metadata'))return {rows:[{metadata:{decision:'approved',assetFingerprint:hash}}]};
  if(sql.startsWith('select active_revision_id'))return {rows:[{active_revision_id:'r',state:'ready'}]};
  if(sql.startsWith('select * from content_studio.publications'))return {rows:[{id:'u',state:'creating',provider_container_ids:{}}]};
  if(sql.startsWith('select t.publication_enabled'))return {rows:[{publication_enabled:true,state:'scheduled',publication_mode:'approved'}]};
  return {rows:[]};
 }};
 const result=await publicationTick(db,{api:async(e,p,m)=>{provider.push({e,p,m});return {id:'123'};},sign:async()=> 'https://example.test/video.mp4'});
 assert.equal(result.state,'preparing');assert.equal(provider.length,1);assert.equal(provider[0].p.media_type,format==='reel'?'REELS':'STORIES');assert.match(scheduleSQL,/r\.brief\s*->>\s*'format'/);
});
test('uncertain sends reconcile read-only while later schedules remain eligible',async()=>{
 const {PGlite}=await import('@electric-sql/pglite');
 const sql=[];const requests=[];
 await publicationTick({query:async query=>{
  sql.push(query);
  if(query.startsWith('select id,revision_id'))return {rows:[{id:'u1',revision_id:'r1',provider_container_ids:{parent:'100'}}]};
  if(query.startsWith('select * from content_studio.settings'))return {rows:[{publication_enabled:true,publication_mode:'approved'}]};
  if(query.startsWith('select health'))return {rows:[{health:'verified',expires_at:'2099-01-01'}]};
  return {rows:[]};
 }},{api:async(e,p,m)=>{requests.push({e,m});return {status_code:'FINISHED'};},sign:async()=>{throw Error('must not sign uncertain media');}});
 assert.deepEqual(requests,[{e:'100',m:'GET'}]);
 const db=new PGlite();try{
  await db.exec(`set time zone 'UTC';create schema content_studio;
   create table content_studio.posts(id text,active_revision_id text,state text);
   create table content_studio.revisions(id text,post_id text,slides jsonb,caption text,brief jsonb);
   create table content_studio.publications(revision_id text,account_id text,state text);
   create table content_studio.schedules(id text,revision_id text,account_id text,state text,local_date date,local_time time,timezone text);
   insert into content_studio.posts values('p1','r1','publishing_unknown'),('p2','r2','publishing'),('p3','r3','ready');
   insert into content_studio.revisions values('r1','p1','[]','x','{}'),('r2','p2','[]','x','{}'),('r3','p3','[]','x','{}');
   insert into content_studio.publications values('r1','account','unknown'),('r2','account','publishing');
   insert into content_studio.schedules select 's1','r1','account','scheduled',(now()-interval '40 minutes')::date,(now()-interval '40 minutes')::time,'UTC';
   insert into content_studio.schedules select 's2','r2','account','scheduled',(now()-interval '30 minutes')::date,(now()-interval '30 minutes')::time,'UTC';
   insert into content_studio.schedules select 's3','r3','account','scheduled',now()::date,now()::time,'UTC';`);
  await db.query(sql.find(q=>q.startsWith("update content_studio.schedules s set state='missed'")),['account']);
  const next=await db.query(sql.find(q=>q.startsWith('select s.*,p.id')),['account']);
  assert.equal(next.rows[0]?.id,'s3');
  assert.deepEqual((await db.query("select state from content_studio.schedules where id in ('s1','s2') order by id")).rows.map(r=>r.state),['scheduled','scheduled']);
  assert.deepEqual((await db.query('select state from content_studio.publications order by revision_id')).rows.map(r=>r.state),['unknown','publishing']);
 }finally{await db.close();}
});

