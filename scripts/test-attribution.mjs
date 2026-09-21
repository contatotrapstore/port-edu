import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/lib/attribution.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const workanaLinkSource = fs.readFileSync(new URL("../src/components/workana/WorkanaLink.tsx", import.meta.url), "utf8");
const compiledWorkanaLink = ts.transpileModule(workanaLinkSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function browserSession({ path = "/", search = "", referrer = "", saved, storageBlocked = false } = {}) {
  const entries = new Map(saved ? [["edh-attr", saved]] : []);
  const storage = {
    getItem: (key) => {
      if (storageBlocked) throw new Error("Storage disabled");
      return entries.get(key) ?? null;
    },
    setItem: (key, value) => {
      if (storageBlocked) throw new Error("Storage disabled");
      entries.set(key, value);
    },
  };
  const location = { pathname: path, search };
  const context = vm.createContext({
    exports: {}, URL, URLSearchParams,
    window: { location, sessionStorage: storage },
    document: { referrer }, sessionStorage: storage,
  });
  vm.runInContext(compiled, context);
  return {
    read: () => JSON.parse(JSON.stringify(context.exports.getAttribution())),
    compact: () => context.exports.compactAttribution?.(),
    navigate: (path, search = "") => Object.assign(location, { pathname: path, search }),
    saved: () => entries.get("edh-attr"),
    clickWorkana: () => {
      const events = [];
      const componentContext = vm.createContext({
        exports: {}, window: { location },
        require: (name) => {
          if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }) };
          if (name === "@vercel/analytics") return { track: (name, properties) => events.push({ name, properties }) };
          if (name === "@/lib/links") return { workanaHref: () => "https://www.workana.com/profile" };
          if (name === "@/lib/attribution") return context.exports;
          throw new Error(`Unexpected component dependency: ${name}`);
        },
      });
      vm.runInContext(compiledWorkanaLink, componentContext);
      componentContext.exports.default({ location: "case_clinafy", children: "Workana" }).props.onClick();
      return JSON.parse(JSON.stringify(events));
    },
  };
}

test("first-page capture survives a home -> full case -> Workana CTA journey", () => {
  const session = browserSession({ search: "?src=proposta_sistema", referrer: "https://www.workana.com/messages" });
  session.read(); // The root initializer runs before the visitor follows a case link.
  session.navigate("/projetos/clinafy");
  assert.deepEqual(session.read(), { src: "proposta_sistema", ref: "www.workana.com", landing: "/" });
});

test("a reload restores the original landing and source from session storage", () => {
  const first = browserSession({ path: "/workana", search: "?utm_source=workana&src=other" });
  first.read();
  const reloaded = browserSession({ path: "/projetos/rei", search: "?src=case", saved: first.saved() });
  assert.deepEqual(reloaded.read(), { src: "workana", landing: "/workana" });
});

test("blocked storage still preserves the first attribution through internal navigation", () => {
  const session = browserSession({ search: "?src=proposta_ia", storageBlocked: true });
  session.read();
  session.navigate("/projetos/mudapaisagens");
  assert.deepEqual(session.read(), { src: "proposta_ia", landing: "/" });
});

test("corrupt saved data is replaced with the current entry instead of losing attribution", () => {
  const session = browserSession({ path: "/workana", search: "?src=convite", saved: "{broken" });
  assert.deepEqual(session.read(), { src: "convite", landing: "/workana" });
  assert.deepEqual(JSON.parse(session.saved()), { src: "convite", landing: "/workana" });
});

test("unexpected saved data cannot replace a valid attribution object", () => {
  const session = browserSession({ search: "?src=perfil", saved: '"invalid"' });
  assert.deepEqual(session.read(), { src: "perfil", landing: "/" });
});

test("direct visits retain their initial landing without attributing a later internal query", () => {
  const session = browserSession({ path: "/projetos" });
  session.read();
  session.navigate("/projetos/pace", "?src=internal");
  assert.deepEqual(session.read(), { landing: "/projetos" });
});

test("server rendering does not access browser state", () => {
  const context = vm.createContext({ exports: {} });
  vm.runInContext(compiled, context);
  assert.equal(JSON.stringify(context.exports.getAttribution()), "{}");
});

test("all campaign fields survive internal navigation and a full reload", () => {
  const first = browserSession({
    path: "/servicos/integracoes-e-automacoes",
    search: "?utm_source=google&utm_medium=organic&utm_campaign=integracoes&utm_content=case_muda",
    referrer: "https://www.google.com/search?q=integracao",
  });
  const expected = {
    src: "google", medium: "organic", campaign: "integracoes", content: "case_muda",
    ref: "www.google.com", landing: "/servicos/integracoes-e-automacoes",
  };
  assert.deepEqual(first.read(), expected);
  first.navigate("/projetos/mudapaisagens", "?utm_campaign=internal");
  assert.deepEqual(first.read(), expected);
  const reload = browserSession({ path: "/workana", saved: first.saved() });
  assert.deepEqual(reload.read(), expected);
});

test("query values are trimmed, bounded, and invalid values do not block source fallback", () => {
  const params = new URLSearchParams({
    utm_source: " \n ", src: " workana ", utm_medium: " organic ",
    utm_campaign: "c".repeat(200), utm_content: "invalid\u0000content",
    email: "not-an-attribution-field@example.com",
  });
  assert.deepEqual(browserSession({ search: `?${params}` }).read(), {
    src: "workana", medium: "organic", campaign: "c".repeat(64), landing: "/",
  });
});

test("stored attribution is allowlisted, validates types, and bounds old values", () => {
  const saved = JSON.stringify({
    landing: "/projetos", src: "old_source", medium: ["invalid"],
    campaign: { value: "invalid" }, content: "x".repeat(300), ref: 17,
    email: "not-an-attribution-field@example.com", unexpected: "drop-me",
  });
  assert.deepEqual(browserSession({ search: "?src=new", saved }).read(), {
    src: "old_source", content: "x".repeat(64), landing: "/projetos",
  });
});

test("legacy saved attribution retains its initial landing and source", () => {
  const legacy = { src: "proposta_sistema", ref: "www.workana.com", landing: "/workana" };
  const session = browserSession({
    path: "/projetos/clinafy", search: "?utm_campaign=later", saved: JSON.stringify(legacy),
  });
  assert.deepEqual(session.read(), legacy);
});

test("invalid stored landing is recaptured without forwarding arbitrary fields", () => {
  const session = browserSession({
    path: "/servicos", search: "?fbclid=opaque-click-id",
    saved: JSON.stringify({ landing: "https://invalid.example/", src: "old", campaign: "old" }),
  });
  assert.deepEqual(session.read(), { src: "meta-ads", landing: "/servicos" });
});

test("click ID fallbacks and source precedence remain compatible with ad entrances", () => {
  assert.deepEqual(browserSession({ path: "/contratar", search: "?gclid=id&fbclid=id" }).read(), {
    src: "google-ads", landing: "/contratar",
  });
  assert.deepEqual(browserSession({ path: "/contratar", search: "?utm_source=meta&src=other&gclid=id" }).read(), {
    src: "meta", landing: "/contratar",
  });
});

test("compact event data preserves normal attribution in valid JSON under the Pro value limit", () => {
  const session = browserSession({
    path: "/projetos/clinafy",
    search: "?utm_source=google&utm_medium=organic&utm_campaign=sistemas&utm_content=case",
    referrer: "https://www.google.com/search?q=software",
  });
  const compact = session.compact();
  assert.equal(typeof compact, "string");
  assert.ok(compact.length <= 255);
  assert.deepEqual(JSON.parse(compact), session.read());
});

test("compact event data remains valid JSON with oversized and escaped values", () => {
  const params = new URLSearchParams({
    utm_source: 's"\\'.repeat(80), utm_campaign: 'c"\\'.repeat(80),
    utm_content: 'x"\\'.repeat(80), utm_medium: 'm"\\'.repeat(80),
  });
  const session = browserSession({
    path: `/${'p"\\'.repeat(150)}`, search: `?${params}`, referrer: `https://${"r".repeat(60)}.example/path`,
  });
  const compact = session.compact();
  assert.equal(typeof compact, "string");
  assert.ok(compact.length <= 255);
  const parsed = JSON.parse(compact);
  assert.equal(parsed.src, session.read().src.slice(0, 32));
  assert.equal(parsed.campaign, session.read().campaign.slice(0, 40));
  assert.ok(parsed.content?.startsWith("x"));
  assert.ok(Object.keys(parsed).every(key => ["src", "medium", "campaign", "content", "ref", "landing"].includes(key)));
});

test("a portfolio click preserves the conversion event and adds bounded attribution as a separate event", () => {
  const session = browserSession({
    path: "/projetos/clinafy", search: "?utm_source=google&utm_campaign=software&utm_content=case",
    referrer: "https://www.google.com/search",
  });
  const events = session.clickWorkana();
  assert.equal(events.length, 2);
  assert.deepEqual(events[0], { name: "workana_cta", properties: { location: "case_clinafy", src: "google" } });
  assert.equal(events[1].name, "workana_attribution");
  assert.equal(events[1].properties.location, "case_clinafy");
  assert.deepEqual(JSON.parse(events[1].properties.attribution), session.read());
  assert.ok(events.every(event => Object.keys(event.properties).length <= 2));
});

test("ad routes preserve their original event payload and event count", () => {
  for (const path of ["/contratar", "/contratar/", "/solucoes", "/solucoes/integracao"]) {
    const session = browserSession({ path, search: "?src=meta&utm_campaign=ads" });
    assert.deepEqual(session.clickWorkana(), [
      { name: "workana_cta", properties: { location: "case_clinafy", src: "meta" } },
    ]);
  }
});
