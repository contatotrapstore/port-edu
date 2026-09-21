# Acompanhamento de propostas

O kit ainda não contém histórico real. As linhas de exemplo foram removidas para não entrarem em contagens. Nenhum zero foi preenchido no lugar de informação ausente.

## Leitura inicial

Preencher `baseline.csv` com período definido de 60–90 dias, data da leitura e fonte. Se houver receitas em moedas diferentes, manter as linhas separadas. Comparar depois períodos de mesma duração e oportunidades com tempo semelhante para maturar.

## Uma linha por oportunidade

Usar `funil.csv` para registrar cada projeto abordado:

- `data_envio`: data da proposta, no formato AAAA-MM-DD.
- `categoria`: automacao_integracao, sistema_gestao, saas, mobile ou outra categoria coerente.
- `origem`: proposta_ativa, convite ou retorno_cliente. Não confundir origem com cliente novo/recorrente.
- `cliente_novo_ou_recorrente`: conforme o histórico de contratação, sem inferir pelo número de mensagens.
- `orcamento_anunciado` e `moeda_orcamento`: faixa original do cliente; em branco se ausente.
- `n_propostas_no_envio`: registrar apenas quando disponível, sem estimativa inventada.
- `lida`: sim, nao ou indisponivel. Só marcar “nao” quando a plataforma permitir verificar; dado ausente não prova falta de leitura.
- `respondeu`: sim ou nao, contado por projeto. Registrar a primeira resposta em `data_primeira_resposta`.
- `conversa_qualificada`: sim quando cliente confirma necessidade compatível, orçamento viável e janela do projeto; nao quando não qualificada; em branco enquanto desconhecido.
- `fechou`: sim, nao ou em_aberto. Proposta recente sem resposta não é automaticamente oportunidade encerrada.
- `data_contrato`, `valor_proposto`, `valor_contratado` e `moeda_contrato`: dados reais; respeitar a moeda ao comparar.
- `case_usado`: case efetivamente citado; em branco se nenhum foi usado.
- `horas_estimadas`: estimativa do trabalho para avaliar retorno econômico, identificada como estimativa.
- `motivo_perda_informado`: somente o motivo comunicado pelo cliente. Sem retorno não significa “preço”.
- `observacao`: restrições, mudanças de escopo e informação útil para interpretar o resultado.

## Taxas que respondem a perguntas diferentes

- Leitura: propostas lidas / propostas enviadas com informação de leitura disponível. Informar também quantas têm dado indisponível.
- Resposta: projetos com resposta / propostas enviadas.
- Qualificação: conversas qualificadas / projetos com resposta.
- Fechamento: contratos / conversas qualificadas.

Se o denominador for zero, a taxa é “não calculável”. Exibir as contagens junto das porcentagens. Separar categorias, origem e clientes novos/recorrentes antes de concluir que o perfil ou a copy mudou o desempenho.

## Revisão

Fazer uma primeira leitura após 14 dias de registros novos. Esse intervalo organiza a rotina; não garante amostra suficiente ou que todas as oportunidades já decidiram. Analisar também contratos que fecharam depois.

Sem leitura ou resposta: revisar seleção e proposta inicial. Com conversas e poucos contratos: revisar escopo, condução, prazo, agenda e preço a partir das conversas reais. Não reduzir preço, impor volume semanal ou atribuir queda ao HERO sem evidência.

`horas.csv` continua disponível para acompanhar a agenda. `recorrentes.csv` fica vazio até existir histórico real de clientes e contato autorizado. Conferir as condições efetivas de comissão de cada relação na plataforma; nenhuma faixa foi presumida.
