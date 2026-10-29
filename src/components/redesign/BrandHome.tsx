import "./redesign.css";
import "./studio.css";
import "./station/station.css";
import "./home/home.css";
import { getContent } from "@/lib/content.en";
import type { Locale } from "@/lib/locale";
import BrandHeader from "./BrandHeader";
import { getRedesignCopy } from "./copy";
import { plexMono, plexSans } from "./fonts";
import HomeAbout from "./home/HomeAbout";
import HomeContact from "./home/HomeContact";
import HomeFooter from "./home/HomeFooter";
import HomeMethod from "./home/HomeMethod";
import HomeProjects from "./home/HomeProjects";
import HomeSolutions from "./home/HomeSolutions";
import { getHomeCopy } from "./home/copy";
import HtmlLang from "./site/HtmlLang";
import { hireHref } from "./site/paths";
import StationHero, { type StationHeroCopy } from "./station/StationHero";

const STATION_CASE = "passagenseuropa";

/**
 * Home de marca da EDevsHub: a bancada como abertura e, depois dela, projetos,
 * soluções, método, provas, contato e rodapé.
 *
 * `variant="home"` é a home pública (/ e /en, quando EDH_NEW_SITE=1);
 * `variant="preview"` é a mesma página em /redesign e /en/redesign, para
 * revisão. Só mudam os links de marca e idioma e a origem dos cliques.
 */
export default function BrandHome({ locale, variant }: { locale: Locale; variant: "home" | "preview" }) {
  const copy = getRedesignCopy(locale);
  const home = getHomeCopy(locale);
  const content = getContent(locale);
  const project = content.projects.find((p) => p.id === STATION_CASE);
  if (!project) throw new Error(`Projeto ${STATION_CASE} não encontrado`);

  const en = locale === "en";
  const prefix = en ? "/en" : "";
  const homeHref = variant === "home" ? (en ? "/en" : "/") : en ? "/en/redesign" : "/redesign";
  const otherLocaleHref = variant === "home" ? (en ? "/" : "/en") : en ? "/redesign" : "/en/redesign";
  const source = variant === "home" ? "home" : "redesign";

  const hero: StationHeroCopy = {
    title: copy.studio.title,
    lead: home.hero.lead,
    cta: copy.studio.cta,
    ctaHref: hireHref(`${source}-abertura`, locale),
    secondary: home.hero.secondary,
    explore: copy.station.explore,
    back: copy.station.back,
    problem: copy.station.problem,
    onScreen: copy.station.onScreen,
    hint: copy.station.hint,
    pointLabel: copy.station.pointLabel,
    of: copy.station.of,
    next: copy.station.next,
    note: copy.station.note,
    link: copy.case.link,
    shotAlt: copy.station.shotAlt,
    project: {
      title: project.title,
      headline: project.headline ?? copy.case.intro,
      problem: project.problem ?? project.description,
      stack: `${project.tech.join(", ")}${project.year ? ` · ${project.year}` : ""}`,
      href: `${prefix}/projetos/${STATION_CASE}`,
    },
    before: copy.case.decision.before,
    after: copy.case.decision.after,
    points: copy.station.points,
    modules: copy.case.decision.modules,
  };

  return (
    <div
      className={`edh edh-v3 edh-v4 edh-home ${plexSans.variable} ${plexMono.variable}`}
      lang={copy.lang}
      data-scroll-page
    >
      <HtmlLang lang={en ? "en" : "pt-BR"} />
      <a href="#conteudo" className="edh-skip">
        {copy.skip}
      </a>
      <BrandHeader
        copy={copy}
        home={homeHref}
        links={home.nav.links}
        languageHref={otherLocaleHref}
        ctaHref={hireHref(`${source}-nav`, locale)}
      />

      <main id="conteudo">
        <StationHero copy={hero} />
        <HomeProjects copy={home} locale={locale} />
        <HomeSolutions copy={home} locale={locale} />
        <HomeMethod copy={home} />
        <HomeAbout copy={home} locale={locale} />
        <HomeContact copy={home} source={`${source}-contato`} locale={locale} />
      </main>

      <HomeFooter
        copy={home}
        locale={locale}
        homeHref={homeHref}
        otherLocaleHref={otherLocaleHref}
        contactHref={hireHref(`${source}-rodape`, locale)}
      />
    </div>
  );
}
