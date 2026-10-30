'use server';
import {headers,cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {contentAuth,contentConfigured} from '@/lib/content/auth';
import {parseDraft} from '@/lib/content/input';
import {saveDraft} from '@/lib/content/repository';
import {recordReview} from '@/lib/content/review';
import {requestRender} from '@/lib/content/render';
export async function renderPost(postId:string,revisionId:string){
 try{await requestRender(postId,revisionId);}catch{return {error:'Não foi possível pedir os vídeos. Confira se a revisão mudou ou já possui arquivos.'};}
 revalidatePath('/admin/conteudo');return {error:null};
}
export async function reviewPost(form:FormData){
 try{await recordReview(String(form.get('postId')||''),String(form.get('revisionId')||''),String(form.get('decision')||''),String(form.get('notes')||''),form.get('confirmed')==='on',String(form.get('assetFingerprint')||''));}
 catch(error){return {error:error instanceof Error&&/Confirme|Descreva|revisão mudou|Gere todos|Revise os campos|As mídias mudaram/.test(error.message)?error.message:'Não foi possível registrar a avaliação. Confira sua sessão e tente novamente.'};}
 revalidatePath('/admin/conteudo');return {error:null};
}
export async function requestLogin(form:FormData){
 if(!contentConfigured())redirect('/admin/login?status=setup');
 const email=String(form.get('email')||'').trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)redirect('/admin/login?status=invalid');
 const h=await headers();const origin=process.env.CONTENT_APP_ORIGIN||(process.env.NODE_ENV==='development'?'http://localhost:3000':'https://www.edevshub.com');
 if(h.get('origin')!==origin)redirect('/admin/login?status=invalid');
 const auth=await contentAuth();const {error}=await auth.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:origin+'/admin/auth/callback'}});
 redirect('/admin/login?status='+(error?'unavailable':'sent'));
}
// troca a marca do painel (cookie lido por lib/content/brand); só aceita marcas cadastradas
export async function selectBrand(form:FormData){
 const {brandContext,BRAND_COOKIE}=await import('@/lib/content/brand');
 const handle=String(form.get('marca')||''),{brands}=await brandContext();
 if(brands.some(b=>b.handle===handle))(await cookies()).set(BRAND_COOKIE,handle,{httpOnly:true,secure:true,sameSite:'lax',path:'/admin',maxAge:60*60*24*365});
 redirect('/admin/conteudo');
}
export async function logout(){const auth=await contentAuth();await auth.auth.signOut();redirect('/admin/login');}
export async function savePost(form:FormData){
 let id:string;
 try{id=await saveDraft(parseDraft(form),String(form.get('postId')||'')||undefined,String(form.get('revisionId')||'')||undefined);}
 catch{return {error:'Não foi possível salvar. Seu texto foi mantido. Confira os campos e a conexão. Se outra janela alterou este post, copie seu texto antes de recarregar.'};}
 revalidatePath('/admin/conteudo');return {id};
}
