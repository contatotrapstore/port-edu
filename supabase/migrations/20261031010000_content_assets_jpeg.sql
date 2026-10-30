-- Imagem nativa no Instagram (carrossel de imagens e Story de imagem): a Meta só aceita JPEG em image_url.
-- O import de posts prontos grava o JPEG como asset kind 'jpg' com provenance.publish=true; PNG continua só prévia.
-- Não liga publicação nem muda posts existentes.
begin;

alter table content_studio.assets drop constraint if exists assets_kind_check;
alter table content_studio.assets add constraint assets_kind_check check (kind in ('png','mp4','jpg','audio','qa'));

-- Bucket privado content-studio: se ele restringe os tipos aceitos, passa a aceitar image/jpeg.
-- (No Supabase o schema storage existe; nos testes com PGlite não, e o bloco não faz nada.)
do $$
begin
  if to_regclass('storage.buckets') is not null then
    execute $sql$
      update storage.buckets
         set allowed_mime_types = array_append(allowed_mime_types, 'image/jpeg')
       where id = 'content-studio'
         and allowed_mime_types is not null
         and cardinality(allowed_mime_types) > 0
         and not ('image/jpeg' = any(allowed_mime_types))
    $sql$;
  end if;
end $$;

commit;
