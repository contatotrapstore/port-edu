"use client";

import { chapters } from "@/lib/constants";
import type { Project } from "@/lib/constants";
import SkillConstellation from "@/components/SkillConstellation";
import Section from "@/components/home/Section";
import SectionNext from "@/components/home/SectionNext";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

const rangeOf = (id: string) => chapters.find((c) => c.id === id)!.range;

export default function SkillsSection({
  progress,
  openCase,
  onChapterClick,
}: {
  progress: number;
  openCase: (p: Project) => void;
  onChapterClick: (i: number) => void;
}) {
  const locale = useLocale();
  return (
    <Section id="skills" progress={progress} range={rangeOf("skills")}>
      <div>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-2">
          {t(locale, "skills.title")}
        </h2>
        <div className="h-0.5 w-16 bg-gradient-to-r from-white/30 to-transparent mb-6" />

        <p className="mb-6 max-w-2xl text-base leading-relaxed text-white/70">{t(locale, "skills.intro")}</p>
        <SkillConstellation onOpenCase={openCase} />
      </div>
    <SectionNext index={3} onChapterClick={onChapterClick} />
    </Section>
  );
}
