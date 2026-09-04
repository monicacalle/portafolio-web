import { ImageResponse } from "next/og";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CASE_STUDY_SLUGS } from "@/lib/case-studies";
import { routing } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  ProjectCard,
  toDataUrl,
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
// Never reaches the HTML -- page.tsx sets openGraph.images explicitly -- but a
// per-slug route must not name both projects, in case that override is removed.
export const alt = "Mónica Calle";

// The screen that already illustrates each case study on the page itself.
// Literal paths, read here rather than behind a helper taking a path argument:
// a runtime path defeats Next's file tracer, which then bundles all of public/
// into this function. See lib/og/card.ts.
const IMAGE: Record<string, () => Promise<Buffer>> = {
  vibe: () => readFile(join(process.cwd(), "public/images/vibe.png")),
  voluntee: () => readFile(join(process.cwd(), "public/images/voluntee.png")),
};

// Metadata images are their own route handlers with their own segment config,
// so the dynamicParams on page.tsx does not reach here. Without this, every
// unknown slug rendered a real 200 card -- branded, bylined, blank-titled --
// for a URL the site answers 404 to.
export const dynamicParams = false;

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
  // hasOwn, not `IMAGE[slug] ?? fallback`: IMAGE["constructor"] resolves up the
  // prototype chain to a function, which is not nullish, so ?? never fired and
  // the read threw ERR_INVALID_ARG_TYPE -- a 500 on /proyectos/constructor/
  // opengraph-image. The sibling lookup above already guards this way.
  const read = Object.hasOwn(IMAGE, slug) ? IMAGE[slug] : undefined;
  if (!cs || !read) notFound();

  const [font, png] = await Promise.all([seasonsFont(), read()]);
  const image = toDataUrl(png);

  return new ImageResponse(
    (
      <ProjectCard
        wordmark={og("wordmark")}
        title={cs.title}
        // The tagline is a full sentence written for the page; on a card at
        // this size it wraps into a wall, so the card carries the role and
        // year, which is what a reader scans a project link for.
        subtitle={`${cs.meta.role} · ${cs.meta.year}`}
        footnote={og("role")}
        image={image}
        imageAlt={cs.title}
      />
    ),
    { ...size, fonts: [{ name: "Seasons", data: font, style: "normal", weight: 400 }] },
  );
}
