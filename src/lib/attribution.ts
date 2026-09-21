/**
 * Atribuição de primeira visita, guardada por sessão.
 *
 * Preserva a PRIMEIRA entrada da sessão através da navegação interna.
 * IDs de clique só determinam o canal; nunca armazenamos o ID ou a query inteira.
 */

const KEY = "edh-attr";

export type Attribution = {
  /** Origem resolvida; nome legado preservado para os eventos existentes. */
  src?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  ref?: string;
  landing?: string;
};

const UTM_LIMIT = 64;
const EVENT_VALUE_LIMIT = 255;

function boundedString(value: unknown, limit = UTM_LIMIT): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || /[\p{Cc}\p{Cf}]/u.test(trimmed)) return undefined;
  return trimmed.slice(0, limit);
}

function restoreAttribution(value: unknown): Attribution | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const stored = value as Record<string, unknown>;
  const landing = boundedString(stored.landing, EVENT_VALUE_LIMIT);
  if (!landing?.startsWith("/") || landing.startsWith("//")) return undefined;
  const attribution: Attribution = { landing };
  for (const key of ["src", "medium", "campaign", "content", "ref"] as const) {
    const field = boundedString(stored[key], key === "ref" ? EVENT_VALUE_LIMIT : UTM_LIMIT);
    if (field) attribution[key] = field;
  }
  return attribution;
}

/**
 * Uma propriedade JSON, para eventos compatíveis com o limite de 2 propriedades
 * do Vercel Pro. A outra propriedade identifica location, id ou chapter.
 * Tetos em caracteres: src 32, campaign 40, content 32, landing 48, medium 16,
 * ref 32. Escapes JSON também contam no teto total de 255; se necessário,
 * reduzimos os campos da menor para a maior prioridade (ref até src).
 * Sempre serializamos o objeto final: nunca cortamos uma string JSON pronta.
 */
export function compactAttribution(attribution = getAttribution()): string {
  const limits = { src: 32, campaign: 40, content: 32, landing: 48, medium: 16, ref: 32 } as const;
  const compact: Attribution = {};
  const keys = Object.keys(limits) as (keyof typeof limits)[];
  for (const key of keys) {
    const value = boundedString(attribution[key], limits[key]);
    if (value) compact[key] = value;
  }
  for (const key of [...keys].reverse()) {
    while (compact[key] && JSON.stringify(compact).length > EVENT_VALUE_LIMIT) {
      compact[key] = Array.from(compact[key]!).slice(0, -1).join("");
      if (!compact[key]) delete compact[key];
    }
  }
  return JSON.stringify(compact);
}

// Também preserva a origem durante a navegação quando o navegador bloqueia storage.
let sessionAttribution: Attribution | undefined;

/** Lê (e grava, na primeira vez) a atribuição da sessão. Seguro em SSR. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  if (sessionAttribution) return sessionAttribution;

  try {
    const saved = window.sessionStorage.getItem(KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : undefined;
    const restored = restoreAttribution(parsed);
    if (restored) {
      sessionAttribution = restored;
      return sessionAttribution;
    }
  } catch {
    // Storage bloqueado ou valor antigo inválido: ainda capturamos esta entrada.
  }

  const params = new URLSearchParams(window.location.search);
  // Origem explícita tem prioridade; IDs de clique são apenas fallback.
  const src =
    boundedString(params.get("utm_source")) ||
    boundedString(params.get("src")) ||
    boundedString(params.get("ref")) ||
    (params.get("gclid") ? "google-ads" : undefined) ||
    (params.get("fbclid") ? "meta-ads" : undefined) ||
    undefined;
  let ref: string | undefined;
  try {
    ref = document.referrer ? boundedString(new URL(document.referrer).host, EVENT_VALUE_LIMIT) : undefined;
  } catch {
    ref = undefined;
  }
  sessionAttribution = {
    ...(src ? { src } : {}),
    ...(ref ? { ref } : {}),
    landing: boundedString(window.location.pathname, EVENT_VALUE_LIMIT) ?? "/",
  };
  for (const field of ["medium", "campaign", "content"] as const) {
    const value = boundedString(params.get(`utm_${field}`));
    if (value) sessionAttribution[field] = value;
  }
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(sessionAttribution));
  } catch {
    // O fallback em memória já preserva a sessão do App Router.
  }
  return sessionAttribution;
}
