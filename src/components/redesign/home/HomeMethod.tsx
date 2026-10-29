"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import passagensCrm from "../../../../public/images/redesign/passagens-crm-demo.webp";
import type { HomeCopy } from "./copy";

type Method = HomeCopy["method"];

/**
 * Como um projeto anda: cada etapa diz o que o cliente recebe e o que decide,
 * com um exemplo ilustrativo do que é entregue (escopo, prévia, validação,
 * operação). No desktop, o exemplo fica num painel fixo que acompanha a etapa
 * em leitura; sem JavaScript, ou no celular, cada exemplo aparece junto da sua
 * etapa. Nenhum exemplo é documento de cliente: o escopo e os critérios usam
 * o texto das páginas de serviço, e a prévia é a recriação com dados fictícios.
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

// Recebe só o bloco do método: componente de cliente serializa as props na página.
export default function HomeMethod({ method: t }: { method: Method }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // Com JavaScript, o painel fixo assume no desktop (ver home.css).
    root.current?.classList.add("is-enhanced");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      // A etapa vira a ativa quando cruza a faixa central da tela.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const step of steps.current) if (step) observer.observe(step);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="metodo" className="edh-ch edh-ch--ink" aria-labelledby="edh-method-title">
      <div className="edh-frame">
        <div className="edh-ch-head edh-rise">
          <h2 id="edh-method-title" className="edh-ch-title">
            {t.title}
          </h2>
          <p className="edh-ch-intro">{t.intro}</p>
        </div>

        <div ref={root} className="edh-process">
          <ol className="edh-process-steps">
            {t.steps.map((step, i) => (
              <li
                key={step.id}
                ref={(node) => {
                  steps.current[i] = node;
                }}
                data-index={i}
                className={i === active ? "edh-pstep is-active" : "edh-pstep"}
              >
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
                <div className="edh-pstep-art">
                  <Artifact t={t} index={i} />
                </div>
              </li>
            ))}
          </ol>
          {/* Painel do desktop: repete os exemplos acima, por isso fica fora da árvore de acessibilidade. */}
          <div className="edh-process-stage" aria-hidden="true">
            {t.steps.map((step, i) => (
              <div key={step.id} className={i === active ? "edh-stage-item is-active" : "edh-stage-item"}>
                <Artifact t={t} index={i} />
              </div>
            ))}
          </div>
        </div>

        <p className="edh-method-note">{t.note}</p>
      </div>
    </section>
  );
}
