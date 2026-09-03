import type { NextConfig } from "next";
import { vercelAliasHost } from "./src/lib/site";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

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
