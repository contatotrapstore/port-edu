import Link from "next/link";
import WorkanaLink from "@/components/workana/WorkanaLink";
import { workanaProfile as stats } from "@/lib/constants";
import type { Locale } from "@/lib/locale";
import type { ServicePage } from "@/lib/services";
import { getServices } from "@/lib/services.en";
import { getServiceCases } from "./service-cases";
import { siteUrl } from "@/lib/site";
import SitePage from "./SitePage";
import ServiceCrop from "./ServiceCrop";
import { getSiteCopy } from "./copy";
import { hireHref, localePath } from "./paths";
import { getServicesCopy } from "./services-copy";

/**
 * Página de um serviço no design novo. Conteúdo de services.ts (ou da versão
 * em inglês): para quem é, a decisão de escopo, exemplos com critério de
 * aceite, um case relacionado, as etapas, as dúvidas e o que reunir antes da
 * conversa. O próximo passo é a página de contratação.
 */
export default function ServiceView({ service, locale }: { service: ServicePage; locale: Locale }) {
  const site = getSiteCopy(locale);
  const t = getServicesCopy(locale);
  const d = t.detail;
  const base = localePath("/servicos", locale).href;
  const url = `${siteUrl}${base}/${service.slug}`;
  const project = getServiceCases(locale)[service.caseId];
  const related = getServices(locale).filter((item) => item.slug !== service.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: service.metadataTitle, description: service.metadataDescription, inLanguage: locale === "en" ? "en" : "pt-BR" },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.crumbs.home, item: `${siteUrl}${localePath("/", locale).href}` },
          { "@type": "ListItem", position: 2, name: site.crumbs.services, item: `${siteUrl}${base}` },
          { "@type": "ListItem", position: 3, name: service.name, item: url },
        ],
      },
    ],
  };

  return (
    <SitePage locale={locale} ptPath={`/servicos/${service.slug}`} current="servicos" source={`servico_${service.slug}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="edh-pagehead" aria-labelledby="edh-page-title">
        <div className="edh-frame">
          <nav aria-label={site.crumbs.label}>
            <ol className="edh-crumbs">
              <li>
                <Link href={localePath("/", locale).href}>{site.crumbs.home}</Link>
              </li>
              <li>
                <Link href={base}>{site.crumbs.services}</Link>
              </li>
              <li aria-current="page">{service.name}</li>
            </ol>
          </nav>
          <h1 id="edh-page-title" className="edh-pagehead-title">
            {service.title}
          </h1>
          <p className="edh-pagehead-lead">{service.intro}</p>
          <div className="edh-actions">
            <Link href={hireHref(`servico_${service.slug}`, locale)} className="edh-cta">
              {site.cta}
            </Link>
            <a href="#escopo" className="edh-link">
              {d.scopeLink}
            </a>
          </div>
          <ul className="edh-proofstrip">
            <li>
              <b>{d.proofRole}</b>
            </li>
            <li>Workana {stats.level}</li>
            <li>
              <b>{stats.projectsCompleted}</b> {t.projects}
            </li>
            <li className="edh-proofstrip-source">
              {t.checked} {stats.verifiedAtLabel}
            </li>
          </ul>
        </div>
      </section>

      <section className="edh-ch edh-ch--paper" aria-labelledby="edh-svc-fit">
        <div className="edh-frame">
          <div className="edh-sec edh-split">
            <div>
              <h2 id="edh-svc-fit" className="edh-sec-title">
                {service.fitTitle}
              </h2>
              <ul className="edh-rules">
                {service.fit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="edh-aside-rule">
              <h3>{service.decisionTitle}</h3>
              <p>{service.decision}</p>
            </div>
          </div>

          <div id="escopo" className="edh-sec">
            <h2 className="edh-sec-title">{service.scopeTitle}</h2>
            <p className="edh-sec-intro">{d.scopeNote}</p>
            <ul className="edh-scope">
              {service.scopeExamples.map((example) => (
                <li key={example.title}>
                  <h3>{example.title}</h3>
                  <p>{example.description}</p>
                  <p className="edh-scope-accept">
                    <b>{d.accept}</b> {example.acceptance}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {project ? (
            <div className="edh-sec">
              <p className="edh-kicker">{d.caseKicker}</p>
              <h2 className="edh-sec-title">{d.caseTitle}</h2>
              <article className="edh-svc-case">
                <figure>
                  <ServiceCrop project={project} sizes="(min-width: 64rem) 46rem, calc(100vw - 2.5rem)" />
                  <figcaption>{project.caption}</figcaption>
                </figure>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <Link href={`${localePath("/projetos", locale).href}/${project.id}`} className="edh-link">
                    {d.caseLink(project.name)}
                  </Link>
                </div>
              </article>
            </div>
          ) : null}

          <div className="edh-sec">
            <h2 className="edh-sec-title">{d.processTitle}</h2>
            <ol className="edh-steps">
              {service.process.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="edh-sec">
            <h2 className="edh-sec-title">{d.questionsTitle}</h2>
            <div className="edh-faq">
              {service.questions.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="edh-ch edh-ch--ink" aria-labelledby="edh-svc-brief">
        <div className="edh-frame edh-brief">
          <div className="edh-closing">
            <h2 id="edh-svc-brief" className="edh-closing-title">
              {service.briefTitle}
            </h2>
            <div className="edh-actions">
              <Link href={hireHref(`servico_${service.slug}_fecho`, locale)} className="edh-cta">
                {site.cta}
              </Link>
            </div>
            <p className="edh-closing-alt">
              {site.workana}{" "}
              <WorkanaLink location={`service_${service.slug}_bottom`} className="edh-link">
                {site.workanaLink}
              </WorkanaLink>
              . {d.workanaChat}
            </p>
          </div>
          <div>
            <p className="edh-closing-body">{d.briefIntro}</p>
            <ul className="edh-rules">
              {service.brief.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="edh-ch edh-ch--paper" aria-labelledby="edh-svc-other">
        <div className="edh-frame">
          <h2 id="edh-svc-other" className="edh-sec-title">
            {d.otherTitle}
          </h2>
          <ul className="edh-svc-rows">
            {related.map((item) => (
              <li key={item.slug} className="edh-svc-row">
                <Link href={`${base}/${item.slug}`}>
                  <h3>{item.name}</h3>
                  <p>{item.indexDescription}</p>
                  <span className="edh-svc-row-go">{t.index.open}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SitePage>
  );
}
