# Reels e Stories — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** produzir e agendar o lote autorizado até segunda 02/11, ampliando o Content Studio para Reels narrados e Stories.
**Architecture:** `brief.format` identifica carousel/reel/story, com carousel como padrão legado. Roteiros continuam sendo cenas/slides; Reel/Story resulta em um MP4 vertical e poster. A mesma revisão imutável, fingerprint, aprovação e máquina de publicação protegem os três formatos. Slot de agenda manual distingue formato; automático continua limitado a carrossel diário e desativado na conta.
**Tech Stack:** Next/React/Postgres privado/Supabase Storage, Node worker local, Python/FFmpeg, Meta Graph Instagram Login.
**Spec:** pedido do usuário de 27/10 e ANALISE-INSTAGRAM-2026-10-27.md. Autorização cobre produção, revisão delegada e agendamento desta semana; não ativar geração contínua.

## Global Constraints
- Preservar seis carrosséis aprovados e o post publicado. Não alterar Finance, site público, redesign, segredos ou autenticação.
- Produzir somente sob demanda; publicar arquivos prontos pela nuvem, modo approved.
- Reels quatro nesta janela: terça, quinta, sábado e segunda. Stories curtos de apoio nos mesmos dias, com conteúdo próprio e sem fingir stickers interativos.
- Formato ausente é carousel; valor inválido falha fechado. Assets/revisão/formato precisam concordar.
- Não reenviar publicação de resultado incerto. Não usar fake metrics, depoimentos ou promessas de alcance.
- Produção de voz deve usar um recurso disponível sem contratar assinatura; não representar a voz sintética como a voz do usuário.

## Review Focus
- Formato inválido ou alterado não pode publicar como formato errado.
- Uma segunda publicação no mesmo dia não deve colidir com o carrossel nem duplicar a revisão.
- Reel/Story com asset incompleto ou proporção/duração inadequada deve ser rejeitado.
- Timeout após envio não pode causar duplicação.
- UI de prévia e edição deve preservar o formato e representar um vídeo contínuo.

### Task 1: Publicação e elegibilidade por formato
Files: src/lib/content/publication-{policy,step,queue}.mjs, publication-policy.d.mts; tools/content-worker/tests/*publication*.test.mjs.
Consumes: `brief.format`, slots existentes; produces: eligibility aceita `format`, advancePublication aceita `format`, mantendo default carousel.
- [x] Criar testes que rejeitam formato inválido, aceitam um MP4 vertical com roteiro multi-cena e recusam assets carrossel para Reel; executar e observar falha antes da implementação.
- [x] Mapear REELS com caption/share_to_feed; STORIES sem caption; um container, mesma preparação/checagem/envio e reconciliação. Manter carrossel intacto.
- [x] Propagar formato da revisão pela queue e restringir seleção automática a carousel.
- [x] Rodar regressões de publicação, incluindo timeout e pausa.

### Task 2: Editor, revisão e agenda
Files: src/lib/content/{input,repository,review,scheduling}.ts; src/app/admin/conteudo/{page,AssetPreview,PublicationControl}.tsx; tests apropriados.
Consumes: formato normalizado e elegibilidade de Task1; produces: rascunho tipado, revisão preservada, slots carousel/principal, reel, story.
- [x] Testar parsing/agenda por formato e regressão dos rascunhos legados.
- [x] Adicionar seletor nativo e descrição de cenas; prévia vertical, sem loop de Reel; compartilhar elegibilidade no review/schedule.
- [x] Confirmar constraints reais no DB antes de qualquer alteração; evitar migration se slot_id existente aceita nomes arbitrários.
- [x] Build/lint e prévia no navegador; confirmar que /admin exige login e site público segue intacto.

### Task 3: Produção vertical local
Files: tools/content-worker/scripts/vertical-*; worker-once.mjs e documentação local.
Consumes: revisão com formato e roteiro; produces: um MP4 1080x1920 H264/AAC, poster, QA e proveniência com formato.
- [x] Implementar narração por cena, duração derivada do áudio e legendas; compor cenas diferentes, efeitos discretos e mix legível.
- [x] Integrar no worker pontual e upload privado sem alterar geração/carrossel legado.
- [x] Validar áudio, codecs, duração e áreas seguras; inspecionar contato visual. Áudio validado tecnicamente; audição humana não realizada.

### Task 4: Lote e entrega
Files: kit-conteudo/LOTE-REELS-STORIES-2026-10-27.md; artefatos output/conteudo/vertical-batch-2026-10-27/.
- [x] Preparar quatro roteiros úteis e quatro Stories de apoio; usar exemplos identificados, fontes primárias e temas distintos dos carrosséis.
- [x] Renderizar, revisar e registrar aprovação do assistente com autorização do usuário, sem simular clique manual.
- [x] Revisão independente do código; deploy da extensão, smoke test e verificação de heartbeat cloud.
- [x] Agendar apenas após QA e deploy. Hoje usar horário ainda futuro, com margem operacional; futuros Reels 19h, Stories 19h15.
- [x] Conferir lote completo no banco e modo approved/research false. Documentar horários efetivos e pendências honestamente.

## Ledger
- 27/10 17h55: worktree existente codex/content-studio confirmado isolado; nenhum arquivo de instrução AGENTS/CODEX/RTK localizado na raiz. Dados de conta já verificados. Decisão: usar brief.format para evitar migration estrutural desnecessária e compatibilidade default carousel.
- Autorização do usuário já inclui executar e programar; não exigir nova aprovação genérica de plano.

- 27/10 18h15: entrega verificada em produção; 14 agendamentos, cloud ativo, pesquisa desativada. Meta retornou FINISHED para os containers de Reel e Story de hoje, ainda sem publicar.
