'use client';
import {useEffect} from 'react';
// "Central" do seletor: volta para onde o usuário veio. Vindo do app do PC (localhost, ?volta=pc), volta para o prédio local
// na mesma janela; senão, para o painel /central do site. A marca fica na aba (sessionStorage) enquanto ele navega no admin.
const VOLTA_PC='http://localhost:4321/predio/';
export default function CentralLink({children}:{children:React.ReactNode}){
 useEffect(()=>{try{if(new URLSearchParams(location.search).get('volta')==='pc')sessionStorage.setItem('edh-volta','pc');}catch{/* sem sessionStorage */}},[]);
 const ir=(e:React.MouseEvent<HTMLAnchorElement>)=>{try{if(sessionStorage.getItem('edh-volta')==='pc'){e.preventDefault();location.href=VOLTA_PC;}}catch{/* segue para /central */}};
 return <a href="/central" onClick={ir}>{children}</a>;
}
