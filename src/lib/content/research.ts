import 'server-only';
import {requireAdmin} from './auth';
import {contentDb} from './db';
export async function researchState(){
 await requireAdmin();
 const settings=(await contentDb().query<{preferred_engine:string;research_enabled:boolean}>("select preferred_engine,research_enabled from content_studio.settings s join content_studio.brands b on b.id=s.brand_id where b.handle='edevshub'")).rows[0];
 const runs=(await contentDb().query<{id:string;engine:string;state:string;result_post_id:string|null;error_code:string|null}>("select r.id,r.engine,r.state,r.result_post_id,r.error_code from content_studio.research_runs r join content_studio.brands b on b.id=r.brand_id where b.handle='edevshub' order by r.created_at desc limit 5")).rows;
 return {settings,runs};
}
export async function configureResearch(engine:string,daily:boolean,generate:boolean){
 const actor=await requireAdmin();if(!['codex','claude'].includes(engine))throw Error('Escolha Codex ou Claude.');
 const db=await contentDb().connect();
 try{await db.query('begin');
 const brand=(await db.query("select s.brand_id from content_studio.settings s join content_studio.brands b on b.id=s.brand_id where b.handle='edevshub' for update of s")).rows[0];
 if(!brand)throw Error('Marca indisponível.');
 await db.query('update content_studio.settings set preferred_engine=$1,research_enabled=$2 where brand_id=$3',[engine,daily,brand.brand_id]);
 if(generate)await db.query("insert into content_studio.research_runs(brand_id,engine,request_key) values($1,$2,'manual:'||gen_random_uuid()::text) on conflict do nothing",[brand.brand_id,engine]);
 await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values($1,$2,'research.configured',$3)",[actor.id,brand.brand_id,JSON.stringify({engine,daily,generate})]);
 await db.query('commit');
 }catch(e){await db.query('rollback');throw e;}finally{db.release();}
}
