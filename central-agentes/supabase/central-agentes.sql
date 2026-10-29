-- Central de Agentes · Fase 2 (painel /central do site)
-- Rode no Supabase: SQL Editor → cole tudo → Run. Pode rodar de novo sem quebrar (idempotente).
-- Quem escreve: o agente do PC, com a service_role (ignora RLS e fica só no agent/.env).
-- Quem lê e responde: só os usuários listados em central_admins (login por e-mail no site).

-- 1) Quem pode ver o painel
create table if not exists public.central_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.central_admins enable row level security;
drop policy if exists "admin vê o próprio cadastro" on public.central_admins;
create policy "admin vê o próprio cadastro" on public.central_admins for select to authenticated using (user_id = auth.uid());

-- Admin da Central = quem está em central_admins OU já é admin do Content Studio (mesmo projeto Supabase)
create or replace function public.is_central_admin() returns boolean
language plpgsql stable security definer set search_path = public as $$
begin
  if exists (select 1 from public.central_admins where user_id = auth.uid()) then return true; end if;
  begin
    return exists (select 1 from content_studio.admin_users where user_id = auth.uid());
  exception when undefined_table or invalid_schema_name then return false;
  end;
end $$;
revoke all on function public.is_central_admin() from public;
grant execute on function public.is_central_admin() to authenticated;

-- 2) Estado do escritório (uma linha, id = 'principal'): resumo sem prompts, comandos nem caminhos
create table if not exists public.office_state (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.office_state enable row level security;
drop policy if exists "admins leem o estado" on public.office_state;
create policy "admins leem o estado" on public.office_state for select to authenticated using (public.is_central_admin());

-- 3) Pedidos de permissão espelhados (só no modo ausente ou com o painel aberto)
create table if not exists public.permission_requests (
  id text primary key,
  room text,
  tool text,
  status text not null default 'pending' check (status in ('pending', 'decided', 'resolved', 'expired')),
  decision text check (decision in ('allow', 'deny')),
  decided_at timestamptz,
  decided_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);
alter table public.permission_requests enable row level security;
drop policy if exists "admins leem pedidos" on public.permission_requests;
create policy "admins leem pedidos" on public.permission_requests for select to authenticated using (public.is_central_admin());
drop policy if exists "admins respondem pedidos pendentes" on public.permission_requests;
create policy "admins respondem pedidos pendentes" on public.permission_requests for update to authenticated
  using (public.is_central_admin() and status = 'pending')
  with check (public.is_central_admin() and status = 'decided' and decision in ('allow', 'deny'));

-- 4) Comandos do site para o PC (modo ausente)
create table if not exists public.office_control (
  id text primary key,
  away boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.office_control enable row level security;
drop policy if exists "admins leem controle" on public.office_control;
create policy "admins leem controle" on public.office_control for select to authenticated using (public.is_central_admin());
drop policy if exists "admins criam controle" on public.office_control;
create policy "admins criam controle" on public.office_control for insert to authenticated with check (public.is_central_admin() and id = 'principal');
drop policy if exists "admins mudam controle" on public.office_control;
create policy "admins mudam controle" on public.office_control for update to authenticated using (public.is_central_admin()) with check (public.is_central_admin() and id = 'principal');

-- Índice para consultar/limpar pedidos antigos (ex.: delete from public.permission_requests where created_at < now() - interval '7 days')
create index if not exists permission_requests_created_at on public.permission_requests (created_at);

-- Permissões de tabela (este projeto não dá acesso automático a tabelas novas). O RLS acima decide as linhas;
-- visitante sem login (anon) não recebe nada.
revoke all on public.central_admins, public.office_state, public.permission_requests, public.office_control from anon;
grant select on public.central_admins, public.office_state, public.permission_requests, public.office_control to authenticated;
grant update (status, decision, decided_at, decided_by) on public.permission_requests to authenticated;
grant insert, update on public.office_control to authenticated;
grant all on public.central_admins, public.office_state, public.permission_requests, public.office_control to service_role;

-- 5) Tempo real (o painel atualiza sozinho)
do $$ begin
  begin alter publication supabase_realtime add table public.office_state; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.permission_requests; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.office_control; exception when duplicate_object then null; end;
end $$;

-- 6) Quem já é admin do Content Studio entra direto. Para liberar outra conta: entre uma vez em /central e rode a linha abaixo trocando o e-mail.
-- insert into public.central_admins (user_id) select id from auth.users where email = 'SEU-EMAIL-AQUI' on conflict do nothing;

-- Avisa a API do Supabase (PostgREST) das tabelas e funções novas
notify pgrst, 'reload schema';
