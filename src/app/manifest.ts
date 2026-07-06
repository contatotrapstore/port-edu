import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EDevsHub — Eduardo Gouveia",
    short_name: "EDevsHub",
    description:
      "Eduardo Gouveia — Full Stack Senior, Top 1 Brasil em TI na Workana. SaaS, Dashboards e Sistemas.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "pt-BR",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
