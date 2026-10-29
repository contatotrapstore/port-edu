import type { StaticImageData } from "next/image";
import passagensChat from "../../../../public/images/redesign/passagens-chat-demo.webp";
import passagensCrm from "../../../../public/images/redesign/passagens-crm-demo.webp";
import passagensTicket from "../../../../public/images/redesign/passagens-ticket-demo.webp";
import mudaFluxo from "../../../../public/images/redesign/cases/muda-fluxo.webp";
import neuroChat from "../../../../public/images/redesign/cases/neuroialab-chat.webp";
import neuroPainel from "../../../../public/images/redesign/cases/neuroialab-painel.webp";
import pacePainel from "../../../../public/images/redesign/cases/pace-painel.webp";
import paceProtocolos from "../../../../public/images/redesign/cases/pace-protocolos.webp";
import type { HomeCaseId } from "./copy";

/**
 * Pontos de troca de imagem da home, num lugar só.
 *
 * Para trocar uma imagem: substitua o arquivo em public/images/redesign (ou o
 * import acima) e revise a nota e o texto alternativo do case em copy.ts, que
 * dizem o que a imagem mostra. O Passagens usa recriações com dados fictícios
 * (fontes em output/telas-demo-fonte); uma captura real do CRM pode entrar no
 * lugar de passagensCrm, trocando a nota para "Tela real do sistema entregue".
 * Os recortes dos outros cases vêm das capturas do portfólio, sem e-mails nem
 * mensagens de teste.
 */
export type HomeCaseMedia =
  | { layout: "lead"; crm: StaticImageData; chat: StaticImageData; ticket: StaticImageData }
  | { layout: "right" | "left" | "compact"; main: StaticImageData; detail?: StaticImageData };

export const HOME_CASES: readonly { id: HomeCaseId; media: HomeCaseMedia }[] = [
  {
    id: "passagenseuropa",
    media: { layout: "lead", crm: passagensCrm, chat: passagensChat, ticket: passagensTicket },
  },
  { id: "neuroialab", media: { layout: "right", main: neuroPainel, detail: neuroChat } },
  { id: "pace", media: { layout: "left", main: pacePainel, detail: paceProtocolos } },
  { id: "mudapaisagens", media: { layout: "compact", main: mudaFluxo } },
];
