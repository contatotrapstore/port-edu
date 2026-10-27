# Infraestrutura — estado confirmado em 26/10/2026

## Implementado

- Projeto Supabase **edevshub-content-studio**, ref **kcjshrnjkrmtzgpwnygc**, organização **EDevs Dark**. É o antigo finance-os, renomeado após autorização para aposentar os dois aplicativos antigos.
- Finance OS e Elyndra pausados na Vercel. Ambos responderam 503 DEPLOYMENT_PAUSED após a pausa. Projetos/deployments foram conservados pausados; os domínios antigos não foram transferidos para o site.
- Removidos os 14 conjuntos de tabelas financeiras antigas, as 15 tabelas do schema atreia (14 de dados + histórico), views/funções/enums dos aplicativos antigos, trigger antigo de criação de perfil, duas contas antigas do Supabase Auth e role elyndra_runtime.
- Preservadas as estruturas gerenciadas do Supabase e as extensões. Não foi apagado o projeto Supabase.
- Criado schema privado content_studio com 10 tabelas: admin_users, brands, posts, revisions, assets, jobs, schedules, publications, events, settings.
- Todas com RLS; anon/authenticated sem acesso direto. Role exclusiva content_studio_runtime sem privilégios globais, sem acesso ao schema auth e sem permissão de criar administradores ou editar revisões/eventos.
- Marca edevshub cadastrada. Automação e publicação DESATIVADAS. Nenhuma conexão Instagram ou publicação realizada.
- Cadastro público desativado. URL Auth aponta para www.edevshub.com; callbacks preparados para /admin/auth/callback e localhost:3000. Rotas ainda não implementadas. Não há administrador cadastrado.
- Credenciais locais específicas em .env.content.local, ignorado pelo Git. Não é carregado automaticamente pelo Next: integrar explicitamente ou migrar somente as variáveis necessárias para .env.local e Vercel ao implementar o painel. Token de gerenciamento não foi gravado nesse arquivo.

## Projeto preservado

**financeiro-edevshub**, Supabase **gsykjkkylzhqkkkgclzi**, domínio **financeiro-edevshub.vercel.app**. Nenhuma operação de banco/configuração nesse projeto. HTTP 200 conferido após a troca.

O Revix e seu antigo schema atreia vazio também não foram alterados. O conector Supabase padrão continua apontando para Revix: não usá-lo para este projeto.

## Evidências e limites

- SQL de desativação: tools/content-db/retire-legacy-apps.sql, executado somente neste alvo em transação única junto com a foundation.
- Foundation: supabase/migrations/20261027001716_content_studio_foundation.sql. Aplicada via Management API; não foi inserida automaticamente no histórico do Supabase CLI. Reconciliar histórico antes de db push; não reaplicar.
- Ensaio remoto com rollback passou antes da transação definitiva. Revisão independente sem achados importantes; 9/9 testes locais passaram.
- Advisor de segurança retornou lints vazio. Conexão real da role nova validada; não há prova de fluxo completo de autenticação, concorrência de workers ou publicação Instagram.
- Recibo sem segredos: RECIBO-INFRA.json. Backup anterior do Elyndra continua na pasta privada original; restauração testada. Não existe novo backup do Finance OS, conforme usuário dispensou.

## Próximas entregas

1. Concluir piloto de sete slides (PNG/MP4/áudio/prévia).
2. Implementar painel Next.js na Vercel do site, autenticação e primeiro administrador autorizado.
3. Implementar operações transacionais de revisões, aprovação, leases e fila; as tabelas são base, não substituem essas regras.
4. Criar bucket privado para assets, configurar credenciais nos serviços e conectar Meta/Insights.
5. Hospedar worker para funcionar sem PC ligado; só ativar agenda após validação real.

A Vercel hospeda painel/APIs. Renderização HTML/Chromium/Python/FFmpeg é externa. JEV/Hermes seguem fora da implementação inicial.
# Atualização — execução local com assinatura (26/10/2026)

O usuário escolheu PC ligado, usando Claude Code ou Codex já assinados. Verificado localmente: Claude Code 2.1.170 com login claude.ai/Max; Codex CLI 0.162.1 com login ChatGPT. Não copiar OAuth/cookies para Vercel nem oferecer login Claude.ai dentro do painel.

Implementado adaptador local `tools/content-worker/scripts/draft-generation.mjs`: invoca o binário oficial Claude Code, sem shell, sem ferramentas/MCP e sem herdar chaves API/banco. Dados de entrada são limitados; saída JSON é validada, fontes precisam estar na entrada e placeholders são rejeitados. Falha de sessão/limite interrompe o trabalho, sem fallback pago. Um rascunho real de sete slides foi gerado em `output/conteudo/teste-assinatura/draft.json`. Isso comprova a geração local via assinatura, não um serviço autônomo já instalado.

Revisão editorial adicionada: decisão e notas persistem no histórico, vinculadas à revisão e ao hash das mídias apresentadas. Aprovação NÃO agenda, habilita publicação nem cria jobs. Modificação de texto/mídia exige nova avaliação. Apenas o usuário deve aprovar o conteúdo.

Pendente: ligar pesquisa → geração → renderer → upload → painel e instalar rotina local; concluir Meta antes de qualquer teste real de publicação. Usuário proibiu publicar até analisar o post. Codex permanece uma alternativa autenticada; seu adaptador ainda não foi implementado/testado.

Referências: https://code.claude.com/docs/en/headless ; https://code.claude.com/docs/en/legal-and-compliance ; https://learn.chatgpt.com/docs/auth ; https://learn.chatgpt.com/docs/non-interactive-mode . Uso local individual pelos aplicativos oficiais, sujeito aos limites das assinaturas.

