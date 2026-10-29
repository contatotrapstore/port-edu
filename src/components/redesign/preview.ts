/**
 * A prévia do redesign é local. Em `next dev` ela existe; num build de
 * produção só com EDH_REDESIGN_PREVIEW=1 no ambiente do build, para medir
 * desempenho localmente. Um deploy sem essa flag responde 404.
 */
export function isRedesignPreviewEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.EDH_REDESIGN_PREVIEW === "1";
}

/**
 * Troca do site pela nova identidade: home, projetos, cases, serviços,
 * contratação e privacidade, em PT e EN. Lida no build (as páginas são
 * estáticas): com EDH_NEW_SITE=1 as rotas renderizam o design novo e as
 * versões em inglês de serviços, contratação e privacidade passam a existir;
 * sem a variável (ou com outro valor) tudo continua como está publicado.
 * Reverter é remover a variável e fazer um novo deploy; nenhum arquivo muda.
 */
export function isNewSiteEnabled(): boolean {
  return process.env.EDH_NEW_SITE === "1";
}
