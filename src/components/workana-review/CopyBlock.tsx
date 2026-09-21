"use client";

import { useId, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useReviewDraft } from "./useReviewDraft";

export function CopyButton({ text, label = "Copiar texto", disabled = false }: { text: string; label?: string; disabled?: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" disabled={disabled} onClick={copy} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#dce8f7] px-4 py-2 text-sm font-semibold text-[#12233c] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dce8f7] disabled:cursor-not-allowed disabled:opacity-40">
        {status === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {status === "copied" ? "Copiado" : label}
      </button>
      <span role="status" className="text-sm text-slate-300">
        {status === "error" ? "Selecione o texto e use Ctrl+C para copiar." : status === "copied" ? "Texto copiado para a área de transferência." : ""}
      </span>
    </div>
  );
}

export default function CopyBlock({ draftKey, title, initialText, hint, rows = 8 }: { draftKey: string; title: string; initialText: string; hint?: string; rows?: number }) {
  const { value, setValue, reset, storageUnavailable, changed } = useReviewDraft(draftKey, initialText);
  const id = useId();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-lg font-medium text-white">{title}</label>
        <span className="text-xs text-slate-400">{value.length.toLocaleString("pt-BR")} caracteres</span>
      </div>
      {hint && <p id={`${id}-hint`} className="max-w-3xl text-sm leading-relaxed text-slate-300">{hint}</p>}
      <textarea id={id} aria-describedby={hint ? `${id}-hint` : undefined} rows={rows} value={value} onChange={(event) => setValue(event.target.value)} className="block w-full resize-y rounded-xl border border-slate-600/70 bg-[#111b2b] px-4 py-4 text-base leading-7 text-slate-100 focus:border-[#b8d3f3] focus:outline-2 focus:outline-[#b8d3f3]/30 sm:px-5" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CopyButton text={value} label={`Copiar ${title.toLowerCase()}`} disabled={!value.trim()} />
        {changed && <button type="button" onClick={reset} className="min-h-11 rounded px-2 text-sm text-slate-300 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-[#b8d3f3]">Restaurar texto original</button>}
      </div>
      <p role="status" className={`text-xs leading-5 ${storageUnavailable ? "text-amber-100" : "text-slate-400"}`}>
        {storageUnavailable ? "Armazenamento indisponível. Seu texto continua nesta tela; copie antes de sair." : changed ? "Rascunho salvo neste navegador." : ""}
      </p>
    </div>
  );
}
