import Link from "next/link";
import type { CaseInsight } from "@/lib/case-insights";
import type { Locale } from "@/lib/locale";

export default function CaseInsights({ content, locale }: { content: CaseInsight; locale: Locale }) {
  const projectPath = locale === "en" ? "/en/projetos" : "/projetos";

  return (
    <div className="space-y-8 border-t border-white/15 pt-7">
      <section>
        <h2 className="font-display text-xl font-semibold leading-snug text-white">{content.flowTitle}</h2>
        <ol className="mt-5 space-y-5">
          {content.flow.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span aria-hidden="true" className="pt-0.5 text-base font-medium text-[#4ade80]">{index + 1}.</span>
              <div>
                <h3 className="text-base font-semibold text-white/90">{step.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-white/75">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold leading-snug text-white">{content.planningTitle}</h2>
        <p className="mt-3 text-base leading-relaxed text-white/75">{content.planningIntro}</p>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-[15px] leading-relaxed text-white/75 marker:text-[#4ade80]">
          {content.planning.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <Link href={content.service.href} hrefLang="pt-BR" className="mt-5 inline-flex min-h-11 items-center text-[15px] leading-relaxed text-[#4ade80] underline decoration-[#4ade80]/40 underline-offset-4 hover:decoration-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]">
          {content.service.label}
        </Link>
      </section>

      <section className="border-t border-white/15 pt-6">
        <h2 className="font-display text-xl font-semibold leading-snug text-white">{content.relatedTitle}</h2>
        <ul className="mt-4 space-y-4">
          {content.related.map((project) => (
            <li key={project.id}>
              <Link href={`${projectPath}/${project.id}`} className="inline-flex min-h-11 items-center text-base font-medium text-[#4ade80] underline decoration-[#4ade80]/40 underline-offset-4 hover:decoration-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]">
                {project.title}
              </Link>
              <p className="text-[15px] leading-relaxed text-white/75">{project.reason}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
