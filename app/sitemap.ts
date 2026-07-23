import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Single-page site: one canonical entry. Add routes here if project detail
// pages are introduced later.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
