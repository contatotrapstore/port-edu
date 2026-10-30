import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { contentDb } from './db';
export function contentConfigured(){return !!(process.env.CONTENT_DATABASE_URL&&process.env.NEXT_PUBLIC_CONTENT_SUPABASE_URL&&process.env.NEXT_PUBLIC_CONTENT_SUPABASE_PUBLISHABLE_KEY);}
export async function contentAuth(){
  const jar=await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_CONTENT_SUPABASE_URL!,process.env.NEXT_PUBLIC_CONTENT_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll:()=>jar.getAll(),setAll:values=>{try{for(const {name,value,options}of values)jar.set(name,value,options);}catch{/* Server components are refreshed by proxy. */}}}});
}
// Uma verificação por requisição: a página chama vários carregadores que exigem admin
export const getAdmin=cache(async function getAdmin(){
  if(!contentConfigured())return null;
  const auth=await contentAuth();const {data,error}=await auth.auth.getUser();
  if(error||!data.user)return null;
  const result=await contentDb().query('select user_id from content_studio.admin_users where user_id=$1',[data.user.id]);
  return result.rowCount ? {id:data.user.id,email:data.user.email} : null;
});
export async function requireAdmin(){const user=await getAdmin();if(!user)throw new Error('Acesso administrativo necessário.');return user;}
