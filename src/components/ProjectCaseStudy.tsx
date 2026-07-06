"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { X } from "lucide-react";
import { projectColors, type Project } from "@/lib/constants";
import CaseStudyContent from "@/components/CaseStudyContent";
import { useLocale } from "@/lib/locale";
import { t, categoryLabel } from "@/lib/i18n";

/**
 * Accessible case-study preview modal: role=dialog, focus trap, Esc / click-outside
 * to close, focus restored to the opener. Body shared with the full page via CaseStudyContent.
 */
export default function ProjectCaseStudy({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useEffect(() => {
    if (!project) return;
    const prevFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
        );
        if (!f || f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey, true);
    document.body.style.overflow = "hidden";
    // Tell the home's scroll-jacking (Experience) to stand down so the modal scrolls natively.
    document.documentElement.setAttribute("data-modal-open", "");
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = "";
      document.documentElement.removeAttribute("data-modal-open");
      prevFocused?.focus?.();
    };
  }, [project, onClose]);

  if (!project) return null;
  const color = projectColors[project.category];

  return (
    <LazyMotion features={domAnimation} strict>
    <m.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
    >
      <m.div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto scrollbar-none rounded-lg border border-white/10 bg-[#0c0c0d] shadow-2xl"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.2 } }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center h-9 px-3 bg-[#0c0c0d] border-b border-white/[0.08]">
          <div className="terminal-dots">
            <span /><span /><span />
          </div>
          <span className="ml-3 text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-white/45">
            {project.id}.case.md
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t(locale, "case.close")}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero image */}
        {project.image && (
          <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 92vw, 640px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0c0c0d] via-transparent to-transparent" />
          </div>
        )}

        <div className="p-5 md:p-7">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3
              id="case-title"
              className="text-2xl font-bold text-white font-[family-name:var(--font-jetbrains-mono)]"
            >
              {project.title}
            </h3>
            <span
              className="text-[8px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] px-2 py-1 rounded border font-bold shrink-0"
              style={{ color, borderColor: `${color}30`, backgroundColor: `${color}10` }}
            >
              {categoryLabel(locale, project.category)}
            </span>
          </div>

          <Link
            href={`/${locale === "en" ? "en/" : ""}projetos/${project.id}`}
            className="inline-flex items-center gap-1.5 mb-5 text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-[#4ade80] hover:text-[#86efac] border-b border-[#4ade80]/30 hover:border-[#4ade80]/60 pb-0.5 transition-colors"
          >
{t(locale, "case.viewFull")} <span aria-hidden>→</span>
          </Link>

          <CaseStudyContent project={project} />
        </div>
      </m.div>
    </m.div>
    </LazyMotion>
  );
}
