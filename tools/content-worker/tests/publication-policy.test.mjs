import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fingerprint,publicationEligibility,refreshDue} from '../../../src/lib/content/publication-policy.mjs';
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
