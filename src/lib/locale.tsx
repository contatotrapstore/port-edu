"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Locale = "pt" | "en";

const LocaleContext = createContext<Locale>("pt");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Current locale for UI strings/content. Defaults to "pt" outside a provider. */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}
