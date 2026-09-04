import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CASE_STUDY_SLUGS, GRAFICO_ROUTE } from "@/lib/case-studies";

// Derived from CASE_STUDY_SLUGS rather than hand-listed, because the
// hand-listed version silently went stale: the case-study routes shipped and
// the sitemap still claimed this was a single-page site, so neither of her two
// strongest product pages was ever submitted to a search engine.
// No lastModified: it was new Date(), which stamped every URL with the build
// time on every deploy and told crawlers everything had changed whenever
// anything did. We do not track per-page content dates, and an absent field is
// honest where a wrong one is actively misleading.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}${GRAFICO_ROUTE}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...CASE_STUDY_SLUGS.map((slug) => ({
      url: `${SITE_URL}/proyectos/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
