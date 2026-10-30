// One resumable step. Caller persists checkpoints and serializes execution.
// input.media: [{type:'video'|'image',url}] na ordem dos slides (input.videos, só URLs de vídeo, segue aceito).
// input.aiGenerated: false omite is_ai_generated (padrão: true, como sempre foi na EDevsHub).
// input.collaborators: até 3 usernames; vão no contêiner pai de carrossel e de Reel (Story não aceita).
const USERNAME=/^[a-z0-9._]{1,30}$/i;
// Recusa da Meta ligada ao convite de Collab (conta privada, usuário inexistente, recurso indisponível...).
// Só o texto do erro da Meta decide; recusa genérica continua falhando como antes.
export function collaboratorRejection(error){
 const text=error?.message==='instagram_request_rejected'?error.provider?.text:null;
 return typeof text==='string'&&/collab|colabora/i.test(text);
}
function mediaOf(input){
 if(Array.isArray(input.media))return input.media;
 if(Array.isArray(input.videos))return input.videos.map(url=>({type:'video',url}));
 return null;
}
export async function advancePublication(input,previous,api,save,allow){
 let state={children:[],...previous};
 const checkpoint=async patch=>{const next={...state,...patch};await save(next);state=next;return state;};
 if(!input.enabled||!await allow())return {...state,phase:'paused'};
 const format=input.format===undefined?'carousel':input.format;
 const media=mediaOf(input),collaborators=input.collaborators===undefined?[]:input.collaborators;
 if(!['carousel','reel','story'].includes(format)||!/^\d+$/.test(input.accountId)||!Array.isArray(media)||(format==='carousel'?(media.length<2||media.length>10):media.length!==1)
  ||!media.every(m=>['video','image'].includes(m?.type)&&typeof m.url==='string'&&m.url.length>0)||(format==='reel'&&media[0].type!=='video')
  ||typeof input.caption!=='string'||input.caption.length>2200
  ||(input.aiGenerated!==undefined&&typeof input.aiGenerated!=='boolean')
  ||!Array.isArray(collaborators)||collaborators.length>3||!collaborators.every(c=>typeof c==='string'&&USERNAME.test(c)))throw Error('invalid_publication');
 if(state.phase==='complete'||state.phase==='failed')return state;
 if(['creating_child','creating_parent'].includes(state.phase))return checkpoint({phase:'unknown',reason:'interrupted_creation'});
 if(['sending','unknown'].includes(state.phase)){
  if(state.parent){const status=await api(state.parent,{fields:'status_code'},'GET');if(status.status_code==='PUBLISHED')return checkpoint({phase:'complete',reconciled:true});}
  return checkpoint({phase:'unknown'});
 }
 try{
  if(format==='carousel'&&state.children.length<media.length){
   if(!await allow())return {...state,phase:'paused'};
   await checkpoint({phase:'creating_child'});
   const item=media[state.children.length];
   // filho de carrossel: imagem sem media_type (padrão IMAGE); is_ai_generated só no pai (no filho é erro)
   const child=await api(`${input.accountId}/media`,item.type==='image'?{image_url:item.url,is_carousel_item:'true'}:{media_type:'VIDEO',is_carousel_item:'true',video_url:item.url},'POST');
   if(!/^\d+$/.test(String(child.id)))throw Error('provider_outcome_unknown');
   return checkpoint({children:[...state.children,String(child.id)],phase:'preparing'});
  }
  if(format==='carousel'&&!state.childrenReady){
   const statuses=await Promise.all(state.children.map(id=>api(id,{fields:'status_code'},'GET')));
   if(statuses.some(s=>['ERROR','EXPIRED'].includes(s.status_code)))return checkpoint({phase:'failed',reason:'media_processing_failed'});
   if(statuses.some(s=>s.status_code!=='FINISHED'))return state;
   await checkpoint({childrenReady:true});
  }
  if(!state.parent){
   if(!await allow())return {...state,phase:'paused'};
   await checkpoint({phase:'creating_parent'});
   const ai=input.aiGenerated===false?{}:{is_ai_generated:'true'};
   const first=media[0];
   const params=format==='carousel'?{media_type:'CAROUSEL',children:state.children.join(','),caption:input.caption,...ai}
    :format==='story'?{media_type:'STORIES',...(first.type==='image'?{image_url:first.url}:{video_url:first.url}),...ai}
    :{media_type:'REELS',video_url:first.url,...ai,caption:input.caption,share_to_feed:'true',...(Number.isInteger(input.coverMs)&&input.coverMs>=0?{thumb_offset:String(input.coverMs)}:{})};
   const collab=format!=='story'&&collaborators.length&&!state.collaboratorsDropped?{collaborators:JSON.stringify(collaborators)}:null;
   let parent;
   try{parent=await api(`${input.accountId}/media`,collab?{...params,...collab}:params,'POST');}
   catch(error){
    if(!collab||!collaboratorRejection(error))throw error;
    // A recusa não cria contêiner: registra o aviso e refaz o pai sem collaborators, sem falhar a publicação.
    await checkpoint({collaboratorsDropped:true,warnings:[...(state.warnings||[]),{code:'collaborators_rejected',collaborators,providerCode:error.provider?.code??null,providerSubcode:error.provider?.subcode??null}]});
    parent=await api(`${input.accountId}/media`,params,'POST');
   }
   if(!/^\d+$/.test(String(parent.id)))throw Error('provider_outcome_unknown');
   return checkpoint({parent:String(parent.id),phase:'preparing'});
  }
  const status=await api(state.parent,{fields:'status_code'},'GET');
  if(status.status_code==='PUBLISHED')return checkpoint({phase:'complete',reconciled:true});
  if(['ERROR','EXPIRED'].includes(status.status_code))return checkpoint({phase:'failed',reason:'container_expired_or_failed'});
  if(status.status_code!=='FINISHED'||!input.due)return state;
  if(!await allow())return {...state,phase:'paused'};
  await checkpoint({phase:'sending'});
  const published=await api(`${input.accountId}/media_publish`,{creation_id:state.parent},'POST');
  if(!/^\d+$/.test(String(published.id)))throw Error('provider_outcome_unknown');
  return checkpoint({phase:'complete',mediaId:String(published.id)});
 }catch(error){
  if(error.message==='publication_paused')return {...state,phase:'paused'};
  if(state.phase==='sending'||error.message==='provider_outcome_unknown')return checkpoint({phase:'unknown'});
  throw error;
 }
}
