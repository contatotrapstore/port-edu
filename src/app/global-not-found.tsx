import "./globals.css";
import type { Metadata } from "next";
import RootDocument from "./_root/document";
import NotFoundView from "./_root/not-found-view";

// Endereços que não existem em nenhuma rota. Com dois layouts raiz, o Next não
// tem um layout único para montar esse 404 e usa este documento completo
// (experimental.globalNotFound no next.config.ts).
export const metadata: Metadata = {
  title: "Página não encontrada | EDevsHub",
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="pt-BR">
      <NotFoundView languages={["pt-BR", "en"]} />
    </RootDocument>
  );
}
