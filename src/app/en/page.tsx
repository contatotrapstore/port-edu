import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

const siteUrl = "https://edevshub.com";

export const metadata: Metadata = {
  title: "EDevsHub | Eduardo Gouveia — #1 Full Stack Developer in Brazil (Workana)",
  description:
    "Eduardo Gouveia — Senior Full Stack Developer, ranked #1 in IT in Brazil on Workana. 144+ projects delivered, 4.72/5 ⭐, HERO level. Specialist in SaaS, dashboards and AI systems.",
  keywords: [
    "Eduardo Gouveia",
    "EDevsHub",
    "Full Stack Developer",
    "Top 1 Brazil Workana",
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
    title: "EDevsHub | #1 Full Stack Developer in Brazil on Workana",
    description:
      "144+ projects delivered · 4.72/5 ⭐ · HERO level · #1 in IT in Brazil. Specialist in SaaS, dashboards and systems.",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Eduardo Gouveia — Senior Full Stack · #1 in Brazil · Workana HERO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EDevsHub | #1 Full Stack Developer in Brazil",
    description:
      "144+ projects · 4.72/5 ⭐ · Workana HERO. SaaS & systems specialist.",
    images: ["/og-cover.jpg"],
  },
};

export default function Page() {
  return <HomePage locale="en" />;
}
