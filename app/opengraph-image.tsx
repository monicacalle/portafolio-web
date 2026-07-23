import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PERSON } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${PERSON.name} — ${PERSON.jobTitle}`;

// Brand colours (kept literal; this runs outside the CSS pipeline).
const PAPER = "#f7f1e6";
const INK = "#240e06";
const BURGUNDY = "#4e0909";
const BLUE = "#c4d9dd";

export default async function OpengraphImage() {
  // TheSeasons is a TTF, which Satori can embed (woff2 cannot be used here).
  const seasons = await readFile(
    join(process.cwd(), "public/fonts/the-seasons-regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "72px 80px",
          fontFamily: "Seasons",
          color: INK,
          position: "relative",
        }}
      >
        {/* corner marks */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 6,
            color: BURGUNDY,
          }}
        >
          <span>PORTAFOLIO</span>
          <span style={{ color: INK, opacity: 0.55 }}>VALENCIA · ESPAÑA</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, lineHeight: 1, color: INK }}>
            {PERSON.name}
          </div>
          {/* TheSeasons renders "/" and "-" as ornaments, so the serif lines
              use middot separators and "Frontend" as one word. */}
          <div
            style={{
              marginTop: 26,
              fontSize: 40,
              color: BURGUNDY,
            }}
          >
            Diseñadora UX · UI · Frontend
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 24,
            color: INK,
            opacity: 0.7,
          }}
        >
          <span
            style={{
              width: 120,
              height: 6,
              background: BURGUNDY,
              borderRadius: 6,
            }}
          />
          <span>Diseño UX · UI · Branding · Frontend</span>
        </div>

        {/* accent bar down the right edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 14,
            height: "100%",
            background: BLUE,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Seasons", data: seasons, style: "normal", weight: 400 }],
    },
  );
}
