# Portfolio — next preview

Base: fbb30aa. Branch: codex/portfolio-evolution. Preview only; production remains unchanged.

## Delivery
- 29 cases in PT/EN: existing 22 plus King Prime, PlanetShake, Beeder, PnL Global, ChatCupom, Marli Gouveia and Livoreto.
- Category filters with counts, direct category links and complete server-rendered content without JavaScript.
- Whole-image catalog covers. Home and cases offer native modal image inspection, fit/100%, Esc and native focus return. Home low-resolution sources are capped at their real width.
- Guided PlanetShake exhibit on the home: web/Android, map, legend and historical screens. Real captured screens; no requests to customer backends. Motion only after interaction and disabled with reduced-motion.

## Provenance and limits
Captures: public pages on 29 October 2026, in public/images/portfolio-2026. Beeder, King Prime, PnL, Marli and Livoreto were recaptured without Chrome's Dark Reader. ChatCupom and PlanetShake retain their original captured presentation. Planet Android screens are originals from Downloads/Planet/play-store/imagens, not generated mockups.

Code evidence: King Prime — Downloads/Renato; PlanetShake — Downloads/Planet/source; Beeder — Downloads/Beeder; PnL — Downloads/PNL; ChatCupom — Downloads/Fernando/web; Marli — Documents/Site Mae; Livoreto — Downloads/Plat Fernando. Read-only inspection; no client project was started and no private data was copied.

Livoreto remains labeled in development. PnL capture is the public marketing page, not the private trader system. Beeder is private-link selling, not a public marketplace. PlanetShake snapshots are not live monitoring or official alerts. No result metrics invented.

Rei Sol (830 px) and Muda (699 px) still need better original captures for further detail. No generative upscale of interface text. Additional local candidates remain listed in the earlier audit; their release status and usable media are not yet established, so they were not presented as completed work.

## Validation
- Builds with EDH_NEW_SITE=0 and =1 passed; Workana isolation passed in both.
- 26 existing attribution tests passed.
- Scoped ESLint and TypeScript passed; git diff --check passed.
- Local production build: 74 sitemap URLs returned 200 with correct server HTML language and canonical.
- Browser: category filtering and direct anchors; original image modal, 100% horizontal scrolling, Esc and focus restoration; PT/EN; 390 px without horizontal document overflow; desktop exhibit and Android switching.
- Independent source review caught hotspot focus loss, stale image dimensions and untranslated technology labels. Fixed before delivery.
- Chrome extension mutations produced hydration warnings (Dark Reader and bis_skin_checked); clean in-app browser had no execution errors in the checks performed.

## Modern Web Guidance
`dialog`: used native showModal with visible close, native Esc/focus management and overscroll containment. Applied: “DON'T add role=\"dialog\", aria-modal, a focus trap, inert toggling or an Esc handler.”

## Preview deployment
Use `vercel deploy --scope edevs --build-env EDH_NEW_SITE=1`; do not use --prod or promote. Existing production secrets are excluded by .vercelignore and scoped to production in Vercel. No publishing schedules were altered.
