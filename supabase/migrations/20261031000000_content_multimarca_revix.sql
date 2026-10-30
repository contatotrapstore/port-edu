-- Content Studio com várias marcas: a conexão do Instagram deixa de ser presa à @edevshub
-- e a Revix (@revix.app) entra como segunda marca, com publicação DESLIGADA e modo "aprovar antes".
begin;

alter table content_studio.instagram_connections drop constraint if exists instagram_connections_account_id_check;
alter table content_studio.instagram_connections drop constraint if exists instagram_connections_username_check;
do $$ begin
  alter table content_studio.instagram_connections add constraint instagram_connections_account_format check (account_id ~ '^[0-9]{5,30}$');
exception when duplicate_object then null; end $$;
create unique index if not exists instagram_connections_account_unique on content_studio.instagram_connections(account_id);

update content_studio.brands
   set guidelines = guidelines || '{"name":"EDevsHub","instagram_username":"edevshub"}'::jsonb
 where handle = 'edevshub';

insert into content_studio.brands(handle, guidelines) values ('revix', $json${
  "name": "Revix",
  "instagram_username": "revix.app",
  "language": "pt-BR",
  "series": "ENCONTROS",
  "tagline": "Encontros de carros, Pista e Carro do Mês na Grande Curitiba.",
  "about": "app de encontros de carros (mapa e calendário de encontros, check-in com troféu, garagem, Pista, Cena, ranking e Carro do Mês) focado na Grande Curitiba e no Paraná",
  "audience": "entusiastas de carros, rebaixados, JDM e antigos da Grande Curitiba e do Paraná",
  "tone": "direto, urbano, confiante e premium; fala com você; pouca gíria, sem exclamações em excesso e sem hype",
  "rules": [
    "evento em pista: sempre 'em pista fechada' ou 'autódromo'",
    "nunca escrever racha, rachão ou #rachao",
    "post de encontro de rua termina com 'Encontro de rua tem regra. Aqui também.'",
    "como usar o app só no último slide",
    "não mostrar placas nem rostos sem autorização",
    "não inventar evento, data, local, número de confirmados ou preço"
  ],
  "cta": "Link na bio.",
  "hashtags": ["#encontrodecarros", "#carrosrebaixados", "#curitiba", "#parana", "#jdm", "#carrodomes"],
  "pillars": ["encontros da semana", "Carro do Mês", "Pista", "cultura automotiva"],
  "research": {
    "source": "revix-events",
    "topic": "Monte a agenda de encontros dos próximos dias com os eventos fornecidos: um evento por slide, com dia, hora, cidade e o que torna o encontro especial. Termine convidando a confirmar presença no app.",
    "fallback_topic": "Não há encontros novos nos próximos dias. Crie um conteúdo de cultura automotiva útil para quem frequenta encontros (cuidados, etiqueta de encontro, preparação), sem inventar eventos."
  },
  "visual": {
    "font": "SpaceGrotesk",
    "colors": {
      "bg": "#090909", "bg2": "#121212", "panel": "#141418", "panel2": "#1E1E1E",
      "line": "#2B2B2B", "line2": "#3A3A46", "cream": "#FFFFFF", "muted": "#CFCFCF", "dim": "#8A8A8A",
      "amber": "#A78BFA", "amber2": "#C9B2FF", "green": "#4F7BFF", "red": "#F3907F"
    },
    "mark": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100\" height=\"100\" rx=\"24\" fill=\"#090909\"/><path d=\"M 20.11 47.38 A 30 30 0 0 1 47.38 20.11\" fill=\"none\" stroke=\"#A78BFA\" stroke-width=\"7\" stroke-linecap=\"round\"/><path d=\"M 52.62 20.11 A 30 30 0 0 1 79.89 47.38\" fill=\"none\" stroke=\"#4F7BFF\" stroke-width=\"7\" stroke-linecap=\"round\"/><path d=\"M 47.38 79.89 A 30 30 0 0 1 20.11 52.62\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"7\" stroke-linecap=\"round\"/><path d=\"M 79.89 52.62 A 30 30 0 0 1 52.62 79.89\" fill=\"none\" stroke=\"#3A3A46\" stroke-width=\"7\" stroke-linecap=\"round\"/><line x1=\"50\" y1=\"50\" x2=\"66.35\" y2=\"35.28\" stroke=\"#FFFFFF\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"50\" cy=\"50\" r=\"6\" fill=\"#8B5CF6\"/><circle cx=\"50\" cy=\"50\" r=\"2.6\" fill=\"#FFFFFF\"/></svg>"
  }
}$json$::jsonb)
on conflict (handle) do update set guidelines = excluded.guidelines;

-- mesmas regras da EDevsHub, mas tudo desligado até você conectar o @revix.app e aprovar o primeiro post.
-- O segredo do app Instagram é o mesmo app da Meta (já criptografado), copiado da EDevsHub.
insert into content_studio.settings(brand_id, publication_enabled, research_enabled, publication_mode, publish_time, publisher_location, preferred_engine, instagram_app_secret)
select b.id, false, false, 'approved', '19:00', 'cloud', 'claude',
       (select s.instagram_app_secret from content_studio.settings s join content_studio.brands e on e.id = s.brand_id where e.handle = 'edevshub')
  from content_studio.brands b where b.handle = 'revix'
on conflict (brand_id) do nothing;

commit;
