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

/** Lê (e grava, na primeira vez) a atribuição da sessão. Seguro em SSR. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as Attribution;

    const params = new URLSearchParams(window.location.search);
    const src =
      params.get("utm_source") ||
      params.get("src") ||
      params.get("ref") ||
      undefined;
    let ref: string | undefined;
    try {
      ref = document.referrer ? new URL(document.referrer).host : undefined;
    } catch {
      ref = undefined;
    }
    const attr: Attribution = {
      ...(src ? { src } : {}),
      ...(ref ? { ref } : {}),
      landing: window.location.pathname,
    };
    sessionStorage.setItem(KEY, JSON.stringify(attr));
    return attr;
  } catch {
    return {};
  }
}
