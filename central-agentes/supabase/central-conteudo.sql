-- Central de Agentes · resumo do Content Studio (posts e reels automáticos) para o prédio.
-- Só leitura, só contagens e horários. Executável apenas pela service_role (o agente do PC); o site não chama.
-- Rode no SQL Editor do mesmo projeto do Content Studio. Idempotente.
create or replace function public.central_content_summary() returns jsonb
language sql stable security definer set search_path = content_studio, public as $$
  with tz as (select 'America/Sao_Paulo'::text z),
  hoje as (select (date_trunc('day', now() at time zone (select z from tz)) at time zone (select z from tz)) ini),
  pb as (  -- post de cada revisão, para ligar agendamentos e publicações à marca
    select r.id revision_id, p.brand_id, p.topic from revisions r join posts p on p.id = r.post_id
  )
  select coalesce(jsonb_agg(x order by x->>'marca'), '[]'::jsonb) from (
    select jsonb_build_object(
      'marca', b.handle,
      'instagram', i.username, 'saudeInstagram', i.health, 'tokenExpiraEm', i.expires_at,
      'automacao', coalesce(s.automation_enabled, false), 'publicacao', coalesce(s.publication_enabled, false),
      'modo', s.publication_mode, 'horario', to_char(s.publish_time, 'HH24:MI'),
      'erroPublicador', s.publisher_error is not null, 'publicadorVistoEm', s.publisher_seen_at,
      'emRevisao', (select count(*) from posts p where p.brand_id = b.id and p.state = 'review'),
      'agendados', (select count(*) from schedules sc join pb on pb.revision_id = sc.revision_id where pb.brand_id = b.id and sc.state = 'scheduled'),
      'proximos', (select coalesce(jsonb_agg(jsonb_build_object('quando', to_char(sc.local_date, 'DD/MM') || ' ' || to_char(sc.local_time, 'HH24:MI'), 'tema', left(pb.topic, 60)) order by sc.local_date, sc.local_time), '[]'::jsonb)
                   from (select * from schedules where state = 'scheduled' order by local_date, local_time limit 20) sc join pb on pb.revision_id = sc.revision_id where pb.brand_id = b.id),
      'publicadosHoje', (select count(*) from publications pu join pb on pb.revision_id = pu.revision_id where pb.brand_id = b.id and pu.state = 'published' and pu.created_at >= (select ini from hoje)),
      'publicados7d', (select count(*) from publications pu join pb on pb.revision_id = pu.revision_id where pb.brand_id = b.id and pu.state = 'published' and pu.created_at >= now() - interval '7 days'),
      'publicandoAgora', (select count(*) from publications pu join pb on pb.revision_id = pu.revision_id where pb.brand_id = b.id and pu.state not in ('published', 'failed')),
      'ultimoPost', (select pu.permalink from publications pu join pb on pb.revision_id = pu.revision_id where pb.brand_id = b.id and pu.state = 'published' order by pu.created_at desc limit 1),
      'jobsNaFila', (select count(*) from jobs j join pb on pb.revision_id = j.revision_id where pb.brand_id = b.id and j.state not in ('succeeded', 'failed', 'cancelled')),
      'jobsFalhos24h', (select count(*) from jobs j join pb on pb.revision_id = j.revision_id where pb.brand_id = b.id and j.state = 'failed' and j.created_at >= now() - interval '1 day')
    ) x
    from brands b left join settings s on s.brand_id = b.id left join instagram_connections i on i.brand_id = b.id
  ) t;
$$;
revoke all on function public.central_content_summary() from public, anon, authenticated;
grant execute on function public.central_content_summary() to service_role;

-- Avisa a API do Supabase (PostgREST) que a função existe
notify pgrst, 'reload schema';
