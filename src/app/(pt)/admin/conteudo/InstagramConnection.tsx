'use client';
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {saveInstagramApp,beginInstagramConnection} from './instagram-actions';
export default function InstagramConnection({connected,appReady,username}:{connected:boolean;appReady:boolean;username:string}){
 const [pending,start]=useTransition(),[message,setMessage]=useState(''),router=useRouter();
 return <section className="studio-operation studio-research"><h2>Conexão Instagram</h2><p>{connected?`@${username} conectado e identidade verificada.`:`Autorize @${username} pelo Instagram para conectar o Content Studio.`} Conectar não ativa publicação.</p>{appReady?<form action={beginInstagramConnection}><button disabled={pending}>Conectar com Instagram</button></form>:<details><summary>Configurar aplicativo Meta</summary><form onSubmit={event=>{event.preventDefault();const element=event.currentTarget,form=new FormData(element);start(async()=>{const result=await saveInstagramApp(form);setMessage(result.ok?'Aplicativo configurado. Agora conecte com Instagram.':'Chave do aplicativo inválida.');if(result.ok){element.reset();router.refresh();}});}}><label htmlFor="instagram-app-secret">Chave secreta do app Instagram</label><input id="instagram-app-secret" name="appSecret" type="password" autoComplete="off" required minLength={32} maxLength={32}/><button disabled={pending}>Salvar aplicativo</button></form></details>}{message&&<p role="status">{message}</p>}</section>;
}
