"use client";

import dynamic from "next/dynamic";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import SceneBoundary from "./SceneBoundary";
import type { StationMarkSpot, StationMode } from "./StationScene";
import { STATION_POINTS, STATION_SCREEN } from "./station";

const StationScene = dynamic(() => import("./StationScene"), { ssr: false });

// Quadros da própria cena, no mesmo enquadramento da câmera: o final
// (#render-station), o de abertura (#render-station-intro) e o de retrato.
const POSTER_DESKTOP = { src: "/images/redesign/station-desktop.webp", width: 2396, height: 1200 };
const POSTER_DESKTOP_INTRO = { src: "/images/redesign/station-desktop-intro.webp", width: 2396, height: 1200 };
const POSTER_MOBILE = { src: "/images/redesign/station-mobile.webp", width: 856, height: 1864 };

type Point = { n: number; title: string; body: string };

export type StationHeroCopy = {
  title: string[];
  lead: string;
  cta: string;
  ctaHref: string;
  secondary: string;
  explore: string;
  back: string;
  problem: string;
  onScreen: string;
  hint: string;
  pointLabel: string;
  of: string;
  next: string;
  note: string;
  link: string;
  shotAlt: string;
  project: { title: string; headline: string; problem: string; stack: string; href: string };
  before: string;
  after: string;
  points: Point[];
  modules: string[];
};

/**
 * Abertura com a bancada Passagens Europa. O pôster (quadro da própria cena)
 * é a primeira pintura e o fallback: mobile, tablet em retrato, movimento
 * reduzido e navegador sem WebGL ficam nele, e a estação abre o case do mesmo
 * jeito, com a tela plana e os mesmos pontos. No desktop, a cena 3D cobre o
 * pôster no mesmo quadro; abrir a estação aproxima a câmera, os bilhetes
 * entram na tela e cada ponto selecionado traz a câmera para perto dele.
 */
export default function StationHero({ copy }: { copy: StationHeroCopy }) {
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [introPose, setIntroPose] = useState(false);
  const [mode, setMode] = useState<StationMode>("overview");
  const [selected, setSelected] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  const section = useRef<HTMLElement>(null);
  const points = useRef<Record<number, HTMLButtonElement | null>>({});
  const trigger = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const toggled = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    const forced = hash.startsWith("#render-station");
    const wide = window.matchMedia("(min-width: 64rem) and (orientation: landscape)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      webgl = Boolean(document.createElement("canvas").getContext("webgl2"));
    } catch {
      webgl = false;
    }
    // Aparelho modesto ou economia de dados: fica o pôster, que é completo.
    const device = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const modest =
      Boolean(device.connection?.saveData) || (device.hardwareConcurrency ?? 8) < 4 || (device.deviceMemory ?? 8) < 4;
    if (!webgl || (!forced && (!wide || calm || modest))) return;

    const start = () => {
      setAnimate(!forced);
      setIntroPose(hash === "#render-station-intro");
      if (hash === "#render-station-focus") setMode("focus");
      setLive(true);
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 400);
    return () => clearTimeout(id);
  }, []);

  // Fora da tela, a cena não desenha nenhum quadro.
  useEffect(() => {
    const el = section.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Falha da cena: pôster e versão plana do case, sem perder o estado aberto.
  const fallBack = useCallback(() => {
    setLive(false);
    setReady(false);
  }, []);

  // A cena manda posições a cada quadro; o DOM é atualizado sem re-render.
  const placeTag = useCallback((x: number, y: number) => {
    const el = trigger.current;
    if (!el) return;
    el.style.setProperty("--tag-x", `${x.toFixed(1)}px`);
    el.style.setProperty("--tag-y", `${y.toFixed(1)}px`);
  }, []);
  const placePoints = useCallback((spots: StationMarkSpot[]) => {
    for (const spot of spots) {
      const el = points.current[spot.n];
      if (!el) continue;
      el.style.transform = `translate3d(${spot.x.toFixed(1)}px, ${spot.y.toFixed(1)}px, 0)`;
      const on = spot.on ? "true" : "false";
      if (el.dataset.on !== on) el.dataset.on = on;
    }
  }, []);
  const hoverStation = useCallback((hover: boolean) => {
    const el = trigger.current;
    if (el) el.dataset.hover = hover ? "true" : "false";
  }, []);

  const open = useCallback(() => {
    toggled.current = true;
    setMode("focus");
  }, []);
  const close = useCallback(() => {
    toggled.current = true;
    setMode("overview");
    setSelected(null);
  }, []);
  const choose = useCallback((n: number) => setSelected((current) => (current === n ? null : n)), []);
  const nextPoint = useCallback(() => setSelected((current) => ((current ?? 0) % STATION_POINTS.length) + 1), []);

  // Foco do teclado acompanha a troca: título do case ao abrir, rótulo ao voltar.
  useEffect(() => {
    if (!toggled.current) return;
    if (mode === "focus") heading.current?.focus({ preventScroll: true });
    else trigger.current?.focus({ preventScroll: true });
  }, [mode]);

  // A explicação do ponto escolhido fica à vista (no painel ou na página).
  useEffect(() => {
    if (selected === null) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    detail.current?.scrollIntoView({ block: "nearest", behavior: calm ? "auto" : "smooth" });
  }, [selected]);

  useEffect(() => {
    if (mode !== "focus") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, close]);

  const common = { alt: "", sizes: "100vw", fetchPriority: "high" as const, loading: "eager" as const };
  const { props: desktop } = getImageProps({ ...common, ...POSTER_DESKTOP });
  const {
    props: { srcSet: introSrcSet },
  } = getImageProps({ ...common, ...POSTER_DESKTOP_INTRO });
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...common, ...POSTER_MOBILE, quality: 75 });

  const focused = mode === "focus";
  const current = copy.points.find((p) => p.n === selected) ?? null;

  return (
    <section
      ref={section}
      className="edh-station"
      aria-labelledby="edh-station-title"
      data-mode={mode}
      data-live={live ? "true" : "false"}
      data-selected={selected ?? undefined}
    >
      <div className="edh-hall" data-ready={ready ? "true" : undefined}>
        <picture>
          <source media="(orientation: portrait)" srcSet={mobileSrcSet} />
          {/* Mesmas condições em que a cena ao vivo roda (WebGL à parte). */}
          <source media="(min-width: 64rem) and (prefers-reduced-motion: no-preference)" srcSet={introSrcSet} />
          <img {...desktop} alt="" className="edh-hall-poster" />
        </picture>
        {live && (
          <div className="edh-hall-live">
            <SceneBoundary onFail={fallBack}>
              <StationScene
                mode={mode}
                selected={selected}
                animate={animate}
                introPose={introPose}
                paused={!visible}
                labels={copy.modules}
                onReady={() => setReady(true)}
                onSelect={open}
                onFail={fallBack}
                onTag={placeTag}
                onMarks={placePoints}
                onHover={hoverStation}
              />
            </SceneBoundary>
          </div>
        )}
        {/* Pontos sobre a tela do monitor: atalho do mouse; o teclado usa os do painel. */}
        <div className="edh-station-points" aria-hidden="true">
          {copy.points.map((point) => (
            <button
              key={point.n}
              type="button"
              tabIndex={-1}
              className="edh-point"
              data-n={point.n}
              data-active={selected === point.n ? "true" : undefined}
              ref={(el) => {
                points.current[point.n] = el;
              }}
              onClick={() => choose(point.n)}
            >
              <span>{point.n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="edh-studio-scrim" aria-hidden="true" />

      <div className="edh-frame edh-studio-copy" inert={focused}>
        <h1 id="edh-station-title" className="edh-studio-title">
          {copy.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="edh-studio-lead">{copy.lead}</p>
        <div className="edh-actions">
          <Link href={copy.ctaHref} className="edh-cta">
            {copy.cta}
          </Link>
          <a href="#projetos" className="edh-link">
            {copy.secondary}
          </a>
        </div>
      </div>

      <button
        ref={trigger}
        type="button"
        className="edh-station-tag"
        aria-expanded={focused}
        aria-controls="edh-station-case"
        onClick={open}
        inert={focused}
      >
        <span className="edh-station-tag-dot" aria-hidden="true" />
        <span className="edh-station-tag-name">{copy.project.title}</span>
        <span className="edh-station-tag-action">{copy.explore}</span>
      </button>

      <section id="edh-station-case" className="edh-station-case" aria-labelledby="edh-station-case-title" inert={!focused}>
        <div className="edh-station-case-inner">
          <h2 id="edh-station-case-title" ref={heading} tabIndex={-1} className="edh-station-case-title">
            {copy.project.title}
          </h2>
          <p className="edh-station-case-headline">{copy.project.headline}</p>

          {/* Sem a cena ao vivo: a tela plana, com os mesmos pontos. */}
          <figure className="edh-station-shot">
            <div className="edh-station-shot-frame">
              <Image
                src={STATION_SCREEN.src}
                width={2616}
                height={1604}
                alt={copy.shotAlt}
                sizes="(min-width: 64rem) 30rem, 100vw"
                className="edh-station-shot-img"
              />
              <div aria-hidden="true">
                {STATION_POINTS.map((point) => (
                  <button
                    key={point.n}
                    type="button"
                    tabIndex={-1}
                    className="edh-station-shot-point"
                    data-active={selected === point.n ? "true" : undefined}
                    style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
                    onClick={() => choose(point.n)}
                  >
                    {point.n}
                  </button>
                ))}
              </div>
            </div>
          </figure>

          <h3 className="edh-station-case-label">{copy.problem}</h3>
          <p className="edh-station-case-text">{copy.project.problem}</p>
          <p className="edh-station-shift">
            <span>{copy.before}</span>
            <span>{copy.after}</span>
          </p>

          <h3 className="edh-station-case-label" id="edh-station-points-label">
            {copy.onScreen}
          </h3>
          <div className="edh-point-chips" role="group" aria-labelledby="edh-station-points-label">
            {copy.points.map((point) => (
              <button
                key={point.n}
                type="button"
                className="edh-point-chip"
                aria-pressed={selected === point.n}
                aria-label={`${copy.pointLabel} ${point.n}: ${point.title}`}
                onClick={() => choose(point.n)}
              >
                {point.n}
              </button>
            ))}
          </div>
          <div className="edh-point-detail" aria-live="polite" ref={detail}>
            {current ? (
              <>
                <p className="edh-point-title">
                  <span className="edh-point-count">
                    {current.n} {copy.of} {copy.points.length}
                  </span>
                  {current.title}
                </p>
                <p className="edh-point-body">{current.body}</p>
                <button type="button" className="edh-point-next" onClick={nextPoint}>
                  {copy.next}
                </button>
              </>
            ) : (
              <p className="edh-point-hint">{copy.hint}</p>
            )}
          </div>

          <p className="edh-station-stack">{copy.project.stack}</p>

          <div className="edh-station-case-actions">
            <Link href={copy.project.href} className="edh-cta">
              {copy.link}
            </Link>
            <button type="button" className="edh-station-back" onClick={close}>
              {copy.back}
            </button>
          </div>
        </div>
      </section>

      <p className="edh-studio-note">{copy.note}</p>
    </section>
  );
}
