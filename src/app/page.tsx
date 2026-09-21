import HomePage from "@/components/HomePage";
import { portfolioMetadata } from "@/lib/portfolio-metadata";

export const metadata = portfolioMetadata;

export default function Page() {
  return <HomePage locale="pt" />;
}
