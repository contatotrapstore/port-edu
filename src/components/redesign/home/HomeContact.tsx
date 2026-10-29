import Image from "next/image";
import Link from "next/link";
import WorkanaLink from "@/components/workana/WorkanaLink";
import type { Locale } from "@/lib/locale";
import { hireHref, localePath } from "../site/paths";
import type { HomeCopy } from "./copy";

/**
 * Fecho com um próximo passo claro. O contato direto vai para /contratar (o
 * canal comercial que já existe, com a origem no parâmetro src); a Workana
 * fica como alternativa identificada. Os passos repetem os da /contratar, para
 * a promessa da home continuar igual na página de contato.
 */
export default function HomeContact({ copy, source, locale }: { copy: HomeCopy; source: string; locale: Locale }) {
  const t = copy.contact;
  const ptOnly = localePath("/contratar", locale).ptOnly;
  return (
    <section id="contato" className="edh-ch edh-ch--ink edh-contact" aria-labelledby="edh-contact-title">
      <div className="edh-frame edh-contact-inner">
        <div className="edh-contact-text edh-rise">
          <h2 id="edh-contact-title" className="edh-contact-title">
            {t.title}
          </h2>
          <p className="edh-contact-body">{t.body}</p>
          <ol className="edh-contact-steps">
            {t.steps.map((step, i) => (
              <li key={step}>
                <span aria-hidden="true">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="edh-actions">
            <Link href={hireHref(source, locale)} hrefLang={ptOnly ? "pt-BR" : undefined} className="edh-cta">
              {t.cta}
            </Link>
          </div>
          <p className="edh-contact-channel">{ptOnly ? t.channelPtOnly : t.channel}</p>
          <p className="edh-contact-alt">
            {t.workana}{" "}
            <WorkanaLink location="home_contato" className="edh-link">
              {t.workanaLink}
            </WorkanaLink>
          </p>
        </div>
        <Image
          src="/brand/edevshub-simbolo.png"
          width={470}
          height={470}
          sizes="15rem"
          alt=""
          className="edh-contact-mark"
        />
      </div>
    </section>
  );
}
