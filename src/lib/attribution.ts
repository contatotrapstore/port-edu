/**
 * Atribuição de primeira visita, guardada por sessão.
 *
 * Sem isto não dá para responder "de onde veio esse lead?" — o gclid/utm morre
 * ao sair do domínio e o referrer se perde na navegação interna. Guardamos o
 * que chegou na PRIMEIRA página da sessão e enviamos junto de cada evento.
 */

const KEY = "edh-attr";

export type Attribution = {
  src?: string;
  ref?: string;
  landing?: string;
};

// Também preserva a origem durante a navegação quando o navegador bloqueia storage.
let sessionAttribution: Attribution | undefined;

/** Lê (e grava, na primeira vez) a atribuição da sessão. Seguro em SSR. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  if (sessionAttribution) return sessionAttribution;

  try {
    const saved = window.sessionStorage.getItem(KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : undefined;
    if (
      parsed && typeof parsed === "object" && !Array.isArray(parsed) &&
      "landing" in parsed && typeof parsed.landing === "string" &&
      (!("src" in parsed) || typeof parsed.src === "string") &&
      (!("ref" in parsed) || typeof parsed.ref === "string")
    ) {
      sessionAttribution = parsed as Attribution;
      return sessionAttribution;
    }
  } catch {
    // Storage bloqueado ou valor antigo inválido: ainda capturamos esta entrada.
  }

  const params = new URLSearchParams(window.location.search);
  // Origem explícita tem prioridade; IDs de clique são apenas fallback.
  const src =
    params.get("utm_source") ||
    params.get("src") ||
    params.get("ref") ||
    (params.get("gclid") ? "google-ads" : undefined) ||
    (params.get("fbclid") ? "meta-ads" : undefined) ||
    undefined;
  let ref: string | undefined;
  try {
    ref = document.referrer ? new URL(document.referrer).host : undefined;
  } catch {
    ref = undefined;
  }
  sessionAttribution = {
    ...(src ? { src } : {}),
    ...(ref ? { ref } : {}),
    landing: window.location.pathname,
  };
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(sessionAttribution));
  } catch {
    // O fallback em memória já preserva a sessão do App Router.
  }
  return sessionAttribution;
}
