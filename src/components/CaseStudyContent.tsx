import type { ReactNode } from "react";
import { projectColors, workanaStats, type Project } from "@/lib/constants";
import CaseGallery from "@/components/CaseGallery";

function Label({ children, color }: { children: ReactNode; color: string }) {
  return (
    <div
      className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] mb-2"
      style={{ color }}
    >
      &gt; {children}:
    </div>
  );
}

/** Shared case-study body — used by both the modal preview and the /projetos/[id] page. */
export default function CaseStudyContent({ project }: { project: Project }) {
  const color = projectColors[project.category];

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-white/75">
        {project.overview || project.description}
      </p>

      {project.gallery && project.gallery.length > 0 && (
        <CaseGallery images={project.gallery} title={project.title} />
      )}

      {project.problem && (
        <div>
          <Label color={color}>desafio</Label>
          <p className="text-sm leading-relaxed text-white/70">{project.problem}</p>
        </div>
      )}

      {project.approach && (
        <div>
          <Label color={color}>solução</Label>
          <p className="text-sm leading-relaxed text-white/70">{project.approach}</p>
        </div>
      )}

      {project.features && project.features.length > 0 && (
        <div>
          <Label color={color}>funcionalidades</Label>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {project.features.map((f) => (
              <li key={f} className="text-[13px] leading-relaxed text-white/70 flex items-start gap-2">
                <span style={{ color }} className="shrink-0">▹</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.output && project.output.length > 0 && (
        <div>
          <Label color="#4ade80">resultado</Label>
          <ul className="space-y-1.5">
            {project.output.map((o) => (
              <li key={o} className="text-[13px] leading-relaxed text-white/70 flex items-start gap-2">
                <span className="text-[#4ade80] shrink-0">▹</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Label color="#c0c0c0">stack</Label>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[11px] font-[family-name:var(--font-jetbrains-mono)] px-2.5 py-1 rounded bg-white/[0.05] text-white/70 border border-white/[0.08]"
            >
              &lt;{t} /&gt;
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] font-[family-name:var(--font-jetbrains-mono)] font-bold px-4 h-10 rounded-lg border border-white/15 text-white hover:bg-white/[0.06] transition-colors"
          >
            ver ao vivo <span aria-hidden>↗</span>
          </a>
        )}
        <a
          href={workanaStats.workanaProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[12px] font-[family-name:var(--font-jetbrains-mono)] font-bold text-black px-5 h-10 rounded-lg bg-[#fbbf24] hover:bg-[#fcd34d] transition-colors"
        >
          <span className="text-[10px]">★</span> discutir um projeto assim <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
