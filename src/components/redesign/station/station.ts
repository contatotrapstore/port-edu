/**
 * Bancada Passagens Europa: medidas em metros, origem no piso sob o centro da
 * bancada, frente voltada para +z.
 *
 * As três superfícies (CRM, conversa e bilhete) são recriações em alta
 * resolução com dados fictícios: a tela segue o layout e os rótulos da
 * captura real do CRM entregue; o HTML-fonte está em output/telas-demo-fonte.
 */

// `src` é a imagem inteira, para o HTML; `tex` é a versão menor que vira
// textura no 3D (mesma proporção, menos tempo de envio à GPU).
export const STATION_SCREEN = {
  src: "/images/redesign/passagens-crm-demo.webp",
  tex: "/images/redesign/station/screen-crm.webp",
  /** 2616 × 1604: a tela ativa do monitor tem a mesma proporção. */
  aspect: 2616 / 1604,
  width: 0.7,
};

export const STATION_CHAT = {
  src: "/images/redesign/passagens-chat-demo.webp",
  tex: "/images/redesign/station/screen-chat.webp",
  aspect: 1080 / 2280,
};
export const STATION_TICKET = {
  src: "/images/redesign/passagens-ticket-demo.webp",
  tex: "/images/redesign/station/screen-ticket.webp",
  aspect: 1520 / 600,
};

/** Pontos exploráveis da tela, em frações da captura (x da esquerda, y do topo). */
export const STATION_POINTS = [
  { n: 1, x: 0.14, y: 0.27 }, // menu de módulos
  { n: 2, x: 0.885, y: 0.102 }, // abas Funil de Vendas / Conversas
  { n: 3, x: 0.528, y: 0.292 }, // etapas do funil SDR
  { n: 4, x: 0.885, y: 0.958 }, // Assistente
] as const;

/** Bilhetes colados no monitor: cada parte da operação numa ferramenta. */
export type StationTicket = {
  /** Índice do módulo em copy.case.decision.modules. */
  module: number;
  /** Posição no plano da tela (m, a partir do centro) e giro em graus. */
  at: [number, number];
  tilt: number;
  /** Ponto da tela para onde o bilhete vai. */
  point: number;
  tone: "amber" | "ivory";
};

export const STATION_TICKETS: StationTicket[] = [
  { module: 0, at: [-0.322, 0.198], tilt: 7, point: 2, tone: "amber" },
  { module: 1, at: [-0.372, 0.052], tilt: -9, point: 3, tone: "ivory" },
  { module: 2, at: [0.366, 0.17], tilt: -5, point: 1, tone: "amber" },
  { module: 3, at: [0.376, 0.036], tilt: 8, point: 1, tone: "ivory" },
  { module: 4, at: [-0.296, -0.19], tilt: -4, point: 1, tone: "ivory" },
  { module: 5, at: [0.262, -0.208], tilt: 10, point: 1, tone: "amber" },
];

/** Ponto da tela em coordenadas do plano do monitor (m, a partir do centro). */
export function pointOnScreen(n: number): [number, number] {
  const point = STATION_POINTS.find((p) => p.n === n);
  if (!point) return [0, 0];
  const height = STATION_SCREEN.width / STATION_SCREEN.aspect;
  return [(point.x - 0.5) * STATION_SCREEN.width, (0.5 - point.y) * height];
}
