import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "EDevsHub | Eduardo Gouveia — Senior Full Stack · Workana HERO",
  description:
    "Eduardo Gouveia — Senior Full Stack Developer, HERO level on Workana: 176 projects delivered, 4.74/5 ⭐ across 179 reviews, reached #1 in IT in Brazil. Specialist in SaaS, dashboards and AI systems.",
  keywords: [
    "Eduardo Gouveia",
    "EDevsHub",
    "Full Stack Developer",
    "Workana HERO",
    "SaaS developer",
    "dashboard developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "3D portfolio",
  ],
  alternates: {
    canonical: `${siteUrl}/en`,
    languages: {
      "pt-BR": "/",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/en`,
    siteName: "EDevsHub — Eduardo Gouveia",
    title: "EDevsHub | Eduardo Gouveia — Senior Full Stack · Workana HERO",
    description:
      "176 projects delivered · 4.74/5 ⭐ (179 reviews) · HERO level · reached #1 in IT in Brazil. Specialist in SaaS, dashboards and systems.",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Eduardo Gouveia — Senior Full Stack · Workana HERO · reached #1 in Brazil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EDevsHub | Eduardo Gouveia — Senior Full Stack",
    description:
      "176 projects · 4.74/5 ⭐ · Workana HERO. SaaS & systems specialist.",
    images: ["/og-cover.jpg"],
  },
};

export default function Page() {
  return <HomePage locale="en" />;
}
