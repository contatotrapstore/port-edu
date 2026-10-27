# Registro de execução

- Autorização mais recente: usuário não usa mais Finance OS nem Elyndra; reutilizar ambos. Preservar financeiro-edevshub (`gsykjkkylzhqkkkgclzi`). Nenhuma limpeza remota realizada; acesso administrativo ao antigo finance-os ainda necessário.

Plano: kit-conteudo/PLANO.md. Branch: codex/content-studio, worktree separado.

- Iniciado em 26/10/2026. Alterações do checkout original preservadas.
- Decisão do usuário: Vercel do site + Supabase. JEV/Hermes secundários.
- Supabase: criação de edevshub-content em sa-east-1 rejeitada pelo limite de projetos gratuitos. Nenhum projeto existente alterado. Decisão pendente do usuário; não contratar upgrade automaticamente.
- Tarefa 1 em execução: motor portátil local, dependências isoladas e validação de caminhos.
- Testes paths: RED por módulo ausente; GREEN 3/3 após implementação. Doctor identificou corretamente Chromium ausente; instalação iniciada. Piloto ainda não gerado.
- Usuário autorizou reaproveitar infraestrutura do marketplace Aion cancelado. Conferidos docs originais e conexão READ ONLY: finance-os / atreia / elyndra_runtime. Não usar Revix nem sua cópia antiga vazia. DECISOES-INFRA.md registra o alvo e os limites.
- Autorização posterior: remover atreia/Elyndra e criar estrutura Content Studio preservando Finance. Backup cifrado e drill verificado em 26/10. Preparação SQL testada em PGlite (3/3), sem CASCADE. Banco remoto ainda intacto: acesso administrativo indisponível; navegador pede conta com acesso a finance-os. A autorização para excluir não supre a falta de credenciais administrativas.
- Ruling: produzir prévia animada com a identidade já escolhida sem esperar nova aprovação do estático — usuário pediu começar a implementação; ajustes visuais continuam possíveis — custo: eventual nova renderização.
- Ruling: não publicar nem agendar enquanto conexão Meta e acesso privado não estiverem validados — esses pré-requisitos continuam ausentes — custo: ativação online fica pendente.

- Infraestrutura aplicada: antigo finance-os renomeado edevshub-content-studio, ambos apps antigos pausados, estruturas antigas retiradas, schema novo com 10 tabelas privadas e credenciais exclusivas. Financeiro atual preservado. 9/9 testes, ensaio remoto rollback, revisão independente e advisor sem lints. Ver DECISOES-INFRA.md e RECIBO-INFRA.json para estado atual; notas anteriores de bloqueio foram superadas.

- 26/10: Mobbin MCP instalado globalmente e OAuth concluído. Administrador provisionado com o e-mail informado; nenhum convite enviado. Painel local com login por link, autorização server-side e revisões persistidas implementado. Build passou; lint do código novo passou após correção, lint geral tem erros preexistentes. Testes de infraestrutura 9/9. Sete MP4s exportados e FFprobe/QA aprovados; ver VALIDACAO-PILOTO.md. Integração Meta em configuração no navegador, publicação permanece desativada. Painel ainda não implantado.

- Login: conta administrativa confirmada pelo provisionamento; Supabase aceitou envio do magic link após correção (antes retornava signup_disabled). Redirecionamento anônimo verificado no navegador. Falha Turbopack em dev causada por junction residual do npm no worker; removê-la foi bloqueado pela política. Resolvido sem exclusão: limitar detecção Tailwind ao código src, conforme documentação oficial. App Meta criado pelo usuário e confirmado no painel: 1667104521635136; @edevshub logado no navegador.

- Revisão independente do painel: corrigido P2 de perda de rascunho em erro de salvamento. Teste reproduziu falha antes da correção e passou depois. Formulário mantém conteúdo e mostra erro sem navegação; tsc e lint passaram. Meta: usuário autorizou acesso ao perfil/publicação/insights e conversão pública. Instagram confirmou conta comercial pronta (Empresa de software), sem contato público; convite de testador em nova tentativa após conversão.

- Verificação atual: 13/13 testes passaram; build de produção e isolamento Workana passaram após correção do editor. Permissões da Meta configuradas para teste, mas nenhum token obtido; conta profissional convertida com confirmação explícita do usuário.

- E2E autenticado: usuário abriu magic link no Chrome; painel carregou como administrador. Piloto salvo no post a198d7c7-0ea2-4212-802e-5000531bc2c6. Fonte inválida recusada sem perda de campos; correção salva como segunda revisão. Reload manteve rascunho; consulta read-only confirmou duas revisões e estado draft. Fonte específica do case HTTP 200. Nenhum envio Instagram.

- Base da fila render criada por TDD: teste falhou por módulo ausente e passou após implementação. Três cenários: duplicação/dois claims, recuperação de lease e rejeição de worker antigo, revisão obsoleta e isolamento de jobs publish. Não conectada ao renderizador nem ao painel ainda.

- Suite consolidada após fila: 16/16 passou. Painel autenticado e rascunho persistido validados no navegador. Convite Meta falhou também manualmente; toast genérico capturado. Sem token/sem publicação.

- Storage privado content-studio criado; 14 arquivos piloto (7 PNG/7 MP4) com hash e revisionId. Chave de Storage somente no servidor, em .env ignorado. API de preview exige admin e redireciona para URL de cinco minutos. Teste HTTP: sem sessão401/no-store; URL pública negada400; URL assinada200 video/mp4. Reprodução autenticada no painel confirmada 1080x1350, 8s, sem erro; pausa confirmada. Suite17/17, tsc/lint do código novo passaram. Revisão adicional de storage/rota/preview/fila sem achados importantes. Nenhuma implantação, nenhum post Instagram.
