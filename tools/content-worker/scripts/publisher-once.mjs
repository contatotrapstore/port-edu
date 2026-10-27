import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseEnv} from 'node:util';
import pg from 'pg';
import {createClient} from '@supabase/supabase-js';
import {publicationTick} from './publication-queue.mjs';
import {refreshDue} from '../../../src/lib/content/publication-policy.mjs';
import {decryptToken,encryptToken,instagramRequest,verifyInstagram,EXPECTED_ACCOUNT} from '../../../src/lib/content/instagram-core.mjs';
const repo=fileURLToPath(new URL('../../../',import.meta.url)),env=parseEnv(fs.readFileSync(path.join(repo,'.env.local'),'utf8'));
const url=new URL(env.CONTENT_DATABASE_URL);for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
const pool=new pg.Pool({connectionString:url.href,ssl:{rejectUnauthorized:true,ca:env.CONTENT_DATABASE_CA},max:1,statement_timeout:15000,connectionTimeoutMillis:10000});
let db,locked=false;
try{
 db=await pool.connect();locked=(await db.query('select pg_try_advisory_lock(718264,1) as locked')).rows[0].locked;
 if(locked){
  let connection=(await db.query('select * from content_studio.instagram_connections where account_id=$1',[EXPECTED_ACCOUNT])).rows[0];
  let token=connection?decryptToken(connection.token_ciphertext,env.CONTENT_TOKEN_ENCRYPTION_KEY):null;
  if(connection?.health==='verified'&&refreshDue(connection)){
   // Official refresh endpoint requires token in query. Never print URL, errors or responses.
   const refresh=new URL('https://graph.instagram.com/refresh_access_token');refresh.searchParams.set('grant_type','ig_refresh_token');refresh.searchParams.set('access_token',token);
   let response,data;try{response=await fetch(refresh,{signal:AbortSignal.timeout(30000)});data=await response.json();}catch{throw Error('token_refresh_failed');}
   if(!response.ok||!data.access_token||!Number.isFinite(data.expires_in))throw Error(data?.error?.code===190?'instagram_reconnect_required':'token_refresh_failed');
   await verifyInstagram(data.access_token);token=data.access_token;
   await db.query("update content_studio.instagram_connections set token_ciphertext=$1,refreshed_at=now(),expires_at=now()+$2*interval '1 second' where account_id=$3",[encryptToken(token,env.CONTENT_TOKEN_ENCRYPTION_KEY),data.expires_in,EXPECTED_ACCOUNT]);
  }
  const storage=createClient(env.NEXT_PUBLIC_CONTENT_SUPABASE_URL,env.CONTENT_SUPABASE_STORAGE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  const api=async(endpoint,params,method)=>{
   if(!token)throw Error('instagram_reconnect_required');
   if(method==='POST'&&endpoint.endsWith('/media_publish')){
    const quota=await instagramRequest(token,`${EXPECTED_ACCOUNT}/content_publishing_limit`,{fields:'config,quota_usage'});
    const limits=quota.data?.[0];if(!limits||!Number.isFinite(limits.quota_usage)||!Number.isFinite(limits.config?.quota_total)||limits.quota_usage>=limits.config.quota_total)throw Error('publishing_quota_unavailable');
   }
   return instagramRequest(token,endpoint,params,method);
  };
  const sign=async key=>{const {data,error}=await storage.storage.from('content-studio').createSignedUrl(key,3600);if(error||!data?.signedUrl)throw Error('media_url_failed');return data.signedUrl;};
  await publicationTick(db,{api,sign});
  await db.query("update content_studio.settings set publisher_error=null where brand_id=(select id from content_studio.brands where handle='edevshub') and publisher_error not in ('revision_changed','media_changed','approval_required','changes_requested')");
 }
}catch(error){
 const safe=['instagram_reconnect_required','token_refresh_failed','publishing_quota_unavailable','media_url_failed','instagram_request_rejected','provider_unavailable'].includes(error.message)?error.message:'publisher_failed';
 if(db){await db.query("update content_studio.settings set publisher_seen_at=now(),publisher_error=$1,publication_enabled=case when $1='instagram_reconnect_required' then false else publication_enabled end where brand_id=(select id from content_studio.brands where handle='edevshub')",[safe]).catch(()=>{});
 if(safe==='instagram_reconnect_required')await db.query("update content_studio.instagram_connections set health='reconnect' where account_id=$1",[EXPECTED_ACCOUNT]).catch(()=>{});}
 console.error('Publicador: '+safe);process.exitCode=1;
}finally{if(locked)await db.query('select pg_advisory_unlock(718264,1)').catch(()=>{});db?.release();await pool.end();}
