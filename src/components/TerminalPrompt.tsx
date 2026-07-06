"use client";

import { useRef, useState } from "react";
import { workanaStats } from "@/lib/constants";
import { track } from "@vercel/analytics";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

const HELP: Record<"pt" | "en", string[]> = {
  pt: [
    "comandos disponíveis:",
    "  help              mostra esta lista",
    "  whoami            quem é o dev",
    "  projects          vai para os projetos",
    "  hire              abre o perfil na Workana",
    "  clear             limpa o terminal",
  ],
  en: [
    "available commands:",
    "  help              show this list",
    "  whoami            who the dev is",
    "  projects          jump to the projects",
    "  hire              open the Workana profile",
    "  clear             clear the terminal",
  ],
};

/** Interactive easter-egg prompt for the contact terminal. */
export default function TerminalPrompt() {
  const [lines, setLines] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const locale = useLocale();
  const en = locale === "en";

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const echo = `$ ${raw}`;
    let out: string[] = [];

    switch (cmd) {
      case "":
        return;
      case "help":
        out = HELP[locale];
        break;
      case "whoami":
        out = en
          ? [
              "Eduardo Gouveia — Senior Full Stack",
              `Top ${workanaStats.rankITBrazil} Brazil · ${workanaStats.level} level · ${workanaStats.rating}★`,
            ]
          : [
              "Eduardo Gouveia — Full Stack Sênior",
              `Top ${workanaStats.rankITBrazil} Brasil · nível ${workanaStats.level} · ${workanaStats.rating}★`,
            ];
        break;
      case "projects":
      case "projetos":
        out = en ? ["→ opening projects..."] : ["→ abrindo projetos..."];
        window.dispatchEvent(new CustomEvent("gotoChapter", { detail: { index: 1 } }));
        break;
      case "hire":
      case "contratar":
        out = en ? ["→ opening Workana..."] : ["→ abrindo Workana..."];
        window.open(workanaStats.workanaProfileUrl, "_blank", "noopener,noreferrer");
        break;
      case "clear":
        setLines([]);
        return;
      case "sudo make coffee":
      case "sudo make me a coffee":
        out = en
          ? ["☕ error 418: i'm a teapot — but I'll still ship your project in record time."]
          : ["☕ erro 418: i'm a teapot — mas fecho seu projeto em tempo recorde."];
        break;
      case "sudo":
        out = en
          ? ["nice try. permission denied (but the coffee's ready)."]
          : ["nice try. permissão negada (mas o café tá pronto)."];
        break;
      case "ls":
        out = en
          ? ["saas/  dashboards/  ai-systems/  ecommerce/"]
          : ["saas/  dashboards/  sistemas-ia/  ecommerce/"];
        break;
      default:
        out = en
          ? [`command not found: ${cmd} — try "help"`]
          : [`comando não encontrado: ${cmd} — tente "help"`];
    }

    setLines((prev) => [...prev, echo, ...out].slice(-10));
  };

  return (
    <div
      className="pt-3 font-[family-name:var(--font-jetbrains-mono)] text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <p
          key={i}
          className={l.startsWith("$") ? "text-[#4ade80]" : "text-white/55 whitespace-pre-wrap"}
        >
          {l}
        </p>
      ))}
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue("");
        }}
      >
        <span className="text-[#4ade80] shrink-0">$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={t(locale, "terminal.aria")}
          placeholder={t(locale, "terminal.placeholder")}
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-transparent outline-none text-white/85 placeholder:text-white/25 caret-[#4ade80]"
        />
      </form>
    </div>
  );
}
