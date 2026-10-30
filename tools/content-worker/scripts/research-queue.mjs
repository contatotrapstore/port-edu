import {createHash} from 'node:crypto';
export async function enqueueDaily(db){
 return db.query(`insert into content_studio.research_runs(brand_id,engine,request_key)
 select brand_id,preferred_engine,'daily:'||(now() at time zone timezone)::date::text from content_studio.settings
 where research_enabled and extract(hour from now() at time zone timezone)>=9 on conflict do nothing`);
}
export async function claimResearch(db){
 // A timed-out generation needs an explicit retry; do not silently spend subscription again.
 await db.query("update content_studio.research_runs set state='failed',error_code='worker_interrupted',lease_token=null,lease_until=null where state='running' and lease_until<now()");
 return (await db.query(`update content_studio.research_runs set state='running',lease_token=gen_random_uuid(),lease_until=now()+interval '10 minutes'
 where id=(select id from content_studio.research_runs where state='queued' order by created_at for update skip locked limit 1) returning *`)).rows[0]||null;
}
// Caller supplies a transaction. Lease ownership and atomic commit prevent duplicate posts.
export async function saveGeneratedDraft(db,run,draft,sources,{format,finish=true}={}){
 const owned=(await db.query("select id from content_studio.research_runs where id=$1 and lease_token=$2 and state='running' and lease_until>now() for update",[run.id,run.lease_token])).rows[0];
 if(!owned)throw Error('lease_lost');
 const post=(await db.query("insert into content_studio.posts(brand_id,topic,state) values($1,$2,'producing') returning id",[run.brand_id,draft.topic])).rows[0].id;
 const revision=(await db.query('insert into content_studio.revisions(post_id,brief,slides,caption,source_refs,content_hash) values($1,$2,$3,$4,$5,$6) returning id',[post,JSON.stringify({text:draft.brief,...(format&&format!=='carousel'?{format}:{}),generation:draft.generation||{engine:run.engine,model:'padrão do Claude Code',authentication:'claude.ai-subscription'},research:sources}),JSON.stringify(draft.slides),draft.caption,JSON.stringify(draft.sources),createHash('sha256').update(JSON.stringify(draft)).digest('hex')])).rows[0].id;
 await db.query('update content_studio.posts set active_revision_id=$1 where id=$2',[revision,post]);
 await db.query("insert into content_studio.jobs(revision_id,kind) values($1,'render')",[revision]);
 // uma rodada pode gerar Reel e carrossel: só fecha no último rascunho
 if(!finish){await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values('local-worker',$1,'research.completed',$2)",[post,JSON.stringify({runId:run.id,engine:run.engine,format,published:false})]);return post;}
 await db.query("update content_studio.research_runs set state='succeeded',result_post_id=$3,sources=$4,lease_token=null,lease_until=null where id=$1 and lease_token=$2",[run.id,run.lease_token,post,JSON.stringify(sources)]);
 await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values('local-worker',$1,'research.completed',$2)",[post,JSON.stringify({runId:run.id,engine:run.engine,published:false})]);
 return post;
}
