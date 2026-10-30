"use client";
import Link,{useLinkStatus} from 'next/link';
import type {ReactNode} from 'react';

// Marca a pauta clicada enquanto o servidor monta a prévia (resposta imediata ao clique)
function Pending(){const {pending}=useLinkStatus();return <span className="studio-pending" data-on={pending?'1':'0'} aria-hidden="true"/>;}
export default function PautaLink({href,selected,children}:{href:string;selected:boolean;children:ReactNode}){
  return <Link href={href} className={selected?'is-selected':''} scroll={false} prefetch={false}><Pending/>{children}</Link>;
}
