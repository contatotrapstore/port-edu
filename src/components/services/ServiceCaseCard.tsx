import Image from "next/image";
import Link from "next/link";
import type { ServiceCase } from "@/lib/services";

export default function ServiceCaseCard({ project, featured = false }: { project: ServiceCase; featured?: boolean }) {
  const { crop } = project;
  return (
    <article className={`overflow-hidden rounded-xl border border-white/15 bg-white/[0.025] ${featured ? "grid md:grid-cols-2" : "flex flex-col"}`}>
      <figure className={`min-w-0 ${featured ? "p-5 md:p-7" : "p-4"}`}>
        <div className={`mx-auto relative overflow-hidden rounded-md bg-[#f5f5f5] ${project.id === "clinafy" ? "max-w-[364px]" : ""}`} style={{ aspectRatio: `${crop.width} / ${crop.height}` }}>
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1280}
            height={800}
            sizes={featured ? "(max-width: 767px) 1000px, 1000px" : "800px"}
            className="absolute h-auto"
            style={{ maxWidth: "none", width: `${1280 / crop.width * 100}%`, left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%` }}
          />
        </div>
        <figcaption className="mt-3 text-sm leading-relaxed text-white/60">{project.caption}</figcaption>
      </figure>
      <div className={`flex flex-1 flex-col justify-center ${featured ? "border-t border-white/10 p-5 md:border-l md:border-t-0 md:p-8" : "border-t border-white/10 p-5"}`}>
        <h3 className="font-display text-xl font-semibold text-white md:text-2xl">{project.name}</h3>
        <p className="mt-3 text-base leading-relaxed text-white/75">{project.description}</p>
        <Link href={`/projetos/${project.id}`} className="mt-5 inline-flex min-h-11 items-center self-start text-[15px] font-medium text-[#4ade80] underline decoration-[#4ade80]/35 underline-offset-4 hover:decoration-[#4ade80] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4ade80]">
          Conhecer o case de {project.name} <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </div>
    </article>
  );
}
