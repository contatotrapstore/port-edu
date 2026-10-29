import "../globals.css";
import RootDocument, { rootMetadata, rootViewport } from "../_root/document";

// Layout raiz das rotas em inglês (/en/*): o HTML já sai com lang="en" (ver _root/document.tsx).
export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
