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
// Rótulo de IA por revisão: padrão true (Studio gera); false omite o campo em todos os formatos
test('aiGenerated false omits is_ai_generated on carousel, reel and story; default keeps it',async()=>{
 for(const [format,videos] of [['carousel',input.videos],['reel',input.videos.slice(0,1)],['story',input.videos.slice(0,1)]])for(const aiGenerated of [undefined,true,false]){
  const calls=[];let state={};
  const api=async(e,p,m)=>{calls.push({e,p,m});return m==='POST'?{id:String(10+calls.length)}:{status_code:'FINISHED'};};
  for(let i=0;i<4&&!state.parent;i++)await advancePublication({...input,format,videos,due:false,aiGenerated},state,api,async s=>{state=s;},async()=>true);
  const parent=calls.filter(c=>c.m==='POST').at(-1).p,children=calls.filter(c=>c.m==='POST'&&c.p.is_carousel_item);
  assert.equal(parent.is_ai_generated,aiGenerated===false?undefined:'true',`${format} ${aiGenerated}`);
  assert.ok(children.every(c=>c.p.is_ai_generated===undefined));
 }
});
test('invalid aiGenerated or collaborators are rejected before any provider write',async()=>{
 for(const patch of [{aiGenerated:'false'},{collaborators:'formula.foto'},{collaborators:['a','b','c','d']},{collaborators:['@formula.foto']},{collaborators:['tem espaço']}])
  await assert.rejects(advancePublication({...input,...patch},{},async()=>{throw Error('provider_called');},async()=>{},async()=>true),/invalid_publication/);
});
// Collab: vai no pai de carrossel e de Reel; Story não aceita
test('collaborators go on carousel and reel parent containers, never on children or stories',async()=>{
 for(const [format,videos] of [['carousel',input.videos],['reel',input.videos.slice(0,1)],['story',input.videos.slice(0,1)]]){
  const calls=[];let state={};
  const api=async(e,p,m)=>{calls.push({e,p,m});return m==='POST'?{id:String(10+calls.length)}:{status_code:'FINISHED'};};
  for(let i=0;i<4&&!state.parent;i++)await advancePublication({...input,format,videos,due:false,collaborators:['formula.foto','revix.app']},state,api,async s=>{state=s;},async()=>true);
  const posts=calls.filter(c=>c.m==='POST'),parent=posts.at(-1).p;
  assert.equal(parent.collaborators,format==='story'?undefined:'["formula.foto","revix.app"]');
  assert.ok(posts.slice(0,-1).every(c=>c.p.collaborators===undefined));
  assert.equal(state.warnings,undefined);
 }
});
const rejected=(text,code=100)=>{const e=Error('instagram_request_rejected');Object.defineProperty(e,'provider',{enumerable:false,value:{code,subcode:2207000,text}});return e;};
test('collab invitation refused by Meta records a warning and recreates the parent without collaborators',async()=>{
 for(const [format,videos,state0] of [['carousel',input.videos,{children:['1','2'],childrenReady:true}],['reel',input.videos.slice(0,1),{}]]){
  const calls=[],saves=[];let state=state0;
  const api=async(e,p,m)=>{calls.push({e,p,m});if(m==='POST'&&p.collaborators)throw rejected('Invalid parameter: user cannot be added as a collaborator');return m==='POST'?{id:'77'}:{status_code:'FINISHED'};};
  const result=await advancePublication({...input,format,videos,due:false,collaborators:['formula.foto']},state,api,async s=>{state=s;saves.push(s);},async()=>true);
  const posts=calls.filter(c=>c.m==='POST');
  assert.equal(posts.length,2);assert.equal(posts[0].p.collaborators,'["formula.foto"]');assert.equal(posts[1].p.collaborators,undefined);
  assert.deepEqual({...posts[0].p,collaborators:undefined},{...posts[1].p,collaborators:undefined});
  assert.equal(result.parent,'77');assert.equal(result.phase,'preparing');assert.equal(result.collaboratorsDropped,true);
  assert.deepEqual(result.warnings,[{code:'collaborators_rejected',collaborators:['formula.foto'],providerCode:100,providerSubcode:2207000}]);
  // o aviso é gravado antes do novo contêiner (fica no estado mesmo se o processo cair entre um e outro)
  assert.ok(saves.some(s=>s.phase==='creating_parent'&&s.collaboratorsDropped));
  // não insiste no Collab nos passos seguintes
  await advancePublication({...input,format,videos,collaborators:['formula.foto']},state,api,async s=>{state=s;},async()=>true);
  assert.equal(state.phase,'complete');assert.equal(calls.filter(c=>c.p?.collaborators).length,1);
 }
});
test('Portuguese collab message also triggers the fallback; other rejections still fail without retry',async()=>{
 let calls=0;
 const pt=await advancePublication({...input,collaborators:['formula.foto'],due:false},{children:['1','2'],childrenReady:true},async(e,p,m)=>{if(m!=='POST')return {status_code:'FINISHED'};calls++;if(p.collaborators)throw rejected('Não foi possível adicionar o colaborador');return {id:'5'};},async()=>{},async()=>true);
 assert.equal(pt.parent,'5');assert.equal(calls,2);
 for(const error of [rejected('Invalid caption'),Error('instagram_request_rejected'),Error('instagram_reconnect_required')]){
  let posts=0;
  await assert.rejects(advancePublication({...input,collaborators:['formula.foto'],due:false},{children:['1','2'],childrenReady:true},async(e,p,m)=>{if(m!=='POST')return {status_code:'FINISHED'};posts++;throw error;},async()=>{},async()=>true),{message:error.message});
  assert.equal(posts,1);
 }
 // sem collaborators, nenhuma recusa é refeita
 let posts=0;
 await assert.rejects(advancePublication({...input,due:false},{children:['1','2'],childrenReady:true},async(e,p,m)=>{if(m!=='POST')return {status_code:'FINISHED'};posts++;throw rejected('collaborator');},async()=>{},async()=>true),/instagram_request_rejected/);
 assert.equal(posts,1);
 // refeito sem Collab e a resposta se perde: estado incerto, nunca reenviado
 let state={children:['1','2'],childrenReady:true};
 const lost=await advancePublication({...input,collaborators:['formula.foto'],due:false},state,async(e,p,m)=>{if(m!=='POST')return {status_code:'FINISHED'};if(p.collaborators)throw rejected('collaborators');throw Error('provider_outcome_unknown');},async s=>{state=s;},async()=>true);
 assert.equal(lost.phase,'unknown');assert.equal(state.collaboratorsDropped,true);
});
// Imagem nativa: filhos IMAGE no carrossel e Story de imagem
test('image carousel creates IMAGE children with image_url and a normal carousel parent; mixed media keeps order',async()=>{
 const media=[{type:'image',url:'https://example.test/1.jpg'},{type:'video',url:'https://example.test/2.mp4'},{type:'image',url:'https://example.test/3.jpg'}];
 const calls=[];let state={};
 const api=async(e,p,m)=>{calls.push({e,p,m});return m==='POST'?{id:String(20+calls.length)}:{status_code:'FINISHED'};};
 for(let i=0;i<6;i++)await advancePublication({...input,media,videos:undefined,aiGenerated:false},state,api,async s=>{state=s;},async()=>true);
 const posts=calls.filter(c=>c.m==='POST');
 assert.deepEqual(posts.slice(0,3).map(c=>c.p),[{image_url:media[0].url,is_carousel_item:'true'},{media_type:'VIDEO',is_carousel_item:'true',video_url:media[1].url},{image_url:media[2].url,is_carousel_item:'true'}]);
 assert.deepEqual(posts[3].p,{media_type:'CAROUSEL',children:state.children.join(','),caption:'Teste'});
 assert.equal(state.phase,'complete');assert.equal(posts.filter(c=>c.e.endsWith('media_publish')).length,1);
});
test('story image uses STORIES with image_url; reel refuses an image',async()=>{
 const calls=[];
 await advancePublication({...input,format:'story',media:[{type:'image',url:'https://example.test/s.jpg'}],videos:undefined,due:false,aiGenerated:false,collaborators:['formula.foto']},{},async(e,p,m)=>{calls.push(p);return m==='POST'?{id:'9'}:{status_code:'IN_PROGRESS'};},async()=>{},async()=>true);
 assert.deepEqual(calls[0],{media_type:'STORIES',image_url:'https://example.test/s.jpg'});
 await assert.rejects(advancePublication({...input,format:'reel',media:[{type:'image',url:'https://example.test/s.jpg'}],videos:undefined},{},async()=>{throw Error('provider_called');},async()=>{},async()=>true),/invalid_publication/);
 for(const media of [[{type:'gif',url:'https://example.test/x'}],[{type:'image',url:''}],[{type:'image'}],'https://example.test/x'])
  await assert.rejects(advancePublication({...input,format:'story',media,videos:undefined},{},async()=>{throw Error('provider_called');},async()=>{},async()=>true),/invalid_publication/);
});

