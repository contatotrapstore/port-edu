"use client";
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {savePublication,prepareSchedule,removeSchedule} from './publication-actions';
type Props={enabled:boolean;location:string;mode:string;time:string;connected:boolean;online:boolean;lastSeen:string|null;error:string|null;postId?:string;revisionId?:string;schedules:{id:string;topic:string;format?:string;state:string;local_date:string;local_time:string;publication_state:string|null}[]};
export default function PublicationControl(props:Props){
 const [enabled,setEnabled]=useState(props.enabled),[mode,setMode]=useState(props.mode),[time,setTime]=useState(props.time.slice(0,5)),[message,setMessage]=useState(''),[pending,start]=useTransition(),router=useRouter();
 return <section id="agenda" className="studio-operation studio-research" aria-labelledby="agenda-title">
  <div className="studio-sectionhead"><h2 id="agenda-title">Agenda</h2><button type="button" className="studio-link-button" disabled={pending} onClick={()=>router.refresh()}>Atualizar</button></div>
  <p className="studio-fieldhint">{props.online?(props.location==='cloud'?'Publicador online na nuvem: publica mesmo com o PC desligado.':'Publicador online neste PC: mantenha o PC e o worker ligados.'):'Publicador sem sinal recente.'}{props.lastSeen?' Último sinal '+props.lastSeen+'.':''} Até um carrossel, um Reel e um Story por dia.</p>
  {props.error&&<p role="alert">A operação precisa de atenção ({props.error}). Confira a conexão e o executor antes de ativar.</p>}
  {props.postId&&<form className="studio-schedule" onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);start(async()=>{const result=await prepareSchedule(form);setMessage(result.ok?'Agenda preparada. Confira o estado abaixo.':'Confira aprovação desta versão, vídeos completos, horário futuro e disponibilidade desse formato no dia.');if(result.ok)router.refresh();});}}>
   <input type="hidden" name="postId" value={props.postId}/><input type="hidden" name="revisionId" value={props.revisionId}/><label htmlFor="schedule-local">Agendar a pauta aberta (horário de Brasília)</label><div><input id="schedule-local" name="local" type="datetime-local" required/><button disabled={pending}>Agendar</button></div><p className="studio-fieldhint">Precisa estar aprovada, de 5 min a 30 dias no futuro.</p>
  </form>}
  {message&&<p role="status">{message}</p>}
  <details className="studio-fold"><summary>Configurar publicação · {mode==='automatic'?'automática às '+time:'só o que eu agendar'} · {enabled?'ligada':'desligada'}</summary>
  <form onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);start(async()=>{const result=await savePublication(form);setMessage(result.ok?'Configuração de publicação salva.':'Não foi possível salvar. Para ativar, confira Instagram conectado, executor online, confirmação e horário.');if(result.ok)router.refresh();});}}>
   <fieldset disabled={pending}><legend>Modo de publicação</legend>
    <label><input type="radio" name="mode" value="approved" checked={mode==='approved'} onChange={()=>setMode('approved')}/> Somente posts aprovados e agendados por mim</label>
    <label><input type="radio" name="mode" value="automatic" checked={mode==='automatic'} onChange={()=>setMode('automatic')}/> Automático: escolher um rascunho recente por dia, sem minha aprovação individual</label>
    <p className="studio-fieldhint">Automático: usa uma produção das últimas 36 h com vídeos completos; pedidos de ajuste impedem a escolha.</p>
    {mode==='automatic'?<><label htmlFor="publication-time">Horário diário (Brasília)</label><input id="publication-time" name="time" type="time" value={time} onChange={e=>setTime(e.target.value)} required/></>:<input type="hidden" name="time" value={time}/>}
    <label><input name="enabled" type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)} disabled={!props.connected&&!props.enabled}/> Habilitar publicação no Instagram</label>
    {enabled&&<label><input name="confirmed" type="checkbox" required/> Confirmo o modo escolhido e autorizo publicar no @edevshub, incluindo agendas futuras preparadas.</label>}
    <button type="submit">{pending?'Salvando…':'Salvar'}</button>
   </fieldset>
  </form>
  </details>
  {(()=>{const ativos=props.schedules.filter(s=>!['cancelled','completed'].includes(s.state)),historico=props.schedules.filter(s=>['cancelled','completed'].includes(s.state));
   const item=(s:Props['schedules'][number])=><li key={s.id}>{s.local_date.split('-').reverse().join('/')} {s.local_time.slice(0,5)} · {s.format==='reel'?'Reel':s.format==='story'?'Story':'Carrossel'} · {s.topic} · {({paused:'Preparado / pausado',scheduled:'Agendado',missed:'Horário perdido',cancelled:'Cancelado',completed:'Concluído'} as Record<string,string>)[s.state]||s.state}
   {s.publication_state==='unknown'&&<strong> · Resultado incerto: confira o Instagram. Não será reenviado automaticamente.</strong>}{s.publication_state==='failed'&&<strong> · A Meta recusou o processamento. Cancele e prepare uma nova revisão.</strong>}
   {['paused','scheduled','missed'].includes(s.state)&&<button type="button" disabled={pending} onClick={()=>start(async()=>{const result=await removeSchedule(s.id);setMessage(result.ok?'Agenda cancelada.':'Não foi possível cancelar: pode já estar em envio ou aguardando conferência da Meta.');router.refresh();})}>Cancelar</button>}
  </li>;
   return <>{ativos.length===0?<p>Nenhum post agendado.</p>:<ul>{ativos.map(item)}</ul>}{historico.length>0&&<details className="studio-history"><summary>Histórico ({historico.length} concluídos ou cancelados)</summary><ul>{historico.map(item)}</ul></details>}</>;})()}
 </section>;
}
