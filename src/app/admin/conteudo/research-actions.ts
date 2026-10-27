'use server';
import {revalidatePath} from 'next/cache';
import {configureResearch} from '@/lib/content/research';
export async function updateResearch(form:FormData){
 try{await configureResearch(String(form.get('engine')),form.get('daily')==='on',form.get('generate')==='yes');revalidatePath('/admin/conteudo');return {ok:true};}
 catch{return {ok:false,error:'Não foi possível salvar a pesquisa. Confira sua sessão e tente novamente.'};}
}
