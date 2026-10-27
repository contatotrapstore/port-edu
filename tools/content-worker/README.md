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

## Operação atual

O worker persistente inicia no login do Windows pelo atalho EDevsHub Content Studio. Pode ser iniciado manualmente com `powershell -File tools/content-worker/INICIAR-WORKER.ps1`; evita instância duplicada.

- Pesquisa/produção consulta a fila a cada 30 segundos. Pesquisa diária após 9h de Brasília, fontes oficiais e deduplicação; sem notícia recente, pauta educativa. Usa Codex/ChatGPT ou Claude Code/Claude.ai no PC conforme escolha no painel. Não usa API paga de geração. Limites da assinatura continuam valendo.
- Publicador independente consulta a cada 60 segundos, mesmo durante renderização. Precisa do PC ligado, sessão Windows e internet. Vercel hospeda o painel; não executa o render/publicador.
- A aprovação editorial não agenda nem ativa envios. Modo aprovado exige aprovação da revisão e mídias exatas, mais agenda manual. Modo automático exige ativação explícita, escolhe uma produção das últimas 36 horas com QA, rejeita pedidos de ajustes. Limite operacional: um slot por dia.
- Preparação de containers começa até 20 minutos antes; envio só no horário. Tolerância de 15 minutos, sem recuperar dias perdidos. Pausa global bloqueia novos envios; resultados incertos continuam sendo conferidos por leitura. Nunca repetir media_publish automaticamente após resposta perdida.
- Cancelar é permitido antes do envio. Após confirmação de envio, confira o resultado no Instagram. Em erro de processamento, cancele, crie nova revisão e revise novamente; containers não são reutilizados indefinidamente.
- Token criptografado AES-GCM; refresh quando faltar menos de 14 dias e tiver mais de 24h de idade. Revogação/expiração exige reconectar pelo painel. Sem PC ligado durante toda a validade, a renovação não acontece.
- Efeitos originais: 12 famílias × 3 variações, 48kHz, sincronizados aos elementos e mixados na trilha. Prévia das famílias no painel. MP4s antigos preservam o áudio que foi revisado.

Verificação de implantação: publicação global desligada e nenhuma chamada real de postagem. Testes com Meta simulada exercitam conclusão, pausa, cancelamento, resposta perdida e retomada. A primeira publicação real permanece uma validação operacional pendente de autorização do usuário.
