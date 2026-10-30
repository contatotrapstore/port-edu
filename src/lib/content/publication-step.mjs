// One resumable step. Caller persists checkpoints and serializes execution.
export async function advancePublication(input,previous,api,save,allow){
 let state={children:[],...previous};
 const checkpoint=async patch=>{const next={...state,...patch};await save(next);state=next;return state;};
 if(!input.enabled||!await allow())return {...state,phase:'paused'};
 const format=input.format===undefined?'carousel':input.format;
 if(!['carousel','reel','story'].includes(format)||!/^\d+$/.test(input.accountId)||!Array.isArray(input.videos)||(format==='carousel'?(input.videos.length<2||input.videos.length>10):input.videos.length!==1)||typeof input.caption!=='string'||input.caption.length>2200)throw Error('invalid_publication');
 if(state.phase==='complete'||state.phase==='failed')return state;
 if(['creating_child','creating_parent'].includes(state.phase))return checkpoint({phase:'unknown',reason:'interrupted_creation'});
 if(['sending','unknown'].includes(state.phase)){
  if(state.parent){const status=await api(state.parent,{fields:'status_code'},'GET');if(status.status_code==='PUBLISHED')return checkpoint({phase:'complete',reconciled:true});}
  return checkpoint({phase:'unknown'});
 }
 try{
  if(format==='carousel'&&state.children.length<input.videos.length){
   if(!await allow())return {...state,phase:'paused'};
   await checkpoint({phase:'creating_child'});
   const child=await api(`${input.accountId}/media`,{media_type:'VIDEO',is_carousel_item:'true',video_url:input.videos[state.children.length]},'POST');
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
   const params=format==='carousel'?{media_type:'CAROUSEL',children:state.children.join(','),caption:input.caption,is_ai_generated:'true'}:{media_type:format==='reel'?'REELS':'STORIES',video_url:input.videos[0],is_ai_generated:'true',...(format==='reel'?{caption:input.caption,share_to_feed:'true',...(Number.isInteger(input.coverMs)&&input.coverMs>=0?{thumb_offset:String(input.coverMs)}:{})}:{})};
   const parent=await api(`${input.accountId}/media`,params,'POST');
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
