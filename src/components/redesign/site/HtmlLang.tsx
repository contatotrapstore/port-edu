"use client";

import { useEffect } from "react";

/**
 * O layout raiz é um só e sai com lang="pt-BR". Nas páginas do site novo, o
 * documento passa a declarar a língua da página assim que ela hidrata e a cada
 * navegação no cliente. O conteúdo já vem marcado pelo lang do contêiner.
 */
export default function HtmlLang({ lang }: { lang: "pt-BR" | "en" }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    // Ao sair para uma página sem HtmlLang, o documento volta ao padrão do layout.
    return () => {
      document.documentElement.lang = "pt-BR";
    };
  }, [lang]);
  return null;
}
