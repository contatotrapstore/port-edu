import Image from "next/image";
import Link from "next/link";
import { contratarHref } from "@/lib/links";
import type { RedesignCopy } from "./copy";
import MenuLink from "./MenuLink";

/**
 * No desktop a navegação fica sempre visível. No mobile ela vira um popover
 * nativo: Esc, clique fora e retorno do foco ao botão vêm do navegador; os
 * links só fecham o menu ao navegar. Sem suporte a popover, o CSS mostra os
 * links abertos.
 *
 * As prévias antigas usam os links e o idioma de `copy`; a home e as páginas
 * do site novo passam os próprios links, o destino do idioma (a mesma página
 * na outra língua) e o destino do CTA, com a origem do clique.
 */
export default function BrandHeader({
  copy,
  home = copy.home,
  links = copy.nav.links,
  current,
  languageHref = copy.nav.language.href,
  ctaHref = contratarHref("redesign-nav"),
}: {
  copy: RedesignCopy;
  home?: string;
  links?: readonly { label: string; href: string }[];
  /** href da seção atual, marcada com aria-current. */
  current?: string;
  languageHref?: string;
  ctaHref?: string;
}) {
  const { nav } = copy;

  return (
    <header className="edh-header">
      <div className="edh-frame edh-header-row">
        <Link href={home} className="edh-brand">
          <Image
            src="/brand/edevshub-simbolo.png"
            width={470}
            height={470}
            sizes="32px"
            alt=""
            className="edh-brand-mark"
          />
          <span className="edh-brand-name">EDevsHub</span>
          <span className="edh-brand-descriptor">{nav.descriptor}</span>
        </Link>

        <button type="button" className="edh-menu-button" popoverTarget="edh-menu">
          {nav.menu}
        </button>

        <nav id="edh-menu" className="edh-nav" popover="auto" aria-label={nav.label}>
          <ul className="edh-nav-links">
            {links.map((link) => (
              <li key={link.href}>
                <MenuLink href={link.href} aria-current={link.href === current ? "page" : undefined}>
                  {link.label}
                </MenuLink>
              </li>
            ))}
            <li>
              <Link
                href={languageHref}
                hrefLang={nav.language.hrefLang}
                lang={nav.language.hrefLang}
                className="edh-lang"
              >
                {nav.language.label}
                <span className="edh-sr"> ({nav.language.name})</span>
              </Link>
            </li>
          </ul>
          <MenuLink href={ctaHref} className="edh-nav-cta">
            {nav.cta}
          </MenuLink>
        </nav>
      </div>
    </header>
  );
}
