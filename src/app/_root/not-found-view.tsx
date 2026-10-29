import Link from "next/link";

type Language = "pt-BR" | "en";

const copy: Record<Language, { title: string; body: string; home: string; cta: string }> = {
  "pt-BR": {
    title: "Página não encontrada",
    body: "O endereço pode estar errado ou a página mudou de lugar.",
    home: "/",
    cta: "ir para o início",
  },
  en: {
    title: "Page not found",
    body: "The address may be wrong, or the page may have moved.",
    home: "/en",
    cta: "go to the home page",
  },
};

/**
 * Tela de 404 no mesmo estilo de error.tsx. As rotas de cada língua usam a
 * própria; o 404 global, de endereços que não pertencem a nenhuma rota, mostra
 * as duas.
 */
export default function NotFoundView({ languages }: { languages: Language[] }) {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center gap-12 bg-[#0a0a0a] px-6 text-center">
      {languages.map((lang, index) => {
        const t = copy[lang];
        const Heading = index === 0 ? "h1" : "h2";
        return (
          <section key={lang} lang={lang} className="flex flex-col items-center gap-5">
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#4ade80]">
              <span>&gt;</span> 404
            </div>
            <Heading className="text-xl font-bold text-white font-[family-name:var(--font-jetbrains-mono)]">{t.title}</Heading>
            <p className="max-w-sm text-sm text-white/50">{t.body}</p>
            <Link
              href={t.home}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-white/15 bg-white/[0.05] text-[12px] font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-[2px] text-white hover:bg-white/[0.1] transition-colors"
            >
              {t.cta}
            </Link>
          </section>
        );
      })}
    </main>
  );
}
