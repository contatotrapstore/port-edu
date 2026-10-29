import Image from "next/image";
import Link from "next/link";
import WorkanaLink from "@/components/workana/WorkanaLink";
import { getCaseInsights } from "@/lib/case-insights";
import { siteConfig, workanaProfile as stats, type Project } from "@/lib/constants";
import { getContent } from "@/lib/content.en";
import type { Locale } from "@/lib/locale";
import { getPortfolioRole } from "@/lib/portfolio-case-copy";
import { siteUrl } from "@/lib/site";
import profile from "../../../../public/images/profile.jpeg";
import SitePage from "./SitePage";
import { getSiteCopy } from "./copy";
import { hireHref, localePath } from "./paths";
import { projectImageSize } from "./project-images";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Página de case no design novo. Todo o conteúdo vem da mesma fonte da versão
 * atual (getContent, getPortfolioRole, getCaseInsights): visão geral,
 * problema, entrega, funcionalidades, capacidades, telas e o percurso do case.
 * Sem métricas: os cases não têm resultado medido documentado.
 */
export default function CasePage({ project, locale }: { project: Project; locale: Locale }) {
  const t = getSiteCopy(locale);
  const c = t.case;
  const en = locale === "en";
  const base = localePath("/projetos", locale).href;
  const url = `${siteUrl}${base}/${project.id}`;
  const cases = getContent(locale).projects.filter((item) => item.overview);
  const index = cases.findIndex((item) => item.id === project.id);
  const prev = cases[(index - 1 + cases.length) % cases.length];
  const next = cases[(index + 1) % cases.length];
  const role = project.role ?? getPortfolioRole(project.id, locale);
  const insights = getCaseInsights(project.id, locale);
  const capabilities = project.portfolioOutput ?? project.output;
  const vertical = t.projectsIndex.verticals.find((item) => item.id === project.vertical);
  const headline = capitalize(project.headline ?? project.description);
  const gallery = project.gallery?.length ? project.gallery : insights?.useProjectImage && project.image ? [project.image] : [];
  const service = insights ? localePath(insights.service.href, locale) : null;
  const serviceLabel = insights && service && !service.ptOnly ? insights.service.label.replace(/\s*\(in Portuguese\)$/, "") : insights?.service.label;
  const rating = en ? String(stats.rating) : stats.rating.toLocaleString("pt-BR");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        description: project.overview || project.description,
        image: `${siteUrl}${project.image}`,
        url,
        inLanguage: en ? "en" : "pt-BR",
        keywords: project.tech.join(", "),
        ...(project.url ? { sameAs: project.url } : {}),
        creator: { "@type": "Person", name: siteConfig.name, url: `${siteUrl}/#person` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.crumbs.home, item: `${siteUrl}${localePath("/", locale).href}` },
          { "@type": "ListItem", position: 2, name: t.crumbs.projects, item: `${siteUrl}${base}` },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };

  return (
    <SitePage locale={locale} ptPath={`/projetos/${project.id}`} current="projetos" source={`case_${project.id}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="edh-pagehead edh-casehead" aria-labelledby="edh-page-title">
        <div className="edh-frame">
          <nav aria-label={t.crumbs.label}>
            <ol className="edh-crumbs">
              <li>
                <Link href={localePath("/", locale).href}>{t.crumbs.home}</Link>
              </li>
              <li>
                <Link href={base}>{t.crumbs.projects}</Link>
              </li>
              <li aria-current="page">{project.title}</li>
            </ol>
          </nav>
          <p className="edh-pagehead-kicker">
            {[vertical?.label, project.year].filter(Boolean).join(", ")}
          </p>
          <h1 id="edh-page-title" className="edh-pagehead-title">
            {project.title}
          </h1>
          <p className="edh-pagehead-lead">{headline}.</p>
        </div>
        <figure className="edh-casehero">
          <div className="edh-frame">
            <div className="edh-case-frame">
              <Image
                src={project.image}
                alt={c.imageAlt(project.title, headline)}
                {...projectImageSize(project.image)}
                priority
                sizes="(min-width: 80rem) 80rem, calc(100vw - 2.5rem)"
              />
            </div>
          </div>
        </figure>
      </section>

      <section className="edh-ch edh-ch--paper" aria-label={c.overview}>
        <div className="edh-frame edh-casebody">
          <aside className="edh-casebody-aside">
            <dl className="edh-spec">
              {project.problem ? (
                <div>
                  <dt>{c.spec.problem}</dt>
                  <dd>{project.problem}</dd>
                </div>
              ) : null}
              {role ? (
                <div>
                  <dt>{c.spec.role}</dt>
                  <dd>{role}</dd>
                </div>
              ) : null}
              <div className="edh-spec-half">
                <dt>{c.spec.stack}</dt>
                <dd>{project.tech.join(", ")}</dd>
              </div>
              {project.year ? (
                <div className="edh-spec-half">
                  <dt>{c.spec.year}</dt>
                  <dd>{project.year}</dd>
                </div>
              ) : null}
            </dl>
            {project.url ? (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="edh-link edh-case-live">
                {c.live}
              </a>
            ) : null}
          </aside>

          <article className="edh-casebody-main">
            <p className="edh-case-overview">{project.overview || project.description}</p>

            {project.approach ? (
              <section className="edh-case-section">
                <h2>{c.spec.delivery}</h2>
                <p>{project.approach}</p>
              </section>
            ) : null}

            {project.features?.length ? (
              <section className="edh-case-section">
                <h2>{c.features}</h2>
                <ul className="edh-rules edh-rules--two">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {gallery.length ? (
              <section className="edh-case-section">
                <h2>{c.gallery}</h2>
                <div className="edh-case-gallery">
                  {gallery.map((src, i) => (
                    <figure key={src}>
                      <div className="edh-case-frame">
                        <Image
                          src={src}
                          alt={insights?.galleryCaptions[i] ?? `${project.title}, ${c.gallery.toLowerCase()} ${i + 1}`}
                          {...projectImageSize(src)}
                          sizes="(min-width: 64rem) min(46rem, 55vw), calc(100vw - 2.5rem)"
                        />
                      </div>
                      {insights?.galleryCaptions[i] ? <figcaption className="edh-case-note">{insights.galleryCaptions[i]}</figcaption> : null}
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {capabilities?.length ? (
              <section className="edh-case-section">
                <h2>{c.output}</h2>
                <ul className="edh-rules">
                  {capabilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {insights ? (
              <>
                <section className="edh-case-section">
                  <h2>{insights.flowTitle}</h2>
                  <ol className="edh-flow">
                    {insights.flow.map((step) => (
                      <li key={step.title}>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </section>
                <section className="edh-case-section">
                  <h2>{insights.planningTitle}</h2>
                  <p>{insights.planningIntro}</p>
                  <ul className="edh-rules">
                    {insights.planning.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {service ? (
                    <Link href={service.href} hrefLang={service.ptOnly ? "pt-BR" : undefined} className="edh-link edh-case-live">
                      {serviceLabel}
                    </Link>
                  ) : null}
                </section>
                <section className="edh-case-section">
                  <h2>{insights.relatedTitle}</h2>
                  <ul className="edh-related">
                    {insights.related.map((item) => (
                      <li key={item.id}>
                        <Link href={`${base}/${item.id}`} className="edh-link">
                          {item.title}
                        </Link>
                        <p>{item.reason}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            ) : null}
          </article>
        </div>
      </section>

      <section className="edh-ch edh-ch--ink" aria-labelledby="edh-case-cta">
        <div className="edh-frame edh-closing">
          <h2 id="edh-case-cta" className="edh-closing-title">
            {c.ctaTitle}
          </h2>
          <p className="edh-closing-body">{c.ctaBody}</p>
          <div className="edh-actions">
            <Link href={hireHref(`case_${project.id}`, locale)} className="edh-cta">
              {t.cta}
            </Link>
          </div>
          <p className="edh-closing-alt">
            {t.workana}{" "}
            <WorkanaLink location={`case_${project.id}`} className="edh-link">
              {t.workanaLink}
            </WorkanaLink>
          </p>
          <div className="edh-author">
            <Image src={profile} alt="" sizes="4.5rem" placeholder="blur" />
            <div>
              <p className="edh-author-name">{c.authorTitle}</p>
              <p className="edh-author-body">{c.authorBody}</p>
            </div>
            <p className="edh-author-proof">
              {stats.projectsCompleted} {t.proof.projects}, {t.proof.rating} {rating}/5 ({stats.clientReviews} {t.proof.reviews}). {t.proof.checked}{" "}
              {stats.verifiedAtLabel}.
            </p>
          </div>
        </div>
      </section>

      <nav className="edh-ch edh-ch--paper" aria-label={c.all}>
        <div className="edh-frame">
          <div className="edh-casenav">
            {[
              { item: prev, label: c.prev, cls: "" },
              { item: next, label: c.next, cls: "edh-casenav-next" },
            ].map(({ item, label, cls }) => (
              <Link key={label} href={`${base}/${item.id}`} className={cls}>
                <span className="edh-casenav-thumb">
                  <Image src={item.image} alt="" fill sizes="7rem" />
                </span>
                <span>
                  <span className="edh-casenav-label">{label}</span>
                  <span className="edh-casenav-name">{item.title}</span>
                </span>
              </Link>
            ))}
          </div>
          <p className="edh-casenav-all">
            <Link href={base} className="edh-link">
              {c.all}
            </Link>
          </p>
        </div>
      </nav>
    </SitePage>
  );
}
