'use client';
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {renderPost} from '../actions';
export default function RenderControl({postId,revisionId,state}:{postId:string;revisionId:string;state?:string}){
 const [message,setMessage]=useState(''),[pending,start]=useTransition(),router=useRouter();
 const waiting=state==='queued'||state==='running';
 return <div className="studio-render-control"><p>{state==='queued'?'Na fila. O worker deste PC precisa estar em execução.':state==='running'?'Gerando vídeos neste PC. Aguarde a conclusão.':state==='failed'?'A geração foi interrompida. Confira o worker local antes de tentar novamente.':'Gere os vídeos da versão salva para revisar animação e áudio.'}</p><button disabled={pending||waiting} onClick={()=>start(async()=>{try{const result=await renderPost(postId,revisionId);setMessage(result.error||'Pedido enviado à fila local.');router.refresh();}catch{setMessage('Não foi possível confirmar o pedido. Atualize o status antes de repetir.');}})}>Gerar vídeos</button>{' '}<button onClick={()=>router.refresh()}>Atualizar status</button>{message&&<p role="status">{message}</p>}</div>;
}
