# Publicação independente do PC

Escopo autorizado: produção via assinatura continua no PC. Agendamento e envio dos vídeos prontos passam para Supabase Cron → rota privada na Vercel → Instagram. Preservar aprovação e horário 28/10/2026 12:00 America/Sao_Paulo. Nenhum envio antecipado ou aprovação automática nova.

1. Extrair publicador compartilhado e autenticar endpoint com segredo privado.
2. Corrigir lock para conexão de sessão (porta 5432); pool transacional 6543 não garante advisory lock entre transações.
3. Adicionar seletor operacional cloud/local, sem alterar aprovação editorial.
4. Implantar endpoint, configurar Vault e cron, testar chamadas e heartbeat com execução local desabilitada.
5. Verificar autorização Meta via GET, agenda, prevenção de duplicidade e revisão final.

Custos: usar infraestrutura existente; nenhuma contratação ou API de geração paga.

## Verificação em 27/10/2026

- Publicador cloud ativo no Supabase; local retorna inactive. Geração e pesquisa permanecem no PC, conforme esclarecimento do usuário.
- Endpoint recusa solicitações sem assinatura (401); HMAC SHA-256 válido por 90 segundos, segredo somente Vault/Vercel. A fila pg_net não recebe o segredo permanente.
- Cron executou em 05:07 UTC, HTTP 200, state idle. Heartbeat cloud confirmado no painel autenticado.
- API Meta GET confirmou @edevshub e acesso content_publishing_limit; nenhuma publicação de teste enviada.
- 49 testes passaram; build Vercel Ready. Revisão independente corrigiu orçamento de execução: 300s máximo, 150s para iniciar novas etapas, fetch de storage 30s.
- Mantida agenda aprovada de 28/10/2026, 12:00 America/Sao_Paulo, revisão 85b25d8c-491c-4779-8cf8-ebd53f653f38.
- Painel diferencia produção local e publicação na nuvem.
