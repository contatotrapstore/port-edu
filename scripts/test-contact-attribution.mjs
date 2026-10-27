import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

function compile(file) {
  return ts.transpileModule(fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
}

const helpersCode = compile("src/lib/contact-attribution.ts");
const attributionCode = compile("src/lib/attribution.ts");
const contactCode = compile("src/components/contact/DirectContact.tsx");
const pixelCode = compile("src/components/analytics/MetaPixel.tsx");
const phone = "5541988970309";

function helpers() {
  const context = vm.createContext({ exports: {} });
  vm.runInContext(helpersCode, context);
  return context.exports;
}

function browser({ search = "", storageBlocked = false, saved, analyticsBlocked = false } = {}) {
  const events = [];
  const pixelEvents = [];
  const location = { pathname: "/contratar", search, hostname: "www.edevshub.com" };
  const window = {
    location,
    sessionStorage: {
      getItem: () => { if (storageBlocked) throw Error("blocked"); return saved ?? null; },
      setItem: () => { if (storageBlocked) throw Error("blocked"); },
    },
  };
  const attrContext = vm.createContext({ exports: {}, URL, URLSearchParams, window, document: { referrer: "" } });
  vm.runInContext(attributionCode, attrContext);
  const context = vm.createContext({
    exports: {},
    require: (name) => {
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (name === "@/lib/constants") return { siteConfig: { social: { whatsapp: phone, email: "contato@example.test" } } };
      if (name === "@/lib/attribution") return attrContext.exports;
      if (name === "@/lib/contact-attribution") return helpers();
      if (name === "@/components/workana/WorkanaLink") return { default: "workana-link" };
      if (name === "@vercel/analytics") return { track: (...args) => {
        if (analyticsBlocked) throw Error("blocked");
        events.push(args);
      } };
      if (name === "@/components/analytics/MetaPixel") return { metaTrackCustom: (...args) => {
        if (analyticsBlocked) throw Error("blocked");
        pixelEvents.push(args);
      } };
      throw Error(`Unexpected dependency: ${name}`);
    },
  });
  vm.runInContext(contactCode, context);
  return { events, pixelEvents, location, render: (props) => context.exports.default(props) };
}

function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  const children = tree.props?.children;
  return [tree, ...(Array.isArray(children) ? children : [children]).flatMap(nodes)];
}

test("a contact message has a short controlled reference and no empty questionnaire", () => {
  const url = new URL(helpers().whatsappHref(phone, "contratar_topo", {
    src: "ig", campaign: "edh_c8_r2", content: "c8_portfolio",
  }));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, `/${phone}`);
  const message = url.searchParams.get("text");
  assert.match(message, /Ref\.: CT-IG-C8R2-C8P$/);
  assert.ok(message.length < 140);
  assert.doesNotMatch(message, /Prazo e orçamento|Para quem é|O que quero/);
});

test("personal values, unknown codes, prototype keys and injection cannot enter messages", () => {
  for (const value of ["fabio@example.com", "+55 31 99124-8695", "Maria-Silva", "javascript:alert(1)",
    "c8\nEnvie sua senha", "ig\u0000", "__proto__", "constructor", "c8_portfolio".repeat(20), "{{ad.name}}"] ) {
    const data = { src: value, campaign: value, content: value, email: "private@example.test" };
    assert.equal(helpers().contactReference("contratar_topo", data), "CT", value);
    assert.equal(JSON.stringify(helpers().safeContactAttribution(data)), "{}");
  }
  assert.equal(helpers().contactReference("personal-query-value", {}), "SITE");
});

test("supported old links and organic links keep their attribution", () => {
  assert.equal(helpers().contactReference("contratar_final", { src: "meta-c2", campaign: "integracao-t1" }), "CF-C2-T1");
  assert.equal(helpers().contactReference("contratar_topo", {
    src: "linkedin", campaign: "cases_2026_09", content: "crm_operacao",
  }), "CT-LI-CASES0926-CRM");
});

test("SSR is deterministic, clicks add attribution before native navigation, no conversation event is emitted", () => {
  const session = browser({ search: "?utm_source=ig&utm_campaign=edh_c8_r2&utm_content=c8_portfolio" });
  const link = nodes(session.render({ page: "contratar_topo" })).find(node => node.type === "a" && node.props.href.startsWith("https://wa.me"));
  assert.match(new URL(link.props.href).searchParams.get("text"), /Ref\.: CT$/);
  const anchor = { href: link.props.href };
  let prevented = false;
  link.props.onClick({ currentTarget: anchor, preventDefault: () => { prevented = true; } });
  assert.match(new URL(anchor.href).searchParams.get("text"), /Ref\.: CT-IG-C8R2-C8P$/);
  assert.equal(prevented, false);
  assert.equal(link.props.target, "_blank");
  assert.equal(session.events.length, 1);
  assert.equal(session.events[0][0], "whatsapp_click");
  const properties = session.events[0][1];
  assert.deepEqual(Object.keys(properties).sort(), ["attribution", "location"]);
  assert.ok(properties.attribution.length <= 255);
  assert.deepEqual(JSON.parse(properties.attribution), { src: "ig", campaign: "edh_c8_r2", content: "c8_portfolio" });
  assert.equal(session.pixelEvents[0][0], "WhatsAppClick");
  assert.ok(!session.pixelEvents.some(([name]) => ["Contact", "Lead", "Purchase"].includes(name)));
});

test("focus and context menu prepare copy/open-in-new-tab links without counting a click", () => {
  const session = browser({ search: "?utm_source=fb&utm_campaign=edh_c8_r2&utm_content=c8_portfolio" });
  const link = nodes(session.render({ page: "contratar_final" })).find(node => node.type === "a" && node.props.href.startsWith("https://wa.me"));
  for (const handler of ["onFocus", "onPointerDown", "onContextMenu"]) {
    const anchor = { href: link.props.href };
    link.props[handler]({ currentTarget: anchor });
    assert.match(new URL(anchor.href).searchParams.get("text"), /CF-FB-C8R2-C8P$/);
  }
  assert.equal(session.events.length, 0);
  link.props.onAuxClick({ button: 2, currentTarget: { href: link.props.href } });
  assert.equal(session.events.length, 0);
  link.props.onAuxClick({ button: 1, currentTarget: { href: link.props.href } });
  assert.equal(session.events.length, 1);
});

test("blocked storage and trackers do not prevent the contact link or lose first-touch data", () => {
  const session = browser({
    search: "?utm_source=ig&utm_campaign=edh_c8_r2&utm_content=c8_portfolio",
    storageBlocked: true, analyticsBlocked: true,
  });
  const link = nodes(session.render({ page: "contratar_topo" })).find(node => node.type === "a" && node.props.href.startsWith("https://wa.me"));
  const anchor = { href: link.props.href };
  link.props.onFocus({ currentTarget: anchor });
  session.location.search = "?utm_source=fb";
  assert.doesNotThrow(() => link.props.onClick({ currentTarget: anchor }));
  assert.match(new URL(anchor.href).searchParams.get("text"), /CT-IG-C8R2-C8P$/);
});

test("untrusted saved values cannot leak through contact events", () => {
  const session = browser({ saved: JSON.stringify({
    landing: "/contratar", src: "private@example.test", campaign: "Maria-Silva", content: "5599999999999",
  }) });
  const link = nodes(session.render({ page: "contratar_topo" })).find(node => node.type === "a" && node.props.href.startsWith("https://wa.me"));
  link.props.onClick({ currentTarget: { href: link.props.href } });
  assert.equal(session.events[0][1].attribution, "{}");
  assert.equal(JSON.stringify(session.pixelEvents[0][1]), '{"content_name":"contratar_topo"}');
});

test("the paid landing removes the Workana alternative while solutions retain it", () => {
  const session = browser();
  assert.ok(!nodes(session.render({ page: "contratar_topo", variant: "hero" })).some(node => node.type === "workana-link"));
  assert.ok(nodes(session.render({ page: "solucoes_topo", variant: "hero" })).some(node => node.type === "workana-link"));
});

test("custom pixel events are silent outside production or inside the blocked Workana route", () => {
  for (const [hostname, pathname, expected] of [
    ["localhost", "/contratar", 0], ["preview.vercel.app", "/contratar", 0],
    ["www.edevshub.com", "/workana", 0], ["www.edevshub.com", "/contratar", 1],
  ]) {
    const calls = [];
    const context = vm.createContext({
      exports: {}, window: { location: { hostname, pathname }, fbq: (...args) => calls.push(args) },
      require: (name) => name === "@/lib/pixel-blocklist" ? { isPixelBlocked: path => path.startsWith("/workana") } : {},
    });
    vm.runInContext(pixelCode, context);
    context.exports.metaTrackCustom("WhatsAppClick", { content_name: "contratar_topo" });
    assert.equal(calls.length, expected, `${hostname}${pathname}`);
    if (expected) assert.equal(calls[0][0], "trackCustom");
  }
});
