import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/i18n/paths";

/*
  The shared furniture behind every generated share card.

  There are four of these routes now (home, the two case studies, the graphic
  portfolio) and they have to look like one family, so the palette, the size
  and the font loading live here rather than being copied per route.
*/
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Brand colours, kept literal: this renders outside the CSS pipeline, so the
// custom properties in globals.css are not available here.
export const PAPER = "#f7f1e6";
export const INK = "#240e06";
export const BURGUNDY = "#4e0909";
export const BLUE = "#c4d9dd";

/** TheSeasons is a TTF because Satori cannot embed woff2. */
export function seasonsFont() {
  return readFile(join(process.cwd(), "public/fonts/the-seasons-regular.ttf"));
}

/**
 * A PNG already read off disk, as a data URL for Satori.
 *
 * The read itself deliberately stays in the route files, against literal
 * paths. This used to take a path string and do the read here, and because
 * that argument was a runtime value Next's file tracer could not resolve it --
 * so it gave up and bundled the whole of public/ into every function that
 * called it: 86.66 MB each, including two 20 MB case-study PDFs and a 19 MB
 * mockup, to draw a card that needs 2.4 MB. The literal path is what makes the
 * trace work; see app/[locale]/opengraph-image.tsx, which traces one file.
 */
export function toDataUrl(png: Buffer) {
  return `data:image/png;base64,${png.toString("base64")}`;
}

/**
 * TheSeasons draws "/" and "-" as decorative ornaments, not punctuation, and
 * the licensed file here is a demo build whose ornament carries a DEMO
 * watermark -- so "Diseño UX/UI" rendered as "Diseño UX(DEMO)UI" on the card.
 * The homepage card sidesteps this by never writing a slash; the case-study
 * cards take their text from the case-study copy, which does. Swapping to the
 * middot the rest of that copy already uses keeps it readable and keeps the
 * watermark off Monica's share images.
 */
export function serifSafe(text: string) {
  return text
    .replace(/\s*[/-]\s*/g, " · ")
    .replace(/(?: · )+/g, " · ")
    .trim();
}

/**
 * Long titles have to shrink or Satori overflows them off the card without
 * complaining. Measured against the real titles at 1200x630.
 */
function titleSize(title: string) {
  if (title.length <= 10) return 128;
  if (title.length <= 18) return 96;
  return 72;
}

export function ProjectCard({
  wordmark,
  title,
  subtitle,
  footnote,
  image,
  imageAlt,
}: {
  wordmark: string;
  title: string;
  subtitle: string;
  footnote: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: PAPER,
        fontFamily: "Seasons",
        color: INK,
        position: "relative",
      }}
    >
      {/* The words. Kept to the left half so the image never crowds them. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 660,
          padding: "72px 56px 72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: BURGUNDY }}>
          {wordmark}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: titleSize(title), lineHeight: 1, color: INK }}>
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 30, color: BURGUNDY, lineHeight: 1.25 }}>
            {serifSafe(subtitle)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 22, color: INK, opacity: 0.7 }}>
          <div style={{ display: "flex", width: 90, height: 6, background: BURGUNDY, borderRadius: 6 }} />
          <div style={{ display: "flex" }}>{serifSafe(footnote)}</div>
        </div>
      </div>

      {/* The work itself. A card for a design project that shows no design is
          the problem this route exists to solve, so the image is half the
          canvas, bled to the edges. */}
      <div style={{ display: "flex", width: 540, height: "100%", position: "relative" }}>
        <img
          src={image}
          alt={imageAlt}
          width={540}
          height={630}
          style={{ width: 540, height: 630, objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          width: 14,
          height: "100%",
          background: BLUE,
        }}
      />
    </div>
  );
}

/**
 * The canonical URL of a route's generated share card.
 *
 * Next resolves the file-convention image against the route it rendered, which
 * under localePrefix "as-needed" is the internal /es/... path -- so the Spanish
 * pages, the canonical ones, advertised an og:image that answered 307. Several
 * scrapers do not follow redirects for images, and those are the URLs Monica
 * actually shares. localePath is the same helper the canonical tag and the
 * sitemap use, so the card cannot disagree with them.
 */
export function shareImage(locale: string, routePath: string, alt: string) {
  const path = routePath === "/" ? "/opengraph-image" : `${routePath}/opengraph-image`;
  return [
    {
      url: `${SITE_URL}${localePath(locale, path)}`,
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      type: OG_CONTENT_TYPE,
      alt,
    },
  ];
}
