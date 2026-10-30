# Motor local do Content Studio

Execute a partir da raiz do repositório:

```powershell
npm.cmd ci --prefix tools/content-worker
node tools/content-worker/scripts/doctor.mjs
node --test tools/content-worker/tests/*.test.mjs
node tools/content-worker/scripts/create-pilot.mjs
node tools/content-worker/scripts/render.mjs --project piloto-01 --mode stills
node tools/content-worker/scripts/render.mjs --project piloto-01 --mode cues
Push-Location output/conteudo/piloto-01
../../../tools/content-worker/.venv/Scripts/python.exe scripts/musica.py
Pop-Location
node tools/content-worker/scripts/render.mjs --project piloto-01 --mode qa
node tools/content-worker/scripts/render.mjs --project piloto-01 --mode video
```

O gerador recusa substituir um piloto existente. Python, bibliotecas em requirements.txt, FFmpeg/FFprobe e Chromium do Playwright precisam estar instalados; doctor verifica disponibilidade. Saídas ficam exclusivamente em `output/conteudo/`.

Referência: https://github.com/Felpborges/criador-de-carrosseis-simples, commit `0c0323d44ecdf69c501145a27af0796763efaff5`. O gerador espera uma cópia local desse commit em `vendor/criador-de-carrosseis-simples-<commit>` e usa suas fontes e seu script de música com adaptação UTF-8. Nenhuma licença geral foi identificada na cópia inspecionada: não redistribuir o pacote original como código próprio. Vendor e mídia gerada não são versionados.

## Operação atual — 27/10/2026

- Produção **somente sob demanda**. Pesquisa diária está desativada e o atalho de inicialização foi removido. Não iniciar `worker-loop.mjs` sem nova autorização.
- Para processar um pedido já na fila, execute `node tools/content-worker/scripts/worker-once.mjs`. O processo termina após um job e não publica.
- Vercel executa o publicador; Supabase Cron chama a rota protegida uma vez por minuto. Arquivos prontos ficam no Storage privado. O PC pode estar desligado na hora da postagem.
- Modo atual: somente revisões aprovadas e explicitamente agendadas. Na agenda manual há um slot por formato/dia: `principal` (carrossel), `reel`, `story`. A seleção automática continua limitada ao carrossel e não está ativada.
- Preparação normal começa até 20 minutos antes. Tolerância de 15 minutos; não recuperar dias perdidos. Envios de resultado incerto são reconciliados por leitura e nunca reenviados automaticamente; não bloqueiam outros posts.
- Aprovar é uma etapa editorial. Agendar é separado. Alterações de texto criam nova revisão, invalidam a aprovação anterior e pausam agendas antigas. Alterar somente a legenda preserva o storyboard vertical; alterar cenas/formato gera um novo storyboard padrão.
- Token Meta criptografado; renovação ocorre no publicador cloud quando aplicável. Revogação exige reconectar pelo painel.

## Reels e Stories narrados

`brief.format`: `carousel` (padrão legado), `reel`, `story`. A UI permite escolher formato. As linhas do roteiro são cenas: um carrossel gera um vídeo por cena; Reel e Story geram um vídeo contínuo 1080×1920, H.264/AAC, 30 fps. Limites editoriais internos: Reel 3–90 s; Story 3–60 s. A narração determina a duração.

`vertical_render.py` usa `edge-tts==7.3.1`, voz sintética `pt-BR-AntonioNeural`, legendas baseadas em tempos de palavras, trilha e efeitos originais. O texto da narração é enviado ao serviço online de voz do Edge; não usar dados privados de clientes nos roteiros. Não usa crédito de API GPT/Claude para a voz, não clona a voz do usuário e não requer uma nova assinatura. A disponibilidade do serviço externo não é garantida: se falhar, o job para; não substitui silenciosamente por outra voz.

Instalar dependências locais: `tools/content-worker/.venv/Scripts/python.exe -m pip install -r tools/content-worker/requirements.txt`.

Artefatos: `output/conteudo/job-<id>-<attempt>/resultados/slide-01.mp4`, `estatico/slide-01.png`, `review.jpg` e `qa.json`. Conferir roteiro, prévia e áudio antes de aprovar. O QA automatizado valida estrutura; não substitui revisão editorial.

Reels usam `media_type=REELS` e aparecem também no feed; Stories usam `STORIES`, sem legenda enviada à API. Não há stickers de enquete/link simulados. A mesma máquina de estados e proteções de duplicação atendem os três formatos.

Verificações: `node --test tools/content-worker/tests/*.test.mjs` e `tools/content-worker/.venv/Scripts/python.exe tools/content-worker/tests/vertical.test.py`.

## Voz padrão: ElevenLabs / Gabriel (27/10/2026)
O renderer vertical agora usa ElevenLabs por padrão e falha se faltar configuração; não retorna silenciosamente ao Edge. Configuração exclusivamente local em `.env.elevenlabs.local` (ignorado pelo Git): ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL_ID, ELEVENLABS_VOICE_NAME e CONTENT_VOICE_PROVIDER. A chave não vai para Vercel, Supabase, navegador do painel ou subprocessos de geração de texto. O worker passa somente essas variáveis ao renderer vertical.

Chave autorizada para geração de fala, leitura de vozes e consulta do usuário/saldo, com limite de 10.000 créditos por ciclo. Voz Gabriel — Shorts & Reels; modelo eleven_v4. Não há compra automática de créditos nem ativação de produção contínua. Para uso comercial o provider exige assinatura diferente de Free. Falha de rede de uma geração potencialmente cobrada não dispara retry automático. Cache inclui provedor, voz, modelo, parâmetros e texto, sem reutilizar o cache Edge.

O provider recebe alinhamento de caracteres, converte em palavras e sincroniza as legendas. Áudio normalizado com margem de true peak e limiter antes do AAC. Testes: `python tools/content-worker/tests/eleven_voice.test.py` e `python tools/content-worker/tests/vertical.test.py` usando o Python da venv.

O lote de 27/10 a 02/11 foi regenerado após ativação do Starter: dois primeiros áudios pelo navegador e seis vídeos restantes via API. Foram criadas revisões novas, assets novos e aprovações novas; os containers antigos não foram reaproveitados. Consulte `kit-conteudo/ENTREGA-GABRIEL-2026-10-27.md`.

## Posts prontos importados, rótulo de IA, Collab e imagem nativa (30/10/2026)

Posts feitos fora do Studio (ex.: Revix, foto real de carros e encontros) entram pelo `studio-importar.mjs` (repositório Revix, `marketing/instagram/_ferramentas/`, fora do Git) com `brief.production='manual-only'`. O painel não oferece "Gerar vídeos" para eles; `requestRender` e o worker recusam.

- **Rótulo de IA** (`is_ai_generated`): vem da revisão. `brief.ai_generated` (boolean) manda; sem ele, conteúdo gerado pelo Studio leva o rótulo (comportamento da EDevsHub) e `manual-only` não leva. Com `false` o campo não é enviado. Nunca vai nos filhos do carrossel.
- **Collab**: `brief.collaborators` (até 3 usernames, sem @) vai como `collaborators` (JSON) no contêiner pai de carrossel e de Reel. Story não aceita. Se a Meta recusar a criação do pai por causa do convite (texto do erro com "collab"/"colabora"), o aviso `collaborators_rejected` fica em `publications.provider_container_ids.warnings` e no evento `publication.complete`, o pai é refeito sem collaborators na mesma etapa e a Agenda mostra "saiu sem colaboradores". Recusa genérica continua falhando como antes (sem nova tentativa).
- **Imagem nativa**: a Meta só aceita JPEG em `image_url`. Imagem publicável = asset `kind='jpg'` com `provenance.publish=true` (e `format`, `slide`, 1080×1350/1080×1080 no carrossel ou 1080×1920 no Story, `qa='image-checked'`). Vira filho IMAGE (`image_url`, `is_carousel_item`) no carrossel ou `STORIES` com `image_url`. PNG continua só capa/prévia. Carrossel aceita um item publicável por slide (vídeo, imagem ou misto); Reel só vídeo; imagem nunca sai no modo automático. A marca `publish` entra na impressão digital só das imagens, então impressões e aprovações de vídeo existentes não mudam. A URL é a mesma URL assinada (1 h) do bucket privado `content-studio`.
- **Migração** `supabase/migrations/20261031010000_content_assets_jpeg.sql`: `assets.kind` aceita `'jpg'` e o bucket passa a aceitar `image/jpeg` (se ele restringe tipos; hoje restringe a mp4, png, wav e json). Precisa estar aplicada antes do primeiro `--gravar` com imagem.
- **Editar post importado**: o brief importado (production, ai_generated, collaborators, import_key) segue para a revisão nova. Mesmo formato e mesmo roteiro (só legenda, tema, briefing ou fontes): as mídias são copiadas no Storage para a pasta da revisão nova, com ids novos; o post volta para "Em revisão" e precisa de nova aprovação. Falha na cópia ou no banco desfaz e apaga as cópias. Roteiro ou formato novo deixa a revisão sem mídia: reimportar.
