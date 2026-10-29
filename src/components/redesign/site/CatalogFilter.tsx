"use client";

import { useEffect, useState, type ReactNode } from "react";

type Group = { id: string; label: string; count: number; content: ReactNode };
export default function CatalogFilter({ groups, en }: { groups: Group[]; en: boolean }) {
  const [active, setActive] = useState("all");
  useEffect(() => {
    const read = () => { const id = window.location.hash.replace("#tipo-", ""); setActive(groups.some(g => g.id === id) ? id : "all"); };
    read(); window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [groups]);
  const total = groups.reduce((sum, group) => sum + group.count, 0);
  const visible = active === "all" ? total : groups.find(g => g.id === active)?.count ?? total;
  return <>
    <nav className="edh-filter" aria-label={en ? "Filter projects" : "Filtrar projetos"}>
      {[{ id: "all", label: en ? "All work" : "Todos os projetos", count: total }, ...groups].map(g =>
        <a key={g.id} href={g.id === "all" ? "#catalogo" : `#tipo-${g.id}`} aria-current={active === g.id ? "true" : undefined}
          onClick={event => { event.preventDefault(); setActive(g.id); window.history.replaceState(null, "", g.id === "all" ? "#catalogo" : `#tipo-${g.id}`); }}>
          {g.label}<span>{g.count}</span>
        </a>)}
    </nav>
    <p className="edh-filter-count" role="status">{visible} {en ? "projects in view" : "projetos nesta seleção"}</p>
    {groups.map(g => <div key={g.id} hidden={active !== "all" && active !== g.id}>{g.content}</div>)}
  </>;
}
