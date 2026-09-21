import type { Locale } from "@/lib/locale";

export interface CaseInsight {
  flowTitle: string;
  flow: readonly [
    { title: string; description: string },
    { title: string; description: string },
    { title: string; description: string },
  ];
  planningTitle: string;
  planningIntro: string;
  planning: readonly string[];
  relatedTitle: string;
  related: readonly { id: string; title: string; reason: string }[];
  service: { href: string; label: string };
  galleryCaptions: readonly string[];
  useProjectImage?: boolean;
}

// Product capabilities come from the existing project descriptions and images.
// Planning items describe a future project; they are not claims about past scope,
// acceptance criteria, individual authorship or measured business results.
const caseInsights: Partial<Record<string, Record<Locale, CaseInsight>>> = {
  mudapaisagens: {
    pt: {
      flowTitle: "Do primeiro contato ao registro no CRM",
      flow: [
        { title: "Entrada pelo WhatsApp", description: "O fluxo recebe os novos contatos pelo WhatsApp Business e inicia o pré-atendimento." },
        { title: "Qualificação com perguntas", description: "A automação conduz perguntas estruturadas para reunir as informações do lead." },
        { title: "Registro no Pipefy", description: "O Make conecta as etapas e encaminha as informações para registro no Pipefy." },
      ],
      planningTitle: "Para planejar um projeto semelhante",
      planningIntro: "O primeiro passo é definir quais conversas automatizar e quais informações a equipe precisa receber.",
      planning: [
        "Mapear as perguntas de qualificação e os momentos em que uma pessoa deve assumir o atendimento.",
        "Conferir o acesso ao canal, ao Make e ao Pipefy, além dos campos e etapas usados pela operação.",
        "Combinar como testar respostas, criação de registros, falhas e retomadas antes de ampliar o fluxo.",
      ],
      relatedTitle: "Outras formas de organizar a operação",
      related: [
        { id: "passagenseuropa", title: "Passagens Europa", reason: "Quando o atendimento precisa fazer parte de um CRM com cotações e financeiro." },
        { id: "rei", title: "Rei", reason: "Quando o foco é acompanhar tarefas, responsáveis e etapas de execução." },
      ],
      service: { href: "/servicos/integracoes-e-automacoes", label: "Conhecer o serviço de integrações e automações" },
      galleryCaptions: ["Captura do cenário “IA SDR — Qualificador de leads” no Make, apresentada em um mockup de notebook. A imagem mostra as conexões entre as etapas do fluxo."],
      useProjectImage: true,
    },
    en: {
      flowTitle: "From the first message to the CRM record",
      flow: [
        { title: "WhatsApp intake", description: "The workflow receives new contacts through WhatsApp Business and starts the initial conversation." },
        { title: "Structured qualification", description: "The automation asks structured questions to collect the lead’s information." },
        { title: "Pipefy registration", description: "Make connects the steps and sends the information to Pipefy for registration." },
      ],
      planningTitle: "Planning a similar project",
      planningIntro: "Start by defining which conversations to automate and what information the team needs to receive.",
      planning: [
        "Map the qualification questions and the points at which a person should take over the conversation.",
        "Check access to the messaging channel, Make and Pipefy, including the fields and stages used by the team.",
        "Agree on how to test responses, record creation, failures and retries before extending the workflow.",
      ],
      relatedTitle: "Other ways to organize operations",
      related: [
        { id: "passagenseuropa", title: "Passagens Europa", reason: "For customer conversations connected to a CRM with quotes and finance." },
        { id: "rei", title: "Rei", reason: "For tracking tasks, owners and execution stages." },
      ],
      service: { href: "/servicos/integracoes-e-automacoes", label: "Explore integrations and automation services (in Portuguese)" },
      galleryCaptions: ["Screenshot of the “IA SDR — Qualificador de leads” scenario in Make, presented in a laptop mockup. It shows the connections between workflow steps."],
      useProjectImage: true,
    },
  },
  passagenseuropa: {
    pt: {
      flowTitle: "Do lead à gestão comercial",
      flow: [
        { title: "Atendimento e funil", description: "O CRM reúne os leads e o atendimento via WhatsApp nas etapas do funil de vendas." },
        { title: "Cotações e vendas", description: "Os módulos de cotação e venda dão continuidade ao trabalho da equipe comercial." },
        { title: "Financeiro e comissões", description: "A plataforma também reúne a gestão financeira, os relatórios e as comissões da operação." },
      ],
      planningTitle: "Para planejar um projeto semelhante",
      planningIntro: "Um CRM sob medida começa pelo fluxo da equipe e pelas regras que precisam estar no sistema.",
      planning: [
        "Desenhar as etapas do atendimento e definir quem pode consultar, alterar ou aprovar cada informação.",
        "Detalhar as regras de cotação, venda, financeiro e comissão, incluindo exceções que precisam de tratamento.",
        "Mapear integrações e dados existentes; combinar uma forma de validar a migração e cada fluxo antes do uso pela equipe.",
      ],
      relatedTitle: "Projetos com necessidades relacionadas",
      related: [
        { id: "mudapaisagens", title: "Muda Paisagens", reason: "Para automatizar a qualificação antes de registrar o lead no CRM." },
        { id: "clubeazul", title: "Clube Azul", reason: "Para conhecer outro sistema com integração de cobranças e pagamentos." },
      ],
      service: { href: "/servicos/sistemas-sob-medida", label: "Conhecer o serviço de sistemas sob medida" },
      galleryCaptions: ["Tela de CRM e atendimento apresentada em um mockup de notebook. A captura mostra as colunas do funil sem registros; os contadores dessa imagem não indicam volume de leads ou resultado comercial."],
      useProjectImage: true,
    },
    en: {
      flowTitle: "From the lead to commercial management",
      flow: [
        { title: "Conversations and pipeline", description: "The CRM brings leads and WhatsApp conversations together across the sales pipeline." },
        { title: "Quotes and sales", description: "Quoting and sales modules support the next steps of the commercial team’s work." },
        { title: "Finance and commissions", description: "The platform also brings financial management, reporting and commissions into the same system." },
      ],
      planningTitle: "Planning a similar project",
      planningIntro: "A custom CRM starts with the team’s workflow and the rules the system needs to support.",
      planning: [
        "Map the customer journey and define who can view, edit or approve each type of information.",
        "Specify quoting, sales, finance and commission rules, including exceptions that need handling.",
        "Map integrations and existing data, then agree on how to validate migration and each workflow before team rollout.",
      ],
      relatedTitle: "Projects with related needs",
      related: [
        { id: "mudapaisagens", title: "Muda Paisagens", reason: "For automating qualification before registering a lead in the CRM." },
        { id: "clubeazul", title: "Clube Azul", reason: "For another system with billing and payment integrations." },
      ],
      service: { href: "/servicos/sistemas-sob-medida", label: "Explore custom system development (in Portuguese)" },
      galleryCaptions: ["CRM and customer service screen presented in a laptop mockup. The screenshot shows empty pipeline columns; its counters do not indicate lead volume or commercial results."],
      useProjectImage: true,
    },
  },
  clinafy: {
    pt: {
      flowTitle: "Agenda, atendimento e gestão em uma plataforma",
      flow: [
        { title: "Organizar a agenda", description: "A plataforma reúne agendamento e área do paciente para organizar o acesso aos atendimentos." },
        { title: "Conduzir o atendimento", description: "Prontuário eletrônico e teleconsulta fazem parte do conjunto de funcionalidades para a rotina clínica." },
        { title: "Acompanhar a gestão", description: "O módulo financeiro completa a gestão da operação junto aos recursos de atendimento." },
      ],
      planningTitle: "Para planejar um projeto semelhante",
      planningIntro: "A definição do produto precisa considerar a rotina de atendimento, os dados envolvidos e as responsabilidades de cada usuário.",
      planning: [
        "Priorizar os fluxos de agenda, prontuário e atendimento que precisam entrar na primeira versão.",
        "Definir perfis de acesso, tratamento de dados e requisitos aplicáveis com os responsáveis pela operação.",
        "Confirmar provedores e integrações necessários e combinar testes com dados adequados antes do uso real.",
      ],
      relatedTitle: "Outros produtos para saúde e neurotecnologia",
      related: [
        { id: "neuroialab", title: "NeuroIA Lab", reason: "Assistentes de IA voltados à rotina de profissionais de saúde mental." },
        { id: "pace", title: "PACE", reason: "Neurofeedback e gestão clínica com acompanhamento de sessões." },
      ],
      service: { href: "/servicos/desenvolvimento-saas", label: "Conhecer o serviço de desenvolvimento SaaS" },
      galleryCaptions: [
        "Captura da página de apresentação do Clinafy com os recursos divulgados pelo produto. Promessas e indicadores mostrados nessa página não são resultados medidos desta entrega.",
        "Captura dos planos divulgados na página de apresentação do Clinafy. Preços, ofertas e limites pertencem ao produto na data da captura; não são orçamento de desenvolvimento nem resultado do projeto.",
      ],
    },
    en: {
      flowTitle: "Scheduling, care and management in one platform",
      flow: [
        { title: "Organize appointments", description: "The platform brings scheduling and the patient area together to organize access to care." },
        { title: "Support the appointment", description: "Electronic records and telehealth are part of the product’s clinical workflow features." },
        { title: "Manage the operation", description: "The finance module supports practice management alongside the care features." },
      ],
      planningTitle: "Planning a similar project",
      planningIntro: "Product scope needs to account for the care workflow, the data involved and each user’s responsibilities.",
      planning: [
        "Prioritize the scheduling, records and care workflows that belong in the first release.",
        "Define access roles, data handling and applicable requirements with the people responsible for the operation.",
        "Confirm required providers and integrations, then agree on tests with appropriate data before real use.",
      ],
      relatedTitle: "Other health and neurotechnology products",
      related: [
        { id: "neuroialab", title: "NeuroIA Lab", reason: "AI assistants for the work of mental health professionals." },
        { id: "pace", title: "PACE", reason: "Neurofeedback and clinical management with session tracking." },
      ],
      service: { href: "/servicos/desenvolvimento-saas", label: "Explore SaaS development services (in Portuguese)" },
      galleryCaptions: [
        "Screenshot of Clinafy’s presentation page and its advertised features. Claims and indicators on that page are not measured results of this delivery.",
        "Screenshot of the plans advertised on Clinafy’s presentation page. Prices, offers and limits belong to the product at the time of capture; they are not development quotes or project results.",
      ],
    },
  },
};

export function getCaseInsights(projectId: string, locale: Locale) {
  return caseInsights[projectId]?.[locale];
}
