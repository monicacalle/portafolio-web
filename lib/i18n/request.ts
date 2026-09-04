import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { isLocale, type Locale } from "./config";
import en from "@/messages/en";
import es from "@/messages/es";

const resources = { es, en } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // The locale now comes from the URL segment rather than a cookie, so it is
  // the same for a crawler as for a person and every page has one address.
  const requested = await requestLocale;
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale;

  return { locale, messages: resources[locale] };
});
