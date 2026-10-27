'use server';
import {revalidatePath} from 'next/cache';
import {configurePublication,scheduleDraft,cancelSchedule} from '@/lib/content/scheduling';
export async function savePublication(form:FormData){try{await configurePublication(form.get('enabled')==='on',String(form.get('mode')),String(form.get('time')),form.get('confirmed')==='on');revalidatePath('/admin/conteudo');return {ok:true};}catch{return {ok:false};}}
export async function prepareSchedule(form:FormData){try{await scheduleDraft(String(form.get('postId')),String(form.get('revisionId')),String(form.get('local')));revalidatePath('/admin/conteudo');return {ok:true};}catch{return {ok:false};}}

export async function removeSchedule(id:string){try{await cancelSchedule(id);revalidatePath("/admin/conteudo");return {ok:true};}catch{return {ok:false};}}
