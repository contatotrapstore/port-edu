create table content_studio.instagram_connections(
 brand_id uuid primary key references content_studio.brands(id),
 account_id text not null check(account_id='17841416428564956'),
 username text not null check(username='edevshub'),
 token_ciphertext text not null,
 verified_at timestamptz not null default now(),
 refreshed_at timestamptz,
 expires_at timestamptz,
 health text not null default 'verified' check(health in ('verified','reconnect'))
);
alter table content_studio.instagram_connections enable row level security;
revoke all on content_studio.instagram_connections from public,anon,authenticated;
grant select,insert,update on content_studio.instagram_connections to content_studio_runtime;
create policy backend_only on content_studio.instagram_connections to content_studio_runtime using(true) with check(true);
