import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CASE_STUDY_SLUGS } from "@/lib/case-studies";

// Derived from CASE_STUDY_SLUGS rather than hand-listed, because the
// hand-listed version silently went stale: the case-study routes shipped and
// the sitemap still claimed this was a single-page site, so neither of her two
// strongest product pages was ever submitted to a search engine.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...CASE_STUDY_SLUGS.map((slug) => ({
      url: `${SITE_URL}/proyectos/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
