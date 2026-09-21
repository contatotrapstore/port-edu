import type { Project } from "@/lib/constants";
import type { Locale } from "@/lib/locale";

// Eduardo confirmed full development of the existing portfolio on 2026-09-21.
// Keep the IDs explicit so future entries do not inherit this confirmation.
const confirmedProjects = new Set([
  "pace", "revix", "neuroialab", "anamex", "connote", "clinafy",
  "cacaostore", "click", "blackinbot", "clubeazul", "corpxbank", "rei",
  "passagenseuropa", "ciliosclick", "neuroone", "focus", "woodsuperfoods",
  "mudapaisagens", "paylink", "tap", "direcao", "wesleymods", "kdelojab",
]);

const caseCopy: Partial<Record<string, Record<Locale, { role: string; description: string }>>> = {
  mudapaisagens: {
    pt: {
      role: "Desenvolvi a automação completa de pré-atendimento e qualificação pelo WhatsApp, incluindo o fluxo no Make e a integração com o Pipefy.",
      description: "Automação de WhatsApp com qualificação de leads e integração entre Make e Pipefy. Conheça o projeto Muda Paisagens, desenvolvido por Eduardo Gouveia.",
    },
    en: {
      role: "I developed the complete WhatsApp intake and lead qualification automation, including the Make workflow and Pipefy integration.",
      description: "WhatsApp lead qualification with Make and Pipefy integration. Explore the Muda Paisagens automation project developed by Eduardo Gouveia.",
    },
  },
  passagenseuropa: {
    pt: {
      role: "Desenvolvi o sistema completo, com CRM, atendimento por WhatsApp, funil de vendas, cotações, gestão financeira e comissões.",
      description: "CRM sob medida com WhatsApp, cotações, financeiro e comissões. Conheça o sistema Passagens Europa, desenvolvido por Eduardo Gouveia.",
    },
    en: {
      role: "I developed the complete system, including the CRM, WhatsApp support, sales pipeline, quotes, financial management and commissions.",
      description: "Custom CRM with WhatsApp, quotes, finance and commissions. Explore the Passagens Europa system developed by Eduardo Gouveia.",
    },
  },
  clinafy: {
    pt: {
      role: "Desenvolvi a plataforma completa, incluindo agenda, prontuário eletrônico, teleconsulta, área do paciente e gestão financeira.",
      description: "SaaS para saúde mental com prontuário, agenda, teleconsulta e gestão financeira. Conheça o Clinafy, desenvolvido por Eduardo Gouveia.",
    },
    en: {
      role: "I developed the complete platform, including scheduling, electronic records, telehealth, the patient area and financial management.",
      description: "Mental health SaaS with clinical records, scheduling, telehealth and finance. Explore Clinafy, developed by Eduardo Gouveia.",
    },
  },
};

export function getPortfolioRole(projectId: string, locale: Locale): string | undefined {
  if (!confirmedProjects.has(projectId)) return undefined;
  return caseCopy[projectId]?.[locale].role ?? (locale === "en"
    ? "I was responsible for the complete development of this project."
    : "Fui responsável pelo desenvolvimento completo deste projeto.");
}

export function getCaseDescription(project: Project, locale: Locale): string {
  return caseCopy[project.id]?.[locale].description
    ?? (locale === "en" ? project.overview || project.description : project.description);
}
