import { getPortfolioRole } from "@/lib/portfolio-case-copy";

export const reviewDate = "21/09/2026";

export const profileCopy = {
  title: "Sistemas, SaaS e Integrações | Full Stack Sênior",
  about: `Desenvolvo sistemas sob medida, plataformas SaaS e integrações entre ferramentas. Posso construir uma solução nova ou evoluir um produto existente, com escopo e entregas definidos antes do desenvolvimento.

Sou Eduardo Gouveia, desenvolvedor Full Stack Sênior e HERO na Workana, com 180 projetos realizados na plataforma.

POSSO AJUDAR COM
• Sistemas de gestão, CRMs e painéis administrativos.
• Plataformas SaaS e MVPs com funcionalidades priorizadas.
• Integrações entre APIs, bancos de dados e ferramentas da operação.
• Automações de processos e aplicações de IA.
• Aplicativos web e mobile.

Trabalho com JavaScript e TypeScript, React, Next.js, Node.js e Python, além das ferramentas que o projeto exige. A escolha técnica parte do uso, das integrações e da manutenção necessária.

COMO TRABALHO
Antes de começar, alinhamos escopo, prazo e critérios de aceite no chat da Workana. Divido o desenvolvimento em etapas para você acompanhar e validar as entregas. Se o caminho que você pediu precisar de ajustes, explico a alternativa e seu impacto antes de executar.

Me conte o que precisa construir ou melhorar e quais ferramentas já utiliza. Com esse contexto, avalio o caminho técnico e o que cabe no prazo do projeto.`,
  experience: `Desenvolvimento de sistemas web, SaaS, integrações e aplicativos, da definição técnica ao deploy e à evolução do produto.

Meu portfólio inclui projetos para saúde e neurotecnologia, sistemas de gestão e automações comerciais. Entre eles estão PACE, NeuroIA Lab, Clinafy, Passagens Europa e Muda Paisagens.

Também atuo na evolução de produtos existentes, integração de serviços e manutenção. O trabalho é organizado por entregas e critérios de aceite combinados com o cliente.`,
};

export const reviewCases = [
  {
    id: "mudapaisagens",
    name: "Muda Paisagens",
    category: "Integração e atendimento",
    title: "Muda Paisagens | Qualificação de leads no WhatsApp com registro no CRM",
    summary: "Fluxo de pré-atendimento com IA, perguntas estruturadas e integração ao Pipefy via Make.",
    role: getPortfolioRole("mudapaisagens", "pt")!,
    deliverables: "• Pré-atendimento e qualificação de leads pelo WhatsApp.\n• Perguntas estruturadas para reunir as informações do contato.\n• Fluxo no Make com registro das informações no Pipefy.",
    image: "/images/projects/mudapaisagens.webp",
  },
  {
    id: "passagenseuropa",
    name: "Passagens Europa",
    category: "Sistema de gestão",
    title: "Passagens Europa | CRM para atendimento e gestão comercial",
    summary: "Leads, cotações, financeiro e comissões reunidos em uma plataforma para a operação comercial.",
    role: getPortfolioRole("passagenseuropa", "pt")!,
    deliverables: "• CRM com atendimento por WhatsApp e funil de vendas.\n• Módulos de cotação e venda.\n• Gestão financeira, relatórios e comissões.",
    image: "/images/projects/passagenseuropa.webp",
  },
  {
    id: "clinafy",
    name: "Clinafy",
    category: "Plataforma SaaS",
    title: "Clinafy | Gestão clínica com prontuário, agenda e teleconsulta",
    summary: "Plataforma para profissionais e clínicas de saúde mental, com prontuário, agenda e teleconsulta.",
    role: getPortfolioRole("clinafy", "pt")!,
    deliverables: "• Agenda e área do paciente.\n• Prontuário eletrônico e teleconsulta.\n• Gestão financeira integrada à rotina clínica.",
    image: "/images/projects/clinafy.webp",
  },
] as const;

export const proposalCopy = `Olá, [nome]. Pelo que você descreveu, o objetivo é [resultado solicitado], incluindo [detalhe concreto do briefing].

[Responda aqui às perguntas que o cliente fez, se houver.]

Eu começaria por [primeira entrega útil]. Depois seguiria com [etapa necessária], considerando [restrição informada pelo cliente].

Desenvolvi [case relacionado do meu portfólio], com [funcionalidade real que responde a uma necessidade deste projeto].

[Se faltar informação decisiva: faça uma pergunta que ainda não foi respondida no briefing.]
[Se já houver informação suficiente: apresente entregáveis, valor, prazo e premissas.]

Eduardo`;

export const checklist = [
  {
    title: "Conferir os números antes de colar",
    detail: "180 projetos, 181 avaliações e nota 4,75 foram observados em 21/09/2026. Atualize caso o perfil já tenha mudado. As 37 recontratações não foram recontadas e ficaram fora da nova bio.",
  },
  {
    title: "Verificar as 2 violações no painel",
    detail: "Conferir datas, motivos e situação com a plataforma. O contador público não prova penalização atual nem explica a queda de contratos.",
  },
  {
    title: "Revisar os 13 projetos em execução",
    detail: "Confirmar quais estão ativos, quais aguardam cliente e quais precisam de encerramento acordado. Informar início de novos trabalhos conforme a agenda real.",
  },
  {
    title: "Alinhar habilidades e experiência",
    detail: "Escolher as habilidades que representam o trabalho que você quer vender. Conferir os anos reais de React e Python: perfil e site mostravam faixas diferentes.",
  },
  {
    title: "Conferir imagens e títulos dos cases",
    detail: "A autoria do desenvolvimento foi confirmada por você em 21/09/2026. Conferir o título e a stack de AnamNex, a grafia de KDElojob e os títulos de Revix e Tap Aviation. Remover contatos externos das imagens compartilhadas na plataforma.",
  },
  {
    title: "Observar a vitrine depois de salvar",
    detail: "Conferir quais projetos a Workana mostra primeiro. A ordem sugerida prioriza sistemas e integrações; adapte aos projetos que você quer conquistar. Não é necessário apagar cases para testar a seleção.",
  },
] as const;
