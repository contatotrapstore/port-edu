import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/central", "/admin"],
    },
    sitemap: "https://www.edevshub.com/sitemap.xml",
  };
}
