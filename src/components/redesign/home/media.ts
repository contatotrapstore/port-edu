import type { StaticImageData } from "next/image";
import passagensChat from "../../../../public/images/redesign/passagens-chat-demo.webp";
import passagensCrm from "../../../../public/images/redesign/passagens-crm-demo.webp";
import passagensTicket from "../../../../public/images/redesign/passagens-ticket-demo.webp";
import mudaFluxo from "../../../../public/images/redesign/cases/muda-fluxo.webp";
import pacePainel from "../../../../public/images/redesign/cases/pace-painel.webp";
import paceProtocolos from "../../../../public/images/redesign/cases/pace-protocolos.webp";
import reiPainel from "../../../../public/images/lp/rei-painel.webp";
import type { HomeCaseId } from "./copy";

/**
 * Pontos de troca de imagem da home, num lugar só.
 *
 * Cada destaque é apresentado conforme o tipo de trabalho: o CRM com a mesa de
 * demonstração, o sistema pela tela de operação, o produto por duas telas, a
 * loja por uma sequência de páginas e a integração pelo fluxo. Ao trocar uma
 * imagem, revise em copy.ts a nota e o texto alternativo, que dizem o que ela
 * mostra. O Passagens usa recriações com dados fictícios (fontes em
 * output/telas-demo-fonte); os demais são capturas dos projetos entregues.
 */
export type HomeCaseMedia =
  | { layout: "lead"; crm: StaticImageData; chat: StaticImageData; ticket: StaticImageData }
  | { layout: "system"; main: StaticImageData }
  | { layout: "product"; main: StaticImageData; detail: StaticImageData }
  | { layout: "store"; shots: { key: "home" | "products" | "brand"; image: StaticImageData }[] }
  | { layout: "flow"; main: StaticImageData };

export const HOME_CASES: readonly { id: HomeCaseId; media: HomeCaseMedia }[] = [
  {
    id: "passagenseuropa",
    media: { layout: "lead", crm: passagensCrm, chat: passagensChat, ticket: passagensTicket },
  },
  { id: "rei", media: { layout: "system", main: reiPainel } },
  { id: "pace", media: { layout: "product", main: pacePainel, detail: paceProtocolos } },
  // Cacao Store fora da home desde 11/11/2026: o domínio da loja não existe mais (NXDOMAIN).
  { id: "mudapaisagens", media: { layout: "flow", main: mudaFluxo } },
];
