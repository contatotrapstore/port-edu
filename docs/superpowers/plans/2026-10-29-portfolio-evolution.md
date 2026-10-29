# Portfolio evolution — implementation plan

> Execute inline using executing-plans. The user approved the audit and implementation; no additional design gate is needed.

**Goal:** Improve image legibility, discovery and useful interaction; add documented projects in a preview.
**Architecture:** Preserve the existing brand shell. Add scoped catalog data, a small client filter, native image dialog and a guided product exhibit. Existing Workana and admin stay isolated.
**Tech Stack:** Next.js, React, TypeScript, native CSS/dialog.
**Spec:** output/auditoria-portfolio-2026-10-29/AUDITORIA.md

## Constraints
- Preview only. No production promotion or Instagram changes.
- Real captures, no invented UI or result metrics. Livoreto explicitly in development.
- PT/EN, keyboard, touch and reduced motion. Preserve existing projects.
- No new runtime dependencies; retain low-resolution source limitations honestly.

## Review focus
- Filters expose every project without JS and handle a direct category anchor.
- Image dialog closes by Esc and returns focus; original-resolution view remains scrollable on mobile.
- New cases have bilingual metadata and sitemap entries only when the new site is enabled.
- Demonstrations do not call customer backends or submit real transactions.
- Workana, admin and existing content-worker paths remain unaffected.

## Tasks
- [ ] Capture public pages for King Prime, Beeder, PnL, ChatCupom, Marli and Livoreto; use original PlanetShake screenshots. Record source and limits.
- [ ] Add a bilingual project data module and connect new-site case routes, catalog and sitemap.
- [ ] Correct image fit; add native image enlargement and accessible category filters.
- [ ] Add a guided PlanetShake exhibit using actual product screens, with explicit snapshot labeling and touch controls.
- [ ] Validate builds, isolation, links, desktop/mobile and keyboard interactions; review diff and publish preview only.

## Ledger
- Starting commit fbb30aa; branch codex/portfolio-evolution in existing managed worktree. Existing untracked content assets preserved.
- Native dialog guidance retrieved; use showModal, visible close and native Esc/focus management.
