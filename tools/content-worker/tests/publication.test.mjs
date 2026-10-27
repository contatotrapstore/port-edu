import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advancePublication} from '../../../src/lib/content/publication-step.mjs';
const input={enabled:true,due:true,accountId:'17841416428564956',caption:'Teste',videos:['https://example.test/1.mp4','https://example.test/2.mp4']};
test('complete carousel survives separate steps and never publishes before due',async()=>{
 let state={},next=10,posts=[];
 const api=async(e,p,m)=>{if(m==='POST'){posts.push(e);return {id:String(next++)};}return {status_code:'FINISHED'};};
 const save=async s=>{state=s;};
 for(let i=0;i<5;i++)await advancePublication({...input,due:false},state,api,save,async()=>true);
 assert.equal(posts.filter(e=>e.endsWith('media_publish')).length,0);
 await advancePublication(input,state,api,save,async()=>true);
 await advancePublication(input,state,api,save,async()=>true);
 assert.equal(state.phase,'complete');assert.equal(posts.length,4);
});
test('crash during container creation stops for review rather than repeating writes',async()=>{
 let called=false;
 const result=await advancePublication(input,{phase:'creating_child',children:[]},async()=>{called=true;},async()=>{},async()=>true);
 assert.equal(called,false);assert.equal(result.phase,'unknown');
});
test('disabled publication performs no provider requests',async()=>{
 const result=await advancePublication({...input,enabled:false},{},async()=>{throw Error('must not call');},async()=>{},async()=>true);assert.equal(result.phase,'paused');
});
test('atomic final checkpoint rejects a cancellation racing with allow without sending',async()=>{
 let posts=0;
 const result=await advancePublication(input,{children:['1','2'],parent:'3',childrenReady:true},async(e,p,m)=>{if(m==='POST')posts++;return {status_code:'FINISHED'};},async state=>{if(state.phase==='sending')throw Error('publication_paused');},async()=>true);
 assert.equal(posts,0);assert.equal(result.phase,'paused');
});
test('lost publish response is persisted and never retried',async()=>{
 let state={children:['1','2'],parent:'3',childrenReady:true},publishes=0;const save=async value=>{state=value;};
 const api=async(endpoint,params,method)=>{if(method==='POST'){publishes++;assert.equal(state.phase,'sending');throw Error('provider_outcome_unknown');}return {status_code:'FINISHED'};};
 await advancePublication(input,state,api,save,async()=>true);assert.equal(state.phase,'unknown');
 await advancePublication(input,state,api,save,async()=>true);assert.equal(publishes,1);
});
test('pause at final gate blocks sending and uncertainty can reconcile read-only',async()=>{
 let state={children:['1','2'],parent:'3',childrenReady:true};let posts=0;const api=async(e,p,m)=>{if(m==='POST')posts++;return {status_code:'FINISHED'};};
 await advancePublication(input,state,api,async s=>{state=s;},async()=>false);assert.equal(posts,0);
 state={...state,phase:'unknown'};await advancePublication(input,state,async()=>({status_code:'PUBLISHED'}),async s=>{state=s;},async()=>true);assert.equal(state.phase,'complete');
});
