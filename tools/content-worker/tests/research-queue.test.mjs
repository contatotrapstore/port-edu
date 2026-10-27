import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {claimResearch,saveGeneratedDraft} from '../scripts/research-queue.mjs';
test('research claims once, saves one revision/render and never creates a publication',async()=>{
 const db=new PGlite();try{
 await db.exec('create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);');
 for(const name of ['20261027001716_content_studio_foundation.sql','20261027022714_content_research_pipeline.sql'])await db.exec(fs.readFileSync(new URL('../../../supabase/migrations/'+name,import.meta.url),'utf8'));
 await assert.rejects(db.query("update content_studio.settings set preferred_engine='api'"));
 await db.query("insert into content_studio.research_runs(brand_id,engine,request_key) select id,'codex','test' from content_studio.brands");
 const run=await claimResearch(db);assert.ok(run);assert.equal(await claimResearch(db),null);
 const draft={topic:'Um exemplo de agente',brief:'Exemplo educativo.',slides:['Uma pergunta','Um próximo passo'],caption:'Teste',sources:[]};
 await assert.rejects(saveGeneratedDraft(db,{...run,lease_token:'00000000-0000-4000-8000-000000000000'},draft,[]));
 await db.exec('begin');const post=await saveGeneratedDraft(db,run,draft,[]);await db.exec('commit');
 assert.equal((await db.query('select state from content_studio.posts where id=$1',[post])).rows[0].state,'producing');
 assert.deepEqual((await db.query('select kind from content_studio.jobs')).rows,[{kind:'render'}]);
 assert.equal((await db.query('select * from content_studio.publications')).rows.length,0);
 assert.equal((await db.query('select * from content_studio.schedules')).rows.length,0);
 await assert.rejects(saveGeneratedDraft(db,run,draft,[]));
 assert.equal((await db.query('select * from content_studio.posts')).rows.length,1);
 }finally{await db.close();}
});
