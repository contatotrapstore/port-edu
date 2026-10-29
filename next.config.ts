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
const off = "./src/components/redesign/site/off.ts";
const siteModules: Record<string, string> = {
  "@site/home": "./src/components/redesign/BrandHome.tsx",
  "@site/projects": "./src/components/redesign/site/ProjectsIndex.tsx",
  "@site/case": "./src/components/redesign/site/CasePage.tsx",
  "@site/services": "./src/components/redesign/site/ServicesIndex.tsx",
  "@site/service": "./src/components/redesign/site/ServiceView.tsx",
  "@site/hire": "./src/components/contact/HirePage.tsx",
  "@site/privacy": "./src/components/redesign/site/PrivacyPage.tsx",
};
/**
 * O inverso: o que só as páginas atuais carregam. O CSS da /contratar atual
 * estiliza as mesmas classes do DirectContact que a página nova usa; com o site
 * novo ele sai, e /contratar e /en/contratar recebem o mesmo CSS.
 */
const currentModules: Record<string, string> = {
  "@current/contratar-styles": "./src/app/(pt)/contratar/landing.css",
};

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  experimental: {
    // O site tem dois layouts raiz, app/(pt) e app/(en), para o <html lang> já
    // sair certo do servidor. Sem um layout no topo, o 404 de endereços que não
    // existem vem de app/global-not-found.tsx.
    globalNotFound: true,
  },
  turbopack: {
    resolveAlias: {
      ...Object.fromEntries(Object.entries(siteModules).map(([name, file]) => [name, newSite ? file : off])),
      ...Object.fromEntries(Object.entries(currentModules).map(([name, file]) => [name, newSite ? off : file])),
    },
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
      },    ];
  },
  async rewrites() {
    return [
      // Central de Agentes (painel privado, arquivos estáticos em public/central, gerados por central-agentes: npm run site:sync)
      { source: "/central", destination: "/central/index.html" },
      { source: "/central/predio", destination: "/central/predio/index.html" },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Painel privado da Central de Agentes: nunca indexar
      { source: "/central", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/central/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
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
