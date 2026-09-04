/**
 * i18n config — single source of truth for supported locales.
 * The locale lives in the URL under app/[locale], not in a cookie -- see
 * lib/i18n/routing.ts for why that changed.
 */
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE_NAME = "locale";

export const isLocale = (value: string | null | undefined): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value);

// BCP-47 tags for <html lang> / OpenGraph.
export const OG_LOCALE: Record<Locale, string> = {
  es: "es_ES",
  en: "en_US",
};
