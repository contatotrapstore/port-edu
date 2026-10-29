import type { StaticImageData } from "next/image";
import ZoomImage from "../site/ZoomImage";

function CaseImage({ src, alt, sizes, en }: { src: StaticImageData; alt: string; sizes: string; en: boolean }) {
  return <div style={{ maxWidth: src.width, marginInline: "auto" }}><ZoomImage src={src.src} width={src.width} height={src.height} alt={alt} sizes={sizes} en={en} /></div>;
}
import Link from "next/link";
import { getContent } from "@/lib/content.en";
import type { Locale } from "@/lib/locale";
import type { HomeCopy } from "./copy";
import { HOME_CASES, type HomeCaseMedia } from "./media";

/**
 * Projetos selecionados, um por tipo de trabalho. Cada um aparece do jeito que
 * melhor demonstra o que foi feito (ver media.ts); o texto fica curto e a
 * ficha completa continua na página do case. Ano vem de getContent(), a mesma
 * fonte do portfólio.
 */
function CaseMedia({ media, alt, locale }: { media: HomeCaseMedia; alt: Record<string, string>; locale: Locale }) {
  switch (media.layout) {
    case "lead":
      return (
        <div className="edh-demo">
          <div className="edh-case-frame edh-demo-main">
            <CaseImage en={locale === "en"} src={media.crm} alt={alt.crm} sizes="(min-width: 64rem) min(62vw, 52rem), calc(100vw - 2.5rem)" />
          </div>
          <div className="edh-demo-phone">
            <CaseImage en={locale === "en"} src={media.chat} alt={alt.chat} sizes="(min-width: 64rem) 13rem, 34vw" />
          </div>
          <div className="edh-demo-ticket">
            <CaseImage en={locale === "en"} src={media.ticket} alt={alt.ticket} sizes="(min-width: 64rem) 24rem, 58vw" />
          </div>
        </div>
      );
    case "system":
    case "flow":
      return (
        <div className="edh-case-frame">
          <CaseImage en={locale === "en"} src={media.main} alt={alt.main} sizes="(min-width: 80rem) 80rem, calc(100vw - 2.5rem)" />
        </div>
      );
    case "product":
      return (
        <div className="edh-case-shots edh-case-shots--pair">
          <div className="edh-case-frame">
            <CaseImage en={locale === "en"} src={media.main} alt={alt.main} sizes="(min-width: 64rem) min(55vw, 46rem), calc(100vw - 2.5rem)" />
          </div>
          <div className="edh-case-frame edh-case-detail">
            <CaseImage en={locale === "en"} src={media.detail} alt={alt.detail} sizes="(min-width: 64rem) 24rem, 72vw" />
          </div>
        </div>
      );
    case "store":
      return (
        // No celular a fileira rola na horizontal: focável para quem navega pelo teclado.
        <div className="edh-store" tabIndex={0} role="group" aria-label={alt.group}>
          {media.shots.map((shot) => (
            <div key={shot.key} className="edh-case-frame edh-store-shot">
              <CaseImage en={locale === "en"} src={shot.image} alt={alt[shot.key]} sizes="(min-width: 64rem) 27rem, 78vw" />
            </div>
          ))}
        </div>
      );
  }
}

export default function HomeProjects({ copy, locale }: { copy: HomeCopy; locale: Locale }) {
  const t = copy.projects;
  const projects = getContent(locale).projects;
  const prefix = locale === "en" ? "/en" : "";

  return (
    <section id="projetos" className="edh-ch edh-ch--paper edh-projects" aria-labelledby="edh-projects-title">
      <div className="edh-frame">
        <div className="edh-ch-head edh-rise">
          <h2 id="edh-projects-title" className="edh-ch-title">
            {t.title}
          </h2>
          <p className="edh-ch-intro">{t.intro}</p>
        </div>

        <div className="edh-cases">
          {HOME_CASES.map(({ id, media }) => {
            const project = projects.find((p) => p.id === id);
            if (!project) throw new Error(`Projeto ${id} não encontrado`);
            const c = t.cases[id];
            const href = `${prefix}/projetos/${id}`;
            const flow = media.layout === "flow";

            return (
              <article key={id} id={`caso-${id}`} className={`edh-case edh-case--${media.layout}`} aria-labelledby={`caso-${id}-title`}>
                <figure className="edh-case-media">
                  <CaseMedia media={media} alt={c.alt} locale={locale} />
                  {media.layout === "store" ? (
                    <ol className="edh-store-steps" aria-label={c.kind}>
                      {c.look.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  ) : null}
                  <figcaption className="edh-case-note">{c.note}</figcaption>
                </figure>

                <div className="edh-case-body">
                  <p className="edh-case-kicker">{c.kind}</p>
                  <h3 id={`caso-${id}-title`} className="edh-case-title">
                    {c.title}
                  </h3>
                  <p className="edh-case-lede">{c.summary}</p>
                  {flow ? (
                    <ol className="edh-flow">
                      {c.look.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ) : media.layout !== "store" ? (
                    <div className="edh-case-look">
                      <p>{t.look}</p>
                      <ul>
                        {c.look.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <p className="edh-case-meta">
                    {project.title}
                    {project.year ? `, ${project.year}` : ""}. {c.role}.
                  </p>
                  <Link href={href} className="edh-link edh-case-link">
                    {t.open}
                    <span className="edh-sr">: {project.title}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="edh-projects-foot">
          <p>{t.allNote}</p>
          <Link href={`${prefix}/projetos`} className="edh-link edh-case-link">
            {t.all}
          </Link>
        </div>
      </div>
    </section>
  );
}
