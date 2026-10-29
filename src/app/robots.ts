import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /central fica fora do índice pelo X-Robots-Tag (next.config.ts); não listar aqui para não anunciar o caminho
      allow: "/",
    },
    sitemap: "https://www.edevshub.com/sitemap.xml",
  };
}
