import {createHash} from 'node:crypto';
// Mídia publicável de uma revisão: todo MP4 e a imagem marcada para publicar.
// A Meta só aceita JPEG em image_url, então imagem publicável = kind 'jpg' com provenance.publish===true
// (gravada pelo import de posts prontos). PNG continua sendo só capa/prévia e nunca vai à Meta.
export const IMAGE_QA='image-checked';
export function isPublishableImage(a){return a?.kind==='jpg'&&a.provenance?.publish===true;}
export function publishableMedia(assets){return assets.filter(a=>a.kind==='mp4'||isPublishableImage(a)).sort((a,b)=>(a.provenance.slide||0)-(b.provenance.slide||0));}
// A marca 'publish' entra na impressão digital só das imagens publicáveis: as impressões antigas (vídeo) não mudam.
export function fingerprint(assets){return createHash('sha256').update(JSON.stringify(assets.map(a=>[a.id,a.sha256,a.kind,a.object_key,a.provenance.slide,...(isPublishableImage(a)?['publish']:[])]).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))))).digest('hex');}
function imageShape(a,format){const p=a.provenance;return p.format===format&&Number.isInteger(p.slide)&&p.width===1080&&(format==='story'?p.height===1920&&p.slide===1:[1080,1350].includes(p.height));}
export function publicationEligibility({revisionId,activeRevision,slides,assets,expectedFingerprint,review,mode,format='carousel'}){
 if(!['carousel','reel','story'].includes(format))return 'invalid_format';
 if(revisionId!==activeRevision)return 'revision_changed';
 if(!Array.isArray(slides)||slides.length<2||slides.length>10)return 'invalid_slides';
 if(fingerprint(assets)!==expectedFingerprint)return 'media_changed';
 const media=publishableMedia(assets),videos=media.filter(a=>a.kind==='mp4'),images=media.filter(isPublishableImage);
 if(format==='carousel'){
  // um item publicável por slide: vídeo, imagem ou os dois misturados
  if(media.length!==slides.length||!slides.every((_,i)=>media.filter(a=>a.provenance.slide===i+1).length===1)||media.some(a=>a.provenance.format!==undefined&&a.provenance.format!=='carousel'))return 'incomplete_media';
  if(images.some(a=>!imageShape(a,'carousel')))return 'incomplete_media';
 }else{
  if(media.length!==1)return 'incomplete_media';
  const p=media[0].provenance;
  if(images.length){
   if(format!=='story'||!imageShape(media[0],'story'))return 'incomplete_media';
  }else{
   if(p.format!==format||p.slide!==1||p.width!==1080||p.height!==1920||!Number.isFinite(p.duration)||p.duration<3||p.duration>(format==='story'?60:90))return 'incomplete_media';
   if(p.qa!=='vertical-layout-audio-passed')return 'qa_required';
  }
  if(mode==='automatic'&&format!=='reel')return 'invalid_mode';
 }
 if(images.some(a=>a.provenance.qa!==IMAGE_QA))return 'qa_required';
 if(review?.decision==='changes')return 'changes_requested';
 if(mode==='approved'&&(review?.decision!=='approved'||review.assetFingerprint!==expectedFingerprint))return 'approval_required';
 // o Studio não gera imagem: imagem nativa só sai aprovada à mão
 if(mode==='automatic'&&images.length)return 'invalid_mode';
 if(mode==='automatic'&&format==='carousel'&&videos.some(a=>!['loop-layout-determinism-passed','carousel-layout-audio-passed'].includes(a.provenance.qa)))return 'qa_required';
 if(!['approved','automatic'].includes(mode))return 'invalid_mode';
 return null;
}
// Rótulo "Feito com IA" da Meta: brief.ai_generated (boolean) manda; sem ele, conteúdo gerado pelo Studio
// leva o rótulo (comportamento da EDevsHub) e post pronto importado (production 'manual-only') não leva.
export function aiGenerated(brief){
 if(typeof brief?.ai_generated==='boolean')return brief.ai_generated;
 return brief?.production!=='manual-only';
}
// Collab: até 3 usernames do Instagram, sem @, sem repetição. Item inválido é descartado.
export function collaboratorsOf(brief){
 const out=[];
 for(const c of Array.isArray(brief?.collaborators)?brief.collaborators:[]){
  const u=String(c).trim().replace(/^@/,'').toLowerCase();
  if(/^[a-z0-9._]{1,30}$/.test(u)&&!out.includes(u))out.push(u);
 }
 return out.slice(0,3);
}
export function refreshDue(connection,now=Date.now()){
 const expiry=new Date(connection.expires_at).getTime(),last=new Date(connection.refreshed_at||connection.verified_at).getTime();
 return expiry>now&&expiry-now<14*86400000&&now-last>86400000;
}
