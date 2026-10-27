"use client";
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {savePublication,prepareSchedule,removeSchedule} from './publication-actions';
type Props={enabled:boolean;location:string;mode:string;time:string;connected:boolean;online:boolean;lastSeen:string|null;error:string|null;postId?:string;revisionId?:string;schedules:{id:string;topic:string;state:string;local_date:string;local_time:string;publication_state:string|null}[]};
export default function PublicationControl(props:Props){
 const [enabled,setEnabled]=useState(props.enabled),[mode,setMode]=useState(props.mode),[time,setTime]=useState(props.time.slice(0,5)),[message,setMessage]=useState(''),[pending,start]=useTransition(),router=useRouter();
 return <section id="agenda" className="studio-operation studio-research" aria-labelledby="agenda-title">
  <h2 id="agenda-title">Agenda e publicação</h2>
  <p><strong>{props.online?(props.location==='cloud'?'Publicador online na nuvem':'Publicador online neste PC'):'Publicador sem sinal recente'}</strong>{props.lastSeen?' · Último sinal: '+props.lastSeen:''}</p>
  <p>{props.location==='cloud'?'Vídeos prontos são publicados mesmo com o PC desligado. Ligue o PC somente para pesquisar e produzir novos carrosséis.':'Mantenha o Windows conectado e o worker ligado para publicar.'} Um post por dia. Tolerância de 15 minutos; depois disso, o horário é marcado como perdido, sem publicar atrasados em sequência.</p>
  {props.error&&<p role="alert">A operação precisa de atenção ({props.error}). Confira a conexão e o executor antes de ativar.</p>}
  <form onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);start(async()=>{const result=await savePublication(form);setMessage(result.ok?'Configuração de publicação salva.':'Não foi possível salvar. Para ativar, confira Instagram conectado, executor online, confirmação e horário.');if(result.ok)router.refresh();});}}>
   <fieldset disabled={pending}><legend>Modo de publicação</legend>
    <label><input type="radio" name="mode" value="approved" checked={mode==='approved'} onChange={()=>setMode('approved')}/> Somente posts aprovados e agendados por mim</label>
    <label><input type="radio" name="mode" value="automatic" checked={mode==='automatic'} onChange={()=>setMode('automatic')}/> Automático: escolher um rascunho recente por dia, sem minha aprovação individual</label>
    <p>No modo automático, usa uma produção das últimas 36 horas, com vídeos completos e verificação técnica. Pedidos de ajustes impedem a seleção. A IA pode cometer erros editoriais.</p>
    <label htmlFor="publication-time">Horário diário do modo automático — Brasília (obrigatório)</label><input id="publication-time" name="time" type="time" value={time} onChange={e=>setTime(e.target.value)} required/>
    <p>12h30 é um ponto inicial para testar, não uma garantia de alcance. O horário manual é definido em cada agenda.</p>
    <label><input name="enabled" type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)} disabled={!props.connected&&!props.enabled}/> Habilitar publicação no Instagram</label>
    {enabled&&<label><input name="confirmed" type="checkbox" required/> Confirmo o modo escolhido e autorizo publicar no @edevshub, incluindo agendas futuras preparadas.</label>}
    <button type="submit">{pending?'Salvando…':'Salvar configuração de publicação'}</button>
   </fieldset>
  </form>
  <p>Desativar bloqueia os próximos envios. Um envio que a Meta já recebeu pode terminar; o sistema confere o resultado sem reenviar.</p>
  {props.postId&&<details><summary>Agendar a revisão selecionada</summary><p>Exige aprovação desta versão e de suas mídias. Entre cinco minutos e 30 dias no futuro. Com publicação desligada, fica preparado e pausado.</p>
   <form onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);start(async()=>{const result=await prepareSchedule(form);setMessage(result.ok?'Agenda preparada. Confira o estado abaixo.':'Confira aprovação desta versão, vídeos completos, horário futuro e disponibilidade do dia.');if(result.ok)router.refresh();});}}>
    <input type="hidden" name="postId" value={props.postId}/><input type="hidden" name="revisionId" value={props.revisionId}/><label htmlFor="schedule-local">Data e horário de Brasília (obrigatório)</label><input id="schedule-local" name="local" type="datetime-local" required/><button disabled={pending}>Preparar agendamento</button>
   </form>
  </details>}
  {message&&<p role="status">{message}</p>}
  <button type="button" disabled={pending} onClick={()=>router.refresh()}>Atualizar operação</button>
  {props.schedules.length===0?<p>Nenhum post agendado.</p>:<ul>{props.schedules.map(s=><li key={s.id}>{s.local_date.split('-').reverse().join('/')} {s.local_time.slice(0,5)} · {s.topic} · {({paused:'Preparado / pausado',scheduled:'Agendado',missed:'Horário perdido',cancelled:'Cancelado',completed:'Concluído'} as Record<string,string>)[s.state]||s.state}
   {s.publication_state==='unknown'&&<strong> · Resultado incerto: confira o Instagram. Não será reenviado automaticamente.</strong>}{s.publication_state==='failed'&&<strong> · A Meta recusou o processamento. Cancele e prepare uma nova revisão.</strong>}
   {['paused','scheduled','missed'].includes(s.state)&&<button type="button" disabled={pending} onClick={()=>start(async()=>{const result=await removeSchedule(s.id);setMessage(result.ok?'Agenda cancelada.':'Não foi possível cancelar: pode já estar em envio ou aguardando conferência da Meta.');router.refresh();})}>Cancelar agenda</button>}
  </li>)}</ul>}
 </section>;
}
