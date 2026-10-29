"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Group = { id: string; label: string; count: number; content: ReactNode };

/** Traz o controle de volta à tela, só se ele ficou acima da área visível. */
function revealControl(el: HTMLElement | null) {
  if (!el || el.getBoundingClientRect().top >= 0) return;
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
}

/**
 * Filtro do catálogo. Sem JavaScript, os links levam às âncoras de cada grupo
 * e tudo aparece. Com JavaScript, esconde os outros grupos e, quando o filtro
 * muda (clique, link direto ou voltar do navegador), traz o controle de volta
 * à tela: a lista encolhe e o visitante não fica no rodapé.
 */
export default function CatalogFilter({ groups, en }: { groups: Group[]; en: boolean }) {
  const [active, setActive] = useState("all");
  const nav = useRef<HTMLElement>(null);

  const reveal = () => revealControl(nav.current);

  useEffect(() => {
    const read = (initial: boolean) => {
      const id = window.location.hash.replace("#tipo-", "");
      const next = groups.some((g) => g.id === id) ? id : "all";
      setActive(next);
      // Link direto para um grupo: o navegador rolou até ele na lista completa;
      // depois de filtrar, o lugar certo é o controle, logo acima do grupo.
      if (next !== "all" || !initial) requestAnimationFrame(() => revealControl(nav.current));
    };
    read(true);
    const onHash = () => read(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [groups]);

  const total = groups.reduce((sum, group) => sum + group.count, 0);
  const visible = active === "all" ? total : groups.find((g) => g.id === active)?.count ?? total;
  return (
    <>
      <nav ref={nav} id="catalogo" className="edh-filter" aria-label={en ? "Filter projects" : "Filtrar projetos"}>
        {[{ id: "all", label: en ? "All work" : "Todos os projetos", count: total }, ...groups].map((g) => (
          <a
            key={g.id}
            href={g.id === "all" ? "#catalogo" : `#tipo-${g.id}`}
            aria-current={active === g.id ? "true" : undefined}
            onClick={(event) => {
              event.preventDefault();
              setActive(g.id);
              // "Todos" limpa o hash: ao voltar de um case, o navegador devolve o
              // visitante ao card em que estava, não ao topo do catálogo.
              const url = g.id === "all" ? window.location.pathname + window.location.search : `#tipo-${g.id}`;
              window.history.replaceState(window.history.state, "", url);
              requestAnimationFrame(reveal);
            }}
          >
            {g.label}
            <span>{g.count}</span>
          </a>
        ))}
      </nav>
      <p className="edh-filter-count" role="status">
        {visible} {en ? "projects in view" : "projetos nesta seleção"}
      </p>
      <div className="edh-pgroups">
        {groups.map((g) => (
          <div key={g.id} className="edh-pgroups-item" hidden={active !== "all" && active !== g.id}>
            {g.content}
          </div>
        ))}
      </div>
      <p className="edh-filter-again">
        <a href="#catalogo" className="edh-link" onClick={(event) => { event.preventDefault(); reveal(); nav.current?.querySelector<HTMLAnchorElement>("[aria-current]")?.focus({ preventScroll: true }); }}>
          {en ? "Choose another category" : "Escolher outra categoria"}
        </a>
      </p>
    </>
  );
}
