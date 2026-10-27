import {fingerprint,publicationEligibility} from '../../../src/lib/content/publication-policy.mjs';
import {advancePublication} from '../../../src/lib/content/publication-step.mjs';
import {EXPECTED_ACCOUNT} from '../../../src/lib/content/instagram-core.mjs';

async function mediaAndReview(db,postId,revisionId){
 const assets=(await db.query('select id,sha256,kind,object_key,provenance from content_studio.assets where revision_id=$1',[revisionId])).rows;
 const review=(await db.query("select metadata from content_studio.events where entity_id=$1 and action='review.recorded' and metadata->>'revisionId'=$2 order by created_at desc,id desc limit 1",[postId,revisionId])).rows[0]?.metadata||null;
 return {assets,review};
}
export async function automaticSchedule(db){
 // Only fresh, fully rendered drafts, one slot/day; never backfill missed days.
 const settings=(await db.query("select *,(now() at time zone timezone)::date::text as today from content_studio.settings where publication_enabled and publication_mode='automatic' and (now() at time zone timezone)::time between publish_time-interval '20 minutes' and publish_time+interval '5 minutes'")).rows[0];
 if(!settings)return;
 const candidates=(await db.query("select p.id,p.active_revision_id,r.slides from content_studio.posts p join content_studio.revisions r on r.id=p.active_revision_id where p.brand_id=$1 and p.state='review' and r.created_at>now()-interval '36 hours' and r.brief->'generation' is not null and not exists(select 1 from content_studio.schedules s where s.revision_id=r.id) and not exists(select 1 from content_studio.publications u where u.revision_id=r.id) order by r.created_at desc limit 10",[settings.brand_id])).rows;
 for(const post of candidates){
  const {assets,review}=await mediaAndReview(db,post.id,post.active_revision_id),hash=fingerprint(assets);
  if(publicationEligibility({revisionId:post.active_revision_id,activeRevision:post.active_revision_id,slides:post.slides,assets,review,expectedFingerprint:hash,mode:'automatic'}))continue;
  await db.query("insert into content_studio.schedules(account_id,revision_id,local_date,local_time,timezone,slot_id,state,asset_fingerprint,approval_mode) values($1,$2,$3,$4,'America/Sao_Paulo','principal','scheduled',$5,'automatic') on conflict do nothing",[EXPECTED_ACCOUNT,post.active_revision_id,settings.today,settings.publish_time,hash]);return;
 }
}
export async function publicationTick(db,{api,sign}){
 await db.query("update content_studio.settings set publisher_seen_at=now() where brand_id=(select id from content_studio.brands where handle='edevshub')");
 // Read-only reconciliation remains available after the user disables new sends.
 const uncertain=(await db.query("select id,revision_id,provider_container_ids from content_studio.publications where account_id=$1 and state in ('publishing','unknown') order by created_at limit 5",[EXPECTED_ACCOUNT])).rows;
 for(const item of uncertain){
  const parent=item.provider_container_ids?.parent;if(!parent)continue;
  const result=await api(parent,{fields:'status_code'},'GET');
  if(result.status_code==='PUBLISHED'){
   await db.query('begin');try{
    await db.query("update content_studio.publications set state='published',provider_container_ids=$1 where id=$2",[JSON.stringify({...item.provider_container_ids,phase:'complete',reconciled:true}),item.id]);
    await db.query("update content_studio.posts set state='published' where active_revision_id=$1",[item.revision_id]);
    await db.query("update content_studio.schedules set state='completed' where revision_id=$1 and account_id=$2",[item.revision_id,EXPECTED_ACCOUNT]);
    await db.query("insert into content_studio.events(actor,entity_id,action) values('publisher',$1,'publication.reconciled')",[item.id]);
    await db.query('commit');
   }catch(e){await db.query('rollback');throw e;}
  }
 }
 const settings=(await db.query("select * from content_studio.settings where brand_id=(select id from content_studio.brands where handle='edevshub')")).rows[0];
 if(!settings?.publication_enabled)return {state:'disabled'};
 const connection=(await db.query('select health,expires_at from content_studio.instagram_connections where account_id=$1',[EXPECTED_ACCOUNT])).rows[0];
 if(connection?.health!=='verified'||!connection.expires_at||new Date(connection.expires_at)<=new Date())throw Error('instagram_reconnect_required');
 await automaticSchedule(db);
 // Unknown sends must be reconciled, never marked missed or retried.
 await db.query("update content_studio.schedules s set state='missed' where s.account_id=$1 and s.state='scheduled' and (s.local_date+s.local_time) at time zone s.timezone<now()-interval '15 minutes' and not exists(select 1 from content_studio.publications u where u.revision_id=s.revision_id and u.state in ('publishing','unknown','published'))",[EXPECTED_ACCOUNT]);
 await db.query("update content_studio.posts p set state='paused' where state='publishing' and exists(select 1 from content_studio.schedules s where s.revision_id=p.active_revision_id and s.state='missed')");
 const schedule=(await db.query(`select s.*,p.id as post_id,p.active_revision_id,p.state as post_state,r.slides,r.caption,
 ((s.local_date+s.local_time) at time zone s.timezone)<=now() as due
 from content_studio.schedules s join content_studio.revisions r on r.id=s.revision_id join content_studio.posts p on p.id=r.post_id
 where s.account_id=$1 and s.state='scheduled' and (s.local_date+s.local_time) at time zone s.timezone<=now()+interval '20 minutes'
 order by s.local_date,s.local_time limit 1`,[EXPECTED_ACCOUNT])).rows[0];
 if(!schedule)return {state:'idle'};
 const {assets,review}=await mediaAndReview(db,schedule.post_id,schedule.revision_id);
 const reason=publicationEligibility({revisionId:schedule.revision_id,activeRevision:schedule.active_revision_id,slides:schedule.slides,assets,review,expectedFingerprint:schedule.asset_fingerprint,mode:schedule.approval_mode});
 if(reason||schedule.approval_mode==='automatic'&&settings.publication_mode!=='automatic'){
  await db.query("update content_studio.schedules set state='paused' where id=$1",[schedule.id]);
  await db.query("update content_studio.settings set publisher_error=$1 where brand_id=$2",[reason||'automatic_mode_disabled',settings.brand_id]);return {state:'paused'};
 }
 // Lock against edits/reviews before releasing the transaction and calling Meta.
 await db.query('begin');let publication;
 try{
  const post=(await db.query('select active_revision_id,state from content_studio.posts where id=$1 for update',[schedule.post_id])).rows[0];
  if(post.active_revision_id!==schedule.revision_id||!['review','ready','draft','paused','publishing','publishing_unknown'].includes(post.state))throw Error('revision_changed');
  const fresh=await mediaAndReview(db,schedule.post_id,schedule.revision_id);
  if(publicationEligibility({revisionId:schedule.revision_id,activeRevision:post.active_revision_id,slides:schedule.slides,...fresh,expectedFingerprint:schedule.asset_fingerprint,mode:schedule.approval_mode}))throw Error('approval_changed');
  await db.query("insert into content_studio.publications(account_id,revision_id,idempotency_key) values($1,$2,$3) on conflict do nothing",[EXPECTED_ACCOUNT,schedule.revision_id,EXPECTED_ACCOUNT+':'+schedule.revision_id]);
  publication=(await db.query('select * from content_studio.publications where account_id=$1 and revision_id=$2',[EXPECTED_ACCOUNT,schedule.revision_id])).rows[0];
  if(publication.state==='failed'){await db.query("update content_studio.schedules set state='paused' where id=$1",[schedule.id]);await db.query('commit');return {state:'failed'};}
  await db.query("update content_studio.posts set state=case when $2='unknown' then 'publishing_unknown' else 'publishing' end where id=$1",[schedule.post_id,publication.state]);
  await db.query('commit');
 }catch(e){await db.query('rollback');throw e;}
 const allow=async()=>{
  const row=(await db.query("select t.publication_enabled,s.state,t.publication_mode from content_studio.settings t join content_studio.posts p on p.brand_id=t.brand_id join content_studio.schedules s on s.revision_id=p.active_revision_id where p.id=$1 and s.id=$2",[schedule.post_id,schedule.id])).rows[0];
  return Boolean(row?.publication_enabled&&row.state==='scheduled'&&(schedule.approval_mode!=='automatic'||row.publication_mode==='automatic'));
 };
 const save=async state=>{
  await db.query('begin');try{
   if(state.phase==='sending'){
    const gate=(await db.query("select s.state,t.publication_enabled,t.publication_mode from content_studio.schedules s join content_studio.revisions r on r.id=s.revision_id join content_studio.posts p on p.id=r.post_id join content_studio.settings t on t.brand_id=p.brand_id where s.id=$1 for update of s,t",[schedule.id])).rows[0];
    if(!gate?.publication_enabled||gate.state!=='scheduled'||schedule.approval_mode==='automatic'&&gate.publication_mode!=='automatic')throw Error('publication_paused');
   }
   const mapped={complete:'published',failed:'failed',unknown:'unknown',sending:'publishing'}[state.phase]||'creating';
   await db.query('update content_studio.publications set provider_container_ids=$1,state=$2,provider_media_id=coalesce($3,provider_media_id) where id=$4',[JSON.stringify(state),mapped,state.mediaId||null,publication.id]);
   if(['complete','failed','unknown'].includes(state.phase)){
    await db.query('update content_studio.posts set state=$1 where id=$2',[{complete:'published',failed:'paused',unknown:'publishing_unknown'}[state.phase],schedule.post_id]);
    if(state.phase!=='unknown')await db.query('update content_studio.schedules set state=$1 where id=$2',[state.phase==='complete'?'completed':'paused',schedule.id]);
    await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values('publisher',$1,$2,$3)",[schedule.post_id,'publication.'+state.phase,JSON.stringify({revisionId:schedule.revision_id,mediaId:state.mediaId||null})]);
   }
   await db.query('commit');
  }catch(e){await db.query('rollback');throw e;}
 };
 let previous=Array.isArray(publication.provider_container_ids)?{}:publication.provider_container_ids;
 if(publication.state==='published')previous={...previous,phase:'complete'};
 const videos=assets.filter(a=>a.kind==='mp4').sort((a,b)=>a.provenance.slide-b.provenance.slide);
 // URLs last 1 hour, generated only for this authorized publication attempt.
 const urls=await Promise.all(videos.map(a=>sign(a.object_key)));
 try{
  const result=await advancePublication({enabled:true,due:schedule.due,accountId:EXPECTED_ACCOUNT,caption:schedule.caption,videos:urls},previous,api,save,allow);
  if(result.phase==='complete'&&result.mediaId){
   try{const media=await api(result.mediaId,{fields:'permalink'},'GET');if(/^https:\/\/www\.instagram\.com\//.test(media.permalink||''))await db.query('update content_studio.publications set permalink=$1 where id=$2',[media.permalink,publication.id]);}catch{/* Publication already persisted; permalink is optional. */}
  }
  return {state:result.phase||'processing'};
 }catch(error){
  // Explicit provider rejection is safe to stop. Transport ambiguity is checkpointed by advancePublication.
  if(error.message==='instagram_request_rejected')await save({...previous,phase:'failed',reason:'provider_rejected'});
  throw error;
 }
}
