# Motor de motion v3

Produz Reels (1080×1920) e carrosséis (1080×1350) da EDevsHub. O worker usa este motor para Reels e Stories da fila, e ele também roda direto para lotes manuais.

```
node tools/content-worker/motion/produce.mjs --project output/conteudo/<lote> [--only <id>] [--stills] [--force]
```

O que acontece em cada item do `content.json`:

1. **Voz.** ElevenLabs com tempo por palavra. Fica em cache pelo hash do texto, então nunca se paga duas vezes pelo mesmo roteiro.
2. **Cenas.** Cada cena começa na palavra marcada em `cue`, sincronizada com a fala. A primeira cena já nasce montada no quadro 0, porque é a capa (`cover_ms: 0` vira `thumb_offset` na publicação).
3. **Trilha.** Uma trilha própria por post. Usa o Eleven Music se a chave tiver a permissão `music_generation`; senão, `music.py` sintetiza uma trilha original (estilos `pulse`, `warm`, `lofi` e `garage`, com tom e progressão sorteados pela semente).
4. **Efeitos.** Biblioteca Mixkit (fora do git, em `output/conteudo/audio-library-2026-10-28`). Os pontos vêm da própria animação (`window.__cues`), com altura, volume e posição variando por post.
5. **Mixagem.** `mix.py` abaixa trilha e efeitos sob a voz (ducking) e normaliza em duas passadas para −14 LUFS e −1,5 dBTP, em estéreo 48 kHz.
6. **Render.** Playwright tira um quadro por vez de `stage.html` e o FFmpeg codifica em H.264 High (CRF 16, preset slow, BT.709 etiquetado) com AAC 192k.
7. **QA.** Gera `qa.json` com ffprobe, loudness e checagem de área segura (topo, base e coluna de botões do Instagram), mais folhas de contato (`contact.jpg`).

## Cenas disponíveis

| Tipo | Uso |
|---|---|
| `hook` / `cover` | Capa, com número grande + chips ou comparação "genérico → seu produto" |
| `evidence` | Print oficial em moldura de navegador, com zoom animado e marca no trecho |
| `hub` | Uma fonte ligada a vários destinos |
| `terminal` | Comando digitado, abas e clique |
| `prompt` | Pedido digitado montando um protótipo |
| `badges` | Avisos e limites |
| `compare` | Dois cartões lado a lado |
| `list` | Pares chave → valor |
| `steps` | Caminhos de cliques |
| `chips` | Requisitos |
| `cta` | Pergunta com opções e convite a salvar |
| `statement` | Cena genérica para roteiros vindos do painel |

Revisões do painel sem cenas estruturadas são convertidas por `from-revision.mjs`: cada slide "Título. fala" vira uma cena, e a fala vira narração.
