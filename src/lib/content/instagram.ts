import 'server-only';
import {requireAdmin} from './auth';
import {contentDb} from './db';
import {verifyInstagram,encryptToken,EXPECTED_ACCOUNT} from './instagram-core.mjs';
import {brandContext,currentBrand,type Brand} from './brand';
// A conta conectada precisa ser a esperada da marca: EDevsHub pelo ID conhecido; demais pelo @ cadastrado nas diretrizes
export function expectedAccount(brand:Brand){return brand.handle==='edevshub'?{id:EXPECTED_ACCOUNT,username:'edevshub'}:{username:String(brand.guidelines.instagram_username||'')};}
export async function connectInstagram(token:string,expiresIn?:number,brandHandle?:string){
 const actor=await requireAdmin();
 const {brands}=await brandContext(),brand=brands.find(b=>b.handle===brandHandle)||await currentBrand();
 const expected=expectedAccount(brand);if(!expected.username)throw Error('brand_username_missing');
 const verified=await verifyInstagram(token,fetch,expected);
 const encrypted=encryptToken(token,process.env.CONTENT_TOKEN_ENCRYPTION_KEY);
 const db=await contentDb().connect();try{await db.query('begin');
 await db.query("insert into content_studio.instagram_connections(brand_id,account_id,username,token_ciphertext) select id,$1,$2,$3 from content_studio.brands where id=$4 on conflict(brand_id) do update set account_id=excluded.account_id,username=excluded.username,token_ciphertext=excluded.token_ciphertext,verified_at=now(),health='verified',expires_at=null,refreshed_at=null",[verified.id,verified.username,encrypted,brand.id]);
 if(expiresIn&&Number.isFinite(expiresIn)&&expiresIn>0)await db.query("update content_studio.instagram_connections set expires_at=now()+($1::text||' seconds')::interval,refreshed_at=now() where account_id=$2",[expiresIn,verified.id]);
 await db.query("insert into content_studio.events(actor,action,metadata) values($1,'instagram.connected',$2)",[actor.id,JSON.stringify({accountId:verified.id,username:verified.username,brand:brand.handle})]);await db.query('commit');
 }catch(e){await db.query('rollback');throw e;}finally{db.release();}
}
export async function instagramState(){await requireAdmin();return (await contentDb().query<{username:string;health:string;verified_at:Date}>("select username,case when expires_at <= now() then 'reconnect' else health end as health,verified_at from content_studio.instagram_connections where brand_id=$1",[(await currentBrand()).id])).rows[0]||null;}
