import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/lib/attribution.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
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
    navigate: (path, search = "") => Object.assign(location, { pathname: path, search }),
    saved: () => entries.get("edh-attr"),
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
