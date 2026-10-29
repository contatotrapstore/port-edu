// Componentes do site novo importados pelas rotas atuais. O build resolve
// cada módulo para o componente (EDH_NEW_SITE=1) ou para null (ver next.config.ts).
declare module "@site/home" {
  const Component: typeof import("@/components/redesign/BrandHome").default | null;
  export default Component;
}
declare module "@site/projects" {
  const Component: typeof import("@/components/redesign/site/ProjectsIndex").default | null;
  export default Component;
}
declare module "@site/case" {
  const Component: typeof import("@/components/redesign/site/CasePage").default | null;
  export default Component;
}
declare module "@site/services" {
  const Component: typeof import("@/components/redesign/site/ServicesIndex").default | null;
  export default Component;
}
declare module "@site/service" {
  const Component: typeof import("@/components/redesign/site/ServiceView").default | null;
  export default Component;
}
declare module "@site/hire" {
  const Component: typeof import("@/components/contact/HirePage").default | null;
  export default Component;
}
declare module "@site/privacy" {
  const Component: typeof import("@/components/redesign/site/PrivacyPage").default | null;
  export default Component;
}
// CSS da /contratar atual: só entra no build sem EDH_NEW_SITE (ver next.config.ts).
declare module "@current/contratar-styles";
