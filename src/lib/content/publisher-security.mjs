import {timingSafeEqual,createHmac} from 'node:crypto';
export function authorizedPublisher(header,secret,now=Date.now()){
 if(typeof secret!=='string'||secret.length<32||typeof header!=='string')return false;
 const match=/^Bearer (\d{10})\.([a-f0-9]{64})$/.exec(header);
 if(!match||Math.abs(Math.floor(now/1000)-Number(match[1]))>90)return false;
 const expected=Buffer.from(createHmac('sha256',secret).update(match[1]).digest('hex')),actual=Buffer.from(match[2]);
 return expected.length===actual.length&&timingSafeEqual(expected,actual);
}
export function publisherConnectionString(value){
 const url=new URL(value);
 // Session advisory locks require a pinned PostgreSQL session.
 if(url.hostname.endsWith('.pooler.supabase.com')&&url.port==='6543')url.port='5432';
 for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
 return url.href;
}
