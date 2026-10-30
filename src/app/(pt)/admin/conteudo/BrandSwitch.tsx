"use client";
import {useFormStatus} from 'react-dom';

// Botões de marca: o clicado mostra que está trocando na hora (o servidor monta a outra marca em seguida)
type Item={handle:string;name:string;username:string};
function Botoes({brands,current}:{brands:Item[];current:string}){
  const {pending,data}=useFormStatus(),alvo=pending?String(data?.get('marca')||''):'';
  return <>{brands.map(b=><button key={b.handle} name="marca" value={b.handle} disabled={pending} aria-current={b.handle===current?'true':undefined} data-pending={alvo===b.handle?'1':undefined}>{b.name}<small>{alvo===b.handle?'Abrindo…':'@'+b.username}</small></button>)}</>;
}
export default function BrandSwitch({brands,current,action}:{brands:Item[];current:string;action:(form:FormData)=>Promise<void>}){
  return <form action={action} className="studio-brands" aria-label="Marca"><Botoes brands={brands} current={current}/></form>;
}
