import Image from "next/image";
import Link from "next/link";
import WorkanaLink from "@/components/workana/WorkanaLink";
import { siteConfig } from "@/lib/constants";
import type { Locale } from "@/lib/locale";
import { localePath } from "../site/paths";
import type { HomeCopy } from "./copy";

/**
 * Rodapé completo do site novo: assinatura, trabalho, empresa e informações.
 * Só aponta para rotas que existem. O contato público é a página de
 * contratação; fora dela, só perfis confirmados pelo proprietário (Workana,
 * Instagram e GitHub). Página sem versão em inglês leva o aviso do idioma.
 */
export default function HomeFooter({
  copy,
  locale,
  homeHref,
  otherLocaleHref,
  contactHref,
  workanaLocation = "home_rodape",
}: {
  copy: HomeCopy;
  locale: Locale;
  homeHref: string;
  otherLocaleHref: string;
  contactHref: string;
  /** Origem registrada no evento workana_cta. */
  workanaLocation?: string;
}) {
  const t = copy.footer;
  const en = locale === "en";
  const projects = localePath("/projetos", locale);
  const services = localePath("/servicos", locale);
  const privacy = localePath("/politica-de-privacidade", locale);
  const contact = localePath("/contratar", locale);
  const ptOnly = (show: boolean) => (show && t.ptOnly ? <span className="edh-footer-lang">{t.ptOnly}</span> : null);
  const { instagram, github } = siteConfig.social;
  const year = new Date().getFullYear();

  return (
    <footer className="edh-site-footer">
      <div className="edh-frame">
        <div className="edh-footer-grid">
          <div className="edh-footer-brand">
            <Link href={homeHref} className="edh-brand">
              <Image src="/brand/edevshub-simbolo.png" width={470} height={470} sizes="32px" alt="" className="edh-brand-mark" />
              <span className="edh-brand-name">EDevsHub</span>
            </Link>
            <p>{t.tagline}</p>
          </div>

          <nav className="edh-footer-col" aria-labelledby="edh-footer-work">
            <h2 id="edh-footer-work">{t.columns.work}</h2>
            <ul>
              <li>
                <Link href={projects.href}>{t.projects}</Link>
              </li>
              <li>
                <Link href={services.href} hrefLang={services.ptOnly ? "pt-BR" : undefined}>
                  {t.services}
                  {ptOnly(services.ptOnly)}
                </Link>
              </li>
              <li>
                <Link href={contactHref} hrefLang={contact.ptOnly ? "pt-BR" : undefined}>
                  {t.contact}
                  {ptOnly(contact.ptOnly)}
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="edh-footer-col" aria-labelledby="edh-footer-company">
            <h2 id="edh-footer-company">{t.columns.company}</h2>
            <ul>
              <li>
                <WorkanaLink location={workanaLocation}>{t.workana}</WorkanaLink>
              </li>
              {instagram ? (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer">
                    {t.instagram}
                  </a>
                </li>
              ) : null}
              {github ? (
                <li>
                  <a href={github} target="_blank" rel="noopener noreferrer">
                    {t.github}
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>

          <nav className="edh-footer-col" aria-labelledby="edh-footer-legal">
            <h2 id="edh-footer-legal">{t.columns.legal}</h2>
            <ul>
              <li>
                <Link href={privacy.href} hrefLang={privacy.ptOnly ? "pt-BR" : undefined}>
                  {t.privacy}
                  {ptOnly(privacy.ptOnly)}
                </Link>
              </li>
              <li>
                <Link href={otherLocaleHref} hrefLang={en ? "pt-BR" : "en"} lang={en ? "pt-BR" : "en"}>
                  {t.language}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="edh-footer-base">
          <span>
            © {year} EDevsHub. {t.rights}
          </span>
          <span>{t.descriptor}</span>
        </div>
      </div>
    </footer>
  );
}
