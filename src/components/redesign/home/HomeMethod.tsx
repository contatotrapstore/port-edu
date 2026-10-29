import type { HomeCopy } from "./copy";

/**
 * Método em quatro etapas sobre um trilho com a geometria da marca: as hastes
 * nas pontas (começo e entrega) e o ponto âmbar percorrendo as etapas ao
 * rolar. Sem rolagem animada, o ponto fica no início e a leitura é a mesma.
 */
export default function HomeMethod({ copy }: { copy: HomeCopy }) {
  const t = copy.method;
  return (
    <section id="metodo" className="edh-ch edh-ch--ink" aria-labelledby="edh-method-title">
      <div className="edh-frame">
        <div className="edh-ch-head edh-rise">
          <h2 id="edh-method-title" className="edh-ch-title">
            {t.title}
          </h2>
          <p className="edh-ch-intro">{t.intro}</p>
        </div>

        <div className="edh-method">
          <span className="edh-method-rail" aria-hidden="true">
            <span className="edh-method-dot" />
          </span>
          <ol className="edh-method-track">
            {t.steps.map((step) => (
              <li key={step.n} className="edh-step">
                <span className="edh-step-n" aria-hidden="true">
                  {step.n}
                </span>
                <h3 className="edh-step-title">{step.title}</h3>
                <p className="edh-step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="edh-method-note">{t.note}</p>
      </div>
    </section>
  );
}
