# Escopo e arquitetura proposta

## Resultado

Um espaço privado em `https://www.edevshub.com/admin/conteudo` para produzir, revisar, agendar e acompanhar carrosséis animados da edevshub. Rota proposta, ainda inexistente. Uma marca e uma conta do Instagram no primeiro lançamento. A estratégia inclui serviços + novidades de IA, radar de fontes, Insights e experimento com slots extras; ver ESTRATEGIA-EDITORIAL.md e API-E-AUTOMACAO.md.

## Abordagens consideradas

1. **Tudo local no Claude Code:** menor infraestrutura; produção e agenda dependem do computador disponível. Adequado ao piloto.
2. **Painel no site + worker separado:** recomendado para operação diária. O painel organiza os trabalhos; um processo com Chrome, Python e FFmpeg produz os arquivos e um publicador integra com Instagram. Permite operação sem depender da sessão aberta do usuário, quando o worker for hospedado.
3. **Tudo dentro das requisições do site:** descartado como desenho inicial; mistura atendimento web com render demorado, dependências nativas e recuperação de falhas.

A alternativa 2 é proposta técnica, não uma contratação de infraestrutura. O usuário aprovou a ideia do painel e a preparação; ainda não escolheu fornecedor de banco, autenticação ou worker. Primeiro entregar o piloto local da alternativa 1.

## Painel: telas e ações

| Área | Conteúdo e ações |
|---|---|
| Visão geral | Próxima postagem, trabalhos em andamento, falhas e atalho “Criar carrossel” |
| Calendário | Dia e hora locais, destino, arrastar/reagendar com validação, pausar rotina |
| Produção | Pauta, objetivo, fontes, brief, texto slide a slide, legenda e CTA |
| Revisão | PNG e MP4 por slide, reprodução com som por ação explícita, versão e resultados dos testes |
| Acervo | Carrosséis aprovados, referências, fontes de imagens, identidade e modelos reutilizáveis |
| Histórico | URL do post confirmado, horário, tentativas, falhas e ação de reconciliar |
| Configurações | Conta de destino verificada, fuso, horário, modo manual/automático e limite de gasto |

O painel deve mostrar estado real. “Publicado” exige confirmação do provedor; prévia, upload e agendamento não equivalem a publicação. Controles indisponíveis devem explicar qual conexão falta. Não mostrar credenciais em campos de leitura ou logs.

## Componentes

- **Site Next.js:** páginas administrativas, sessão, autorização no servidor, operações curtas e consulta do estado.
- **Persistência compartilhada:** posts, versões, jobs, agenda e eventos. Em produção usar banco transacional e armazenamento de objetos; não SQLite/arquivos efêmeros da hospedagem web como fonte de verdade.
- **Worker:** consome jobs com lease e heartbeat, executa produção em diretório isolado e envia artefatos. Claude Code é o ambiente escolhido para construir/operar o piloto. Para geração autônoma hospedada, validar autenticação, execução não interativa, plano e custos suportados; não presumir que a assinatura desktop se transfere a um servidor.
- **Publicador:** adaptador para a API oficial suportada pela conta. Confirmar documentação Meta, modalidade de login, permissões, formato e limites vigentes antes de implementar. Não depender de cliques no Instagram ou cookies pessoais como integração de produção.
- **Scheduler:** registra uma ocorrência por conta/data local/horário. Usa a mesma fila do botão manual. Agenda persistente, não um loop dentro da conversa.

## Fluxo e consistência

Post: `draft → producing → review → ready → scheduled → publishing → published`.

Falhas pertencem ao job, com erro legível, categoria e etapa; o post preserva a última versão válida. `paused` suspende a agenda, não apaga trabalhos. `publishing_unknown` representa timeout após envio e exige reconciliação antes de nova tentativa.

- Cada edição cria nova revisão. Aprovação, QA e agendamento apontam para um revisionId imutável.
- Editar conteúdo agendado invalida a aprovação anterior e suspende aquela publicação até conferir a nova versão.
- Publicação exige artefatos validados da mesma revisão e destino correspondente à conta verificada.
- Chave única de publicação: conta + post + revisão. A ocorrência diária também tem chave única. Essas chaves são distintas e protegem contra dois workers e dois disparos do scheduler.
- Após timeout de publicação, consultar os identificadores persistidos e reconciliar; nunca republicar às cegas.
- Worker reiniciado recupera jobs por lease vencido. Limitar tentativas por etapa; erro permanente de permissão não recebe retentativa infinita.
- Guardar datas UTC e fuso IANA; exibir America/Sao_Paulo. Horários de teste propostos: 12h30 e 19h00; ativação continua pendente. Se perder o horário, marcar atraso e aplicar política configurada; não despejar vários posts acumulados.

## Dados mínimos

`Brand(id, handle, guidelinesVersion)`; `Post(id, brandId, topic, state, activeRevisionId)`; `Revision(id, postId, brief, slides, caption, sourceRefs, contentHash)`; `Asset(id, revisionId, kind, objectKey, sha256, provenance)`; `Job(id, revisionId, kind, state, attempts, leaseUntil, error)`; `Schedule(id, accountId, localDate, slotId, experimentId, localTime, timezone, revisionId, state)`; `Publication(id, accountId, revisionId, idempotencyKey, providerContainerIds, providerMediaId, permalink, state)`; `Event(id, actor, entityId, action, timestamp)`.

`slides` guarda sequência e texto; `sourceRefs` guarda origem das afirmações; provenance distingue screenshot original, imagem gerada e licença. Não incluir dados privados de clientes nas referências.

## Acesso e integração com o site

- Login de administrador com acesso explicitamente permitido; sem cadastro público no MVP. Usar provedor mantido, não inventar autenticação por senha no frontend.
- Verificar sessão e permissão em toda leitura privada, mutação e download; esconder link ou usar robots não protege dados.
- URLs temporárias para prévias; exposição para ingestão pela Meta deve ter escopo e validade suficientes ao processamento, sem tornar o acervo inteiro público.
- Segredos somente no servidor/worker. Validar origem/CSRF nas mutações e assinatura/autenticação nos callbacks conforme o mecanismo escolhido.
- `noindex` no admin, fora do sitemap, sem conteúdo privado em caches públicos. Suprimir pixel e analytics de marketing no admin.
- Usar `data-scroll-page` no shell: CSS global da home trava rolagem desktop sem esse marcador.
- Não importar Canvas 3D, áudio ambiente ou navegação da home para o painel. Preservar home, `/contratar`, Workana, atribuição e páginas públicas.

## Critérios de pronto

Piloto: PNGs e MP4s reais, texto legível, movimento que explica o conteúdo, áudio sincronizado, loops testados e prévia navegável. Painel: dados persistem após reinício e acesso privado é testado. Automação: ocorrência diária idempotente, pausa, recuperação de falhas e uma publicação de teste confirmada na conta correta antes de ativar a agenda.

Não entram no MVP: multiempresa, cobrança, sistema operacional de agentes, chatbot de voz, editor de vídeo completo e reprodução integral do painel proprietário do autor.
