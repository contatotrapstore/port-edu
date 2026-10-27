-- Local subscription worker only. These settings never enable publishing.
alter table content_studio.settings add column preferred_engine text not null default 'codex' check(preferred_engine in ('codex','claude'));
alter table content_studio.settings add column research_enabled boolean not null default false;
create table content_studio.research_runs(
 id uuid primary key default gen_random_uuid(),
 brand_id uuid not null references content_studio.brands(id),
 engine text not null check(engine in ('codex','claude')),
 request_key text not null,
 state text not null default 'queued' check(state in ('queued','running','succeeded','failed')),
 lease_token uuid,
 lease_until timestamptz,
 result_post_id uuid references content_studio.posts(id),
 sources jsonb not null default '[]',
 error_code text,
 created_at timestamptz not null default now(),
 unique(brand_id,request_key)
);
create unique index research_one_active on content_studio.research_runs(brand_id) where state in ('queued','running');
alter table content_studio.research_runs enable row level security;
revoke all on content_studio.research_runs from public,anon,authenticated;
grant select,insert,update on content_studio.research_runs to content_studio_runtime;
create policy backend_only on content_studio.research_runs to content_studio_runtime using(true) with check(true);
