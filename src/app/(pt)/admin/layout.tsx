import type {Metadata} from 'next';
import './studio.css';
export const metadata:Metadata={title:'Content Studio · edevshub',robots:{index:false,follow:false},alternates:{canonical:null}};
export const dynamic='force-dynamic';
export default function AdminLayout({children}:{children:React.ReactNode}){return <div data-scroll-page className="studio-root">{children}</div>;}
