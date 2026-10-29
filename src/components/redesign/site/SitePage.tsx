import "../redesign.css";
import "../home/home.css";
import "./site.css";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale";
import BrandHeader from "../BrandHeader";
import { getRedesignCopy } from "../copy";
import { plexMono, plexSans } from "../fonts";
import HomeFooter from "../home/HomeFooter";
import { getHomeCopy } from "../home/copy";
import HtmlLang from "./HtmlLang";
import { getSiteCopy } from "./copy";
import { hireHref, localePath, otherLocaleHref } from "./paths";

/**
 * Moldura das páginas internas do site novo: o mesmo cabeçalho e o mesmo
 * rodapé da home, sem a abertura 3D. `ptPath` é o endereço da página em
 * português; o seletor de idioma leva para a mesma página na outra língua.
 */
export default function SitePage({
  locale,
  ptPath,
  current,
  source,
  children,
}: {
  locale: Locale;
  ptPath: string;
  /** Seção do menu marcada como atual. */
  current?: "projetos" | "servicos";
  /** Prefixo da origem dos cliques para a página de contratação. */
  source: string;
  children: ReactNode;
}) {
  const copy = getRedesignCopy(locale);
  const site = getSiteCopy(locale);
  const home = getHomeCopy(locale);
  const homeHref = locale === "en" ? "/en" : "/";
  const languageHref = otherLocaleHref(ptPath, locale);
  const links = site.nav.map((item) => ({ key: item.key, label: item.label, href: localePath(item.path, locale).href }));
  const currentHref = links.find((link) => link.key === current)?.href;

  return (
    <div className={`edh edh-home edh-site ${plexSans.variable} ${plexMono.variable}`} lang={copy.lang} data-scroll-page>
      <HtmlLang lang={copy.lang === "en" ? "en" : "pt-BR"} />
      <a href="#conteudo" className="edh-skip">
        {copy.skip}
      </a>
      <BrandHeader
        copy={copy}
        home={homeHref}
        links={links}
        current={currentHref}
        languageHref={languageHref}
        ctaHref={hireHref(`${source}-nav`, locale)}
      />
      <main id="conteudo">{children}</main>
      <HomeFooter
        copy={home}
        locale={locale}
        homeHref={homeHref}
        otherLocaleHref={languageHref}
        contactHref={hireHref(`${source}-rodape`, locale)}
        workanaLocation={`${source}_rodape`}
      />
    </div>
  );
}
