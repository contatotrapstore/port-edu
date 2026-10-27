# Piloto 01 — evidências locais

Sete slides sobre atendimento, integração e CRM. Fonte do case: `src/lib/case-insights.ts` (Muda Paisagens). As ilustrações são esquemáticas, sem números de resultado inventados.

Arquivos: `output/conteudo/piloto-01/preview.html`, imagens em `resultados/estatico/`, vídeos em `resultados/slide-01.mp4` até `slide-07.mp4`. Saídas ignoradas pelo Git.

Verificação em 26/10/2026:
- 7 MP4s: H.264, 1080 × 1350, 30 fps, áudio AAC. Durações: 8, 6, 6, 6, 6, 6 e 8 segundos (46 segundos total), conferidas com FFprobe.
- QA dos sete HTMLs: movimento presente, seek determinístico, primeiro/último frame iguais, nenhum overflow ou erro reportado. Evidência: `resultados/qa.json`.
- Música: relatório local `audio/loudness.json`, alvo -14 LUFS e -1,8 dBTP.
- Prévia com controles nativos, sem autoplay, versão estática e download por slide. Dimensões explícitas evitam deslocamentos do layout.

Prévia aberta no Chrome: slides 1 a 6 inspecionados; slide 1 reproduzido e pausado aos 5,13 segundos, duração de 8 segundos, 1080 × 1350 e sem erro de mídia. Os demais vídeos aguardam reprodução manual. Não houve avaliação auditiva da trilha.

Limites: revisão editorial final e aprovação da identidade ainda pendentes. Não publicado no Instagram. Isto é um piloto próprio baseado no método de renderização por código; não uma reprodução artística exata do vídeo do tutorial.

Integração privada: 14 arquivos armazenados no Supabase em bucket privado, vinculados à revisão b35313c8-d500-426a-a989-e44b2242bf9b. Prévia no painel /admin/conteudo validada com login; primeiro MP4 reproduzido e pausado sem erro. Sem sessão: rota401; acesso público de Storage negado; URL temporária autorizada200. As mídias continuam sem publicação.
