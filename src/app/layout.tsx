import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "EDevsHub | Eduardo Gouveia — Full Stack Developer",
  description:
    "Portfolio imersivo de Eduardo Gouveia — Full Stack Developer & Systems Engineer. Experiência 3D interativa cyberpunk.",
  keywords: [
    "Eduardo Gouveia",
    "EDevsHub",
    "portfolio",
    "full stack developer",
    "systems engineer",
    "WebGL",
    "React",
    "Next.js",
  ],
  openGraph: {
    title: "EDevsHub | Eduardo Gouveia — Full Stack Developer",
    description: "Portfolio imersivo com experiência 3D interativa",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
