'use server';
import {revalidatePath} from 'next/cache';
import {configureInstagramApp,instagramAuthorizationUrl} from '@/lib/content/instagram-oauth';
import {redirect} from 'next/navigation';
export async function beginInstagramConnection(){let url:string;try{url=await instagramAuthorizationUrl();}catch{return;}redirect(url);}
export async function saveInstagramApp(form:FormData){try{await configureInstagramApp(String(form.get('appSecret')||'').trim());revalidatePath('/admin/conteudo');return {ok:true};}catch{return {ok:false};}}
