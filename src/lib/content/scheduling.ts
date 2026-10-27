import 'server-only';
import {requireAdmin} from './auth';
import {contentDb} from './db';
import {fingerprint as assetFingerprint,publicationEligibility} from './publication-policy.mjs';
import {EXPECTED_ACCOUNT} from './instagram-core.mjs';
export async function publicationSettings(){await requireAdmin();return (await contentDb().query<{publication_enabled:boolean;publication_mode:string;publish_time:string;publisher_seen_at:Date|null;publisher_error:string|null;publisher_online:boolean}>("select publication_enabled,publication_mode,publish_time::text,publisher_seen_at,publisher_error,coalesce(publisher_seen_at>now()-interval '3 minutes',false) as publisher_online from content_studio.settings where brand_id=(select id from content_studio.brands where handle='edevshub')")).rows[0];}
export async function listSchedules(){await requireAdmin();return (await contentDb().query<{id:string;topic:string;state:string;local_date:string;local_time:string;publication_state:string|null}>("select s.id,p.topic,s.state,s.local_date::text,s.local_time::text,u.state as publication_state from content_studio.schedules s join content_studio.revisions r on r.id=s.revision_id join content_studio.posts p on p.id=r.post_id left join content_studio.publications u on u.revision_id=s.revision_id and u.account_id=s.account_id order by s.local_date desc,s.local_time desc limit 20")).rows;}
export async function scheduleDraft(postId:string,revisionId:string,local:string){
 const actor=await requireAdmin();if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local))throw Error('invalid_date');
 const db=await contentDb().connect();try{await db.query('begin');
 const post=(await db.query("select p.active_revision_id,p.brand_id,p.state,r.slides from content_studio.posts p join content_studio.revisions r on r.id=p.active_revision_id where p.id=$1 for update of p",[postId])).rows[0];
 if(!post||post.active_revision_id!==revisionId||!['draft','review','ready','paused'].includes(post.state))throw Error('revision_unavailable');
 const valid=(await db.query("select ($1::timestamp at time zone 'America/Sao_Paulo') between now()+interval '5 minutes' and now()+interval '30 days' as valid",[local])).rows[0].valid;if(!valid)throw Error('invalid_date');
 const assets=(await db.query('select id,sha256,kind,object_key,provenance from content_studio.assets where revision_id=$1',[revisionId])).rows;
 const fingerprint=assetFingerprint(assets),videos=assets.filter(a=>a.kind==='mp4');
 if(videos.length!==post.slides.length||!post.slides.every((_:string,i:number)=>videos.some(v=>v.provenance.slide===i+1)))throw Error('incomplete_media');
 const review=(await db.query("select metadata from content_studio.events where entity_id=$1 and action='review.recorded' and metadata->>'revisionId'=$2 order by created_at desc,id desc limit 1",[postId,revisionId])).rows[0]?.metadata;
 if(publicationEligibility({revisionId,activeRevision:post.active_revision_id,slides:post.slides,assets,review:review||null,expectedFingerprint:fingerprint,mode:'approved'}))throw Error('approval_required');
 await db.query("insert into content_studio.schedules(account_id,revision_id,local_date,slot_id,local_time,timezone,state,asset_fingerprint) select $1,$2,$3::date,'principal',$4::time,'America/Sao_Paulo',case when publication_enabled then 'scheduled' else 'paused' end,$5 from content_studio.settings where brand_id=$6",[EXPECTED_ACCOUNT,revisionId,local.slice(0,10),local.slice(11),fingerprint,post.brand_id]);
 await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values($1,$2,'schedule.prepared',$3)",[actor.id,postId,JSON.stringify({revisionId,local})]);await db.query('commit');
 }catch(e){await db.query('rollback');throw e;}finally{db.release();}
}
export async function configurePublication(enabled:boolean,mode:string,time:string,confirmed:boolean){
 const actor=await requireAdmin();if(!['approved','automatic'].includes(mode)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||enabled&&!confirmed)throw Error('invalid_configuration');
 const db=await contentDb().connect();try{await db.query('begin');
 if(enabled){const worker=(await db.query("select publisher_seen_at>now()-interval '3 minutes' as online from content_studio.settings where brand_id=(select id from content_studio.brands where handle='edevshub')")).rows[0];if(!worker?.online)throw Error('worker_offline');const connection=(await db.query("select health,expires_at from content_studio.instagram_connections where account_id=$1",[EXPECTED_ACCOUNT])).rows[0];if(connection?.health!=='verified'||connection.expires_at&&new Date(connection.expires_at)<=new Date())throw Error('connection_required');}
 await db.query("update content_studio.settings set publication_enabled=$1,publication_mode=$2,publish_time=$3::time where brand_id=(select id from content_studio.brands where handle='edevshub')",[enabled,mode,time]);
 if(enabled)await db.query("update content_studio.schedules set state='scheduled' where account_id='17841416428564956' and state='paused' and (local_date+local_time) at time zone timezone>now()+interval '5 minutes'");
 await db.query("insert into content_studio.events(actor,action,metadata) values($1,'publication.configured',$2)",[actor.id,JSON.stringify({enabled,mode,time})]);await db.query('commit');
 }catch(e){await db.query('rollback');throw e;}finally{db.release();}
}

export async function cancelSchedule(id:string){
 const actor=await requireAdmin(),db=await contentDb().connect();try{await db.query('begin');
 const row=(await db.query("select s.revision_id,p.id as post_id from content_studio.schedules s join content_studio.revisions r on r.id=s.revision_id join content_studio.posts p on p.id=r.post_id where s.id=$1 and s.account_id=$2 and s.state in ('paused','scheduled','missed') for update of s,p",[id,EXPECTED_ACCOUNT])).rows[0];if(!row)throw Error('unavailable');
 const pub=(await db.query('select state from content_studio.publications where account_id=$1 and revision_id=$2',[EXPECTED_ACCOUNT,row.revision_id])).rows[0];
 if(pub&&['publishing','unknown','published'].includes(pub.state))throw Error('already_sending');
 await db.query("update content_studio.schedules set state='cancelled' where id=$1",[id]);
 await db.query("update content_studio.posts set state='review' where id=$1 and state in ('publishing','paused')",[row.post_id]);
 await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values($1,$2,'schedule.cancelled',$3)",[actor.id,row.post_id,JSON.stringify({scheduleId:id})]);await db.query('commit');
 }catch(e){await db.query('rollback');throw e;}finally{db.release();}
}
