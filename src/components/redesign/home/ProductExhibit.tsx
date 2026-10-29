"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Locale } from "@/lib/locale";
import "./exhibit.css";

const copy = {
  pt: {
    eyebrow: "Em foco / PlanetShake", title: "Um planeta de dados.\nUma interface para explorar.",
    lead: "Do mapa global ao celular. Explore três decisões de interface de um produto web e Android.",
    modes: ["Web", "Android"], steps: ["Encontrar no mapa", "Ler a intensidade", "Consultar o histórico"],
    notes: ["Posição, cor e tamanho organizam os eventos no espaço. O mapa dá contexto antes de apresentar os detalhes.", "A legenda torna a codificação visual explícita. No app, a lista permite comparar magnitude, local e horário.", "O produto oferece uma visão histórica além dos eventos recentes. No Android, ela tem sua própria tela."],
    note: "Visita guiada com capturas reais. Dados registrados nas telas; não é monitoramento ao vivo nem alerta oficial.",
    full: "Conhecer o projeto", overview: "Visão geral", hint: "Escolha um ponto para aproximar", next: "Próximo ponto",
    start: "Comece pelo ponto 1 ou escolha uma etapa da lista.",
  },
  en: {
    eyebrow: "In focus / PlanetShake", title: "A planet of data.\nAn interface to explore.",
    lead: "From the global map to your phone. Explore three interface decisions in a web and Android product.",
    modes: ["Web", "Android"], steps: ["Locate on the map", "Read the intensity", "Explore the history"],
    notes: ["Position, color and size organize events in space. The map provides context before the detail.", "The legend makes the visual encoding explicit. In the app, a list helps compare magnitude, location and time.", "The product offers a historical view beyond recent events. On Android it has its own screen."],
    note: "A guided visit using real captures. Data recorded in the screens; not live monitoring or an official alert.",
    full: "Explore the project", overview: "Overview", hint: "Choose a point to get closer", next: "Next point",
    start: "Start with point 1 or pick a step from the list.",
  },
};

export default function ProductExhibit({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [mode, setMode] = useState(0);
  const [point, setPoint] = useState(-1);
  const stepButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const shot = mode ? `/images/portfolio-2026/planet-${point < 1 ? 1 : point + 1}.png` : point === 2 ? "/images/portfolio-2026/planet-history.png" : "/images/portfolio-2026/planetshake.png";
  return <section className="edh-exhibit" aria-labelledby="exhibit-title" id="explorar-produto">
    <div className="edh-frame">
      <div className="edh-exhibit-heading"><p>{c.eyebrow}</p><h2 id="exhibit-title">{c.title}</h2><p>{c.lead}</p></div>
      <div className="edh-exhibit-console">
        <div className="edh-exhibit-toolbar">
          <span>PLANETSHAKE <i aria-hidden="true" /> EDEVSHUB</span>
          <div role="group" aria-label={locale === "en" ? "Platform" : "Plataforma"}>
            {c.modes.map((name, i) => <button key={name} type="button" aria-pressed={mode === i} onClick={() => setMode(i)}>{name}</button>)}
          </div>
        </div>
        <div className="edh-exhibit-workspace">
          <div className={`edh-exhibit-screen ${mode ? "is-phone" : "is-web"}`} data-point={point}>
            <Image src={shot} width={mode ? 1080 : 1905} height={mode ? 1920 : 894} alt={`PlanetShake — ${c.modes[mode]} — ${point < 0 ? c.overview : c.steps[point]}`} sizes={mode ? "340px" : "(min-width: 64rem) 70vw, 100vw"} />
            {!mode && point < 0 ? <div className="edh-exhibit-points">{c.steps.map((name, i) => <button key={name} type="button" onClick={() => { setPoint(i); stepButtons.current[i]?.focus({ preventScroll: true }); }} aria-label={`${i + 1}. ${name}`}>{i + 1}</button>)}</div> : null}
          </div>
          <aside className="edh-exhibit-controls">
            <p className="edh-exhibit-hint">{c.hint}</p>
            <div role="group" aria-label={locale === "en" ? "Interface tour" : "Visita à interface"}>
              {c.steps.map((name, i) => <button key={name} ref={node => { stepButtons.current[i] = node; }} aria-pressed={point === i} onClick={() => setPoint(i)}><span>0{i + 1}</span>{name}<b aria-hidden="true">↗</b></button>)}
            </div>
            <p className="edh-exhibit-explanation" aria-live="polite">{point >= 0 ? c.notes[point] : c.start}</p>
            <div className="edh-exhibit-actions"><button onClick={(event) => { setPoint(-1); (event.currentTarget.nextElementSibling as HTMLButtonElement | null)?.focus(); }} disabled={point < 0}>{c.overview}</button><button onClick={() => setPoint((point + 1) % 3)}>{c.next} →</button></div>
            <Link href={`${locale === "en" ? "/en" : ""}/projetos/planetshake`}>{c.full} ↗</Link>
          </aside>
        </div>
        <p className="edh-exhibit-note">{c.note}</p>
      </div>
    </div>
  </section>;
}
