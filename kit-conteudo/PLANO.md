# EDevsHub Content Studio — plano de implementação

> Para execução por agentes: usar superpowers:executing-plans se disponível, seguindo as tarefas em ordem. Implementação destinada ao Claude Code, conforme pedido do usuário.

**Objetivo:** validar um piloto animado e evoluir para painel privado e publicação diária no Instagram.

**Arquitetura:** painel Next.js no site existente, persistência compartilhada e worker externo para produção. Publicação e agendamento usam jobs persistentes e identificadores idempotentes.

**Stack:** Next.js/React/TypeScript existentes; motor HTML/Playwright/Python/FFmpeg da skill para o piloto. Fornecedores de auth/banco/storage/worker serão escolhidos na tarefa 3, antes da implementação dessas integrações.

**Especificação:** [ESCOPO.md](ESCOPO.md). Ler também MARCA.md, PILOTO.md, FONTES.md, ESTRATEGIA-EDITORIAL.md e API-E-AUTOMACAO.md. Os dois últimos ampliam o plano com radar, copy, Insights e slots extras; suas tarefas adicionais integram o escopo.

Este plano é executável para o piloto. As fases hospedadas incluem uma etapa explícita de seleção técnica; detalhar os adaptadores do fornecedor escolhido antes de codificá-los. Não há provedor previamente contratado por este documento.

## Restrições globais

- Site: `https://www.edevshub.com`; destino pretendido: `@edevshub`; admin proposto: `/admin/conteudo`.
- Fuso: `America/Sao_Paulo`; janelas propostas de teste às 12h30 e 19h00, ainda não ativadas.
- Preservar alterações preexistentes, campanhas, atribuição e páginas públicas.
- Renderizar fora das requisições web. Não armazenar segredos ou vídeos em `public/` nem versionar tutorial, cookies ou tokens.
- Não declarar publicado sem confirmação do provedor. Não usar retentativa cega após envio incerto.
- Imagens pagas opcionais dependem de orçamento; o piloto proposto usa código e referências existentes.

## Riscos que precisam de testes

1. Reinício ou dois workers sobre o mesmo job: um único dono ativo e recuperação por lease (tarefa 4).
2. Timeout após Meta aceitar publicação: reconciliar antes de retentar (tarefa 6).
3. Edição depois de agendar: versão antiga não publica como se fosse a nova (tarefas 4 e 5).
4. Acesso direto a API ou arquivo privado sem login: negar mesmo que a UI esteja oculta (tarefa 3).
5. Computador desligado ou horário perdido: ocorrência não duplicada e atraso explícito, sem rajada de posts (tarefa 7).

## Fase 1 — piloto local

### 1. Preparar motor e ambiente

Arquivos a criar: `tools/content-worker/README.md`, `tools/content-worker/requirements.txt`, `tools/content-worker/package.json`, `tools/content-worker/scripts/doctor.mjs`, `tools/content-worker/scripts/render.mjs`. Outputs em diretório local ignorado, por exemplo `output/conteudo/piloto-01/`.

Interface: `doctor` retorna versões e disponibilidade de Python, bibliotecas, FFmpeg e Chromium; `render --project <path> --mode stills|video` executa uma etapa explícita sem publicar.

- [ ] Inspecionar instruções locais e git status; criar branch `codex/content-studio` ou isolamento equivalente sem sobrescrever mudanças do usuário.
- [ ] Ler SKILL.md original e scripts no commit registrado; registrar origem e termos. Instalar para o Claude conforme o método suportado, sem sobrescrever skill já existente.
- [ ] Validar dependências; adaptar `PLAYWRIGHT_DIR`, symlink, zsh e paths ao Windows. Executar processos com argumentos separados, sem interpolar brief em comandos de shell.
- [ ] Implementar doctor e wrapper. Verificação: dependência ausente gera diagnóstico e saída não zero; pasta com espaços funciona; caminho de saída não escapa do workspace de render.
- [ ] Executar `node tools/content-worker/scripts/doctor.mjs`; resultado deve identificar todas as dependências necessárias. Não instalar componentes opcionais sem uso.

### 2. Produzir e verificar o piloto

Arquivos gerados: `output/conteudo/piloto-01/{MARCA.md,BRIEF.md,docs/STORYBOARD.md,src/slides/,resultados/,preview.html}`. Relatório curto a versionar: `kit-conteudo/VALIDACAO-PILOTO.md`.

Consome: PILOTO.md, MARCA.md e wrapper da tarefa 1. Produz: revisão local completa com PNG/MP4 por slide e evidência de QA.

- [ ] Conferir fatos do case e referências visuais; criar brief e fontes de cada afirmação.
- [ ] Produzir os sete slides estáticos e folha de contato; inspecionar em tamanho celular. Corrigir texto cortado, corpo pequeno e composição.
- [ ] Mostrar o piloto estático para calibrar identidade; registrar alterações pedidas antes de consolidar o modelo recorrente.
- [ ] Implementar storyboard por batida e renderizar os sete MP4s com a trilha editorial da skill.
- [ ] Executar os testes da skill adaptados ao ambiente; conferir resolução, codec, fps, áudio, loops e correspondência entre revisão estática e animação. Comparar frames originais sem perdas para igualdade; usar tolerância apropriada no MP4.
- [ ] Abrir preview, verificar navegação, pausa e som; escrever VALIDACAO-PILOTO com arquivos, resultados e pendências reais. Não chamar um storyboard de piloto pronto.

## Fase 2 — painel privado e fila

### 3. Escolher serviços e implementar acesso privado

Arquivos propostos: `kit-conteudo/DECISOES-INFRA.md`, `src/app/admin/layout.tsx`, `src/app/admin/login/page.tsx`, `src/lib/content/auth.ts`, `src/lib/content/storage.ts`, `tests/content/auth.test.ts`. Ajustar analytics/pixel com cuidado nos arquivos atuais e documentar o delta.

Interfaces: `requireAdmin(): Promise<{userId:string}>`; `getPreviewUrl(assetId:string): Promise<string>` com autorização e expiração. Erros de auth não devem revelar se um arquivo privado existe.

- [ ] Inventariar serviços já disponíveis sem expor valores secretos. Escolher auth gerenciada, banco transacional, storage e worker; documentar custos, limites, localização dos segredos e implantação.
- [ ] Confirmar conta administradora e conexões necessárias. Não contratar plano ou ampliar permissões por suposição.
- [ ] Escrever testes de usuário anônimo, usuário sem acesso e administrador, inclusive chamada direta à API/download; comprovar falha antes da implementação.
- [ ] Implementar sessão e autorização server-side, ausência de cache público e URLs de prévia temporárias; não usar senha hardcoded nem autorização só no client.
- [ ] Implementar shell com `data-scroll-page`, noindex e sem rastreadores de marketing; manter sitemap sem admin. Testar login, logout e acesso após expiração.

### 4. Persistência, revisões e jobs

Arquivos: `src/lib/content/types.ts`, `repository.ts`, `transitions.ts`, `jobs.ts` no mesmo diretório; migrations no diretório convencional do fornecedor escolhido; `tests/content/jobs.test.ts` e `tests/content/revisions.test.ts`.

Interfaces: `createRevision(postId,input): Promise<Revision>`; `enqueueJob(revisionId,kind): Promise<Job>`; `claimJob(workerId,now): Promise<Job|null>`; `completeJob(jobId,leaseToken,artifacts): Promise<void>`. Especificar `input`, `Revision`, `Job` e `artifacts` em types.ts usando os campos de ESCOPO antes dos consumidores.

- [ ] Escrever testes: dois claims simultâneos têm um vencedor; lease vencido é recuperável; conclusão com lease antigo é rejeitada; reenvio não duplica job ativo; editar revisão suspende agenda anterior.
- [ ] Criar schema, índices únicos e transações para essas invariantes. Artefatos têm hash e revisionId, não apenas caminho do “último arquivo”.
- [ ] Implementar worker com workspace por job, heartbeat, limite de tempo e tentativas. Validar artefatos recebidos, isolamento e limpeza apenas dentro do workspace verificado.
- [ ] Testar restart, perda de lease e falha no upload; registrar eventos sem conteúdo secreto. Executar testes específicos e migrations em ambiente de desenvolvimento.

### 5. Telas e fluxo editorial

Arquivos: `src/app/admin/conteudo/page.tsx`, `src/app/admin/conteudo/[id]/page.tsx`, `src/app/admin/conteudo/calendario/page.tsx`, `src/app/admin/conteudo/acervo/page.tsx`, `src/app/admin/conteudo/configuracoes/page.tsx`; componentes em `src/components/content-admin/`; ações em `src/app/admin/conteudo/actions.ts`; teste E2E `tests/content/editorial.spec.ts`.

Consome auth/repository/jobs. Produz mutações autorizadas e preview da revisão selecionada. UI não acessa banco com chave privilegiada.

- [ ] Montar lista, editor, preview, calendário, acervo e configurações com os estados reais da especificação.
- [ ] Conectar criar → produzir → revisar → pronto; repetir uma etapa gera revisão/job rastreável. Editar agenda exige validação do servidor.
- [ ] Testar fluxo do piloto, atualização de página, nova sessão, edição após agendamento, data inválida e duplo clique. Som só após ação; oferecer pausa e versão estática.
- [ ] Executar lint/build e verificações existentes. Comparar home, `/contratar`, serviços e cases para identificar regressões, sem corrigir problemas preexistentes fora do escopo por conveniência.

## Fase 3 — publicação e automação

### 6. Adaptador Instagram e confirmação

Arquivos: `src/lib/content/publishing/types.ts`, `instagram.ts`, `reconcile.ts`; `tests/content/publishing.test.ts`; `kit-conteudo/CONEXAO-INSTAGRAM.md` sem segredos.

Interface proposta: `publishCarousel(publicationId): Promise<{state:'published'|'processing'|'unknown'|'failed',providerMediaId?:string,permalink?:string}>`; `reconcilePublication(publicationId)` com o mesmo resultado. Os IDs de containers intermediários são persistidos antes de avançar.

- [ ] Conferir documentação oficial Meta vigente e estado real da conta @edevshub: modalidade de login, tipo de conta, permissões, limites de carrossel/vídeo e recuperação de status. Documentar as fontes e data; adaptar exportação se necessário.
- [ ] Testar com adaptador simulado: um filho falha, processamento demora, token expira, resposta se perde após aceitação, dois pedidos concorrentes e limites do provedor.
- [ ] Implementar upload/containers/status/publicação conforme documentação verificada; validar destino e versão; persistir IDs e resultado. Não repetir publicação incerta.
- [ ] Fazer uma publicação de teste de conteúdo revisado no destino confirmado; verificar permalink e ordem/áudio no Instagram. Somente essa evidência comprova integração real.

### 7. Rotina diária e operação

Arquivos: `src/lib/content/scheduler.ts`, `editorial-policy.ts`; `tests/content/scheduler.test.ts`; `kit-conteudo/OPERACAO.md`. O entrypoint do scheduler depende da infraestrutura definida na tarefa 3.

Interface: `scheduleDailyRun(accountId,localDate,slotId): Promise<{created:boolean,jobId?:string}>`; configuração persistida inclui timezone, localTime, enabled, mode e budgetLimit. Não inventar defaults de hora e gasto ao ativar.

- [ ] Definir horário, execução local/hospedada, limite de gasto e política de atraso com o usuário. Objetivo é um principal diário e teste controlado de extras conforme ESTRATEGIA-EDITORIAL; permitir pausar e operar manualmente.
- [ ] Implementar seleção de pauta com histórico, fontes factuais, brief e QA. Conteúdo que falha QA ou carece de fonte vai para revisão, não para publicação automática.
- [ ] Testar idempotência da ocorrência, virada de dia, fuso, pausa, retomada, dia perdido, teto de gasto e revisão invalidada.
- [ ] Rodar ensaio completo sem envio e depois acompanhar uma ocorrência real. Configurar aviso de falha/ação necessária; não emitir notificações repetidas de estado inalterado.
- [ ] Escrever operação: pausar, recuperar job, reconectar conta, reconciliar publicação incerta, backup/restore e custos observados. Ativar somente após todas as dependências reais existirem.

## Revisão do pacote

- [x] Requisitos do usuário mapeados: Claude Code, método do tutorial, carrossel diário, Instagram e painel no domínio.
- [x] Diferença entre skill gratuita e painel proprietário documentada.
- [x] Estado atual do site, alterações preexistentes e incompatibilidades Windows registradas.
- [x] Piloto, arquitetura, tarefas, riscos e prompt de continuidade reunidos.
- [ ] Piloto renderizado e validado — trabalho de implementação futuro.
- [ ] Painel, integrações, deploy e agenda — não executados nesta preparação.
