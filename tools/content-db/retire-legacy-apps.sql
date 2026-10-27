-- Manual, one-time operation for kcjshrnjkrmtzgpwnygc ONLY.
-- User authorized retiring BOTH Finance OS and Elyndra, 2026-10-26.
-- Run in one transaction with the new foundation. NO CASCADE.
do $guard$
declare unexpected text;
begin
  if to_regclass('public.financial_accounts') is null or to_regclass('atreia.users') is null then
    raise exception 'Legacy inventory missing; wrong target or already retired';
  end if;
  if to_regnamespace('content_studio') is not null then raise exception 'Content Studio already exists'; end if;
  select string_agg(n.nspname||'.'||c.relname,', ') into unexpected
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname in ('public','atreia') and c.relkind in ('r','p','v','m','f')
    and not ((n.nspname='public' and c.relname=any(array['audit_logs','categories','clients','expenses','financial_accounts','income_entries','installment_plans','legacy_snapshots','monthly_snapshots','profiles','projects','receivable_payments','receivables','recurrences','v_account_balances','v_client_totals','v_expenses','v_project_financials','v_receivables']))
      or (n.nspname='atreia' and c.relname=any(array['admin_mfa','audit','email_tokens','evidence','favorites','mail_jobs','rate_limits','requests','schema_migrations','seen','session_elevations','sessions','state','users','verified_emails'])));
  if unexpected is not null then raise exception 'Unexpected relations: %',unexpected; end if;
  if exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname<>all(array['today_br','set_updated_at','handle_new_user','bootstrap_user_defaults','get_dashboard_summary','get_dashboard_series','get_dashboard_lists','search_all','register_receivable_payment','void_receivable_payment','create_installment_plan','cancel_installment_plan','materialize_recurrences','close_month','reopen_month','log_closed_month_change','get_monthly_series','get_insight_inputs','format_brl']) and not exists(select 1 from pg_depend d where d.classid='pg_proc'::regclass and d.objid=p.oid and d.deptype='e')) then
    raise exception 'Unexpected public functions';
  end if;
end $guard$;

-- This app-owned Auth trigger would otherwise call the removed profiles table.
do $trigger$
begin
  if exists(select 1 from pg_trigger t where t.tgrelid='auth.users'::regclass and t.tgname='on_auth_user_created'
    and t.tgfoid<>'public.handle_new_user()'::regprocedure) then raise exception 'Auth trigger changed'; end if;
end $trigger$;
drop trigger if exists on_auth_user_created on auth.users;

do $cleanup$
declare names text;
begin
  select string_agg(format('%I.%I',n.nspname,c.relname),', ') into names
    from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='v';
  if names is not null then execute 'drop view '||names||' restrict'; end if;
  -- Drop all application tables in ONE command so internal FKs are in the deletion set.
  select string_agg(format('%I.%I',n.nspname,c.relname),', ') into names
    from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname in ('public','atreia') and c.relkind='r';
  if names is not null then execute 'drop table '||names||' restrict'; end if;
  select string_agg(p.oid::regprocedure::text,', ') into names from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and not exists(select 1 from pg_depend d where d.classid='pg_proc'::regclass and d.objid=p.oid and d.deptype='e');
  if names is not null then execute 'drop function '||names||' restrict'; end if;
  select string_agg(format('public.%I',t.typname),', ') into names from pg_type t join pg_namespace n on n.oid=t.typnamespace where n.nspname='public' and t.typtype='e';
  if names is not null then execute 'drop type '||names||' restrict'; end if;
end $cleanup$;
drop schema atreia restrict;
alter role elyndra_runtime nologin;
