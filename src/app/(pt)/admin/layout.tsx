import type {Metadata} from 'next';
import {Instrument_Sans} from 'next/font/google';
import './studio.css';
// Mesma fonte da Central de Agentes: o estúdio e a Central parecem um app só
const central=Instrument_Sans({subsets:['latin'],variable:'--font-central',weight:['400','500','600','700']});
export const metadata:Metadata={title:'Content Studio · EDevsHub',robots:{index:false,follow:false},alternates:{canonical:null}};
export const dynamic='force-dynamic';
export default function AdminLayout({children}:{children:React.ReactNode}){return <div data-scroll-page className={'studio-root '+central.variable}>{children}</div>;}
