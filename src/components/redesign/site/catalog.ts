import type { Locale } from "@/lib/locale";

/**
 * Catálogo completo do portfólio (índice e páginas de case), separado da
 * curadoria da home. Organiza os 22 projetos por tipo de trabalho e diz, para
 * cada um, qual imagem mostrar e o que ela é.
 *
 * Material:
 * - "screen": tela do sistema ou produto entregue;
 * - "page": captura de página publicada (loja, página do produto);
 * - "promo": imagem de divulgação (notebook ou celular em cena), válida para
 *   apresentar o trabalho, mas que não demonstra o produto funcionando.
 * Capa própria só quando existe uma tela real melhor que a imagem principal;
 * nenhuma tela foi criada para compensar a falta de captura.
 */
export type CatalogKind = "sistemas" | "saas" | "lojas" | "apps" | "sites";
export type Material = "screen" | "page" | "promo";

type Entry = { kind: CatalogKind; material: Material; cover?: { src: string; width: number; height: number } };

export const CATALOG: Record<string, Entry> = {
  kingprime: { kind: "sistemas", material: "page" },
  pnlglobal: { kind: "sistemas", material: "page" },
  planetshake: { kind: "apps", material: "screen" },
  beeder: { kind: "saas", material: "page" },
  chatcupom: { kind: "saas", material: "page" },
  livoreto: { kind: "saas", material: "page" },
  marli: { kind: "sites", material: "page" },
  // Sistemas e integrações
  rei: { kind: "sistemas", material: "screen", cover: { src: "/images/lp/rei-painel.webp", width: 830, height: 517 } },
  passagenseuropa: { kind: "sistemas", material: "promo" },
  mudapaisagens: { kind: "sistemas", material: "screen", cover: { src: "/images/redesign/cases/muda-fluxo.webp", width: 699, height: 460 } },
  // Produtos SaaS: telas reais primeiro
  pace: { kind: "saas", material: "screen" },
  neuroialab: { kind: "saas", material: "screen" },
  anamex: { kind: "saas", material: "screen" },
  connote: { kind: "saas", material: "screen" },
  neuroone: { kind: "saas", material: "screen" },
  clinafy: { kind: "saas", material: "page" },
  clubeazul: { kind: "saas", material: "promo" },
  blackinbot: { kind: "saas", material: "promo" },
  focus: { kind: "saas", material: "promo" },
  ciliosclick: { kind: "saas", material: "promo" },
  // Lojas virtuais
  cacaostore: { kind: "lojas", material: "page" },
  woodsuperfoods: { kind: "lojas", material: "promo" },
  wesleymods: { kind: "lojas", material: "promo" },
  // Aplicativos
  revix: { kind: "apps", material: "promo" },
  corpxbank: { kind: "apps", material: "promo" },
  // Sites
  paylink: { kind: "sites", material: "promo" },
  tap: { kind: "sites", material: "promo" },
  direcao: { kind: "sites", material: "promo" },
  kdelojab: { kind: "sites", material: "promo" },
};

const KINDS: Record<Locale, { id: CatalogKind; label: string; blurb: string }[]> = {
  pt: [
    { id: "sistemas", label: "Sistemas e integrações", blurb: "Sistemas de operação, CRMs e integrações entre as ferramentas que a empresa já usa." },
    { id: "saas", label: "Produtos SaaS", blurb: "Plataformas usadas por clientes, de clínicas a clubes de benefícios, da primeira versão às seguintes." },
    { id: "lojas", label: "Lojas virtuais", blurb: "Lojas sob medida, com catálogo, compra e gestão pelo próprio cliente." },
    { id: "apps", label: "Aplicativos", blurb: "Produtos para celular, publicados nas lojas de aplicativos." },
    { id: "sites", label: "Sites", blurb: "Sites institucionais e páginas de produto sob medida." },
  ],
  en: [
    { id: "sistemas", label: "Systems and integrations", blurb: "Operations systems, CRMs and integrations between the tools the business already uses." },
    { id: "saas", label: "SaaS products", blurb: "Platforms used by customers, from clinics to benefits clubs, from the first version to the next ones." },
    { id: "lojas", label: "Online stores", blurb: "Custom stores with catalog, checkout and management by the client." },
    { id: "apps", label: "Mobile apps", blurb: "Phone products published on the app stores." },
    { id: "sites", label: "Websites", blurb: "Custom corporate websites and product pages." },
  ],
};

const MATERIAL: Record<Locale, Record<Material, string>> = {
  pt: { screen: "Tela do sistema", page: "Página publicada", promo: "Imagem de divulgação" },
  en: { screen: "System screen", page: "Published page", promo: "Promotional image" },
};

export const catalogKinds = (locale: Locale) => KINDS[locale];
export const materialLabel = (material: Material, locale: Locale) => MATERIAL[locale][material];
export const kindLabel = (kind: CatalogKind, locale: Locale) => KINDS[locale].find((k) => k.id === kind)!.label;

/**
 * Ordem do catálogo: por tipo e, dentro dele, na ordem acima. Um projeto novo
 * que ainda não esteja no mapa vai para o fim, como produto SaaS de divulgação,
 * em vez de sumir do índice.
 */
export function catalogOrder<T extends { id: string }>(projects: T[]): T[] {
  const ids = Object.keys(CATALOG);
  const kinds: CatalogKind[] = ["sistemas", "saas", "lojas", "apps", "sites"];
  const rank = (id: string) => kinds.indexOf(entryFor(id).kind) * (ids.length + 1) + (id in CATALOG ? ids.indexOf(id) : ids.length);
  return [...projects].sort((a, b) => rank(a.id) - rank(b.id));
}

export function entryFor(id: string): Entry {
  return CATALOG[id] ?? { kind: "saas", material: "promo" };
}

/** Imagem de capa (a tela real, quando existe) e suas dimensões. */
export function coverFor(project: { id: string; image: string }): { src: string; width?: number; height?: number } {
  return entryFor(project.id).cover ?? { src: project.image };
}
