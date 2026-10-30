import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import * as policy from '../../../src/lib/content/publication-policy.mjs';
const require=createRequire(new URL('../../../package.json',import.meta.url));
function setup({admin=true,online=true,health='verified',valid=true,review='approved',active='r',format=undefined,media=undefined}={}){
 const calls=[],assets=media||[1,2].map(slide=>({id:String(slide),kind:'mp4',sha256:'a'.repeat(64),object_key:String(slide),provenance:{slide}}));
 const db={release(){},async query(sql,args){calls.push({sql,args});let rows=[];
 if(sql.includes('for update of p'))rows=[{active_revision_id:active,brand_id:'brand',state:'review',slides:['a','b'],format}];
 else if(sql.includes('as valid'))rows=[{valid}];
 else if(sql.includes('content_studio.assets'))rows=assets;
 else if(sql.includes("action='review.recorded'"))rows=[{metadata:{decision:review,assetFingerprint:policy.fingerprint(assets)}}];
 else if(sql.includes('as online'))rows=[{online}];
 else if(sql.includes('select health'))rows=[{health,expires_at:new Date(Date.now()+86400000)}];
 return {rows};}};
 const exports={},deps={'server-only':{},'./auth':{requireAdmin:async()=>{if(!admin)throw Error('denied');return {id:'admin'};}},'./db':{contentDb:()=>({connect:async()=>db})},'./publication-policy.mjs':policy,'./instagram-core.mjs':{EXPECTED_ACCOUNT:'17841416428564956'},'./brand':{currentBrand:async()=>{if(!admin)throw Error('denied');return {id:'brand',handle:'edevshub',account:'17841416428564956'};}}};
 vm.runInNewContext(require('typescript').transpileModule(fs.readFileSync(new URL('../../../src/lib/content/scheduling.ts',import.meta.url),'utf8'),{compilerOptions:{module:1,target:9}}).outputText,{exports,require:id=>deps[id]});return {api:exports,calls};
}
test('activation requires admin, online worker, connection and explicit confirmation',async()=>{
 for(const [options,confirmed]of [[{admin:false},true],[{online:false},true],[{health:'reconnect'},true],[{},false]]){
  const {api,calls}=setup(options);await assert.rejects(api.configurePublication(true,'automatic','12:30',confirmed));assert.equal(calls.some(c=>c.sql.startsWith('update content_studio.settings')),false);
 }
 const {api,calls}=setup({online:false,health:'reconnect'});await api.configurePublication(false,'approved','12:30',false);assert.ok(calls.find(c=>c.sql.startsWith('update content_studio.settings')&&c.args[0]===false));
});
test('manual agenda rejects stale revision, unapproved content and invalid BRT date',async()=>{
 for(const options of [{active:'other'},{review:'changes'},{valid:false},{admin:false}]){
  const {api,calls}=setup(options);await assert.rejects(api.scheduleDraft('p','r','2026-10-28T12:30'));assert.equal(calls.some(c=>c.sql.startsWith('insert into content_studio.schedules')),false);
 }
 const {api,calls}=setup();await api.scheduleDraft('p','r','2026-10-28T12:30');const insert=calls.find(c=>c.sql.startsWith('insert into content_studio.schedules'));assert.ok(insert);assert.equal(insert.args[2],'2026-10-28');assert.equal(insert.args[3],'12:30');
 assert.equal(calls.some(c=>c.sql.startsWith('update content_studio.settings')),false);
});

test('same-day manual formats select distinct principal, reel and story slots',async()=>{
 const slots=[];
 for(const format of [undefined,'reel','story']){
  const media=format?[{id:'a',sha256:'x',kind:'mp4',object_key:'video',provenance:{slide:1,format,width:1080,height:1920,duration:30,qa:'vertical-layout-audio-passed'}}]:undefined;
  const {api,calls}=setup({format,media});await api.scheduleDraft('p','r','2026-10-28T19:00');const insert=calls.find(c=>c.sql.startsWith('insert into content_studio.schedules'));slots.push(insert.args[6]);
 }
 assert.deepEqual(slots,['principal','reel','story']);
});
test('manual scheduling rejects explicit null and unknown format',async()=>{
 for(const format of [null,'','REELS']){const {api,calls}=setup({format});await assert.rejects(api.scheduleDraft('p','r','2026-10-28T19:00'));assert.equal(calls.some(c=>c.sql.startsWith('insert into content_studio.schedules')),false);}
});
