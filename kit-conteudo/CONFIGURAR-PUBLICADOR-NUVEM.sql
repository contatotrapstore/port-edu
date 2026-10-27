-- Apply only to Content Studio kcjshrnjkrmtzgpwnygc, as project owner.
-- Provision content_publisher_secret in Vault privately before activation.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.schedule('content-studio-publisher','* * * * *', $job$
 select net.http_post(
   url := 'https://www.edevshub.com/api/internal/content-publisher',
   headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||decrypted_secret),
   body := '{}'::jsonb,
   timeout_milliseconds := 300000
 ) from vault.decrypted_secrets where name='content_publisher_secret';
$job$);

-- Scope retention to these jobs, preserving other projects' history.
select cron.schedule('content-studio-cron-retention','17 6 * * *', $job$
 delete from cron.job_run_details where jobid in
 (select jobid from cron.job where jobname in ('content-studio-publisher','content-studio-cron-retention'))
 and end_time < now()-interval '7 days';
$job$);

-- Switch publisher_location to cloud only after endpoint checks pass.
-- Rollback: set publisher_location='local' and deactivate the publisher cron.
