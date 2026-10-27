import 'server-only';
import {createHash} from 'node:crypto';
import {contentDb} from './db';
import {requireAdmin} from './auth';
import type {DraftInput} from './input';
export type ContentPost={id:string;topic:string;state:string;active_revision_id:string;created_at:Date;caption:string;brief:{text?:string;format?:'carousel'|'reel'|'story';generation?:{engine?:string;model?:string}};slides:string[];source_refs:string[]};
export async function listPosts(){await requireAdmin();return (await contentDb().query<ContentPost>(`select p.*,r.caption,r.brief,r.slides,r.source_refs from content_studio.posts p left join content_studio.revisions r on r.id=p.active_revision_id order by p.created_at desc limit 100`)).rows;}
export async function saveDraft(input:DraftInput,postId?:string,expectedRevision?:string){
 if(input.format!==undefined&&!['carousel','reel','story'].includes(input.format))throw Error('Formato inválido.');
 const actor=await requireAdmin(), db=await contentDb().connect();
 try{await db.query('begin');let id=postId;
 let previous:{brief:ContentPost['brief']&{vertical?:unknown};slides:string[]}|undefined;
 if(id){const current=(await db.query('select * from content_studio.posts where id=$1 for update',[id])).rows[0];
   if(!current||current.active_revision_id!==expectedRevision)throw Error('Este post foi alterado em outra janela. Recarregue antes de salvar.');
   if(['publishing','publishing_unknown','published'].includes(current.state))throw Error('Este post não pode mais ser editado. Crie outro rascunho.');
   previous=(await db.query('select brief,slides from content_studio.revisions where id=$1',[current.active_revision_id])).rows[0];
   await db.query("update content_studio.schedules set state='paused' where revision_id=$1 and state='scheduled'",[expectedRevision]);
   await db.query("update content_studio.jobs set state='cancelled' where revision_id=$1 and state='queued'",[expectedRevision]);
 }else{id=(await db.query("insert into content_studio.posts(brand_id,topic) select id,$1 from content_studio.brands where handle='edevshub' returning id",[input.topic])).rows[0].id;}
 const hash=createHash('sha256').update(JSON.stringify(input)).digest('hex');
 const keepStoryboard=previous&&(previous.brief.format??'carousel')===(input.format??'carousel')&&JSON.stringify(previous.slides)===JSON.stringify(input.slides);
 const brief={text:input.brief,format:input.format??'carousel',...(keepStoryboard&&previous?.brief.vertical?{vertical:previous.brief.vertical}:{})};
 const revision=(await db.query('insert into content_studio.revisions(post_id,brief,slides,caption,source_refs,content_hash) values($1,$2,$3,$4,$5,$6) returning id',[id,JSON.stringify(brief),JSON.stringify(input.slides),input.caption,JSON.stringify(input.sources),hash])).rows[0].id;
 await db.query("update content_studio.posts set topic=$1,active_revision_id=$2,state='draft' where id=$3",[input.topic,revision,id]);
 await db.query("insert into content_studio.events(actor,entity_id,action) values($1,$2,'draft.saved')",[actor.id,id]);
 if(!id)throw Error('Não foi possível identificar o post.');
 await db.query('commit');return id;
 }catch(e){await db.query('rollback');throw e;}finally{db.release();}
}
