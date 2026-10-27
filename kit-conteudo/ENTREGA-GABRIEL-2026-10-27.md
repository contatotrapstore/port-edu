# Gabriel integrado — entrega de 27/10/2026

## Estado confirmado às 19h04 de Brasília
Starter verificado pela interface e API. Integração autorizada pelo usuário; chave restrita guardada apenas em `.env.elevenlabs.local`, ignorado pelo Git, com limite de 10.000 créditos por ciclo. Permissões: Text to Speech, leitura de vozes e usuário/saldo. Demais endpoints desativados. Nenhuma chave registrada neste documento.

Voz: Gabriel — Shorts & Reels (`k3f7zOv6LF88v78QHCNh`). Modelo: eleven_v4. Worker local usa esta voz por padrão; ausência de chave interrompe a produção sem substituir a voz. Publicação dos arquivos prontos continua na nuvem.

## Calendário ativo
- 27/10: Reel 19h30; Story 19h45.
- 29/10, 31/10 e 02/11: Reel 19h; Story 19h15.
- 28/10 a 02/11: seis carrosséis existentes às 12h, preservados.

São 14 agendamentos ativos. Os oito anteriores com Edge continuam como histórico cancelado; não representam duplicação de envio. Os oito novos vídeos têm novas revisões, arquivos, fingerprints e aprovação delegada do assistente, de acordo com o pedido do usuário. As novas narrações foram geradas após ativação do Starter; a prévia Free não foi usada como master comercial.

Meta confirmou FINISHED para os novos containers de hoje, sem publicação antecipada. Heartbeat cloud atualizado e publisher_error nulo; publicação no modo approved; research_enabled=false. Não foi ativado trabalho contínuo, pesquisa diária ou loop local.

## Saldo e QA
Após assinatura: 39.292 créditos. Após lote: 37.860 disponíveis, 1.432 usados. Os 708 créditos do teste Free foram consumidos antes da assinatura e já estavam refletidos no saldo inicial. O consumo observado via API difere do número bruto de caracteres; não estimar a cobrança futura como sempre um crédito por caractere.

Todos oito MP4: 1080×1920 H.264/AAC; folhas de contato revisadas. Loudness medida: -16,25 a -17,23 LUFS; true peak final -1,25 a -2,90 dBTP. Um Story foi remasterizado para corrigir pico. Áudio avaliado tecnicamente; não simula audição humana. Prévia online do primeiro Reel validada: 34,7s, 1080×1920, readyState=4, sem erro e reprodução iniciada.

64 testes Node passaram; cinco testes Python passaram; lint do worker passou; diff sem erros. Não houve mudança no aplicativo hospedado, apenas no renderer/worker local e nos conteúdos do banco, portanto não foi necessário novo deploy.

Recibos e arquivos locais: output/conteudo/gabriel-paid-2026-10-27/. `scheduled.json` registra IDs e hashes; `final-state.json` registra estado Meta/agenda/heartbeat; `balance-after.json` registra saldo sem segredos. O saldo não é uma promessa de quantidade fixa de futuros vídeos.

O fluxo editorial sob demanda permanece em FLUXO-EDITORIAL-ATE-2026-11-02.md. Os trechos daquele documento que indicavam espera pela assinatura foram superados por esta entrega.
