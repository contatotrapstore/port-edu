import Link from "next/link";
import WorkanaLink from "@/components/workana/WorkanaLink";
import type { Locale } from "@/lib/locale";
import { getServiceCases, getServices } from "@/lib/services.en";
import { siteUrl } from "@/lib/site";
import SitePage from "./SitePage";
import ServiceCrop from "./ServiceCrop";
import { getSiteCopy } from "./copy";
import { hireHref, localePath } from "./paths";
import { getServicesCopy } from "./services-copy";

/** Índice de serviços no design novo: os três serviços, a dúvida comum e três cases. */
export default function ServicesIndex({ locale, title, description }: { locale: Locale; title: string; description: string }) {
  const site = getSiteCopy(locale);
  const t = getServicesCopy(locale).index;
  const services = getServices(locale);
  const cases = getServiceCases(locale);
  const base = localePath("/servicos", locale).href;
  const projects = localePath("/projetos", locale).href;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${siteUrl}${base}`, url: `${siteUrl}${base}`, name: title, description, inLanguage: locale === "en" ? "en" : "pt-BR" },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.crumbs.home, item: `${siteUrl}${localePath("/", locale).href}` },
          { "@type": "ListItem", position: 2, name: site.crumbs.services, item: `${siteUrl}${base}` },
        ],
      },
    ],
  };

  return (
    <SitePage locale={locale} ptPath="/servicos" current="servicos" source="servicos">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="edh-pagehead" aria-labelledby="edh-page-title">
        <div className="edh-frame">
          <nav aria-label={site.crumbs.label}>
            <ol className="edh-crumbs">
              <li>
                <Link href={localePath("/", locale).href}>{site.crumbs.home}</Link>
              </li>
              <li aria-current="page">{site.crumbs.services}</li>
            </ol>
          </nav>
          <p className="edh-pagehead-kicker">{t.kicker}</p>
          <h1 id="edh-page-title" className="edh-pagehead-title">
            {t.title}
          </h1>
          <p className="edh-pagehead-lead">{t.lead}</p>
        </div>
      </section>

      <section className="edh-ch edh-ch--paper" aria-labelledby="edh-svc-start">
        <div className="edh-frame">
          <div className="edh-sec">
            <h2 id="edh-svc-start" className="edh-sec-title">
              {t.startTitle}
            </h2>
            <ul className="edh-svc-rows">
              {services.map((service) => (
                <li key={service.slug} className="edh-svc-row">
                  <Link href={`${base}/${service.slug}`}>
                    <h3>{service.name}</h3>
                    <p>{service.indexDescription}</p>
                    <span className="edh-svc-row-go">{t.open}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="edh-sec edh-split">
            <h2 className="edh-sec-title">{t.decisionTitle}</h2>
            <div className="edh-split-text">
              {t.decision.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="edh-sec">
            <p className="edh-kicker">{t.casesKicker}</p>
            <h2 className="edh-sec-title">{t.casesTitle}</h2>
            <div className="edh-svc-cases">
              {["passagenseuropa", "mudapaisagens", "clinafy"].map((id) => {
                const project = cases[id];
                return (
                  <article key={id} className="edh-svc-case">
                    <figure>
                      <ServiceCrop project={project} sizes="(min-width: 64rem) 46rem, calc(100vw - 2.5rem)" />
                      <figcaption>{project.caption}</figcaption>
                    </figure>
                    <div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <Link href={`${projects}/${project.id}`} className="edh-link">
                        {getServicesCopy(locale).detail.caseLink(project.name)}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="edh-casenav-all">
              <Link href={projects} className="edh-link">
                {t.casesAll}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="edh-ch edh-ch--ink" aria-labelledby="edh-svc-closing">
        <div className="edh-frame edh-closing">
          <h2 id="edh-svc-closing" className="edh-closing-title">
            {t.closingTitle}
          </h2>
          <p className="edh-closing-body">{t.closingBody}</p>
          <div className="edh-actions">
            <Link href={hireHref("servicos", locale)} className="edh-cta">
              {site.cta}
            </Link>
          </div>
          <p className="edh-closing-alt">
            {site.workana}{" "}
            <WorkanaLink location="services_index_contact" className="edh-link">
              {site.workanaLink}
            </WorkanaLink>
          </p>
        </div>
      </section>
    </SitePage>
  );
}
