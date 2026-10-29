import Image from "next/image";
import Link from "next/link";
import { workanaProfile as stats } from "@/lib/constants";
import { getContent } from "@/lib/content.en";
import type { Locale } from "@/lib/locale";
import { siteUrl } from "@/lib/site";
import SitePage from "./SitePage";
import { getSiteCopy } from "./copy";
import { localePath } from "./paths";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Índice dos cases no design novo: agrupado pelo tipo de trabalho, como o
 * catálogo atual, em linhas com imagem, título e ano. Só entram projetos com
 * página de case (os que têm visão geral documentada).
 */
export default function ProjectsIndex({ locale }: { locale: Locale }) {
  const t = getSiteCopy(locale);
  const p = t.projectsIndex;
  const cases = getContent(locale).projects.filter((project) => project.overview);
  const base = localePath("/projetos", locale).href;
  const services = localePath("/servicos", locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: p.title,
    url: `${siteUrl}${base}`,
    inLanguage: locale === "en" ? "en" : "pt-BR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cases.length,
      itemListElement: cases.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}${base}/${project.id}`,
        name: project.title,
      })),
    },
  };

  return (
    <SitePage locale={locale} ptPath="/projetos" current="projetos" source="projetos">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="edh-pagehead" aria-labelledby="edh-page-title">
        <div className="edh-frame">
          <nav aria-label={t.crumbs.label}>
            <ol className="edh-crumbs">
              <li>
                <Link href={localePath("/", locale).href}>{t.crumbs.home}</Link>
              </li>
              <li aria-current="page">{t.crumbs.projects}</li>
            </ol>
          </nav>
          <h1 id="edh-page-title" className="edh-pagehead-title">
            {p.title}
          </h1>
          <p className="edh-pagehead-lead">
            {p.lead} {p.intro(cases.length)}
          </p>
          <ul className="edh-proofstrip">
            <li>
              <b>{stats.projectsCompleted}</b> {t.proof.projects}
            </li>
            <li>
              <b>{locale === "en" ? stats.rating : stats.rating.toLocaleString("pt-BR")}/5</b> {t.proof.rating}
            </li>
            <li className="edh-proofstrip-source">
              {t.proof.checked} {stats.verifiedAtLabel}
            </li>
          </ul>
          <div className="edh-actions">
            <Link href={services.href} className="edh-link">
              {p.services}
            </Link>
          </div>
        </div>
      </section>

      <section className="edh-ch edh-ch--paper" aria-label={p.title}>
        <div className="edh-frame">
          {p.verticals.map((vertical) => {
            const items = cases.filter((project) => project.vertical === vertical.id);
            if (!items.length) return null;
            return (
              <section key={vertical.id} className="edh-pgroup" aria-labelledby={`grupo-${vertical.id}`}>
                <div className="edh-pgroup-head">
                  <h2 id={`grupo-${vertical.id}`} className="edh-pgroup-title">
                    {vertical.label}
                  </h2>
                  <p className="edh-pgroup-blurb">{vertical.blurb}</p>
                </div>
                <ul className="edh-prows">
                  {items.map((project) => (
                    <li key={project.id} className="edh-prow">
                      <Link href={`${base}/${project.id}`}>
                        <span className="edh-prow-thumb">
                          <Image src={project.image} alt="" fill sizes="(min-width: 48rem) 11rem, 7.5rem" />
                        </span>
                        <span>
                          <span className="edh-prow-name">{project.title}</span>
                          <span className="edh-prow-headline">
                            {capitalize(project.headline ?? project.description)}
                          </span>
                        </span>
                        <span className="edh-prow-meta">
                          {project.year ? <span>{project.year}</span> : null}
                          <span>{project.tech.slice(0, 3).join(", ")}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </SitePage>
  );
}
