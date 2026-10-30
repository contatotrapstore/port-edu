import pg from 'pg';
import {publisherConnectionString} from './publisher-security.mjs';
import {createClient} from '@supabase/supabase-js';
import {publicationTick} from './publication-queue.mjs';
import {refreshDue} from './publication-policy.mjs';
import {decryptToken,encryptToken,instagramRequest,verifyInstagram,EXPECTED_ACCOUNT} from './instagram-core.mjs';
export async function runPublisher(env,source){
const deadline=Date.now()+150000;
const pool=new pg.Pool({connectionString:publisherConnectionString(env.CONTENT_DATABASE_URL),ssl:{rejectUnauthorized:true,ca:env.CONTENT_DATABASE_CA},max:1,statement_timeout:15000,connectionTimeoutMillis:10000});
let db;
try{
 db=await pool.connect();
 // marcas publicadas daqui (nuvem ou PC); EDevsHub primeiro
 const brands=(await db.query("select b.id,b.handle,c.account_id from content_studio.brands b join content_studio.settings s on s.brand_id=b.id left join content_studio.instagram_connections c on c.brand_id=b.id where s.publisher_location=$1 order by (b.handle='edevshub') desc,b.created_at",[source])).rows;
 if(!brands.length)return {state:'inactive'};
 const results=[];
 for(const b of brands){
  if(Date.now()>deadline)break;
  results.push({brand:b.handle,...await brandTick(db,env,{id:b.id,handle:b.handle,account:b.account_id||(b.handle==='edevshub'?EXPECTED_ACCOUNT:null)},deadline)});
 }
 const first=results.find(x=>x.state==='error')||results[0]||{state:'idle'};
 return {...first,brands:results};
}finally{db?.release();await pool.end();}
}

async function brandTick(db,env,brand,deadline){
 const lockKey=brand.handle==='edevshub'?1:2+Math.abs([...brand.handle].reduce((h,c)=>(h*31+c.charCodeAt(0))|0,0))%1000000;
 const locked=(await db.query('select pg_try_advisory_lock(718264,$1) as locked',[lockKey])).rows[0].locked;
 if(!locked)return {state:'busy'};
 try{
  if(!brand.account){await db.query("update content_studio.settings set publisher_seen_at=now() where brand_id=$1",[brand.id]);return {state:'not_connected'};}
  let connection=(await db.query('select * from content_studio.instagram_connections where brand_id=$1',[brand.id])).rows[0];
  let token=connection?decryptToken(connection.token_ciphertext,env.CONTENT_TOKEN_ENCRYPTION_KEY):null;
  if(connection?.health==='verified'&&refreshDue(connection)){
   // Official refresh endpoint requires token in query. Never print URL, errors or responses.
   const refresh=new URL('https://graph.instagram.com/refresh_access_token');refresh.searchParams.set('grant_type','ig_refresh_token');refresh.searchParams.set('access_token',token);
   let response,data;try{response=await fetch(refresh,{signal:AbortSignal.timeout(30000)});data=await response.json();}catch{throw Error('token_refresh_failed');}
   if(!response.ok||!data.access_token||!Number.isFinite(data.expires_in))throw Error(data?.error?.code===190?'instagram_reconnect_required':'token_refresh_failed');
   await verifyInstagram(data.access_token,fetch,{id:connection.account_id,username:connection.username});token=data.access_token;
   await db.query("update content_studio.instagram_connections set token_ciphertext=$1,refreshed_at=now(),expires_at=now()+$2*interval '1 second' where brand_id=$3",[encryptToken(token,env.CONTENT_TOKEN_ENCRYPTION_KEY),data.expires_in,brand.id]);
  }
  const storage=createClient(env.NEXT_PUBLIC_CONTENT_SUPABASE_URL,env.CONTENT_SUPABASE_STORAGE_KEY,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(url,options)=>fetch(url,{...options,signal:AbortSignal.timeout(30000)})}});
  const api=async(endpoint,params,method)=>{
   if(!token)throw Error('instagram_reconnect_required');
   if(method==='POST'&&endpoint.endsWith('/media_publish')){
    const quota=await instagramRequest(token,`${brand.account}/content_publishing_limit`,{fields:'config,quota_usage'});
    const limits=quota.data?.[0];if(!limits||!Number.isFinite(limits.quota_usage)||!Number.isFinite(limits.config?.quota_total)||limits.quota_usage>=limits.config.quota_total)throw Error('publishing_quota_unavailable');
   }
   return instagramRequest(token,endpoint,params,method);
  };
  const sign=async key=>{const {data,error}=await storage.storage.from('content-studio').createSignedUrl(key,3600);if(error||!data?.signedUrl)throw Error('media_url_failed');return data.signedUrl;};
  const result=await publicationTick(db,{api,sign,shouldContinue:()=>Date.now()<deadline,brand});
  await db.query("update content_studio.settings set publisher_error=null where brand_id=$1 and publisher_error not in ('revision_changed','media_changed','approval_required','changes_requested')",[brand.id]);
  return result||{state:'idle'};
 }catch(error){
  const safe=['instagram_reconnect_required','token_refresh_failed','publishing_quota_unavailable','media_url_failed','instagram_request_rejected','provider_unavailable'].includes(error.message)?error.message:'publisher_failed';
  await db.query("update content_studio.settings set publisher_seen_at=now(),publisher_error=$1,publication_enabled=case when $1='instagram_reconnect_required' then false else publication_enabled end where brand_id=$2",[safe,brand.id]).catch(()=>{});
  if(safe==='instagram_reconnect_required')await db.query("update content_studio.instagram_connections set health='reconnect' where brand_id=$1",[brand.id]).catch(()=>{});
  return {state:'error',error:safe};
 }finally{await db.query('select pg_advisory_unlock(718264,$1)',[lockKey]).catch(()=>{});}
}
