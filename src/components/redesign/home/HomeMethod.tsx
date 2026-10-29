import Image from "next/image";
import passagensCrm from "../../../../public/images/redesign/passagens-crm-demo.webp";
import type { HomeCopy } from "./copy";

type Method = HomeCopy["method"];

/**
 * Como um projeto anda: cada etapa diz o que o cliente recebe e o que decide,
 * com o exemplo ilustrativo do que é entregue ao lado (escopo, prévia,
 * validação, operação), na altura natural do conteúdo. Nenhum exemplo é
 * documento de cliente: o escopo e os critérios usam o texto das páginas de
 * serviço, e a prévia é a recriação com dados fictícios.
 */
function Artifact({ t, index }: { t: Method; index: number }) {
  const a = t.artifacts;
  const tag = <p className="edh-art-tag">{t.illustrative}</p>;
  if (index === 0) {
    return (
      <div className="edh-art edh-art--doc">
        <div className="edh-art-head">
          <p className="edh-art-title">{a.scope.heading}</p>
          {tag}
        </div>
        <p className="edh-art-project">{a.scope.project}</p>
        <dl>
          {a.scope.rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="edh-art edh-art--browser">
        <div className="edh-art-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <p>{a.preview.bar}</p>
        </div>
        <Image src={passagensCrm} alt={a.preview.alt} placeholder="blur" sizes="(min-width: 64rem) 36rem, calc(100vw - 2.5rem)" />
        <p className="edh-art-foot">{a.preview.note}</p>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="edh-art edh-art--doc">
        <div className="edh-art-head">
          <p className="edh-art-title">{a.validation.heading}</p>
          {tag}
        </div>
        <ul className="edh-art-checks">
          {a.validation.items.map(([state, item]) => (
            <li key={item} data-state={state}>
              {item}
            </li>
          ))}
        </ul>
        <p className="edh-art-actions">
          {a.validation.actions.map((action) => (
            <span key={action}>{action}</span>
          ))}
        </p>
      </div>
    );
  }
  return (
    <div className="edh-art edh-art--doc">
      <div className="edh-art-head">
        <p className="edh-art-title">{a.operation.heading}</p>
        {tag}
      </div>
      <ul className="edh-art-handoff">
        {a.operation.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="edh-art-next">{a.operation.next}</p>
    </div>
  );
}

export default function HomeMethod({ method: t }: { method: Method }) {
  return (
    <section id="metodo" className="edh-ch edh-ch--ink" aria-labelledby="edh-method-title">
      <div className="edh-frame">
        <div className="edh-ch-head edh-rise">
          <h2 id="edh-method-title" className="edh-ch-title">
            {t.title}
          </h2>
          <p className="edh-ch-intro">{t.intro}</p>
        </div>

        <ol className="edh-process">
          {t.steps.map((step, i) => (
            <li key={step.id} className="edh-pstep">
              <div className="edh-pstep-text">
                <h3 className="edh-pstep-title">{step.title}</h3>
                <dl className="edh-pstep-pair">
                  <div>
                    <dt>{t.receive}</dt>
                    <dd>{step.receive}</dd>
                  </div>
                  <div>
                    <dt>{t.decide}</dt>
                    <dd>{step.decide}</dd>
                  </div>
                </dl>
              </div>
              <div className="edh-pstep-art">
                <Artifact t={t} index={i} />
              </div>
            </li>
          ))}
        </ol>

        <p className="edh-method-note">{t.note}</p>
      </div>
    </section>
  );
}
