export type ServiceCase = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  caption: string;
  crop: { x: number; y: number; width: number; height: number };
};

/** Capturas existentes: a apresentação descreve o produto, sem atribuir métricas. */
export const serviceCases: Record<string, ServiceCase> = {
  passagenseuropa: {
    id: "passagenseuropa",
    name: "Passagens Europa",
    description: "CRM que reúne leads, atendimento, cotações, financeiro e comissões para uma operação comercial.",
    image: "/images/projects/passagenseuropa.webp",
    imageAlt: "Quadro de atendimento do CRM Passagens Europa",
    caption: "Tela do funil de atendimento e dos módulos do CRM, recortada da apresentação do projeto.",
    crop: { x: 230, y: 97, width: 829, height: 510 },
  },
  mudapaisagens: {
    id: "mudapaisagens",
    name: "Muda Paisagens",
    description: "Pré-atendimento com IA, perguntas de qualificação e registro no Pipefy, com integração pelo Make.",
    image: "/images/projects/mudapaisagens.webp",
    imageAlt: "Fluxo de qualificação de leads da Muda Paisagens no Make",
    caption: "Etapas do fluxo de qualificação configurado no Make, na captura existente do projeto.",
    crop: { x: 304, y: 96, width: 698, height: 468 },
  },
  clinafy: {
    id: "clinafy",
    name: "Clinafy",
    description: "Plataforma para saúde mental com prontuário, agenda, teleconsulta e gestão financeira.",
    image: "/images/projects/clinafy-1.webp",
    imageAlt: "Módulo de prontuário eletrônico na apresentação do Clinafy",
    caption: "Detalhe da apresentação do Clinafy: funções do prontuário eletrônico. A imagem descreve o produto.",
    // Recorte da captura real, sem os números promocionais nem contatos da página.
    crop: { x: 59, y: 279, width: 364, height: 228 },
  },
};

type ScopeExample = { title: string; description: string; acceptance: string };
type ProcessStep = { title: string; description: string };
type Question = { question: string; answer: string };

export type ServicePage = {
  slug: string;
  name: string;
  metadataTitle: string;
  metadataDescription: string;
  title: string;
  intro: string;
  indexDescription: string;
  caseId: string;
  fitTitle: string;
  fit: string[];
  decisionTitle: string;
  decision: string;
  scopeTitle: string;
  scopeExamples: ScopeExample[];
  process: ProcessStep[];
  questions: Question[];
  briefTitle: string;
  brief: string[];
};

export const services: ServicePage[] = [
  {
    slug: "sistemas-sob-medida",
    name: "Sistemas sob medida",
    metadataTitle: "Desenvolvimento de sistemas sob medida | Eduardo Gouveia",
    metadataDescription: "Sistemas de gestão, CRMs e painéis para a operação da sua empresa. Conheça exemplos de escopo, critérios de aceite e o portfólio de Eduardo Gouveia.",
    title: "Sistemas sob medida para a rotina da sua empresa.",
    intro: "Desenvolvo sistemas de gestão, CRMs e painéis sob medida. O ponto de partida é entender quem usa o processo, quais regras precisa seguir e o que hoje fica espalhado entre planilhas e ferramentas.",
    indexDescription: "Para organizar uma rotina própria: cadastro, etapas, responsáveis, permissões e acompanhamento em um sistema.",
    caseId: "passagenseuropa",
    fitTitle: "Quando a rotina não cabe nas ferramentas atuais.",
    fit: [
      "A mesma informação é redigitada em controles diferentes e ninguém sabe qual está atualizado.",
      "A operação tem etapas, aprovações ou exceções que a ferramenta atual não representa.",
      "Há um sistema em uso, mas falta um módulo ou uma visão para quem acompanha o trabalho.",
    ],
    decisionTitle: "Construir um sistema inteiro ou completar o que já existe?",
    decision: "A primeira decisão é o tamanho da intervenção. Às vezes basta integrar ferramentas ou acrescentar um módulo. Quando a regra da operação exige uma aplicação própria, separo o fluxo essencial das melhorias que podem ficar para outra etapa. Isso define um escopo que pode ser descrito e validado.",
    scopeTitle: "O escopo começa pelo trabalho que precisa acontecer.",
    scopeExamples: [
      {
        title: "Etapas e responsáveis",
        description: "Representar um processo comercial ou operacional, com estados, responsáveis e histórico de alterações.",
        acceptance: "Um usuário autorizado avança um registro entre as etapas combinadas; o sistema registra quem alterou e quando.",
      },
      {
        title: "Perfis de acesso",
        description: "Definir o que cada papel pode consultar, criar e alterar, de acordo com a rotina real.",
        acceptance: "As ações permitidas funcionam para cada perfil; operações não autorizadas são bloqueadas também no servidor.",
      },
      {
        title: "Painéis e consultas",
        description: "Organizar as informações que a equipe precisa para acompanhar pendências e tomar decisões.",
        acceptance: "Filtros e totais são conferidos com um conjunto de registros conhecido, incluindo os casos sem resultado.",
      },
      {
        title: "Importação e integrações",
        description: "Planejar a entrada de dados existentes e a relação com serviços que continuam em uso, se fizer parte do projeto.",
        acceptance: "Uma amostra é importada e conferida; duplicidades e dados inválidos recebem o tratamento acordado.",
      },
    ],
    process: [
      { title: "Mapear a rotina", description: "Entender um fluxo concreto, seus usuários, documentos e exceções. Identificar o que já pode ser aproveitado." },
      { title: "Definir telas e regras", description: "Combinar entregáveis, permissões, critérios de aceite e dependências antes de desenvolver." },
      { title: "Validar por etapas", description: "Apresentar o fluxo em funcionamento para conferência com cenários reais da operação." },
      { title: "Preparar a entrega", description: "Conferir os critérios acordados e realizar a passagem de conhecimento e publicação previstas no escopo." },
    ],
    questions: [
      { question: "Preciso substituir todas as minhas ferramentas?", answer: "Não necessariamente. Posso avaliar um módulo complementar ou uma integração. A escolha depende das limitações atuais, dos acessos disponíveis e da regra que precisa ser atendida." },
      { question: "Você também trabalha em um sistema existente?", answer: "Sim. Para definir o trabalho, preciso conhecer o código, a infraestrutura e o problema a resolver. Essa avaliação permite separar a alteração pedida de eventuais dependências técnicas." },
      { question: "É possível trazer os dados das planilhas?", answer: "A importação pode entrar no escopo. Antes, é necessário conferir formato, qualidade, volume e regras de correspondência. O processo de validação e a responsabilidade pela conferência são combinados na proposta." },
      { question: "Manutenção e suporte estão incluídos?", answer: "O que será entregue, a documentação, os ajustes previstos e qualquer suporte precisam constar da proposta. Evoluções posteriores podem ser organizadas como outro escopo; não há um período de suporte presumido nesta página." },
    ],
    briefTitle: "Me mostre um fluxo da sua operação.",
    brief: ["O que a equipe faz hoje e onde registra as informações.", "Quem usa o processo e qual dificuldade precisa ser resolvida primeiro.", "As ferramentas existentes e qualquer restrição de acesso ou prazo."],
  },
  {
    slug: "integracoes-e-automacoes",
    name: "Integrações e automações",
    metadataTitle: "Integrações entre sistemas e automação de processos | Eduardo Gouveia",
    metadataDescription: "Integrações entre APIs, CRMs e ferramentas de operação. Automação de fluxos com regras, tratamento de falhas e critérios de aceite definidos por projeto.",
    title: "Integrações e automações para conectar sua operação.",
    intro: "Desenvolvo integrações e automações para movimentar informações entre sistemas, organizar etapas de atendimento e executar rotinas definidas. Antes de automatizar, é preciso combinar o gatilho, a regra, o destino e o que acontece quando algo falha.",
    indexDescription: "Para tirar uma passagem manual do caminho: receber uma informação, aplicar uma regra e registrar no sistema certo.",
    caseId: "mudapaisagens",
    fitTitle: "Quando o problema está na passagem de uma ferramenta para outra.",
    fit: [
      "Um formulário ou canal de atendimento recebe dados, mas alguém precisa cadastrar cada registro no CRM.",
      "A equipe consulta sistemas diferentes para descobrir se uma etapa foi concluída.",
      "Um fluxo já automatizado precisa lidar com falhas, duplicidades ou novas regras da operação.",
    ],
    decisionTitle: "Automatizar a regra, sem esconder as exceções.",
    decision: "Um fluxo precisa funcionar também quando a entrada está incompleta ou um serviço está indisponível. No alinhamento, definimos quais situações podem seguir automaticamente e quais devem parar para conferência humana. IA pode participar quando a tarefa pede interpretação; regras determinísticas continuam fazendo sentido para validações e registros.",
    scopeTitle: "Um fluxo pode ser descrito de ponta a ponta.",
    scopeExamples: [
      {
        title: "Entrada e validação",
        description: "Receber um evento de uma ferramenta e conferir os campos necessários para a próxima etapa.",
        acceptance: "Entradas completas seguem o fluxo; registros sem campos obrigatórios recebem o encaminhamento combinado.",
      },
      {
        title: "Registro no destino",
        description: "Relacionar os campos de origem aos campos de um CRM, banco de dados ou outra aplicação.",
        acceptance: "Um evento de teste cria ou atualiza o registro correto. O mesmo evento repetido não gera uma duplicidade indevida.",
      },
      {
        title: "Falha e reprocessamento",
        description: "Combinar como a operação identifica uma tentativa que falhou e quando ela pode ser repetida.",
        acceptance: "Uma falha simulada é registrada; o tratamento acordado permite retomar o processamento sem perder seu estado.",
      },
      {
        title: "Passagem para uma pessoa",
        description: "Em fluxos de atendimento ou interpretação com IA, definir os pontos em que a equipe assume a continuidade.",
        acceptance: "O cenário de passagem selecionado entrega à equipe o contexto combinado e interrompe as ações automáticas previstas.",
      },
    ],
    process: [
      { title: "Desenhar o fluxo", description: "Descrever o evento inicial, os dados que circulam, as regras e o resultado esperado em cada ferramenta." },
      { title: "Conferir os acessos", description: "Validar APIs, permissões, documentação e ambientes disponíveis, além dos limites dos serviços envolvidos." },
      { title: "Implementar e testar", description: "Conferir o caminho esperado e as exceções acordadas, como evento duplicado ou indisponibilidade do destino." },
      { title: "Preparar a operação", description: "Documentar como acompanhar o fluxo, identificar uma falha e realizar as ações previstas de manutenção." },
    ],
    questions: [
      { question: "Todas as ferramentas podem ser integradas?", answer: "A viabilidade depende dos acessos oferecidos por cada produto: API, exportação, eventos ou outros meios autorizados. Preciso conferir essas possibilidades antes de confirmar o escopo. Uma ferramenta sem acesso adequado pode exigir outra solução." },
      { question: "Você usa Make, n8n ou código?", answer: "A escolha depende do fluxo, das integrações disponíveis e da manutenção esperada. O case Muda Paisagens usa Make com Pipefy. Um projeto pode usar um integrador, código ou a combinação dos dois, conforme a necessidade." },
      { question: "A automação precisa de inteligência artificial?", answer: "Não. Quando as regras são claras, uma integração convencional pode resolver. IA é considerada quando existe uma tarefa de interpretação, classificação ou atendimento que justifique seu uso e possa ser avaliada com exemplos." },
      { question: "Como entram as contas e os custos dos serviços?", answer: "As contas, permissões e serviços necessários são identificados na definição do escopo. Cobranças de provedores e dependências externas devem ser separadas do desenvolvimento na proposta. Os valores dependem das ferramentas e do uso." },
    ],
    briefTitle: "Qual informação ainda precisa ser passada na mão?",
    brief: ["As ferramentas de origem e destino.", "Um exemplo do evento e dos dados que precisam circular.", "O que deve acontecer em caso de erro e quem acompanha a rotina."],
  },
  {
    slug: "desenvolvimento-saas",
    name: "Desenvolvimento de SaaS",
    metadataTitle: "Desenvolvimento de SaaS e MVP sob medida | Eduardo Gouveia",
    metadataDescription: "Desenvolvimento de plataformas SaaS e MVPs com foco no fluxo principal do produto. Definição de escopo, acesso, dados e critérios de aceite com Eduardo Gouveia.",
    title: "Desenvolvimento de SaaS, da primeira versão à evolução.",
    intro: "Desenvolvo plataformas SaaS e também evoluo produtos existentes. Para uma primeira versão, começo pelo usuário, pelo problema que o produto resolve e pelo fluxo que precisa funcionar para que ele consiga usá-lo.",
    indexDescription: "Para construir ou evoluir um produto usado por clientes, com um fluxo principal e limites claros para cada etapa.",
    caseId: "clinafy",
    fitTitle: "Quando o objetivo é um produto, além de uma tela.",
    fit: [
      "Você tem uma proposta de produto e precisa transformar o fluxo principal em uma aplicação utilizável.",
      "Existe um protótipo ou sistema inicial, mas faltam regras de acesso, consistência ou integrações para o próximo uso.",
      "O produto já está em operação e precisa evoluir um módulo sem tratar toda solicitação como uma reconstrução.",
    ],
    decisionTitle: "O MVP não precisa nascer com todos os módulos.",
    decision: "Autenticação, cobrança e separação entre empresas são decisões de escopo, não uma lista obrigatória para qualquer ideia. Primeiro definimos quem usa, qual tarefa completa e o que caracteriza uma entrega pronta. A validação de mercado continua sendo uma questão do negócio; publicar software não comprova demanda.",
    scopeTitle: "A primeira versão tem uma função e um critério de pronto.",
    scopeExamples: [
      {
        title: "Fluxo principal do usuário",
        description: "Implementar a tarefa que representa o valor central do produto, do primeiro passo à conclusão.",
        acceptance: "Um usuário de teste completa a tarefa com as entradas e as regras definidas, incluindo um cenário de erro previsto.",
      },
      {
        title: "Contas e permissões",
        description: "Definir os papéis de usuário e, se necessário, como cada organização acessa seus dados.",
        acceptance: "Cada perfil acessa apenas o que foi autorizado. Se houver organizações separadas, o isolamento é verificado nos cenários combinados.",
      },
      {
        title: "Cobrança e integrações",
        description: "Quando fizer parte da versão, conectar o produto ao provedor e representar os estados relevantes para o acesso.",
        acceptance: "Os eventos acordados, como confirmação e cancelamento em ambiente de teste, produzem os estados esperados no produto.",
      },
      {
        title: "Publicação e continuidade",
        description: "Definir os ambientes, acessos e materiais necessários para colocar a versão no ar e dar continuidade ao trabalho.",
        acceptance: "A versão é conferida no ambiente previsto, com os acessos e a documentação especificados na proposta.",
      },
    ],
    process: [
      { title: "Recortar a primeira versão", description: "Escolher o usuário inicial, a tarefa principal e o que fica explicitamente fora desta etapa." },
      { title: "Definir dados e jornadas", description: "Combinar telas, papéis, regras e integrações que sustentam esse fluxo, incluindo dependências do cliente." },
      { title: "Construir e validar", description: "Organizar entregas para conferir o comportamento com os critérios acordados e ajustar o que foi contratado." },
      { title: "Publicar a etapa", description: "Preparar o ambiente e a passagem de conhecimento conforme o escopo. Novas funcionalidades recebem outra definição de entrega." },
    ],
    questions: [
      { question: "Preciso chegar com a ideia validada?", answer: "Você precisa conseguir explicar o problema e quem pretende atender. Posso ajudar a estruturar o escopo técnico, mas a construção do produto não substitui a validação comercial nem garante vendas." },
      { question: "Todo SaaS precisa ser multiempresa?", answer: "Não necessariamente. Precisamos entender quem contrata, quem usa e quais dados devem ser separados. A arquitetura acompanha essa necessidade e a etapa do produto, em vez de incluir complexidade por padrão." },
      { question: "Pode haver uma fase sem pagamento integrado?", answer: "Sim, se isso fizer sentido para a forma de uso da primeira versão. A cobrança pode entrar quando for necessária ao fluxo. O que fica fora precisa estar claro para não virar uma expectativa implícita." },
      { question: "Você pode continuar um produto feito por outro desenvolvedor?", answer: "Posso avaliar. O primeiro passo é conhecer o código, os acessos, a documentação e as dependências. Com isso, consigo definir o que pode ser aproveitado e quais alterações o próximo escopo exige." },
    ],
    briefTitle: "O que seu primeiro usuário precisa conseguir fazer?",
    brief: ["Quem vai usar e qual tarefa precisa completar.", "O que já existe: ideia, protótipo, código ou produto em operação.", "As funções essenciais para a primeira etapa e as restrições conhecidas."],
  },
];

export function findService(slug: string) {
  return services.find((service) => service.slug === slug);
}
