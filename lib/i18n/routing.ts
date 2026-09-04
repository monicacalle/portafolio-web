import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "./config";

/**
 * Locale lives in the URL, not in a cookie.
 *
 * The cookie version meant Spanish and English shared one address, so Google
 * could only ever index one of them and there was no English URL to send
 * anyone. For someone applying to remote-EU roles that made half the site
 * invisible to search, and hreflang impossible, because hreflang annotates
 * alternate URLs and there were none.
 *
 * localePrefix "as-needed" keeps Spanish at the bare paths that are already
 * live, indexed and in the sitemap -- monicacalle.es/, /proyectos/vibe -- and
 * puts English under /en. Nothing that currently works breaks.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  // No Accept-Language sniffing: a first-time visitor and a crawler both get
  // Spanish at "/", which is what the canonical tag and the OG image assume.
  localeDetection: false,
});
