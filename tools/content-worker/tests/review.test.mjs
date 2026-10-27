import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import * as policy from '../../../src/lib/content/publication-policy.mjs';
const require=createRequire(new URL('../../../package.json',import.meta.url));
function load(deps){const source=fs.readFileSync(new URL('../../../src/lib/content/review.ts',import.meta.url),'utf8');const exports={};vm.runInNewContext(require('typescript').transpileModule(source,{compilerOptions:{module:1,target:9}}).outputText,{exports,require:id=>id==='server-only'?{}:deps[id]});return exports;}
function setup({active='rev',count=2,authorized=true,format=undefined,media=undefined}={}){
 const calls=[];const db={release(){},async query(sql,args){calls.push({sql,args});if(sql.includes('for update'))return {rows:[{active_revision_id:active,state:'draft',slides:['a','b'],format}]};if(sql.includes('from content_studio.assets'))return {rows:media||Array.from({length:count},(_,i)=>({id:'asset'+i,sha256:'a'.repeat(64),kind:'mp4',object_key:'rev/'+i,provenance:{slide:i+1}}))};return {rows:[]};}};
 return {calls,api:load({'./publication-policy.mjs':policy,'node:crypto':{createHash},'./auth':{requireAdmin:async()=>{if(!authorized)throw Error('denied');return{id:'admin'}}},'./db':{contentDb:()=>({connect:async()=>db})}})};
}
test('review rejects anonymous, stale revision and incomplete rendered slides',async()=>{
 for(const opts of [{authorized:false},{active:'new-rev'},{count:1}]){const {api,calls}=setup(opts);await assert.rejects(api.recordReview('post','rev','approved','',true));assert.equal(calls.some(x=>x.sql.includes('insert into content_studio.events')),false);}
});
test('approval requires explicit human checkbox and never changes publication settings or schedules',async()=>{
 const {api,calls}=setup();await assert.rejects(api.recordReview('post','rev','approved','',false));
 await api.recordReview('post','rev','approved','Conferido no celular',true,api.assetFingerprint(Array.from({length:2},(_,i)=>({id:'asset'+i,sha256:'a'.repeat(64),kind:'mp4',object_key:'rev/'+i,provenance:{slide:i+1}}))));
 const event=calls.find(x=>x.sql.includes('insert into content_studio.events'));assert.ok(event);const data=JSON.parse(event.args[3]);assert.equal(data.revisionId,'rev');assert.match(data.assetFingerprint,/^[a-f0-9]{64}$/);assert.equal(data.decision,'approved');
 assert.equal(calls.some(x=>/update content_studio\.(settings|posts|schedules)|insert into content_studio.jobs/.test(x.sql)),false);
});
test('requested changes require an explanation and allow a draft without assets',async()=>{
 const {api,calls}=setup({count:0});await assert.rejects(api.recordReview('post','rev','changes','',false));await api.recordReview('post','rev','changes','Aumentar texto da capa',false,api.assetFingerprint([]));assert.ok(calls.some(x=>x.sql.includes('insert into content_studio.events')));
});
test('approval refuses media replaced after the review page was displayed',async()=>{
 const {api,calls}=setup();await assert.rejects(api.recordReview('post','rev','approved','',true,'outdated-fingerprint'));
 assert.equal(calls.some(x=>x.sql.includes('insert into content_studio.events')),false);
});

for(const format of ['reel','story'])test(`review approves ${format} only with checked vertical media`,async()=>{
 const media=[{id:'a',sha256:'x',kind:'mp4',object_key:'video',provenance:{slide:1,format,width:1080,height:1920,duration:30,qa:'vertical-layout-audio-passed'}}];
 const {api,calls}=setup({format,media});await api.recordReview('p','rev','approved','checked',true,policy.fingerprint(media));assert.ok(calls.some(c=>c.sql.includes('insert into content_studio.events')));
 const bad=setup({format,media:media.map(a=>({...a,provenance:{...a.provenance,qa:'failed'}}))});await assert.rejects(bad.api.recordReview('p','rev','approved','checked',true,policy.fingerprint(media)));assert.equal(bad.calls.some(c=>c.sql.includes('insert into content_studio.events')),false);
});
test('review rejects explicit null and unknown revision format',async()=>{
 const media=[1,2].map((slide,i)=>({id:'asset'+i,sha256:'a'.repeat(64),kind:'mp4',object_key:'rev/'+i,provenance:{slide}}));
 for(const format of [null,'','REELS']){const {api,calls}=setup({format,media});await assert.rejects(api.recordReview('p','rev','approved','checked',true,policy.fingerprint(media)));assert.equal(calls.some(c=>c.sql.includes('insert into content_studio.events')),false);}
});
