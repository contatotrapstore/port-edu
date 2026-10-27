import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {createRenderQueue} from '../scripts/queue.mjs';

async function fixture(){
 const db=new PGlite();
 await db.exec('create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);');
 await db.exec(fs.readFileSync(new URL('../../../supabase/migrations/20261027001716_content_studio_foundation.sql',import.meta.url),'utf8'));
 const post=(await db.query("insert into content_studio.posts(brand_id,topic) select id,'Queue test' from content_studio.brands returning id")).rows[0].id;
 const revision=(await db.query("insert into content_studio.revisions(post_id,brief,slides,content_hash) values($1,'{}','[]',$2) returning id",[post,'a'.repeat(64)])).rows[0].id;
 await db.query('update content_studio.posts set active_revision_id=$1 where id=$2',[revision,post]);
 return {db,post,revision,queue:createRenderQueue(db)};
}
test('duplicate enqueue returns one job and two claimants cannot share its lease',async()=>{
 const {db,revision,queue}=await fixture();try{
  const a=await queue.enqueue(revision),b=await queue.enqueue(revision);assert.equal(a.id,b.id);
  const claims=await Promise.all([queue.claim(),queue.claim()]);assert.equal(claims.filter(Boolean).length,1);
  const owner=claims.find(Boolean);assert.equal(await queue.heartbeat(owner.id,owner.lease_token),true);
  assert.equal(await queue.heartbeat(owner.id,'00000000-0000-4000-8000-000000000000'),false);
 }finally{await db.close();}
});
test('expired render lease is reclaimed and old worker cannot acknowledge it',async()=>{
 const {db,revision,queue}=await fixture();try{
  await queue.enqueue(revision);const old=await queue.claim();
  await db.query("update content_studio.jobs set lease_until=now()-interval '1 minute' where id=$1",[old.id]);
  const fresh=await queue.claim();assert.equal(fresh.id,old.id);assert.notEqual(fresh.lease_token,old.lease_token);
  assert.equal(await queue.finish(old.id,old.lease_token),false);
  assert.equal(await queue.finish(fresh.id,fresh.lease_token),true);
 }finally{await db.close();}
});
test('obsolete revisions and uncertain publication jobs are never claimed as render work',async()=>{
 const {db,post,revision,queue}=await fixture();try{
  await db.query("insert into content_studio.jobs(revision_id,kind,state,lease_token,lease_until) values($1,'publish','running',gen_random_uuid(),now()-interval '1 minute')",[revision]);
  assert.equal(await queue.claim(),null);
  await queue.enqueue(revision);const job=await queue.claim();
  await db.query('update content_studio.posts set active_revision_id=null where id=$1',[post]);
  assert.equal(await queue.finish(job.id,job.lease_token),false);
  await db.query("update content_studio.jobs set lease_until=now()-interval '1 minute' where id=$1",[job.id]);
  assert.equal(await queue.claim(),null);
  await assert.rejects(queue.enqueue(revision));
 }finally{await db.close();}
});
