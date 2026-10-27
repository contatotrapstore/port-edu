// Private worker/backend only. Caller supplies its restricted Postgres connection.
// This queue handles rendering only; publication must reconcile uncertain outcomes.
export function createRenderQueue(db) {
  return {
    async enqueue(revisionId) {
      const result=await db.query(`insert into content_studio.jobs(revision_id,kind)
        select r.id,'render' from content_studio.revisions r
        join content_studio.posts p on p.id=r.post_id and p.active_revision_id=r.id
        where r.id=$1 and p.state in ('draft','producing','review','ready','paused')
        on conflict(revision_id,kind) where state in ('queued','running','unknown')
        do update set available_at=content_studio.jobs.available_at returning *`,[revisionId]);
      if(!result.rows[0])throw Error('Revisão indisponível para renderização.');
      return result.rows[0];
    },
    async claim() {
      await db.query(`update content_studio.jobs j set state='failed',lease_token=null,lease_until=null,
        error='{"code":"attempt_limit"}'::jsonb where kind='render' and state='running'
        and lease_until<=now() and attempts>=3`);
      await db.query(`update content_studio.jobs j set state='cancelled',lease_token=null,lease_until=null
        where kind='render' and (state='queued' or (state='running' and lease_until<=now()))
        and not exists(select 1 from content_studio.posts p where p.active_revision_id=j.revision_id)`);
      const result=await db.query(`with candidate as (
        select j.id from content_studio.jobs j
        join content_studio.posts p on p.active_revision_id=j.revision_id
        where j.kind='render' and j.attempts<3 and j.available_at<=now()
        and p.state in ('draft','producing','review','ready','paused')
        and (j.state='queued' or (j.state='running' and j.lease_until<=now()))
        order by j.created_at,j.id for update of j skip locked limit 1
      ) update content_studio.jobs j set state='running',attempts=attempts+1,
        lease_token=gen_random_uuid(),lease_until=now()+interval '2 minutes'
        from candidate where j.id=candidate.id returning j.*`);
      return result.rows[0]||null;
    },
    async heartbeat(jobId,leaseToken) {
      const result=await db.query(`update content_studio.jobs j set lease_until=now()+interval '2 minutes'
        where id=$1 and lease_token=$2 and kind='render' and state='running' and lease_until>now()
        and exists(select 1 from content_studio.posts p where p.active_revision_id=j.revision_id)
        returning id`,[jobId,leaseToken]);
      return result.rows.length===1;
    },
    async finish(jobId,leaseToken) {
      // Ack only. Caller must validate and persist artifacts before invoking this.
      const result=await db.query(`update content_studio.jobs j set state='succeeded',lease_token=null,lease_until=null
        where id=$1 and lease_token=$2 and kind='render' and state='running' and lease_until>now()
        and exists(select 1 from content_studio.posts p where p.active_revision_id=j.revision_id)
        returning id`,[jobId,leaseToken]);
      return result.rows.length===1;
    },
  };
}
