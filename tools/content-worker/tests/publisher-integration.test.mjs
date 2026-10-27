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

