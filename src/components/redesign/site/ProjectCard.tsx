import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/constants";
import type { Locale } from "@/lib/locale";
import { coverFor, entryFor, materialLabel } from "./catalog";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Capa de projeto do catálogo: mesma moldura e proporção para todos, com o
 * material identificado (tela, página ou divulgação). Usada no índice e nas
 * sugestões ao fim de cada case, para a navegação parecer um só lugar.
 */
export default function ProjectCard({ project, locale, href, label }: { project: Project; locale: Locale; href: string; label?: string }) {
  const entry = entryFor(project.id);
  const cover = coverFor(project);
  return (
    <Link href={href} className={`edh-pcard edh-pcard--${entry.material}`}>
      <span className="edh-pcard-media">
        <Image src={cover.src} alt="" fill sizes="(min-width: 64rem) 25rem, (min-width: 40rem) 45vw, 90vw" />
      </span>
      <span className="edh-pcard-text">
        {label ? <span className="edh-pcard-label">{label}</span> : null}
        <span className="edh-pcard-name">{project.title}</span>
        <span className="edh-pcard-headline">{capitalize(project.headline ?? project.description)}</span>
        <span className="edh-pcard-meta">
          {[project.year, materialLabel(entry.material, locale)].filter(Boolean).join(", ")}
        </span>
      </span>
    </Link>
  );
}
