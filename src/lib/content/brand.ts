import 'server-only';
import {cache} from 'react';
import {cookies} from 'next/headers';
import {requireAdmin} from './auth';
import {contentDb} from './db';
import {EXPECTED_ACCOUNT} from './instagram-core.mjs';

export type Brand={id:string;handle:string;name:string;username:string;account:string|null;guidelines:Record<string,unknown>};
export const BRAND_COOKIE='studio_marca';

// Marca escolhida no painel (cookie); sem escolha, a EDevsHub. A conta do Instagram vem da conexão salva
// (ou da conta conhecida da EDevsHub, antes de existir conexão).
export const brandContext=cache(async function brandContext(){
 await requireAdmin();
 const rows=(await contentDb().query<{id:string;handle:string;guidelines:Record<string,unknown>|null;account_id:string|null;username:string|null}>("select b.id,b.handle,b.guidelines,c.account_id,c.username from content_studio.brands b left join content_studio.instagram_connections c on c.brand_id=b.id order by b.created_at")).rows;
 const brands:Brand[]=rows.map(r=>{const g=r.guidelines||{};return {id:r.id,handle:r.handle,guidelines:g,
  name:String(g.name||(r.handle==='edevshub'?'EDevsHub':r.handle)),
  username:String(r.username||g.instagram_username||r.handle),
  account:r.account_id||(r.handle==='edevshub'?EXPECTED_ACCOUNT:null)};});
 const wanted=(await cookies()).get(BRAND_COOKIE)?.value;
 const brand=brands.find(b=>b.handle===wanted)||brands.find(b=>b.handle==='edevshub')||brands[0];
 return {brand,brands};
});
export async function currentBrand(){return (await brandContext()).brand;}
