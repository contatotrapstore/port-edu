import { ImageResponse } from "next/og";
import { portfolioWorkanaStats as stats } from "@/lib/constants";

export const runtime = "edge";

/** Imagem de compartilhamento exclusiva do portfólio; sem geração de IA ou requisições externas. */
export function GET() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#0a0c0b", color: "#ffffff", padding: "54px 64px", borderTop: "8px solid #4ade80", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 30 }}>Eduardo Gouveia · EDevsHub</div>
          <div style={{ display: "flex", fontSize: 24, color: "#4ade80", border: "1px solid #4ade80", borderRadius: 12, padding: "12px 20px" }}>Workana {stats.level}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 56, fontSize: 70, fontWeight: 700, lineHeight: 1.12 }}>
          <div style={{ display: "flex" }}>Sistemas sob medida.</div>
          <div style={{ display: "flex", color: "#4ade80" }}>SaaS e integrações.</div>
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 30, gap: 28, color: "#e5e7eb" }}>
          <div style={{ display: "flex" }}>{stats.projectsCompleted} projetos realizados</div>
          <div style={{ display: "flex" }}>{stats.rating.toLocaleString("pt-BR")}/5 · {stats.clientReviews} avaliações</div>
        </div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 21, color: "#a6afa9" }}>
          Dados do perfil Workana conferidos em {stats.verifiedAtLabel}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
