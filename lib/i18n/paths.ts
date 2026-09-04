import { DEFAULT_LOCALE } from "./config";

/**
 * The path a route has in a given locale.
 *
 * localePrefix is "as-needed", so Spanish keeps the bare paths that are already
 * indexed and English sits under /en. One home for that rule, because canonical
 * tags, hreflang alternates and the sitemap all have to agree on it.
 */
export function localePath(locale: string, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  // "/" would otherwise give "/en/", a second URL for the same page.
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
