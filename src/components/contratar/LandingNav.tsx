import Link from "next/link";
import Image from "next/image";

/**
 * Nav mínima da landing: logo, uma âncora e nada mais.
 *
 * Landing de anúncio não tem menu. Todo link que não leva à conversão é uma
 * saída paga que você comprou e devolveu.
 */
export default function LandingNav() {
  return (
    <nav className="lp-nav">
      <div className="lp-wrap">
        <Link href="/" aria-label="EDevsHub, ir para o portfólio">
          <Image
            src="/EdevsHub.webp"
            alt="EDevsHub"
            width={104}
            height={28}
            priority
            className="lp-logo"
          />
        </Link>
        <a href="#solucoes" className="lp-nav-link">
          O que eu construo
        </a>
      </div>
    </nav>
  );
}
