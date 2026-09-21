"use client";

import Image from "next/image";
import type { reviewCases } from "@/lib/workana-review";
import CopyBlock, { CopyButton } from "./CopyBlock";
import { useReviewDraft } from "./useReviewDraft";

type ReviewCase = (typeof reviewCases)[number];

export default function CaseReview({ item, position }: { item: ReviewCase; position: number }) {
  const roleDraft = useReviewDraft(`${item.id}-role`, "");
  const deliverablesDraft = useReviewDraft(`${item.id}-deliverables`, "");
  const role = roleDraft.value;
  const deliverables = deliverablesDraft.value;
  const storageUnavailable = roleDraft.storageUnavailable || deliverablesDraft.storageUnavailable;
  const description = `${item.summary}\n\nMINHA PARTICIPAÇÃO\n${role.trim()}\n\nENTREGAS\n${deliverables.trim()}`;
  const complete = Boolean(role.trim() && deliverables.trim());
  const fieldClass = "mt-2 block w-full resize-y rounded-lg border border-slate-600/70 bg-[#111b2b] px-4 py-3 text-base leading-7 text-slate-100 placeholder:text-slate-400 focus:border-[#b8d3f3] focus:outline-2 focus:outline-[#b8d3f3]/30";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-700/80 bg-[#162133]">
      <div className="grid border-b border-slate-700/80 sm:grid-cols-[180px_1fr]">
        <div className="relative h-44 bg-[#0e1623] sm:h-auto sm:min-h-40">
          <Image src={item.image} alt={`Apresentação do projeto ${item.name}`} fill sizes="(max-width: 640px) 90vw, 180px" className="object-contain p-3" />
        </div>
        <div className="p-5 sm:p-6">
          <p className="mb-2 text-sm text-slate-300">{position}º na vitrine sugerida · {item.category}</p>
          <h3 className="font-display text-2xl font-semibold text-white">{item.name}</h3>
          <p className="mt-2 text-base leading-relaxed text-slate-300">{item.summary}</p>
        </div>
      </div>
      <div className="space-y-6 p-5 sm:p-6">
        <CopyBlock draftKey={`${item.id}-title`} title={`Título de ${item.name}`} initialText={item.title} rows={2} />
        <div className="rounded-lg border border-amber-200/20 bg-amber-200/5 p-4 text-sm leading-6 text-amber-100">
          A descrição abaixo precisa da sua participação real antes de ficar pronta para copiar. As funções do produto, sozinhas, não definem sua autoria.
        </div>
        <label className="block text-base font-medium text-white" htmlFor={`${item.id}-role`}>
          Minha participação
          <textarea id={`${item.id}-role`} value={role} onChange={(event) => roleDraft.setValue(event.target.value)} rows={3} placeholder={item.prompt} className={fieldClass} />
        </label>
        <label className="block text-base font-medium text-white" htmlFor={`${item.id}-deliverables`}>
          Entregas que posso comprovar
          <textarea id={`${item.id}-deliverables`} value={deliverables} onChange={(event) => deliverablesDraft.setValue(event.target.value)} rows={3} placeholder="Liste módulos, fluxos ou integrações que você entregou. Inclua números de resultado somente com fonte e contexto." className={fieldClass} />
        </label>
        {complete && <div className="rounded-lg border border-slate-600/60 bg-[#0f1928] p-4"><p className="mb-3 text-sm font-medium text-slate-300">Descrição montada para revisão</p><p className="whitespace-pre-wrap text-base leading-7 text-slate-100">{description}</p></div>}
        <CopyButton text={description} label={`Copiar descrição de ${item.name}`} disabled={!complete} />
        <p role="status" className={`text-xs leading-5 ${storageUnavailable ? "text-amber-100" : "text-slate-400"}`}>
          {storageUnavailable ? "Armazenamento indisponível. Sua descrição continua nesta tela; copie antes de sair." : roleDraft.changed || deliverablesDraft.changed ? "Rascunhos salvos neste navegador." : ""}
        </p>
      </div>
    </article>
  );
}
