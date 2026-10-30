import 'server-only';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
import {requireAdmin} from './auth';
import {contentDb} from './db';
import {encryptToken,decryptToken} from './instagram-core.mjs';
import {connectInstagram} from './instagram';
import {currentBrand} from './brand';
const appId='2143227139634071';
export const instagramRedirect='https://www.edevshub.com/api/content/instagram/callback';
const scopes=['instagram_business_basic','instagram_business_content_publish','instagram_business_manage_insights'];
export async function configureInstagramApp(secret:string){
 await requireAdmin();if(!/^[a-f0-9]{32}$/i.test(secret))throw Error('invalid_app_secret');
 await contentDb().query("update content_studio.settings set instagram_app_secret=$1 where brand_id=$2",[encryptToken(secret,process.env.CONTENT_TOKEN_ENCRYPTION_KEY),(await currentBrand()).id]);
}
export async function instagramAppReady(){await requireAdmin();return Boolean((await contentDb().query("select instagram_app_secret is not null as ready from content_studio.settings where brand_id=$1",[(await currentBrand()).id])).rows[0]?.ready);}
export async function instagramAuthorizationUrl(){
 const user=await requireAdmin();if(!await instagramAppReady())throw Error('app_not_configured');
 const state=randomBytes(32).toString('hex');
 (await cookies()).set('studio_ig_state',user.id+':'+state+':'+(await currentBrand()).handle,{httpOnly:true,secure:true,sameSite:'lax',path:'/api/content/instagram',maxAge:600});
 const url=new URL('https://www.instagram.com/oauth/authorize');
 for(const [key,value]of Object.entries({client_id:appId,redirect_uri:instagramRedirect,response_type:'code',scope:scopes.join(','),state,enable_fb_login:'false'}))url.searchParams.set(key,value);
 return url.href;
}
export async function finishInstagramAuthorization(url:URL){
 const user=await requireAdmin(),jar=await cookies();const saved=jar.get('studio_ig_state')?.value;jar.delete({name:'studio_ig_state',path:'/api/content/instagram'});
 const brandHandle=saved?.split(':')[2]||'edevshub',received=user.id+':'+(url.searchParams.get('state')||'')+':'+brandHandle;
 if(!saved||saved.length!==received.length||!timingSafeEqual(Buffer.from(saved),Buffer.from(received)))throw Error('invalid_state');
 const code=url.searchParams.get('code');if(!code||code.length>2048||url.searchParams.has('error'))throw Error('authorization_denied');
 const row=(await contentDb().query("select s.instagram_app_secret from content_studio.settings s join content_studio.brands b on b.id=s.brand_id where b.handle=$1",[brandHandle])).rows[0];if(!row?.instagram_app_secret)throw Error('app_not_configured');
 const secret=decryptToken(row.instagram_app_secret,process.env.CONTENT_TOKEN_ENCRYPTION_KEY);
 const body=new FormData();for(const [key,value]of Object.entries({client_id:appId,client_secret:secret,grant_type:'authorization_code',redirect_uri:instagramRedirect,code}))body.set(key,value);
 const response=await fetch('https://api.instagram.com/oauth/access_token',{method:'POST',body,signal:AbortSignal.timeout(30000),cache:'no-store'});
 const data=await response.json();if(!response.ok||!data.access_token)throw Error('token_exchange_failed');
 const granted=Array.isArray(data.permissions)?data.permissions:String(data.permissions||'').split(',');
 if(!scopes.every(scope=>granted.includes(scope)))throw Error('missing_permissions');
 const longUrl=new URL('https://graph.instagram.com/access_token');for(const [key,value]of Object.entries({grant_type:'ig_exchange_token',client_secret:secret,access_token:String(data.access_token)}))longUrl.searchParams.set(key,value);
 const longResponse=await fetch(longUrl,{cache:'no-store',signal:AbortSignal.timeout(30000)}),long=await longResponse.json();
 if(!longResponse.ok||!long.access_token||!long.expires_in)throw Error('long_token_exchange_failed');
 await connectInstagram(long.access_token,Number(long.expires_in),brandHandle);
}
