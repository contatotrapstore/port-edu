-- MANUAL OPERATION, NOT AN AUTOMATIC APP MIGRATION.
-- Target: finance-os / kcjshrnjkrmtzgpwnygc ONLY.
-- Requires a newly verified encrypted backup and administrative access.
-- User authorized retiring atreia on 2026-10-26. No CASCADE, no public/auth edits.
-- Before execution: stop marketplace writes and compare live inventory to backup.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';
select pg_advisory_xact_lock(72410631);

do $retire$
declare
  t record;
  expected text[] := array['users','sessions','state','evidence','requests','audit',
    'favorites','seen','rate_limits','email_tokens','verified_emails','admin_mfa',
    'session_elevations','mail_jobs','schema_migrations'];
begin
  if to_regnamespace('atreia') is null then
    raise exception 'atreia absent: wrong target or operation already performed';
  end if;
  if to_regnamespace('content_studio') is not null then
    raise exception 'content_studio exists: do not overwrite';
  end if;
  if exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='atreia' and c.relkind in ('r','p','v','m','f')
    and (c.relname <> all(expected) or c.relkind <> 'r')) then
    raise exception 'Unexpected objects: inspect and refresh backup';
  end if;
  -- Only internal foreign keys can be removed; external dependencies must block.
  for t in select c.conname, c.conrelid::regclass as tbl
    from pg_constraint c
    join pg_class source on source.oid=c.conrelid
    join pg_namespace ns on ns.oid=source.relnamespace
    join pg_class target on target.oid=c.confrelid
    join pg_namespace nt on nt.oid=target.relnamespace
    where c.contype='f' and ns.nspname='atreia' and nt.nspname='atreia'
  loop
    execute format('alter table %s drop constraint %I restrict', t.tbl, t.conname);
  end loop;
  for t in select c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='atreia' and c.relkind='r' order by c.relname
  loop
    execute format('drop table atreia.%I restrict', t.relname);
  end loop;
end
$retire$;

-- Any leftover view, function or external dependency aborts the whole transaction.
drop schema atreia restrict;
create schema content_studio;
revoke all on schema content_studio from public, anon, authenticated;
comment on schema content_studio is 'EDevsHub Content Studio. Private backend schema; not exposed through PostgREST.';
commit;

-- Runtime provisioning is separate: never rename/reuse elyndra_runtime.
-- Retire the old login only after inspecting its ownership/grants and active sessions.
