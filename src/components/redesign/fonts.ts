import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/**
 * Tipografia das peças do Rebranding (IBM Plex Sans + IBM Plex Mono),
 * carregada só na prévia: o layout raiz e as outras rotas não mudam.
 * Plex Sans variável = um arquivo para todos os pesos.
 */
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
});

// Só rótulos pequenos usam a mono: sem preload, ela não disputa banda com o título.
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});
