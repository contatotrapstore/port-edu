-- Private backend schema. This does NOT enable publication or public registration.
create schema content_studio;
revoke all on schema content_studio from public, anon, authenticated;
create role content_studio_runtime nologin nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
grant usage on schema content_studio to content_studio_runtime;

create table content_studio.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table content_studio.brands (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique,
  guidelines_version integer not null default 1 check (guidelines_version>0),
  guidelines jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table content_studio.posts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references content_studio.brands(id),
  topic text not null,
  state text not null default 'draft' check(state in ('draft','producing','review','ready','scheduled','publishing','publishing_unknown','published','paused')),
  active_revision_id uuid,
  created_at timestamptz not null default now()
);
create table content_studio.revisions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references content_studio.posts(id),
  brief jsonb not null,
  slides jsonb not null check(jsonb_typeof(slides)='array'),
  caption text not null default '',
  source_refs jsonb not null default '[]'::jsonb,
  content_hash text not null check(content_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  unique(post_id,id)
);
alter table content_studio.posts add foreign key(id,active_revision_id) references content_studio.revisions(post_id,id);
create table content_studio.assets (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references content_studio.revisions(id),
  kind text not null check(kind in ('png','mp4','audio','qa')),
  object_key text not null unique,
  sha256 text not null check(sha256 ~ '^[a-f0-9]{64}$'),
  provenance jsonb not null,
  created_at timestamptz not null default now()
);
create table content_studio.jobs (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references content_studio.revisions(id),
  kind text not null check(kind in ('render','publish','insights','research')),
  state text not null default 'queued' check(state in ('queued','running','succeeded','failed','cancelled','unknown')),
  attempts integer not null default 0 check(attempts>=0),
  lease_token uuid,
  lease_until timestamptz,
  available_at timestamptz not null default now(),
  error jsonb,
  created_at timestamptz not null default now(),
  check ((state='running' and lease_token is not null and lease_until is not null) or state<>'running')
);
create unique index jobs_active_once on content_studio.jobs(revision_id,kind) where state in ('queued','running','unknown');
create index jobs_due on content_studio.jobs(state,available_at);
create table content_studio.schedules (
  id uuid primary key default gen_random_uuid(),
  account_id text not null,
  revision_id uuid not null references content_studio.revisions(id),
  local_date date not null,
  slot_id text not null,
  local_time time not null,
  timezone text not null default 'America/Sao_Paulo',
  experiment_id text,
  state text not null default 'paused' check(state in ('paused','scheduled','missed','cancelled','completed')),
  unique(account_id,local_date,slot_id)
);
create table content_studio.publications (
  id uuid primary key default gen_random_uuid(),
  account_id text not null,
  revision_id uuid not null references content_studio.revisions(id),
  idempotency_key text not null unique,
  provider_container_ids jsonb not null default '[]'::jsonb,
  provider_media_id text,
  permalink text,
  state text not null default 'pending' check(state in ('pending','creating','publishing','unknown','published','failed')),
  created_at timestamptz not null default now(),
  unique(account_id,revision_id)
);
create table content_studio.events (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table content_studio.settings (
  brand_id uuid primary key references content_studio.brands(id),
  automation_enabled boolean not null default false,
  publication_enabled boolean not null default false,
  timezone text not null default 'America/Sao_Paulo',
  daily_post_limit smallint not null default 1 check(daily_post_limit between 1 and 3)
);

do $security$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname='content_studio' loop
    execute format('alter table content_studio.%I enable row level security',t.tablename);
    execute format('revoke all on content_studio.%I from public, anon, authenticated',t.tablename);
    execute format('grant select, insert, update, delete on content_studio.%I to content_studio_runtime',t.tablename);
    execute format('create policy backend_only on content_studio.%I to content_studio_runtime using(true) with check(true)',t.tablename);
  end loop;
end $security$;
-- Runtime cannot provision its own administrators or rewrite history/revisions.
revoke insert,update,delete on content_studio.admin_users from content_studio_runtime;
revoke update,delete on content_studio.revisions,content_studio.events from content_studio_runtime;
insert into content_studio.brands(handle,guidelines) values('edevshub','{"language":"pt-BR","pillars":["serviços e cases","IA aplicada","Claude e Codex","agentes e automação"]}');
insert into content_studio.settings(brand_id) select id from content_studio.brands where handle='edevshub';
comment on schema content_studio is 'EDevsHub Content Studio: private backend schema. RLS enabled. No public Data API exposure.';
