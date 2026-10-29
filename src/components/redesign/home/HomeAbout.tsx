import Image from "next/image";
import WorkanaLink from "@/components/workana/WorkanaLink";
import { getContent } from "@/lib/content.en";
import { workanaProfile as stats } from "@/lib/constants";
import type { Locale } from "@/lib/locale";
import profile from "../../../../public/images/profile.jpeg";
import type { HomeCopy } from "./copy";

/**
 * Provas reais: quem conduz o trabalho, os números públicos do perfil (com a
 * data em que foram conferidos) e duas avaliações citadas literalmente. Os
 * números vêm do snapshot central (workanaProfile); as avaliações, de
 * getContent(). O pico histórico de ranking fica de fora: a plataforma não o
 * confirma.
 */
export default function HomeAbout({ copy, locale }: { copy: HomeCopy; locale: Locale }) {
  const t = copy.about;
  const p = copy.proof;
  const en = locale === "en";
  const testimonials = getContent(locale).testimonials;
  const reviews = t.reviewAuthors.map((author) => {
    const review = testimonials.find((item) => item.author === author);
    if (!review) throw new Error(`Avaliação de ${author} não encontrada`);
    return review;
  });
  const checkedOn = en
    ? new Date(`${stats.verifiedAt}T12:00:00Z`).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : stats.verifiedAtLabel;
  const rating = en ? String(stats.rating) : stats.rating.toLocaleString("pt-BR");

  return (
    <section id="sobre" className="edh-ch edh-ch--paper edh-about" aria-labelledby="edh-about-title">
      <div className="edh-frame">
        <div className="edh-about-grid">
          <figure className="edh-about-photo">
            <Image src={profile} alt="" placeholder="blur" sizes="(min-width: 64rem) 22rem, min(22rem, 100vw - 2.5rem)" />
            <figcaption>{t.photoCaption}</figcaption>
          </figure>

          <div className="edh-about-text">
            <h2 id="edh-about-title" className="edh-ch-title">
              {t.title}
            </h2>
            <p className="edh-about-bio">{t.bio}</p>

            <dl className="edh-stats">
              <div>
                <dt>{p.projects}</dt>
                <dd>{stats.projectsCompleted}</dd>
              </div>
              <div>
                <dt>{p.rating}</dt>
                <dd>
                  {rating}
                  <small>/{stats.ratingMax}</small>
                </dd>
              </div>
              <div>
                <dt>{p.reviews}</dt>
                <dd>{stats.clientReviews}</dd>
              </div>
              <div>
                <dt>{p.level}</dt>
                <dd>{stats.level}</dd>
              </div>
            </dl>
            <p className="edh-stats-source">
              {p.source} {checkedOn}.{" "}
              <WorkanaLink location="home_sobre" className="edh-link">
                {p.sourceLink}
              </WorkanaLink>
            </p>
          </div>
        </div>

        <div className="edh-reviews" role="group" aria-labelledby="edh-reviews-title">
          <h3 id="edh-reviews-title" className="edh-reviews-title">
            {t.reviewsTitle}
          </h3>
          {reviews.map((review) => (
            <figure key={review.author} className="edh-review">
              <blockquote lang={en ? "pt-BR" : undefined}>
                <p>{review.text}</p>
              </blockquote>
              <figcaption>
                <span className="edh-review-author">{review.author}</span>
                <span>
                  {t.reviewFrom}, {review.projectType}, {review.date}
                </span>
              </figcaption>
            </figure>
          ))}
          {t.reviewNote ? <p className="edh-reviews-note">{t.reviewNote}</p> : null}
        </div>
      </div>
    </section>
  );
}
