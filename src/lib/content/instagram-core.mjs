import {randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';
export const GRAPH_VERSION='v26.0';
export const EXPECTED_ACCOUNT='17841416428564956';
export function encryptToken(token,key){
 const secret=Buffer.from(key||'','base64');if(secret.length!==32)throw Error('encryption_not_configured');
 const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',secret,iv);
 const data=Buffer.concat([cipher.update(token,'utf8'),cipher.final()]);
 return [iv,cipher.getAuthTag(),data].map(b=>b.toString('base64')).join('.');
}
export function decryptToken(value,key){
 const [iv,tag,data]=value.split('.').map(v=>Buffer.from(v,'base64'));
 const decipher=createDecipheriv('aes-256-gcm',Buffer.from(key||'','base64'),iv);decipher.setAuthTag(tag);
 return Buffer.concat([decipher.update(data),decipher.final()]).toString('utf8');
}
export async function instagramRequest(token,endpoint,params={},method='GET',transport=fetch){
 if(!/^(me|[0-9]+)(\/[a-z_]+)?$/.test(endpoint))throw Error('invalid_endpoint');
 const url=new URL(`https://graph.instagram.com/${GRAPH_VERSION}/${endpoint}`);
 const options={method,headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)};
 if(method==='GET')for(const [k,v]of Object.entries(params))url.searchParams.set(k,String(v));
 else options.body=new URLSearchParams(params);
 let response;try{response=await transport(url,options);}catch{throw Error(method==='POST'?'provider_outcome_unknown':'provider_unavailable');}
 let data;try{data=await response.json();}catch{throw Error(method==='POST'?'provider_outcome_unknown':'provider_invalid_response');}
 if(!response.ok||data.error)throw Error(data.error?.code===190?'instagram_reconnect_required':'instagram_request_rejected');
 return data;
}
export async function verifyInstagram(token,transport=fetch,expected={id:EXPECTED_ACCOUNT,username:'edevshub'}){
 if(typeof token!=='string'||token.length<30||token.length>4096||/\s/.test(token))throw Error('invalid_token');
 const account=await instagramRequest(token,'me',{fields:'user_id,username'},'GET',transport);
 const id=String(account.user_id||account.id);
 if((expected.id&&id!==expected.id)||(expected.username&&account.username!==expected.username)||(!expected.id&&!expected.username))throw Error('wrong_account');
 const quota=await instagramRequest(token,`${id}/content_publishing_limit`,{fields:'config,quota_usage'},'GET',transport);
 return {id,username:account.username,quota};
}
