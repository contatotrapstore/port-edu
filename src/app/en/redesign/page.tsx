import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import BrandHome from "@/components/redesign/BrandHome";
import { isRedesignPreviewEnabled } from "@/components/redesign/preview";

export const metadata: Metadata = {
  title: "Redesign preview | EDevsHub",
  description: "Preview of the new EDevsHub home: the bench opening, projects, solutions, method, proof and contact.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/en/redesign", languages: {} },
};

export const viewport: Viewport = {
  themeColor: "#0e1716",
  colorScheme: "dark",
};

export default function Page() {
  if (!isRedesignPreviewEnabled()) notFound();
  return <BrandHome locale="en" variant="preview" />;
}
