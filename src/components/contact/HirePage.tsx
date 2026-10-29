import "@/components/redesign/redesign.css";
import "@/components/redesign/home/home.css";
import "@/components/redesign/site/site.css";
import Image from "next/image";
import Link from "next/link";
import DirectContact from "@/components/contact/DirectContact";
import { getRedesignCopy } from "@/components/redesign/copy";
import { plexMono, plexSans } from "@/components/redesign/fonts";
import { localePath } from "@/components/redesign/site/paths";
import { siteConfig } from "@/lib/constants";
import { getContent } from "@/lib/content.en";
import type { Locale } from "@/lib/locale";
import { siteUrl } from "@/lib/site";
import { getHireContent } from "./hire-content";

/**
 * Página de contratação no design novo (/contratar e /en/contratar).
 *
 * Continua sendo a landing do tráfego pago e a única superfície com contato
 * direto: mesmo DirectContact (WhatsApp com a origem do clique), mesmo pixel e
 * os mesmos eventos. Cabeçalho mínimo de propósito: marca, uma âncora e o
 * idioma, sem menu que leve o visitante para fora da conversão.
 */
export default function HirePage({ locale }: { locale: Locale }) {
  const copy = getRedesignCopy(locale);
  const t = getHireContent(locale);
  const en = locale === "en";
  const page = en ? "contratar_en" : "contratar";
  const testimonials = getContent(locale).testimonials;
  const otherHref = en ? "/contratar" : localePath("/contratar", "en").href;
  const privacy = localePath("/politica-de-privacidade", locale).href;
  const self = `${siteUrl}${localePath("/contratar", locale).href}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: en ? "Eduardo Gouveia, custom software development" : "Eduardo Gouveia — desenvolvimento de software sob medida",
        url: self,
        areaServed: "BR",
        priceRange: "$$",
        provider: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "FAQPage",
        inLanguage: en ? "en" : "pt-BR",
        mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div id="topo" className={`edh edh-home edh-site edh-hire ${plexSans.variable} ${plexMono.variable}`} lang={copy.lang} data-scroll-page>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <a href="#conteudo" className="edh-skip">
        {copy.skip}
      </a>
      <header className="edh-header">
        <div className="edh-frame edh-header-row">
          <a href="#topo" className="edh-brand" aria-label={t.topLabel}>
            <Image src="/brand/edevshub-simbolo.png" width={470} height={470} sizes="32px" alt="" className="edh-brand-mark" />
            <span className="edh-brand-name">EDevsHub</span>
          </a>
          <nav className="edh-hire-nav" aria-label={copy.nav.label}>
            <a href="#solucoes">{t.navAnchor}</a>
            <Link href={otherHref} hrefLang={copy.nav.language.hrefLang} lang={copy.nav.language.hrefLang} className="edh-lang">
              {copy.nav.language.label}
              <span className="edh-sr"> ({copy.nav.language.name})</span>
            </Link>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <section className="edh-hire-hero" aria-labelledby="edh-hire-title">
          <div className="edh-frame edh-hire-grid">
            <div>
              <h1 id="edh-hire-title" className="edh-hire-title">
                {t.heroTitle[0]} <span>{t.heroTitle[1]}</span>
              </h1>
              <p className="edh-hire-lede">
                {t.heroLede.before}
                <strong>{t.heroLede.price}</strong>
                {t.heroLede.after}
              </p>
              <DirectContact page={`${page}_topo`} variant="hero" locale={locale} />
              <p className="edh-hire-proof">
                <Image src="/images/profile.webp" alt="" width={112} height={112} priority />
                <span>
                  <strong>Eduardo Gouveia</strong>
                  {t.proof}. {t.proofDate}.
                </span>
              </p>
            </div>
            <figure className="edh-hire-art">
              <div className="edh-case-frame">
                <Image src="/images/lp/rei-painel.webp" alt={t.heroAlt} width={830} height={517} priority sizes="(min-width: 64rem) 36rem, calc(100vw - 2.5rem)" />
              </div>
              <figcaption>{t.heroCaption}</figcaption>
            </figure>
          </div>
        </section>

        <section className="edh-ch edh-ch--paper" aria-labelledby="edh-hire-needs">
          <div className="edh-frame">
            <div className="edh-sec">
              <h2 id="edh-hire-needs" className="edh-sec-title">
                {t.needsTitle}
              </h2>
              <ul className="edh-needs">
                {t.needs.map((need) => (
                  <li key={need.t}>
                    <h3>{need.t}</h3>
                    <p>{need.d}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div id="solucoes" className="edh-sec">
              <h2 className="edh-sec-title">{t.offersTitle}</h2>
              <p className="edh-sec-intro">{t.offersNote}</p>
              <ul className="edh-offers">
                {t.offers.map((offer) => (
                  <li key={offer.id} className="edh-offer">
                    <div className="edh-offer-head">
                      <h3>{offer.name}</h3>
                      <p className="edh-offer-meta">
                        <span className="edh-offer-price">{offer.range}</span>
                        <span>{offer.term}</span>
                      </p>
                    </div>
                    <div className="edh-offer-body">
                      <p className="edh-offer-promise">{offer.promise}</p>
                      <ul className="edh-offer-scope">
                        {offer.scope.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className="edh-offer-not">
                        {t.notFor} {offer.notFor}.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div id="cases" className="edh-sec">
              <h2 className="edh-sec-title">{t.casesTitle}</h2>
              <ul className="edh-hire-cases">
                {t.cases.map((item) => (
                  <li key={item.id} className="edh-hire-case">
                    <div className="edh-case-frame">
                      <Image src={item.image} alt={item.alt} width={item.width} height={item.height} sizes="(min-width: 64rem) 24rem, calc(100vw - 2.5rem)" />
                    </div>
                    <h3>{item.title}</h3>
                    <p className="edh-hire-case-type">{item.category}</p>
                    <p>{item.description}</p>
                    <ul>
                      {item.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <p className="edh-hire-note">{t.casesNote}</p>
            </div>
          </div>
        </section>

        <section className="edh-ch edh-ch--ink" aria-labelledby="edh-hire-quotes">
          <div className="edh-frame">
            <h2 id="edh-hire-quotes" className="edh-sec-title">
              {t.quotesTitle}
            </h2>
            <ul className="edh-quotes">
              {t.quotes.map((quote) => {
                const review = testimonials.find((item) => item.author === quote.author);
                return (
                  <li key={quote.author}>
                    <figure>
                      <blockquote lang="pt-BR">
                        <p>{quote.text}</p>
                      </blockquote>
                      <figcaption>
                        <strong>{quote.author}</strong>
                        {review ? <span>{en ? `${review.projectType}, ${review.date}` : `${review.project}, ${review.date}`}</span> : null}
                      </figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
            <p className="edh-hire-note">
              {t.quotesNote} {t.quotesLang}
            </p>
          </div>
        </section>

        <section className="edh-ch edh-ch--paper" aria-labelledby="edh-hire-steps">
          <div className="edh-frame">
            <div className="edh-sec">
              <h2 id="edh-hire-steps" className="edh-sec-title">
                {t.stepsTitle}
              </h2>
              <ol className="edh-steps">
                {t.steps.map((step) => (
                  <li key={step.t}>
                    <h3>{step.t}</h3>
                    <p>{step.d}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="edh-sec edh-hire-faq">
              <div className="edh-hire-no">
                <h2 className="edh-sec-title">{t.noTitle}</h2>
                <ul className="edh-rules">
                  {t.no.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{t.noNote}</p>
              </div>
              <div className="edh-faq-wrap">
                <h2 className="edh-sr">{t.faqLabel}</h2>
                <div className="edh-faq">
                  {t.faq.map((item) => (
                    <details key={item.q} name="faq">
                      <summary>{item.q}</summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="orcamento" className="edh-ch edh-ch--ink edh-hire-final" aria-labelledby="edh-hire-final">
          <div className="edh-frame edh-closing">
            <h2 id="edh-hire-final" className="edh-closing-title">
              {t.finalTitle}
            </h2>
            <p className="edh-closing-body">{t.finalBody}</p>
            <DirectContact page={`${page}_final`} variant="final" locale={locale} />
          </div>
        </section>
      </main>

      <footer className="edh-hire-footer">
        <div className="edh-frame">
          <span>© {new Date().getFullYear()} EDevsHub</span>
          <nav aria-label={en ? "Footer" : "Rodapé"}>
            <a href="#cases">{t.footerCases}</a>
            <a href="#orcamento">{t.footerQuote}</a>
            {/* Nova aba, como no rodapé do resto do site: a landing continua aberta. */}
            {siteConfig.social.instagram ? (
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            ) : null}
            <Link href={privacy}>{t.footerPrivacy}</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
