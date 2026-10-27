import {createHash} from 'node:crypto';
export function fingerprint(assets){return createHash('sha256').update(JSON.stringify(assets.map(a=>[a.id,a.sha256,a.kind,a.object_key,a.provenance.slide]).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))))).digest('hex');}
export function publicationEligibility({revisionId,activeRevision,slides,assets,expectedFingerprint,review,mode}){
 if(revisionId!==activeRevision)return 'revision_changed';
 if(!Array.isArray(slides)||slides.length<2||slides.length>10)return 'invalid_slides';
 if(fingerprint(assets)!==expectedFingerprint)return 'media_changed';
 const videos=assets.filter(a=>a.kind==='mp4');
 if(videos.length!==slides.length||!slides.every((_,i)=>videos.filter(a=>a.provenance.slide===i+1).length===1))return 'incomplete_media';
 if(review?.decision==='changes')return 'changes_requested';
 if(mode==='approved'&&(review?.decision!=='approved'||review.assetFingerprint!==expectedFingerprint))return 'approval_required';
 if(mode==='automatic'&&videos.some(a=>a.provenance.qa!=='loop-layout-determinism-passed'))return 'qa_required';
 if(!['approved','automatic'].includes(mode))return 'invalid_mode';
 return null;
}
export function refreshDue(connection,now=Date.now()){
 const expiry=new Date(connection.expires_at).getTime(),last=new Date(connection.refreshed_at||connection.verified_at).getTime();
 return expiry>now&&expiry-now<14*86400000&&now-last>86400000;
}
