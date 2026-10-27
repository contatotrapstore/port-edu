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
- [ ] Testar política de agenda (aprovação, revisão, mídia, fuso, futuro, pausa).
- [ ] Implementar publicação retomável: filhos, processamento, pai, estado incerto e reconciliação. Simular sem postar.
- [ ] Expor controles e diagnóstico no painel, mantidos desligados.
- [ ] Validar build, revisão independente e fluxo online.

## Pontos de revisão
Credencial expirada; edição após aprovação; resposta perdida após envio; agenda duplicada; PC offline no horário. Uma resposta ambígua nunca deve provocar novo post automático.

## Áudio
Manter identidade com variação de timbre por carrossel. Efeitos só em ações visuais, volume controlado, repouso no fim do loop. Não alegar ganho de conversão sem experimento real. Bibliotecas externas exigem registro de origem/licença por arquivo; nenhuma compra autorizada.

## Verificação de conexão — 27/10/2026
OAuth concluído em www.edevshub.com, credencial criptografada, conta confirmada por leitura. Publicação desligada, nenhuma chamada media_publish real. Revisão independente: removido caminho manual que não validava insights; status considera expiração. Agenda e executor de publicação ainda em implementação, controles não expostos em produção.
