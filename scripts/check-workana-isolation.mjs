/**
 * Guarda de compliance da zona Workana. Roda depois do `next build`.
 *
 * A /workana é enviada como credencial DENTRO de propostas da Workana. A
 * política da plataforma lista "página na internet" como dado de contato
 * proibido, e a punição escala em dois degraus: alerta + suspensão de
 * propostas e, na segunda vez, encerramento da conta — sem recurso.
 *
 * Duas checagens:
 *   1. O HTML renderizado da /workana não pode conter canal de contato
 *      (wa.me, WhatsApp, mailto, tel) nem link para uma rota interna que
 *      tenha canal de contato (/contratar, /solucoes) — nem link de volta
 *      para a home ou para os cases, que levariam ao mesmo lugar em 2 cliques.
 *   2. O componente DirectContact só pode ser importado em /contratar e
 *      /solucoes. Um refactor futuro não pode arrastá-lo para um componente
 *      compartilhado que a /workana também usa.
 *
 * Falhar aqui é intencional: melhor quebrar o deploy do que a conta.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const fail = (msg) => {
  console.error(`\n✖ ISOLAMENTO DA ZONA WORKANA VIOLADO\n\n${msg}\n`);
  process.exit(1);
};

// --- Checagem 1: HTML renderizado da /workana ---------------------------
const candidates = [
  ".next/server/app/workana.html",
  ".next/server/app/workana/index.html",
];
const htmlPath = candidates.map((p) => path.join(ROOT, p)).find(fs.existsSync);

if (!htmlPath) {
  console.warn(
    "⚠ check-workana-isolation: HTML da /workana não encontrado no build " +
      `(procurei em ${candidates.join(", ")}). Pulando a checagem de HTML.`
  );
} else {
  const html = fs.readFileSync(htmlPath, "utf8");

  const forbidden = [
    { re: /wa\.me|api\.whatsapp\.com|web\.whatsapp\.com/i, what: "link de WhatsApp" },
    { re: /mailto:/i, what: "link de e-mail (mailto:)" },
    { re: /href="tel:/i, what: "link de telefone (tel:)" },
    { re: /linkedin\.com/i, what: "link do LinkedIn" },
    {
      // Rotas internas, relativas ou absolutas no próprio domínio.
      re: /href="(?:https?:\/\/(?:www\.)?edevshub\.com)?\/(?:contratar|solucoes|projetos|en)(?:[/"?])/i,
      what: "link para rota interna (/contratar, /solucoes, /projetos ou /en)",
    },
    {
      re: /href="(?:https?:\/\/(?:www\.)?edevshub\.com)?\/"/i,
      what: "link para a home",
    },
  ];

  const hits = forbidden.filter(({ re }) => re.test(html));
  if (hits.length) {
    fail(
      `${htmlPath} contém ${hits.length} item(ns) proibido(s):\n` +
        hits.map((h) => `  · ${h.what}`).join("\n") +
        "\n\nA /workana é um beco sem saída: só CTAs para o perfil da Workana.\n" +
        "Canal direto e links internos vivem em /contratar e /solucoes/*."
    );
  }
}

// --- Checagem 2: onde DirectContact pode ser importado -------------------
const ALLOWED_PREFIXES = [
  path.join("src", "app", "contratar"),
  path.join("src", "app", "solucoes"),
  path.join("src", "components", "contact"), // a própria definição
];

const offenders = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.tsx?$/.test(entry.name)) {
      const src = fs.readFileSync(full, "utf8");
      if (!/from\s+["'][^"']*DirectContact["']/.test(src)) continue;
      const rel = path.relative(ROOT, full);
      if (!ALLOWED_PREFIXES.some((p) => rel.startsWith(p))) offenders.push(rel);
    }
  }
};
walk(path.join(ROOT, "src"));

if (offenders.length) {
  fail(
    "DirectContact importado fora das rotas permitidas:\n" +
      offenders.map((f) => `  · ${f}`).join("\n") +
      "\n\nSó /contratar e /solucoes/* podem expor canal direto."
  );
}

console.log("✓ zona Workana isolada (sem canal de contato nem link interno na /workana)");
