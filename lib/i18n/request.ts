import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isLocale, type Locale } from "./config";
import en from "@/messages/en";
import es from "@/messages/es";

const resources = { es, en } as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  // ES is the hard default. Only an explicit choice — the locale cookie set by
  // the language switcher — changes it. No Accept-Language auto-detection, so
  // first-time visitors and crawlers (e.g. OpenGraph fetches) always get Spanish.
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return { locale, messages: resources[locale] };
});
