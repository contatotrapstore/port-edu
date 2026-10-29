import type { NextConfig } from "next";
import { vercelAliasHost } from "./src/lib/site";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Painel privado /central (login e aprovação de permissões): política fechada
const centralCsp = {
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; "),
};

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  turbopack: {},
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
      // CSP: sem script inline; só os scripts do próprio site e do jsDelivr (Supabase e Three.js com SRI)
      { source: "/central", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, centralCsp] },
      { source: "/central/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, centralCsp] },
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
