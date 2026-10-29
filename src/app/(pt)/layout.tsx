import "../globals.css";
import RootDocument, { rootMetadata, rootViewport } from "../_root/document";

// Layout raiz das rotas em português, inclusive /workana e /admin (ver _root/document.tsx).
export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function PortugueseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="pt-BR">{children}</RootDocument>;
}
