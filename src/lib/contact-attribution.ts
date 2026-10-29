import type { Attribution } from "./attribution";

/**
 * Only published, non-personal campaign identifiers may enter a contact link.
 * Query values are never copied freely into a message: even a valid-looking
 * slug could contain somebody's name, phone number or other personal data.
 * Add future campaign/content codes here when preparing their tracked links.
 */
const SOURCES: Record<string, string> = {
  ig: "IG", instagram: "IG", fb: "FB", facebook: "FB",
  an: "AN", msg: "MSG", messenger: "MSG",
  meta: "META", "meta-ads": "META", "meta-c1": "C1", "meta-c2": "C2",
  google: "GOOGLE", "google-ads": "GADS", linkedin: "LI", workana: "WK",
};

const CAMPAIGNS: Record<string, string> = {
  "integracao-t1": "T1",
  cases_2026_09: "CASES0926",
  edh_c8_r2: "C8R2",
  "c8-r2": "C8R2",
  "c8-20260928": "C8R2",
};

const CONTENT: Record<string, string> = {
  c8: "C8", c8_portfolio: "C8P",
  muda_fluxo: "MUDA", crm_operacao: "CRM", definir_escopo: "ESCOPO",
};

function knownIdentifier(value: unknown, allowed: Record<string, string>): string | undefined {
  if (typeof value !== "string" || value.length > 40) return undefined;
  const key = value.trim().toLowerCase();
  return Object.hasOwn(allowed, key) ? key : undefined;
}

/** Drop arbitrary UTMs, referrers and paths before building contact analytics. */
export function safeContactAttribution(attribution: Attribution): Attribution {
  const src = knownIdentifier(attribution.src, SOURCES);
  const campaign = knownIdentifier(attribution.campaign, CAMPAIGNS);
  const content = knownIdentifier(attribution.content, CONTENT);
  return {
    ...(src ? { src } : {}),
    ...(campaign ? { campaign } : {}),
    ...(content ? { content } : {}),
  };
}

export function contactReference(page: string, attribution: Attribution = {}): string {
  const safe = safeContactAttribution(attribution);
  const location = page === "contratar_topo" ? "CT"
    : page === "contratar_final" ? "CF"
      : page === "contratar_en_topo" ? "CT-EN"
        : page === "contratar_en_final" ? "CF-EN"
          : page.startsWith("solucoes") ? "SOL" : "SITE";
  return [location, safe.src && SOURCES[safe.src],
    safe.campaign && CAMPAIGNS[safe.campaign], safe.content && CONTENT[safe.content]]
    .filter(Boolean).join("-");
}

export function whatsappHref(phone: string, page: string, attribution: Attribution = {}, locale: "pt" | "en" = "pt"): string {
  const greeting = locale === "en"
    ? "Hi, Eduardo! I'd like to talk about a development project.\n\n"
    : "Olá, Eduardo! Quero conversar sobre um projeto de desenvolvimento.\n\n";
  const message = greeting + `Ref.: ${contactReference(page, attribution)}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
