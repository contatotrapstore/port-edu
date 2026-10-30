'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
// Depois de pedir o link: quando ele é aberto neste mesmo perfil do navegador (em outra aba ou janela, como o app da Central),
// a sessão passa a valer aqui também e esta tela entra sozinha, sem precisar recarregar. Desiste depois de 15 min.
export default function AguardaLogin(){
 const router=useRouter();
 useEffect(()=>{
  const fim=Date.now()+15*60e3;
  const id=setInterval(async()=>{
   if(Date.now()>fim){clearInterval(id);return;}
   try{const r=await fetch('/admin/login',{redirect:'manual',cache:'no-store'});if(r.type==='opaqueredirect'||r.redirected){clearInterval(id);router.replace('/admin/conteudo');}}catch{/* sem rede: tenta de novo */}
  },3000);
  return()=>clearInterval(id);
 },[router]);
 return null;
}
