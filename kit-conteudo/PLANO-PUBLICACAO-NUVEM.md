# Publicação independente do PC

Escopo autorizado: produção via assinatura continua no PC. Agendamento e envio dos vídeos prontos passam para Supabase Cron → rota privada na Vercel → Instagram. Preservar aprovação e horário 28/10/2026 12:00 America/Sao_Paulo. Nenhum envio antecipado ou aprovação automática nova.

1. Extrair publicador compartilhado e autenticar endpoint com segredo privado.
2. Corrigir lock para conexão de sessão (porta 5432); pool transacional 6543 não garante advisory lock entre transações.
3. Adicionar seletor operacional cloud/local, sem alterar aprovação editorial.
4. Implantar endpoint, configurar Vault e cron, testar chamadas e heartbeat com execução local desabilitada.
5. Verificar autorização Meta via GET, agenda, prevenção de duplicidade e revisão final.

Custos: usar infraestrutura existente; nenhuma contratação ou API de geração paga.
