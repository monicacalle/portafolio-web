import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CASE_STUDY_SLUGS, GRAFICO_ROUTE } from "@/lib/case-studies";
import { routing } from "@/lib/i18n/routing";
import { localePath } from "@/lib/i18n/paths";

// Derived from CASE_STUDY_SLUGS rather than hand-listed, because the
// hand-listed version silently went stale: the case-study routes shipped and
// the sitemap still claimed this was a single-page site, so neither of her two
// strongest product pages was ever submitted to a search engine.
// No lastModified: it was new Date(), which stamped every URL with the build
// time on every deploy and told crawlers everything had changed whenever
// anything did. We do not track per-page content dates, and an absent field is
// honest where a wrong one is actively misleading.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", GRAFICO_ROUTE, ...CASE_STUDY_SLUGS.map((slug) => `/proyectos/${slug}`)];

  // Every route in every locale. Before the locale moved into the URL there was
  // one entry per page and the English site had no address to submit at all.
  return routing.locales.flatMap((locale) =>
    paths.map((path) => {
      const suffix = localePath(locale, path);
      return {
        url: suffix === "/" ? SITE_URL : `${SITE_URL}${suffix}`,
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 1 : 0.8,
      };
    }),
  );
}
