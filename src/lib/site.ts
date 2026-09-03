/**
 * Fonte única da origem canônica do site.
 *
 * O apex (edevshub.com) redireciona para www — declarar o apex nos canonicals
 * fazia 46/46 URLs do sitemap apontarem para redirects e mantinha o domínio
 * fora do índice. Todo canonical, hreflang, sitemap e JSON-LD importa daqui.
 */
export const siteUrl = "https://www.edevshub.com";

/** Host de deploy da Vercel — nunca deve ser indexado (dados desatualizados). */
export const vercelAliasHost = "port-edu.vercel.app";
