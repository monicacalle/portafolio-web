import { ImageResponse } from "next/og";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CASE_STUDY_SLUGS } from "@/lib/case-studies";
import { routing } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  ProjectCard,
  imageDataUrl,
  seasonsFont,
} from "@/lib/og/card";

/*
  The share card for a case study.

  These two URLs are the ones most likely to be pasted into an application, a
  LinkedIn message or a Slack thread, and until now they carried no og:image at
  all: the parent card at app/[locale]/opengraph-image.tsx does not reach here,
  because generateMetadata in page.tsx sets its own openGraph block. So the link
  rendered as a bare row of text.

  It shows the project's own screen rather than the personal card, because what
  is being shared is the work.
*/
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Vibe / Voluntee";

// The screen that already illustrates each case study on the page itself.
const IMAGE: Record<string, string> = {
  vibe: "images/vibe.png",
  voluntee: "images/voluntee.png",
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_STUDY_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export default async function CaseStudyOgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  // Before getTranslations, or next-intl falls back to reading request headers
  // to find the locale and this route stops being statically rendered.
  setRequestLocale(locale as Locale);

  const t = await getTranslations("caseStudies");
  const og = await getTranslations("og");
  const raw = t.raw as (key: string) => unknown;
  const items = raw("items") as Record<
    string,
    { title: string; tagline: string; meta: { role: string; year: string } }
  >;
  const cs = Object.hasOwn(items, slug) ? items[slug] : undefined;

  const [font, image] = await Promise.all([
    seasonsFont(),
    imageDataUrl(IMAGE[slug] ?? IMAGE.vibe),
  ]);

  return new ImageResponse(
    (
      <ProjectCard
        wordmark={og("wordmark")}
        title={cs?.title ?? ""}
        // The tagline is a full sentence written for the page; on a card at
        // this size it wraps into a wall, so the card carries the role and
        // year, which is what a reader scans a project link for.
        subtitle={cs ? `${cs.meta.role} · ${cs.meta.year}` : ""}
        footnote={og("role")}
        image={image}
        imageAlt={cs?.title ?? ""}
      />
    ),
    { ...size, fonts: [{ name: "Seasons", data: font, style: "normal", weight: 400 }] },
  );
}
