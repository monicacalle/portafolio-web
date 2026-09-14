import localFont from "next/font/local";

/*
  Three faces, all SIL Open Font License 1.1, all with NO Reserved Font Name —
  so subsetting, instancing and self-hosting are granted outright. Licence text
  travels with the binaries in public/fonts/licencias/, as OFL §2 requires.

  This replaced two faces that were never licensed for this site:

    NewYork PERSONAL USE.otf  — embedded string: "free for personal use".
                                It was --font-heading, i.e. every heading.
    the-seasons-regular.ttf   — a FONTSPRING DEMO build.

  The Seasons was worse than "a demo watermark". It carries 97 glyphs and NOT
  ONE Spanish accented character: no á é í ó ú ü ñ, no ¿ ¡, and no U+00B7 —
  which is the middot lib/og/card.tsx substitutes in to dodge the watermarked
  slash. So the serif on the share cards could not set "Mónica" or "Diseñadora
  gráfica", the two things those cards exist to say. Measured with fontTools,
  not inferred.

  The swap is a swap, never a delete-then-fix: next/font/local resolves `src` at
  BUILD time, so removing a file while this module still references it fails the
  build rather than degrading.
*/

// Body and UI. Already the site's sans; this upgrades two static cuts to the
// variable original, which costs fewer bytes than the pair it replaces.
export const geist = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [{ path: "../public/fonts/Geist-Variable.woff2", weight: "100 900", style: "normal" }],
});

// The Renaissance accent. EB Garamond is traced from the 1592 Egenolff-Berner
// specimen of Claude Garamont's roman and Robert Granjon's italic — the same
// hands whose punches Plantin bought to set Philip II's Polyglot Bible. It
// earns the Edition's conceit rather than decorating with it.
//
// The italic is NOT optional: app/edicion.css sets font-style: italic on
// --font-serif in two places, and one of them has no fallback.
export const garamond = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [
    { path: "../public/fonts/EBGaramond-Variable.woff2", weight: "400 800", style: "normal" },
    { path: "../public/fonts/EBGaramond-Italic-Variable.woff2", weight: "400 800", style: "italic" },
  ],
});

// Chapter titles. Its opsz axis spans 6–96 and browsers map font-size to it
// automatically, which does real work here: --font-display has two consumers
// running from ~34px (the hero wordmark's clamp floor) to ~153px (a chapter
// title at its cap), a 4.5x range, with no CSS.
export const bodoni = localFont({
  variable: "--font-display",
  display: "swap",
  src: [{ path: "../public/fonts/BodoniModa-Variable.woff2", weight: "400 900", style: "normal" }],
});
