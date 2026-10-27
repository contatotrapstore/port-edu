# Conexão Instagram — estado em 26/10/2026

- Conta alvo: @edevshub. Login no navegador confirmado. Convertida de pessoal para comercial, categoria Empresa de software, após autorização explícita da publicidade do perfil. Sem adicionar telefone/endereço público; conexão opcional com Página do Facebook não realizada.
- App Meta: EDevsHub Content Studio, ID `1667104521635136`.
- App Instagram: EDevsHub Content Studio-IG, ID `2143227139634071`.
- Configurados para teste: `instagram_business_basic`, `instagram_business_content_publish`, `instagram_business_manage_insights`.
- Sem permissões de mensagens, comentários, anúncios ou exclusão.
- Usuário autorizou vincular a conta como testador, conceder esses três acessos e guardar token no ambiente privado.
- Vinculação ainda em andamento: o modal de testador volta a “Adicionar” sem confirmar ou informar erro. Lista específica de testadores vazia na verificação, inclusive após conversão profissional. Nenhum token capturado, nenhum post publicado.

## Contrato confirmado na documentação oficial

Fonte lida no navegador: https://developers.facebook.com/documentation/instagram-platform/content-publishing (atualizada em 20/10/2026).

Instagram Login usa `graph.instagram.com` com token de usuário do Instagram. Publicação exige basic e content_publish. Os vídeos precisam estar acessíveis à Meta por URL no momento de ingestão. Cada filho do carrossel usa `media_type=VIDEO` e `is_carousel_item=true`; o pai usa `media_type=CAROUSEL` e `children` ordenados. Consultar `status_code` antes de publicar e persistir IDs intermediários.

A página atual informa até 20 itens, mas o produto mantém seu limite editorial inicial de 10. A página contém números de limite diário divergentes (100 no limite geral, 50 na seção de carrossel); consultar `content_publishing_limit` em vez de fixar esse limite no código. Nosso limite editorial inicial é 1/dia.

Contêineres podem estar IN_PROGRESS, FINISHED, ERROR, EXPIRED ou PUBLISHED. A documentação recomenda consulta de status uma vez por minuto por até cinco minutos. Se houver timeout no envio final, reconciliar o contêiner antes de tentar novamente. O parâmetro opcional `is_ai_generated` pertence ao pai de carrossel; enviá-lo nos filhos é erro.

Não ativar agenda antes de verificar conta profissional, token e escopos, storage privado com URL temporária, worker persistente, QA, persistência dos IDs e reconciliação de publicação incerta. O status do app no painel da Meta não prova sucesso de publicação.

Diagnóstico posterior: captura visual confirmou toast Meta: 'O formulário não pode ser salvo. Verifique se inseriu corretamente todas as informações e tente novamente.' A opção correta Testador do Instagram e o handle edevshub estavam selecionados. Usuário reproduziu manualmente. Causa não determinada; não atribuir definitivamente a extensão nem ao cadastro. Auxiliar oficial de integração sendo consultado.
