# Publicação e áudio — implementação

Objetivo: preparar ativação explícita de publicação automática, sem publicar durante a preparação. Especificação: API-E-AUTOMACAO.md, CONEXAO-INSTAGRAM.md e pedidos do usuário.

Arquitetura: token privado, cliente Instagram com persistência de containers, agenda separada da aprovação, bloqueio global false até liberação. Worker local para produção; execução da publicação deve declarar sua dependência operacional, sem prometer funcionamento online sem scheduler implantado.

## Restrições
- Conta edevshub, Instagram ID 17841416428564956. Não mensagens/comentários/anúncios.
- Zero chamadas media_publish reais nesta preparação.
- Aprovação editorial nunca liga publicação nem agenda implicitamente.
- Financeiro ativo gsykjkkylzhqkkkgclzi intocado.
- Credenciais não entram no chat, logs, repositório ou browser bundle.

## Entregas e verificações
- [x] Convite Instagram aceito e OAuth pelo domínio concluído.
- [x] Confirmar token, identidade e escopos somente por leitura: @edevshub, basic/publicação/insights, validade 26/12/2026.
- [x] Ampliar biblioteca sintetizada: 12 famílias / 36 variações, manifesto e demo local; cues integrados.
- [x] Testar política de agenda (aprovação, revisão, mídia, fuso, futuro, pausa).
- [x] Implementar publicação retomável: filhos, processamento, pai, estado incerto e reconciliação. Simular sem postar.
- [x] Expor controles e diagnóstico no painel, mantidos desligados.
- [x] Validar build, revisão independente e fluxo online.

## Pontos de revisão
Credencial expirada; edição após aprovação; resposta perdida após envio; agenda duplicada; PC offline no horário. Uma resposta ambígua nunca deve provocar novo post automático.

## Áudio
Manter identidade com variação de timbre por carrossel. Efeitos só em ações visuais, volume controlado, repouso no fim do loop. Não alegar ganho de conversão sem experimento real. Bibliotecas externas exigem registro de origem/licença por arquivo; nenhuma compra autorizada.

## Verificação de conexão — 27/10/2026
OAuth concluído em www.edevshub.com, credencial criptografada, conta confirmada por leitura. Publicação desligada, nenhuma chamada media_publish real. Revisão independente: removido caminho manual que não validava insights; status considera expiração. Agenda e executor concluídos na etapa abaixo.

## Entrega — 27/10/2026

- Produção Vercel dpl_33mTqvfc5LacaNtuwYenhYSxJXKf, commit 9861db6, www.edevshub.com/admin/conteudo.
- 42 testes passaram; build e lint direcionado passaram. Revisão independente encontrou corrida no cancelamento e ausência de reconciliação com chave desligada; ambas corrigidas e verificadas.
- Worker local reiniciado, publisher independente a cada minuto com heartbeat confirmado. Um slot por dia, horário inicial 12h30 Brasília, modo aprovado, chave false. Pesquisa diária ativa com Codex/ChatGPT.
- Novo fluxo de agenda exige revisão aprovada + mídias exatas. Automático exige ativação explícita sem revisão individual, produção recente e QA. Cancelamento, horário perdido, estado incerto e expiração tratados.
- Efeitos originais: prévia MP3 de 12 famílias acessível no painel, 36 variações na produção. MP4s antigos preservados.
- Credencial renovável pelo worker antes de expirar; a renovação só ocorre quando elegível (mais de 24h, menos de 14 dias restantes). Não forçamos refresh antes da janela da Meta.
- Nenhuma chamada real de media_publish e nenhuma agenda de produção criada. Primeira postagem real depende da autorização do usuário, para respeitar a revisão solicitada; testes de envio usam Meta simulada.

### Modern Web Guidance
Usei forms: controles nativos com nomes e labels, radios para os dois modos e bloqueio de submissão enquanto pendente ("disable the button after a valid submission is clicked to prevent double-posts"). Autorização e validação continuam no servidor.
