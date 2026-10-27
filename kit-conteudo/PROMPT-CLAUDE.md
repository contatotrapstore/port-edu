# Mensagem para iniciar no Claude Code

## Estado real da continuidade

Em 26/10/2026, a preparação já avançou para implementação no worktree `codex/content-studio`. Leia primeiro EXECUCAO.md, DECISOES-INFRA.md, RECIBO-INFRA.json, VALIDACAO-PILOTO.md e CONEXAO-INSTAGRAM.md. Não refaça a limpeza do banco nem reaplique a migration inicial: ela já foi executada manualmente no projeto `kcjshrnjkrmtzgpwnygc`; o histórico do CLI precisa ser reconciliado antes de qualquer db push.

Concluído: Mobbin global no Codex, banco privado, administrador, login por e-mail validado, editor com revisões persistidas, piloto de sete vídeos local, conta Instagram comercial e app Meta criado. Painel somente local; publicação e automação desativadas. Fluxo autenticado verificado com um rascunho e duas revisões. Quatorze arquivos do piloto vinculados à revisão em bucket privado; prévia autenticada reproduzida no painel. Base de fila render com lease e testes implementada, ainda sem daemon. Convite Meta de testador não confirmado; nenhum token capturado.

Pendente: conexão efetiva Meta, integração da fila ao renderer e worker persistente, produção pelo painel, calendário e acervo, adaptador de publicação/reconciliação, radar editorial e rotina diária, deploy no domínio e ensaio completo. Não anunciar a automação como pronta.

Copie o bloco abaixo no Claude Code aberto na pasta deste projeto.

```text
Estamos no projeto EDevsHub, domínio https://www.edevshub.com e Instagram @edevshub.

Quero produzir carrosséis animados com o método do vídeo https://www.youtube.com/watch?v=TZg-PgSxm3M e da skill https://github.com/Felpborges/criador-de-carrosseis-simples. O objetivo final é criar e publicar conteúdo diário sobre nossos serviços e entregas, misturado a novidades de IA, agentes, Claude, Codex e ecossistema, testando quando vale publicar mais de uma vez ao dia, com painel privado no nosso site em /admin/conteudo.

Antes de agir, leia kit-conteudo/README.md, ESCOPO.md, PLANO.md, MARCA.md, PILOTO.md, FONTES.md, ESTRATEGIA-EDITORIAL.md e API-E-AUTOMACAO.md, além das instruções locais aplicáveis. O pacote distingue fatos, propostas e decisões ainda abertas; não trate proposta como infraestrutura já existente ou custo autorizado.

Comece pela Fase 1 do PLANO: preparar a skill no ambiente correto e gerar o piloto real local, com PNGs, um MP4 por slide, som, testes e preview. Inspecione o código externo antes de executá-lo; fixe a versão registrada. Adapte os caminhos e comandos ao Windows. Aproveite os materiais de Rebranding e as fontes factuais do portfólio. Não gere interfaces falsas, resultados comerciais ou números sem fonte.

Leia também kit-conteudo/ANALISE-JEV-HERMES.md. JEV é candidato opcional para triagem e escolha de copy; Hermes é candidato a executor na fase hospedada. Nenhum foi aprovado como dependência obrigatória ou instalado. Não adie o piloto por eles; mantenha interfaces desacopladas e valide com benchmark antes de adotar. Publicação, deduplicação e QA de mídia continuam sob controle do código do produto.

Há mudanças preexistentes neste checkout. Inspecione git status, preserve-as e use isolamento quando necessário. Não faça reset/clean, não faça commit de segredos ou do tutorial baixado, e não envie push em main, pois o README informa deploy automático. Não altere /contratar nem as campanhas para construir este recurso.

O piloto deve validar a identidade antes de expandir. Em seguida implemente o painel e o worker conforme o plano, mantendo render pesado separado das requisições do site. Não invente banco, autenticação ou conta Meta já conectados. Consulte documentação oficial atual para as integrações. Faça o trabalho local que já está definido; solicite apenas decisões ou conexões realmente necessárias para a próxima etapa.

Destino final autorizado pelo pedido: @edevshub. Proposta: sete posts principais por semana, inicialmente alternando 12h30 e 19h00 (America/Sao_Paulo), e depois teste de até três extras semanais. Siga o experimento documentado; os horários não foram comprovados pelos Insights do perfil. Ativação, orçamento e credenciais seguem pendentes. Implemente radar de notícias com fontes oficiais, checagem de fatos, copy, fallback evergreen e coleta de Insights. Não ative agenda sem conexão real e configuração operacional. Não prometa que todas as métricas do aplicativo existem na API. Não prometa custo zero. Publicação deve usar a conta verificada e impedir duplicação, inclusive após timeout. O modo automático é a meta; a revisão inicial calibra o primeiro padrão.

Entregue evidências: arquivos reais do piloto, preview, relatório dos testes e, nas fases seguintes, painel funcional, acesso privado testado e confirmação real de publicação. Relate claramente o que está pronto e o que depende de configuração externa.
```

