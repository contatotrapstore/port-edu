import 'server-only';
import {requireAdmin} from './auth';
import {contentDb} from './db';
export async function requestRender(postId:string,revisionId:string){
 const actor=await requireAdmin(),db=await contentDb().connect();
 try{await db.query('begin');
  const post=(await db.query('select active_revision_id,state from content_studio.posts where id=$1 for update',[postId])).rows[0];
  if(!post||post.active_revision_id!==revisionId||!['draft','review','producing','paused'].includes(post.state))throw Error('Revisão indisponível.');
  if((await db.query('select id from content_studio.assets where revision_id=$1 limit 1',[revisionId])).rows.length)throw Error('Esta revisão já possui vídeos. Edite e salve para gerar outra versão.');
  await db.query("insert into content_studio.jobs(revision_id,kind) values($1,'render') on conflict(revision_id,kind) where state in ('queued','running','unknown') do nothing",[revisionId]);
  await db.query("update content_studio.posts set state='producing' where id=$1",[postId]);
  await db.query("insert into content_studio.events(actor,entity_id,action) values($1,$2,'render.requested')",[actor.id,postId]);
  await db.query('commit');
 }catch(error){await db.query('rollback');throw error;}finally{db.release();}
}
export async function renderStatus(revisionId:string){await requireAdmin();return (await contentDb().query<{state:string;error:{code?:string}|null}>("select state,error from content_studio.jobs where revision_id=$1 and kind='render' order by created_at desc limit 1",[revisionId])).rows[0]||null;}
