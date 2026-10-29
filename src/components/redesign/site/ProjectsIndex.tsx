import Link from "next/link";
import { workanaProfile as stats } from "@/lib/constants";
import { getPortfolioProjects } from "@/lib/portfolio-additions";
import CatalogFilter from "./CatalogFilter";
import type { Locale } from "@/lib/locale";
import { siteUrl } from "@/lib/site";
import ProjectCard from "./ProjectCard";
import SitePage from "./SitePage";
import { catalogKinds, catalogOrder, entryFor } from "./catalog";
import { getSiteCopy } from "./copy";
import { localePath } from "./paths";

/**
 * Catálogo completo: todos os projetos com página de case, por tipo de
 * trabalho (ver catalog.ts), em capas do mesmo formato. A home faz a
 * curadoria; aqui a função é encontrar qualquer trabalho.
 */
export default function ProjectsIndex({ locale }: { locale: Locale }) {
  const t = getSiteCopy(locale);
  const p = t.projectsIndex;
  const cases = catalogOrder(getPortfolioProjects(locale).filter((project) => project.overview));
  const groups = catalogKinds(locale)
    .map((kind) => ({ kind, items: cases.filter((project) => entryFor(project.id).kind === kind.id) }))
    .filter((group) => group.items.length);
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
          <CatalogFilter en={locale === "en"} groups={groups.map(({ kind, items }) => ({
            id: kind.id, label: kind.label, count: items.length, content: (
            <section key={kind.id} id={`tipo-${kind.id}`} className="edh-pgroup" aria-labelledby={`grupo-${kind.id}`}>
              <div className="edh-pgroup-head">
                <h2 id={`grupo-${kind.id}`} className="edh-pgroup-title">
                  {kind.label}
                </h2>
                <p className="edh-pgroup-blurb">{kind.blurb}</p>
              </div>
              <ul className="edh-pgrid">
                {items.map((project) => (
                  <li key={project.id}>
                    <ProjectCard project={project} locale={locale} href={`${base}/${project.id}`} />
                  </li>
                ))}
              </ul>
            </section>
            ),
          }))} />
        </div>
      </section>
    </SitePage>
  );
}
