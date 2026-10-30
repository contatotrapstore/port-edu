import {createHash} from 'node:crypto';
export function fingerprint(assets){return createHash('sha256').update(JSON.stringify(assets.map(a=>[a.id,a.sha256,a.kind,a.object_key,a.provenance.slide]).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))))).digest('hex');}
export function publicationEligibility({revisionId,activeRevision,slides,assets,expectedFingerprint,review,mode,format='carousel'}){
 if(!['carousel','reel','story'].includes(format))return 'invalid_format';
 if(revisionId!==activeRevision)return 'revision_changed';
 if(!Array.isArray(slides)||slides.length<2||slides.length>10)return 'invalid_slides';
 if(fingerprint(assets)!==expectedFingerprint)return 'media_changed';
 const videos=assets.filter(a=>a.kind==='mp4');
 if(format==='carousel'){
  if(videos.length!==slides.length||!slides.every((_,i)=>videos.filter(a=>a.provenance.slide===i+1).length===1)||videos.some(a=>a.provenance.format!==undefined&&a.provenance.format!=='carousel'))return 'incomplete_media';
 }else{
  if(videos.length!==1)return 'incomplete_media';
  const p=videos[0].provenance;
  if(p.format!==format||p.slide!==1||p.width!==1080||p.height!==1920||!Number.isFinite(p.duration)||p.duration<3||p.duration>(format==='story'?60:90))return 'incomplete_media';
  if(p.qa!=='vertical-layout-audio-passed')return 'qa_required';
  if(mode==='automatic'&&format!=='reel')return 'invalid_mode';
 }
 if(review?.decision==='changes')return 'changes_requested';
 if(mode==='approved'&&(review?.decision!=='approved'||review.assetFingerprint!==expectedFingerprint))return 'approval_required';
 if(mode==='automatic'&&format==='carousel'&&videos.some(a=>!['loop-layout-determinism-passed','carousel-layout-audio-passed'].includes(a.provenance.qa)))return 'qa_required';
 if(!['approved','automatic'].includes(mode))return 'invalid_mode';
 return null;
}
export function refreshDue(connection,now=Date.now()){
 const expiry=new Date(connection.expires_at).getTime(),last=new Date(connection.refreshed_at||connection.verified_at).getTime();
 return expiry>now&&expiry-now<14*86400000&&now-last>86400000;
}
