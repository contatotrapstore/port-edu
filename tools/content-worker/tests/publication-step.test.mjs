import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advancePublication} from '../../../src/lib/content/publication-step.mjs';
const input={enabled:true,due:true,accountId:'17841416428564956',caption:'Teste',videos:['https://example.test/1.mp4','https://example.test/2.mp4']};

for(const format of ['reel','story'])test(`${format} creates one container and shares due, pause and uncertain-send safeguards`,async()=>{
 const data={...input,format,videos:input.videos.slice(0,1)};let state={},calls=[],uncertain=false;
 const save=async s=>{state=s;};
 const api=async(e,p,m)=>{calls.push({e,p,m});if(m==='POST'&&e.endsWith('media_publish')){uncertain=true;throw Error('network_timeout');}return m==='POST'?{id:'12'}:{status_code:'FINISHED'};};
 await advancePublication({...data,due:false},state,api,save,async()=>true);
 assert.equal(calls.length,1);assert.equal(state.parent,'12');assert.deepEqual(state.children,[]);
 assert.deepEqual(calls[0].p,{media_type:format==='reel'?'REELS':'STORIES',video_url:data.videos[0],is_ai_generated:'true',...(format==='reel'?{caption:data.caption,share_to_feed:'true'}:{})});
 await advancePublication({...data,due:false},state,api,save,async()=>true);assert.equal(uncertain,false);
 const paused=await advancePublication(data,state,api,save,async()=>false);assert.equal(paused.phase,'paused');
 await advancePublication(data,state,api,save,async()=>true);assert.equal(state.phase,'unknown');
 await advancePublication(data,state,api,save,async()=>true);assert.equal(calls.filter(c=>c.e.endsWith('media_publish')).length,1);
 await advancePublication(data,state,async()=>({status_code:'PUBLISHED'}),save,async()=>true);assert.equal(state.phase,'complete');
});
test('reel sends the designed cover frame as thumb_offset; story ignores it',async()=>{
 for(const format of ['reel','story']){
  const calls=[];await advancePublication({...input,format,videos:input.videos.slice(0,1),coverMs:0,due:false},{},async(e,p,m)=>{calls.push(p);return m==='POST'?{id:'7'}:{status_code:'IN_PROGRESS'};},async()=>{},async()=>true);
  assert.equal(calls[0].thumb_offset,format==='reel'?'0':undefined);
 }
});
test('invalid format is rejected before any provider write',async()=>{
 for(const format of ['',null,'REELS'])await assert.rejects(advancePublication({...input,format},{},async()=>{throw Error('provider_called');},async()=>{},async()=>true),/invalid_publication/);
});

