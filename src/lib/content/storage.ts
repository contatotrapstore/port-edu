import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './auth';
import { contentDb } from './db';

export type ContentAsset={id:string;kind:'png'|'mp4'|'audio'|'qa';object_key:string;sha256:string;provenance:{slide?:number;format?:string;width?:number;height?:number;duration?:number;qa?:string}};
export async function listAssets(revisionId:string){
  await requireAdmin();
  return (await contentDb().query<ContentAsset>('select id,kind,object_key,sha256,provenance from content_studio.assets where revision_id=$1 order by object_key',[revisionId])).rows;
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
