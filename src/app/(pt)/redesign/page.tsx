import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import BrandHome from "@/components/redesign/BrandHome";
import { isRedesignPreviewEnabled } from "@/components/redesign/preview";

export const metadata: Metadata = {
  title: "Prévia do redesign | EDevsHub",
  description: "Prévia da nova home da EDevsHub: abertura com a bancada, projetos, soluções, método, provas e contato.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/redesign", languages: {} },
};

export const viewport: Viewport = {
  themeColor: "#0e1716",
  colorScheme: "dark",
};

export default function Page() {
  if (!isRedesignPreviewEnabled()) notFound();
  return <BrandHome locale="pt" variant="preview" />;
}
