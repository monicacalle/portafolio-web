import localFont from "next/font/local";

// Geist — body/UI. Two weights, matching the reference site's exact files.
export const geist = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "../public/fonts/geist-v1-latin-regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/geist-v1-latin-800.woff2", weight: "800", style: "normal" },
  ],
});

// New York — editorial display serif for headings and titles.
export const newYork = localFont({
  variable: "--font-heading",
  display: "swap",
  src: [{ path: "../public/fonts/NewYork PERSONAL USE.otf", weight: "400", style: "normal" }],
});
