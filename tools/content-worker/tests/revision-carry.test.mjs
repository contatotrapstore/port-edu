import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isManualOnly,importedBriefFields,carriesImportedMedia,copiedAssetPlan} from '../../../src/lib/content/revision-carry.mjs';
import {fingerprint,publicationEligibility} from '../../../src/lib/content/publication-policy.mjs';
const OLD='11111111-1111-4111-8111-111111111111',NEW='22222222-2222-4222-8222-222222222222';
const brief={text:'Post pronto',format:'story',production:'manual-only',ai_generated:false,collaborators:['formula.foto'],import_key:'abc',importado:{lote:'x'},agendar_em:'2026-10-31T10:00',generation:{engine:'claude'},vertical:{x:1}};
test('imported brief keeps import fields only for manual-only revisions',()=>{
 assert.equal(isManualOnly(brief),true);assert.equal(isManualOnly({}),false);assert.equal(isManualOnly(undefined),false);
 assert.deepEqual(importedBriefFields(brief),{production:'manual-only',ai_generated:false,collaborators:['formula.foto'],import_key:'abc',importado:{lote:'x'},agendar_em:'2026-10-31T10:00'});
 assert.deepEqual(importedBriefFields({text:'gerado',collaborators:['x']}),{});assert.deepEqual(importedBriefFields(undefined),{});
});
test('imported media is carried only when format and script are unchanged',()=>{
 const previous={brief,slides:['a','b']};
 assert.equal(carriesImportedMedia(previous,{format:'story',slides:['a','b']}),true);
 assert.equal(carriesImportedMedia(previous,{format:'carousel',slides:['a','b']}),false);
 assert.equal(carriesImportedMedia(previous,{format:'story',slides:['a','c']}),false);
 assert.equal(carriesImportedMedia({brief:{...brief,production:undefined},slides:['a','b']},{format:'story',slides:['a','b']}),false);
 assert.equal(carriesImportedMedia(undefined,{format:'story',slides:['a','b']}),false);
 assert.equal(carriesImportedMedia({brief:{production:'manual-only'},slides:['a','b']},{slides:['a','b']}),true);
});
test('copied assets get new keys in the new revision folder and need a fresh approval',()=>{
 const assets=[{id:'a1',kind:'jpg',sha256:'b'.repeat(64),object_key:`${OLD}/imp-01-abc.jpg`,provenance:{format:'story',slide:1,width:1080,height:1920,publish:true,qa:'image-checked'}}];
 const plan=copiedAssetPlan(assets,NEW);
 assert.deepEqual(plan,[{from:`${OLD}/imp-01-abc.jpg`,to:`${NEW}/imp-01-abc.jpg`,kind:'jpg',sha256:'b'.repeat(64),provenance:{...assets[0].provenance,copied_from:'a1'}}]);
 // nova revisão com a cópia: elegível na forma, mas a aprovação da antiga não vale (ids e chaves novos)
 const copied=plan.map((p,i)=>({id:'n'+i,kind:p.kind,sha256:p.sha256,object_key:p.to,provenance:p.provenance}));
 const old=fingerprint(assets),now=fingerprint(copied);
 assert.notEqual(old,now);
 const base={revisionId:NEW,activeRevision:NEW,slides:['a','b'],format:'story',assets:copied,expectedFingerprint:now,mode:'approved'};
 assert.equal(publicationEligibility({...base,review:{decision:'approved',assetFingerprint:old}}),'approval_required');
 assert.equal(publicationEligibility({...base,review:{decision:'approved',assetFingerprint:now}}),null);
 for(const bad of [[{...assets[0],object_key:'../x.jpg'}],[{...assets[0],object_key:`${OLD}/a/b.jpg`}]])assert.throws(()=>copiedAssetPlan(bad,NEW),/invalid_asset_copy/);
 assert.throws(()=>copiedAssetPlan(assets,'../x'),/invalid_asset_copy/);
});
