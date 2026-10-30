import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './auth';
import { contentDb } from './db';

export type ContentAsset={id:string;kind:'png'|'mp4'|'jpg'|'audio'|'qa';object_key:string;sha256:string;provenance:{slide?:number;format?:string;width?:number;height?:number;duration?:number;qa?:string;publish?:boolean;cover_ms?:number}};
export async function listAssets(revisionId:string){
  await requireAdmin();
  return (await contentDb().query<ContentAsset>('select id,kind,object_key,sha256,provenance from content_studio.assets where revision_id=$1 order by object_key',[revisionId])).rows;
}
// Assina todas as mídias da prévia numa chamada só (antes cada vídeo passava pela rota e assinava sozinho)
export async function signedPreviewUrls(assets:ContentAsset[]){
  await requireAdmin();
  const key=process.env.CONTENT_SUPABASE_STORAGE_KEY,url=process.env.NEXT_PUBLIC_CONTENT_SUPABASE_URL;
  const keys=assets.map(a=>a.object_key).filter(k=>/^[0-9a-f-]{36}\/[a-zA-Z0-9._-]+$/.test(k));
  if(!key||!url||!keys.length)return {} as Record<string,string>;
  const {data,error}=await createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}).storage.from('content-studio').createSignedUrls(keys,3600);
  if(error||!data)return {} as Record<string,string>;
  const byKey=Object.fromEntries(data.filter(d=>d.signedUrl&&d.path).map(d=>[d.path,d.signedUrl]));
  return Object.fromEntries(assets.filter(a=>byKey[a.object_key]).map(a=>[a.id,byKey[a.object_key]])) as Record<string,string>;
}
export async function getPreviewUrl(assetId:string){
  await requireAdmin();
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(assetId))throw Error('Arquivo indisponível');
  const asset=(await contentDb().query<ContentAsset>('select object_key from content_studio.assets where id=$1',[assetId])).rows[0];
  if(!asset||!/^[0-9a-f-]{36}\/[a-zA-Z0-9._-]+$/.test(asset.object_key))throw Error('Arquivo indisponível');
  const key=process.env.CONTENT_SUPABASE_STORAGE_KEY;
  const url=process.env.NEXT_PUBLIC_CONTENT_SUPABASE_URL;
  if(!key||!url)throw Error('Storage indisponível');
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await client.storage.from('content-studio').createSignedUrl(asset.object_key,300);
  if(error||!data)throw Error('Arquivo indisponível');
  return data.signedUrl;
}
// Copia arquivos dentro do bucket privado (post importado: legenda nova reaproveita a mídia já conferida).
// Falhou no meio: apaga o que já tinha copiado e avisa; nada fica pela metade.
function storageClient(){
  const key=process.env.CONTENT_SUPABASE_STORAGE_KEY,url=process.env.NEXT_PUBLIC_CONTENT_SUPABASE_URL;
  if(!key||!url)throw Error('Storage indisponível');
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}).storage.from('content-studio');
}
const KEY=/^[0-9a-f-]{36}\/[a-zA-Z0-9._-]+$/;
export async function copyAssetObjects(pairs:{from:string;to:string}[]){
  await requireAdmin();
  if(!pairs.length)return [] as string[];
  if(!pairs.every(p=>KEY.test(p.from)&&KEY.test(p.to)))throw Error('Arquivo indisponível');
  const bucket=storageClient(),done:string[]=[];
  for(const p of pairs){
    const {error}=await bucket.copy(p.from,p.to);
    if(error){await removeAssetObjects(done);throw Error('Não foi possível copiar as mídias.');}
    done.push(p.to);
  }
  return done;
}
export async function removeAssetObjects(keys:string[]){
  await requireAdmin();
  const valid=keys.filter(k=>KEY.test(k));
  if(!valid.length)return;
  try{await storageClient().remove(valid);}catch{/* limpeza de cópia sem referência no banco: não bloqueia */}
}
