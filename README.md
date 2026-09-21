# EDevsHub Portfolio

[![Live](https://img.shields.io/badge/live-edevshub.com-4ade80?style=flat-square)](https://edevshub.com)
[![Workana](https://img.shields.io/badge/Workana-HERO-22d3ee?style=flat-square)](https://www.workana.com/freelancer/89c9896a5874018ef858f71acf0f5dc6)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-personal-lightgrey?style=flat-square)](#)

Portfolio pessoal de **Eduardo Gouveia** — sistemas sob medida, SaaS e integrações; Full Stack Sênior, nível HERO na Workana. Background 3D em Three.js, conteúdo HTML e navegação entre 5 capítulos (Hero, About, Projects, Skills, Contact).

## Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **UI**: React 19, TypeScript
- **3D**: [Three.js](https://threejs.org) + [React Three Fiber](https://r3f.docs.pmnd.rs) + Drei
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Animação HTML**: [Framer Motion](https://www.framer.com/motion)
- **Hosting**: [Vercel](https://vercel.com) (auto-deploy on push `main`)

## Workana social proof

Dados conferidos no perfil público em **21/09/2026**:

- Nível **HERO**
- **180** projetos realizados · **4,75/5** · **181** avaliações
- Rankings são variáveis e não fazem parte da copy padrão.

O portfólio usa `portfolioWorkanaStats`. Os dados de campanha em `workanaStats` permanecem separados, pois a revisão do portfólio não altera `/contratar`.

## Setup local

```bash
git clone https://github.com/contatotrapstore/port-edu.git
cd port-edu
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

A revisão editável dos textos da Workana fica em [http://localhost:3000/revisao-workana](http://localhost:3000/revisao-workana), disponível apenas em desenvolvimento. Os rascunhos ficam no navegador. A página retorna 404 em produção.

## Estrutura

```
src/
├── app/
│   ├── layout.tsx          Root layout, fonts, metadata, JSON-LD
│   ├── page.tsx            5 sections HTML overlay
│   ├── globals.css         Tailwind v4
│   ├── icon.svg            Favicon (>_)
│   ├── apple-icon.tsx      Apple touch icon
│   ├── sitemap.ts          SEO
│   └── robots.ts           SEO
├── components/
│   └── experience/
│       └── Experience.tsx  Canvas R3F + scroll-jack
└── lib/
    └── constants.ts        Stats Workana, projetos, skills, capítulos
```

## Features

- **Background 3D contínuo** — partículas, hélice DNA, grid Tron, câmera reativa ao scroll progress
- **Scroll-jacking suave** — `target → current` via lerp 0.12, sincroniza HTML overlay e câmera 3D
- **Cross-fade entre sections** — opacity dinâmica nos 10% de borda de cada range (0..1)
- **Mobile-first** — touch handler com boundary detection, native scroll iOS dentro de cada section
- **SEO completo** — metadata Next.js, OpenGraph, JSON-LD Person schema, sitemap, robots
- **Acessibilidade** — texto em HTML real (não Canvas), contraste alto, aria labels

## Deploy

Push em `main` dispara build na Vercel automaticamente. Domínio configurado em `edevshub.com`.

## Links

- **Live**: https://edevshub.com
- **Workana**: https://www.workana.com/freelancer/89c9896a5874018ef858f71acf0f5dc6
- **GitHub**: https://github.com/contatotrapstore/port-edu

---

© Eduardo Gouveia · [contatotrapstore](https://github.com/contatotrapstore)
