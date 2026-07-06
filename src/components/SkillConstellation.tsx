"use client";

import { useMemo, useState } from "react";
import { skills, projects, catColors, type Project, type Skill } from "@/lib/constants";

const W = 820;
const H = 440;

// Deterministic polar clusters per category (no runtime physics — light and stable).
const CLUSTERS: Record<Skill["category"], { cx: number; cy: number; label: string }> = {
  frontend: { cx: 215, cy: 128, label: "frontend" },
  backend: { cx: 610, cy: 128, label: "backend" },
  devops: { cx: 215, cy: 328, label: "devops" },
  tools: { cx: 610, cy: 328, label: "plataformas" },
};

type Node = Skill & { x: number; y: number; r: number };

function normalize(name: string) {
  return name.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
}

function relatedProjects(skill: string): Project[] {
  const n = normalize(skill);
  return projects.filter((p) =>
    p.tech.some((t) => {
      const tn = normalize(t);
      return tn === n || tn.includes(n) || n.includes(tn);
    })
  );
}

export default function SkillConstellation({
  onOpenCase,
}: {
  onOpenCase: (p: Project) => void;
}) {
  const [active, setActive] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => {
    const byCat: Record<string, Node[]> = { frontend: [], backend: [], devops: [], tools: [] };
    const nodes: Node[] = [];

    (Object.keys(CLUSTERS) as Skill["category"][]).forEach((cat) => {
      const list = skills.filter((s) => s.category === cat);
      const { cx, cy } = CLUSTERS[cat];
      list.forEach((s, i) => {
        const angle = (i / list.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 62 + (i % 3) * 18;
        const node: Node = {
          ...s,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius * 0.72,
          r: 5 + s.level * 7,
        };
        byCat[cat].push(node);
        nodes.push(node);
      });
    });

    // Edges: ring inside each cluster + bridges between the strongest node of each cluster.
    const edges: Array<[Node, Node]> = [];
    Object.values(byCat).forEach((list) => {
      for (let i = 0; i < list.length; i++) edges.push([list[i], list[(i + 1) % list.length]]);
    });
    const hubs = Object.values(byCat).map(
      (list) => [...list].sort((a, b) => b.level - a.level)[0]
    );
    for (let i = 0; i < hubs.length; i++) edges.push([hubs[i], hubs[(i + 1) % hubs.length]]);

    return { nodes, edges };
  }, []);

  const activeNode = nodes.find((n) => n.name === active) ?? null;
  const related = activeNode ? relatedProjects(activeNode.name) : [];
  const isNeighbor = (n: Node) =>
    !!activeNode &&
    (n.name === activeNode.name ||
      edges.some(
        ([a, b]) =>
          (a.name === activeNode.name && b.name === n.name) ||
          (b.name === activeNode.name && a.name === n.name)
      ));

  return (
    <div>
      {/* Desktop constellation — sized to fit the viewport (no inner scroll = fluid chapter hand-off) */}
      <div
        className="relative hidden md:block max-w-[880px] mx-auto"
        onMouseLeave={() => setActive(null)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto select-none"
          role="group"
          aria-label="Constelação de tecnologias"
        >
          {/* edges */}
          {edges.map(([a, b], i) => {
            const hot =
              active && (a.name === active || b.name === active);
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={hot ? catColors[a.category] : "#ffffff"}
                strokeOpacity={hot ? 0.5 : active ? 0.04 : 0.1}
                strokeWidth={hot ? 1.2 : 1}
              />
            );
          })}
          {/* cluster labels */}
          {(Object.keys(CLUSTERS) as Skill["category"][]).map((cat) => (
            <text
              key={cat}
              x={CLUSTERS[cat].cx}
              y={CLUSTERS[cat].cy}
              textAnchor="middle"
              className="font-[family-name:var(--font-jetbrains-mono)]"
              fill={catColors[cat]}
              fillOpacity={active ? 0.25 : 0.5}
              fontSize="11"
              letterSpacing="3"
            >
              {`{ ${CLUSTERS[cat].label} }`}
            </text>
          ))}
          {/* nodes */}
          {nodes.map((n) => {
            const dim = active && !isNeighbor(n);
            return (
              <g key={n.name}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r + 6}
                  fill={catColors[n.category]}
                  fillOpacity={active === n.name ? 0.18 : 0}
                  className="motion-safe:animate-pulse"
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={catColors[n.category]}
                  fillOpacity={dim ? 0.15 : 0.85}
                  stroke="#0a0a0a"
                  strokeWidth="2"
                />
                <text
                  x={n.x}
                  y={n.y - n.r - 7}
                  textAnchor="middle"
                  fill="#ffffff"
                  fillOpacity={dim ? 0.2 : active === n.name ? 1 : 0.65}
                  fontSize="11"
                  className="font-[family-name:var(--font-jetbrains-mono)] pointer-events-none"
                >
                  {n.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* invisible focus targets (a11y + hover) */}
        {nodes.map((n) => (
          <button
            key={n.name}
            aria-label={`${n.name} — ${n.years}+ anos`}
            onMouseEnter={() => setActive(n.name)}
            onFocus={() => setActive(n.name)}
            onClick={() => setActive(active === n.name ? null : n.name)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${(n.x / W) * 100}%`,
              top: `${(n.y / H) * 100}%`,
              width: Math.max(28, n.r * 2 + 10),
              height: Math.max(28, n.r * 2 + 10),
            }}
          />
        ))}

        {/* tooltip */}
        {activeNode && (
          <div
            className="absolute z-10 w-60 -translate-x-1/2 terminal-window p-3.5 pointer-events-auto"
            style={{
              left: `${(activeNode.x / W) * 100}%`,
              top: `${((activeNode.y + activeNode.r + 14) / H) * 100}%`,
              backgroundColor: "#0c0c0d",
            }}
          >
            <div className="flex items-baseline justify-between gap-2 mb-1.5">
              <span className="font-display font-bold text-white text-sm">{activeNode.name}</span>
              <span className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/55">
                {activeNode.years}+ anos
              </span>
            </div>
            {related.length > 0 ? (
              <>
                <div className="text-[9px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] text-[#4ade80] mb-1">
                  &gt; usado em:
                </div>
                <div className="flex flex-wrap gap-1">
                  {related.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => p.overview && onOpenCase(p)}
                      className={`text-[10px] font-[family-name:var(--font-jetbrains-mono)] px-1.5 py-0.5 rounded border border-white/10 ${
                        p.overview
                          ? "text-white/75 hover:text-[#4ade80] hover:border-[#4ade80]/40"
                          : "text-white/40 cursor-default"
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/45">
                stack de suporte no dia a dia
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile fallback: chips grouped by category */}
      <div className="md:hidden space-y-5">
        {(Object.keys(CLUSTERS) as Skill["category"][]).map((cat) => (
          <div key={cat}>
            <div
              className="text-[10px] uppercase tracking-[3px] font-[family-name:var(--font-jetbrains-mono)] font-bold mb-2"
              style={{ color: catColors[cat] }}
            >
              {`{ ${CLUSTERS[cat].label} }`}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <span
                    key={s.name}
                    className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] px-2.5 py-1 rounded border border-white/10 bg-white/[0.04] text-white/70"
                  >
                    {s.name} <span className="text-white/40">· {s.years}+a</span>
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
