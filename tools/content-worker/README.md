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

Este motor ainda não é um serviço persistente: não consome fila hospedada, não publica no Instagram e não executa com o computador desligado.

A base de fila em scripts/queue.mjs recebe uma conexão Postgres restrita e implementa enqueue, claim, heartbeat e confirmação de renderização. Claims são atômicos, lease de dois minutos, até três tentativas; nunca recupera publicação incerta como render. Ainda não há daemon integrado, upload de artefatos nem atualização automática do estado editorial. Não a anuncie como automação ativa.
# Execução local e revisão

- `powershell -File tools/content-worker/INICIAR-WORKER.ps1` mantém um worker discreto neste PC, consultando apenas renders solicitados a cada 30 segundos. Depois de reiniciar o PC, execute novamente. Não é tarefa diária de geração nem publicador.
- `node tools/content-worker/scripts/worker-once.mjs` processa um render pendente e termina. Precisa de `.env.local`, dependências do doctor e da referência local de fontes/música. Falha não publica nada.
- No painel, salvar texto cria revisão; **Gerar vídeos** enfileira; **Atualizar status** consulta; **Pedir ajustes/Aprovar conteúdo** registra decisão editorial. Aprovar não agenda/publica. Alterações invalidam a aprovação anterior.
- `generateWithClaude(input,cwd)` em `draft-generation.mjs` usa o Claude Code oficial e seu login local Claude.ai. O teste real gerou sete slides com assinatura Max; não há proxy de OAuth nem chave de API no painel. Consome os limites da assinatura. Codex está autenticado, mas adaptador ainda pendente.
- O roteiro gerado ainda passa por revisão editorial; o teste precisou remover uma hipótese sem evidência e melhorar a legenda. Não tratar JSON válido como qualidade editorial aprovada.
- Radar, rotina diária de escrita e conexão final Meta continuam pendentes. Publicação segue bloqueada por decisão do usuário.

