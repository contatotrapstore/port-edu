import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fingerprint,publicationEligibility,refreshDue,publishableMedia,aiGenerated,collaboratorsOf,IMAGE_QA} from '../../../src/lib/content/publication-policy.mjs';
const assets=[1,2].map(slide=>({id:String(slide),sha256:'a'.repeat(64),kind:'mp4',object_key:`x/${slide}.mp4`,provenance:{slide,qa:'loop-layout-determinism-passed'}}));
const base={revisionId:'r',activeRevision:'r',slides:['a','b'],assets,expectedFingerprint:fingerprint(assets),review:{decision:'approved',assetFingerprint:fingerprint(assets)},mode:'approved'};
test('approval is tied to the current revision and exact complete media',()=>{
 assert.equal(publicationEligibility(base),null);
 for(const patch of [{activeRevision:'new'},{assets:assets.slice(1)},{review:{decision:'changes'}},{expectedFingerprint:'changed'},{assets:[assets[0],assets[0]]}])assert.ok(publicationEligibility({...base,...patch}));
});
test('automatic mode requires rendered QA and respects requested changes',()=>{
 assert.equal(publicationEligibility({...base,mode:'automatic',review:null}),null);
 assert.ok(publicationEligibility({...base,mode:'automatic',review:{decision:'changes'}}));
 const bad=assets.map(a=>({...a,provenance:{slide:a.provenance.slide}}));
 assert.ok(publicationEligibility({...base,mode:'automatic',review:null,assets:bad,expectedFingerprint:fingerprint(bad)}));
});
test('refresh only valid old tokens close to expiry',()=>{
 const now=Date.now(),day=86400000;
 assert.equal(refreshDue({expires_at:new Date(now+5*day),refreshed_at:new Date(now-30*day)},now),true);
 assert.equal(refreshDue({expires_at:new Date(now+60*day),refreshed_at:new Date(now)},now),false);
 assert.equal(refreshDue({expires_at:new Date(now-day),refreshed_at:new Date(now-60*day)},now),false);
});

for(const format of ['reel','story'])test(`${format} accepts one checked vertical video for multiple narrative scenes`,()=>{
 const media=[{...assets[0],provenance:{slide:1,format,width:1080,height:1920,duration:30,qa:'vertical-layout-audio-passed'}}];
 const input={...base,format,assets:media,expectedFingerprint:fingerprint(media),review:{decision:'approved',assetFingerprint:fingerprint(media)}};
 assert.equal(publicationEligibility(input),null);
 assert.equal(publicationEligibility({...base,format}),'incomplete_media');
 for(const patch of [{format:'carousel'},{width:1350},{height:1080},{qa:'loop-layout-determinism-passed'},{slide:2},{duration:2},{duration:91},{duration:NaN},{duration:undefined},...(format==='story'?[{duration:61}]:[])]){
  const bad=[{...media[0],provenance:{...media[0].provenance,...patch}}];
  assert.ok(publicationEligibility({...input,assets:bad,expectedFingerprint:fingerprint(bad),review:{decision:'approved',assetFingerprint:fingerprint(bad)}}));
 }
 assert.equal(publicationEligibility({...input,mode:'automatic'}),format==='reel'?null:'invalid_mode');
});
test('unknown formats fail closed while explicit carousel preserves legacy fingerprints',()=>{
 for(const format of ['',null,'REELS','image'])assert.equal(publicationEligibility({...base,format}),'invalid_format');
 assert.equal(publicationEligibility({...base,format:'carousel'}),null);
 assert.equal(fingerprint(assets),'767d17709a9e44ca1c4d211658bbd9bf3f4637efcd0346d5ada67e88389e5f62');
});
// Imagem nativa: JPEG marcado com provenance.publish=true (o PNG segue sendo só prévia)
const jpg=(slide,p={})=>({id:'j'+slide,sha256:'b'.repeat(64),kind:'jpg',object_key:`x/${slide}.jpg`,provenance:{format:'carousel',slide,width:1080,height:1350,publish:true,qa:IMAGE_QA,...p}});
const approved=(media,patch={})=>({...base,assets:media,expectedFingerprint:fingerprint(media),review:{decision:'approved',assetFingerprint:fingerprint(media)},...patch});
test('image carousel: one publishable JPEG per slide, PNG previews and unmarked JPEG never count',()=>{
 const media=[jpg(1),jpg(2)];
 assert.equal(publicationEligibility(approved(media)),null);
 assert.equal(publicationEligibility(approved([...media,{...media[0],id:'p1',kind:'png',object_key:'x/1.png',provenance:{slide:1}}])),null);
 assert.equal(publicationEligibility(approved(media.map(a=>({...a,kind:'png'})))),'incomplete_media');
 assert.equal(publicationEligibility(approved(media.map(a=>({...a,provenance:{...a.provenance,publish:undefined}})))),'incomplete_media');
 assert.equal(publicationEligibility(approved([...media,{...jpg(2),id:'j3',object_key:'x/3.jpg'}])),'incomplete_media');
 assert.equal(publicationEligibility(approved([...media,{...assets[1],provenance:{slide:2}}])),'incomplete_media');
 for(const patch of [{width:1350},{height:1920},{format:'story'},{format:undefined},{slide:3}])assert.equal(publicationEligibility(approved([jpg(1),jpg(2,patch)])),'incomplete_media',JSON.stringify(patch));
 assert.equal(publicationEligibility(approved([jpg(1),jpg(2,{height:1080})])),null);
 assert.equal(publicationEligibility(approved([jpg(1),jpg(2,{qa:undefined})])),'qa_required');
 // aprovação continua amarrada à mídia exata
 assert.equal(publicationEligibility({...approved(media),review:null}),'approval_required');
 assert.equal(publicationEligibility({...approved(media),review:{decision:'approved',assetFingerprint:fingerprint(assets)}}),'approval_required');
 // o Studio não gera imagem: imagem nunca sai no modo automático
 assert.equal(publicationEligibility({...approved(media),mode:'automatic',review:null}),'invalid_mode');
});
test('mixed carousel accepts a video slide next to an image slide',()=>{
 const media=[jpg(1),{...assets[1],provenance:{slide:2,qa:'carousel-layout-audio-passed'}}];
 assert.equal(publicationEligibility(approved(media)),null);
 assert.deepEqual(publishableMedia([...media].reverse()).map(a=>a.kind),['jpg','mp4']);
});
test('story image accepts one 1080x1920 publishable JPEG; reel never takes an image',()=>{
 const story=[jpg(1,{format:'story',height:1920})];
 assert.equal(publicationEligibility(approved(story,{format:'story'})),null);
 for(const patch of [{height:1350},{slide:2},{format:'reel'},{publish:false}])assert.equal(publicationEligibility(approved([jpg(1,{format:'story',height:1920,...patch})],{format:'story'})),'incomplete_media',JSON.stringify(patch));
 assert.equal(publicationEligibility(approved([jpg(1,{format:'reel',height:1920})],{format:'reel'})),'incomplete_media');
 const video={...assets[0],id:'v',provenance:{slide:1,format:'story',width:1080,height:1920,duration:7,qa:'vertical-layout-audio-passed'}};
 assert.equal(publicationEligibility(approved([...story,video],{format:'story'})),'incomplete_media');
 assert.equal(publicationEligibility({...approved(story,{format:'story'}),mode:'automatic',review:null}),'invalid_mode');
});
test('publish mark is part of the fingerprint only for publishable images',()=>{
 const media=[jpg(1),jpg(2)];
 assert.notEqual(fingerprint(media),fingerprint(media.map(a=>({...a,provenance:{...a.provenance,publish:undefined}}))));
 assert.equal(fingerprint(assets),fingerprint(assets.map(a=>({...a,provenance:{...a.provenance,publish:true}}))));
});
test('AI label comes from the revision: explicit boolean wins, imported posts default to false',()=>{
 assert.equal(aiGenerated(undefined),true);assert.equal(aiGenerated({}),true);assert.equal(aiGenerated({generation:{engine:'claude'}}),true);
 assert.equal(aiGenerated({production:'manual-only'}),false);
 assert.equal(aiGenerated({ai_generated:false}),false);
 assert.equal(aiGenerated({production:'manual-only',ai_generated:true}),true);
 assert.equal(aiGenerated({ai_generated:'false'}),true);
});
test('collaborators are normalized usernames, deduplicated and capped at three',()=>{
 assert.deepEqual(collaboratorsOf(undefined),[]);assert.deepEqual(collaboratorsOf({collaborators:'formula.foto'}),[]);
 assert.deepEqual(collaboratorsOf({collaborators:['@Formula.Foto','formula.foto',' revix.app ','com espaço','a'.repeat(31),'x_1','y.2']}),['formula.foto','revix.app','x_1']);
});
