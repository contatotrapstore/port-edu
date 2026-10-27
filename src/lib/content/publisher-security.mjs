import {timingSafeEqual} from 'node:crypto';
export function authorizedPublisher(header,secret){
 if(typeof secret!=='string'||secret.length<32||typeof header!=='string')return false;
 const expected=Buffer.from('Bearer '+secret),actual=Buffer.from(header);
 return expected.length===actual.length&&timingSafeEqual(expected,actual);
}
export function publisherConnectionString(value){
 const url=new URL(value);
 // Session advisory locks require a pinned PostgreSQL session.
 if(url.hostname.endsWith('.pooler.supabase.com')&&url.port==='6543')url.port='5432';
 for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
 return url.href;
}
