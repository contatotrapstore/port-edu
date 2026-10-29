import type { Locale } from "@/lib/locale";
import type { ServiceCase } from "@/lib/services";
import { getServiceCases as getBaseCases } from "@/lib/services.en";

/**
 * Cases das páginas de serviço no design novo. O site atual continua lendo
 * os dados de lib/services sem alteração; aqui só muda o recorte do Clinafy.
 * O recorte antigo (um cartão de 364 px) ficava pequeno na coluna. Este pega
 * a faixa de IA da mesma captura, ainda sem os números promocionais nem os
 * botões flutuantes da página.
 */
const clinafy = {
  pt: {
    imageAlt: "Faixa de inteligência artificial na apresentação do Clinafy: transcrição, resumos, padrões emocionais e chat sobre o caso",
    caption: "Detalhe da apresentação do Clinafy: os recursos de IA do produto. A imagem descreve o produto.",
  },
  en: {
    imageAlt: "Artificial intelligence section of the Clinafy presentation: transcription, summaries, emotional patterns and case chat",
    caption: "Detail from the Clinafy presentation: the product's AI features. The image describes the product.",
  },
};

export function getServiceCases(locale: Locale): Record<string, ServiceCase> {
  const cases = getBaseCases(locale);
  return {
    ...cases,
    clinafy: {
      ...cases.clinafy,
      ...clinafy[locale === "en" ? "en" : "pt"],
      crop: { x: 40, y: 0, width: 1190, height: 262 },
    },
  };
}
