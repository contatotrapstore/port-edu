-- Post arquivado: some da lista do painel sem apagar revisões, mídias e histórico (reversível: volte o estado para 'review').
begin;
alter table content_studio.posts drop constraint if exists posts_state_check;
alter table content_studio.posts add constraint posts_state_check check (state in ('draft','producing','review','ready','scheduled','publishing','publishing_unknown','published','paused','archived'));
commit;
