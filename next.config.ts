import type { NextConfig } from "next";
import { vercelAliasHost } from "./src/lib/site";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * Site novo (EDH_NEW_SITE=1 no build). As rotas atuais importam o site novo
 * pelos módulos "@site/*"; sem a variável, todos apontam para um módulo vazio
 * e nenhuma rota atual empacota CSS, fonte ou código do site novo.
 */
const newSite = process.env.EDH_NEW_SITE === "1";
const siteModules: Record<string, string> = {
  "@site/home": "./src/components/redesign/BrandHome.tsx",
  "@site/projects": "./src/components/redesign/site/ProjectsIndex.tsx",
  "@site/case": "./src/components/redesign/site/CasePage.tsx",
  "@site/services": "./src/components/redesign/site/ServicesIndex.tsx",
  "@site/service": "./src/components/redesign/site/ServiceView.tsx",
  "@site/hire": "./src/components/contact/HirePage.tsx",
  "@site/privacy": "./src/components/redesign/site/PrivacyPage.tsx",
};

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  turbopack: {
    resolveAlias: Object.fromEntries(
      Object.entries(siteModules).map(([name, file]) => [name, newSite ? file : "./src/components/redesign/site/off.ts"]),
    ),
  },
  async redirects() {
    return [
      // O alias de produção da Vercel estava indexado no lugar do domínio, com
      // dados de duas versões atrás. Previews (*-git-*.vercel.app) não são afetadas.
      {
        source: "/:path*",
        has: [{ type: "host", value: vercelAliasHost }],
        destination: `https://www.edevshub.com/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Cinto e suspensório: qualquer host .vercel.app (inclusive previews) fica
      // fora do índice, mesmo que o redirect acima não pegue.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      // A /workana é enviada como credencial em propostas: nunca indexar.
      {
        source: "/workana",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
