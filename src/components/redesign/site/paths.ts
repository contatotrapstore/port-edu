import type { Locale } from "@/lib/locale";
import { isNewSiteEnabled } from "../preview";

/** Rotas que existem em inglês mesmo sem o site novo ligado. */
const ALWAYS_EN = ["/", "/projetos"];

/**
 * Endereço de uma página na língua pedida. Com EDH_NEW_SITE=1 toda página da
 * jornada comercial tem versão em inglês; sem a variável, só a home e os
 * projetos têm, e o link cai na página em português, avisando (`ptOnly`).
 */
export function localePath(path: string, locale: Locale): { href: string; ptOnly: boolean } {
  if (locale === "pt") return { href: path, ptOnly: false };
  const [base, hash] = path.split("#");
  const exists = isNewSiteEnabled() || ALWAYS_EN.some((p) => base === p || (p !== "/" && base.startsWith(`${p}/`)));
  if (!exists) return { href: path, ptOnly: true };
  const en = base === "/" ? "/en" : `/en${base}`;
  return { href: hash ? `${en}#${hash}` : en, ptOnly: false };
}

/** Página de contratação na língua da página, com a origem do clique. */
export function hireHref(source: string, locale: Locale): string {
  return `${localePath("/contratar", locale).href}?src=${encodeURIComponent(source)}`;
}

/** A mesma página na outra língua (o seletor de idioma leva para ela). */
export function otherLocaleHref(ptPath: string, locale: Locale): string {
  if (locale === "en") return ptPath;
  return localePath(ptPath, "en").href;
}
