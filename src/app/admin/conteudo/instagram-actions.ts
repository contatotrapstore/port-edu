'use server';
import {connectInstagram} from '@/lib/content/instagram';
import {revalidatePath} from 'next/cache';
export async function saveInstagramConnection(form:FormData){
 try{await connectInstagram(String(form.get('token')||'').trim());revalidatePath('/admin/conteudo');return {ok:true};}
 catch{return {ok:false};}
}
