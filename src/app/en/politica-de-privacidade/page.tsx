import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isNewSiteEnabled } from "@/components/redesign/preview";
import PrivacyPage from "@/components/redesign/site/PrivacyPage";
import { portfolioOgImage } from "@/lib/portfolio-metadata";

const title = "Privacy policy";
const description =
  "How data sent through ad forms, WhatsApp, email or browsing on edevshub.com is processed, for how long and what your rights are.";

// Tradução da política em português; existe só com EDH_NEW_SITE=1.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/en/politica-de-privacidade",
    languages: { "pt-BR": "/politica-de-privacidade", en: "/en/politica-de-privacidade", "x-default": "/politica-de-privacidade" },
  },
  openGraph: { type: "website", locale: "en_US", url: "/en/politica-de-privacidade", title, description, images: [portfolioOgImage] },
  twitter: { card: "summary", title, description },
};

export default function PrivacyPageEN() {
  if (!isNewSiteEnabled()) notFound();
  return <PrivacyPage locale="en" />;
}
