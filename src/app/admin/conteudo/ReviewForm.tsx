'use client';
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {reviewPost} from '../actions';
export default function ReviewForm({postId,revisionId,fingerprint}:{postId:string;revisionId:string;fingerprint:string}){
 const [message,setMessage]=useState(''),[pending,startTransition]=useTransition(),router=useRouter();
 return <form onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);const submitter=(event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement|null;data.set('decision',submitter?.value||'changes');startTransition(async()=>{try{const result=await reviewPost(data);setMessage(result.error||'Avaliação registrada. Nenhuma publicação foi autorizada.');if(!result.error)router.refresh();}catch{setMessage('Não foi possível confirmar o registro. Recarregue para conferir antes de tentar novamente.');}});}}>
  <fieldset disabled={pending} style={{border:0,padding:0,margin:0}}>
   <input type="hidden" name="assetFingerprint" value={fingerprint}/><input type="hidden" name="postId" value={postId}/><input type="hidden" name="revisionId" value={revisionId}/>
   <label htmlFor="review-notes">Comentários e ajustes</label><textarea id="review-notes" name="notes" rows={3} maxLength={2000} placeholder="Ex.: aumentar o texto da capa ou trocar a chamada final."/>
   <label className="studio-review-check"><input name="confirmed" type="checkbox"/> Conferi os vídeos, o áudio e a legenda da versão salva.</label>
   <p>Salve alterações no editor antes de avaliar. Esta aprovação é editorial: não agenda nem publica o post.</p>
   <div className="studio-review-buttons"><button type="submit" name="decision" value="changes">Pedir ajustes</button><button type="submit" name="decision" value="approved">Aprovar conteúdo</button></div>
  </fieldset>{message&&<p role="status" className="studio-notice">{message}</p>}
 </form>;
}
