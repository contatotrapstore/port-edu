import 'server-only';
import {requireAdmin} from './auth';
import {contentDb} from './db';
import {verifyInstagram,encryptToken} from './instagram-core.mjs';
export async function connectInstagram(token:string){
 const actor=await requireAdmin();
 const verified=await verifyInstagram(token);
 const encrypted=encryptToken(token,process.env.CONTENT_TOKEN_ENCRYPTION_KEY);
 const db=await contentDb().connect();try{await db.query('begin');
 await db.query("insert into content_studio.instagram_connections(brand_id,account_id,username,token_ciphertext) select id,$1,$2,$3 from content_studio.brands where handle='edevshub' on conflict(brand_id) do update set account_id=excluded.account_id,username=excluded.username,token_ciphertext=excluded.token_ciphertext,verified_at=now(),health='verified',expires_at=null,refreshed_at=null",[verified.id,verified.username,encrypted]);
 await db.query("insert into content_studio.events(actor,action,metadata) values($1,'instagram.connected',$2)",[actor.id,JSON.stringify({accountId:verified.id,username:verified.username})]);await db.query('commit');
 }catch(e){await db.query('rollback');throw e;}finally{db.release();}
}
export async function instagramState(){await requireAdmin();return (await contentDb().query<{username:string;health:string;verified_at:Date}>("select username,health,verified_at from content_studio.instagram_connections where account_id='17841416428564956'")).rows[0]||null;}
