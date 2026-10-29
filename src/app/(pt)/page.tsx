import HomePage from "@/components/HomePage";
import BrandHome from "@site/home";
import { brandHomeMetadata } from "@/components/redesign/home/metadata";
import { isNewSiteEnabled } from "@/components/redesign/preview";
import { portfolioMetadata } from "@/lib/portfolio-metadata";

// EDH_NEW_SITE=1 no build troca a home pela nova experiência de marca; sem a
// variável, a home atual continua igual.
export const metadata = isNewSiteEnabled() ? brandHomeMetadata("pt") : portfolioMetadata;

export default function Page() {
  if (isNewSiteEnabled() && BrandHome) return <BrandHome locale="pt" variant="home" />;
  return <HomePage locale="pt" />;
}
