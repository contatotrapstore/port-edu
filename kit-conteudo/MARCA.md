# Base editorial da edevshub

Status: proposta inicial baseada no repositório; validar no piloto.

## Negócio e público

Eduardo Gouveia / EDevsHub. Sistemas sob medida, SaaS, integrações e automações. Proposta editorial: combinar serviços reais com novidades e aplicações de IA, agentes, Claude, Codex e ecossistema, conforme ESTRATEGIA-EDITORIAL.md. Ajudar responsáveis por negócios e operações a reconhecer problemas que software pode resolver e a planejar uma contratação. Evitar transformar todo o perfil em dicas destinadas apenas a programadores.

Tom: direto, didático, concreto, português brasileiro; explicar antes de vender. CTA útil, com serviço ou case relacionado. Não inventar economia, faturamento, depoimentos, estatísticas ou rankings. Números de Workana divergentes entre arquivos devem ser reconferidos antes de qualquer peça.

## Fontes do próprio projeto

- `src/lib/constants.ts`: cases e informações do portfólio.
- `src/lib/services.ts` e `src/lib/case-insights.ts`: serviços e contexto.
- `kit-organico/publicacoes.md`: três pautas já preparadas, sem confirmação de publicação.
- `Rebranding/`: materiais visuais existentes. Inspecionada `publicar-1-metodo.png`: fundo claro quente, tipografia escura grande, linhas finas, apoio cinza esverdeado.
- Site atual: escuro/prata; Inter, Space Grotesk e JetBrains Mono em `src/app/layout.tsx`.

Há duas direções visuais existentes. Para o piloto proponho a linguagem editorial clara de Rebranding, com contraste, hierarquia e animação do tutorial. O painel pode seguir a base escura do site. Isso não é uma decisão de rebranding global.

## Regras visuais do piloto

1080×1350; área segura proposta de 72 px; uma ideia principal por slide; leitura verificável a 360 px de largura. Extrair cores/fontes das referências, sem afirmar que valores aproximados são tokens oficiais. Usar texto real renderizado por código e screenshots originais quando necessários. Sem interface inventada, efeitos gratuitos, dados pessoais ou retratos gerados sem necessidade.

Movimento acompanha a ordem de leitura: entrada, relação entre elementos, conclusão. Usar máscaras, deslocamento, reorganização e impacto suave. O conteúdo precisa continuar compreensível sem som. Oferecer PNG e pausa da prévia.

## Banco evergreen inicial

A distribuição semanal atual está em ESTRATEGIA-EDITORIAL.md; a lista abaixo é uma reserva de pautas de serviços, não o calendário completo.

1. Piloto: “Seu atendimento termina. Os dados chegam ao CRM?”
2. Escopo: três respostas antes de pedir orçamento de sistema.
3. CRM: o que vem depois do cadastro do lead.
4. Integração: copiar e colar entre sistemas como sinal de retrabalho.
5. Processo: entender, definir, desenvolver por etapas.
6. SaaS: o que validar antes de ampliar funcionalidades.
7. Case documentado do portfólio, sem resultados quantitativos não comprovados.

Pautas não são posts prontos ou agendados. A rotina deve consultar histórico, variar exemplos e evitar repetir tema/gancho recente; janela inicial proposta de 30 dias, configurável.
