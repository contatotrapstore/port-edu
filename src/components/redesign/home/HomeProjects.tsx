import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content.en";
import type { Locale } from "@/lib/locale";
import type { HomeCopy } from "./copy";
import { HOME_CASES } from "./media";

/**
 * Projetos selecionados. Problema, entrega, stack e ano vêm de getContent(),
 * a mesma fonte das páginas de case; aqui ficam o título editorial, o papel e
 * a nota que diz o que cada imagem é. Composição alterna escala e lado.
 */
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
            const alt: Record<string, string> = c.alt;
            const href = `${prefix}/projetos/${id}`;

            return (
              <article
                key={id}
                id={`caso-${id}`}
                className={`edh-case edh-case--${media.layout}`}
                aria-labelledby={`caso-${id}-title`}
              >
                <figure className="edh-case-media">
                  {media.layout === "lead" ? (
                    <div className="edh-demo">
                      <div className="edh-case-frame edh-demo-main">
                        <Image
                          src={media.crm}
                          alt={alt.crm}
                          placeholder="blur"
                          sizes="(min-width: 64rem) min(62vw, 52rem), calc(100vw - 2.5rem)"
                        />
                      </div>
                      <div className="edh-demo-phone">
                        <Image
                          src={media.chat}
                          alt={alt.chat}
                          placeholder="blur"
                          sizes="(min-width: 64rem) 13rem, 34vw"
                        />
                      </div>
                      <div className="edh-demo-ticket">
                        <Image
                          src={media.ticket}
                          alt={alt.ticket}
                          placeholder="blur"
                          sizes="(min-width: 64rem) 24rem, 58vw"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={media.detail ? "edh-case-shots edh-case-shots--pair" : "edh-case-shots"}>
                      <div className="edh-case-frame">
                        <Image
                          src={media.main}
                          alt={alt.main}
                          placeholder="blur"
                          sizes={
                            media.layout === "compact"
                              ? "(min-width: 64rem) 36rem, calc(100vw - 2.5rem)"
                              : "(min-width: 64rem) min(55vw, 46rem), calc(100vw - 2.5rem)"
                          }
                        />
                      </div>
                      {media.detail ? (
                        <div className="edh-case-frame edh-case-detail">
                          <Image
                            src={media.detail}
                            alt={alt.detail}
                            placeholder="blur"
                            sizes="(min-width: 64rem) 24rem, 72vw"
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                  <figcaption className="edh-case-note">{c.note}</figcaption>
                </figure>

                <div className="edh-case-body">
                  <p className="edh-case-kicker">{project.title}</p>
                  <h3 id={`caso-${id}-title`} className="edh-case-title">
                    {c.title}
                  </h3>
                  <dl className="edh-spec">
                    <div>
                      <dt>{t.spec.problem}</dt>
                      <dd>{project.problem ?? project.description}</dd>
                    </div>
                    <div>
                      <dt>{t.spec.delivery}</dt>
                      <dd>{project.approach ?? project.description}</dd>
                    </div>
                    <div>
                      <dt>{t.spec.role}</dt>
                      <dd>{c.role}</dd>
                    </div>
                    <div className="edh-spec-half">
                      <dt>{t.spec.stack}</dt>
                      <dd>{project.tech.join(", ")}</dd>
                    </div>
                    {project.year ? (
                      <div className="edh-spec-half">
                        <dt>{t.spec.year}</dt>
                        <dd>{project.year}</dd>
                      </div>
                    ) : null}
                  </dl>
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
