import Link from "next/link";
import { getContent } from "@/lib/content.en";
import type { Locale } from "@/lib/locale";
import { localePath } from "../site/paths";
import type { HomeCopy } from "./copy";

/**
 * Capacidades a partir do problema de quem contrata. Cada linha aponta para um
 * projeto entregue (o case logo acima, na mesma página) e para a página do
 * serviço na mesma língua (sem o site novo, ela só existe em português).
 */
export default function HomeSolutions({ copy, locale }: { copy: HomeCopy; locale: Locale }) {
  const t = copy.solutions;
  const projects = getContent(locale).projects;

  return (
    <section id="solucoes" className="edh-ch edh-ch--paper edh-solutions" aria-labelledby="edh-solutions-title">
      <div className="edh-frame">
        <div className="edh-ch-head edh-rise">
          <h2 id="edh-solutions-title" className="edh-ch-title">
            {t.title}
          </h2>
          <p className="edh-ch-intro">{t.intro}</p>
        </div>

        <ul className="edh-solution-list">
          {t.items.map((item) => {
            const project = projects.find((p) => p.id === item.caseId);
            if (!project) throw new Error(`Projeto ${item.caseId} não encontrado`);
            const service = localePath(item.service, locale);
            return (
              <li key={item.id} className="edh-solution">
                <h3 className="edh-solution-title">{item.title}</h3>
                <div className="edh-solution-body">
                  <p className="edh-solution-need">{item.need}</p>
                  <ul className="edh-solution-items">
                    {item.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div className="edh-solution-example">
                  <p>
                    <span className="edh-solution-label">{t.example}</span>
                    <a href={`#caso-${item.caseId}`} className="edh-link">
                      {project.title}
                    </a>
                  </p>
                  <Link href={service.href} hrefLang={service.ptOnly ? "pt-BR" : undefined} className="edh-link">
                    {service.ptOnly ? t.servicePtOnly : t.service}
                    <span className="edh-sr">: {item.title}</span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
