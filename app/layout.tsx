import type { Metadata } from "next";
import { geist, theSeasons } from "./fonts";
import "./globals.css";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Backdrop } from "@/components/site/backdrop";
import { NegativeReveal } from "@/components/site/negative-reveal";
import { Preloader } from "@/components/site/preloader";
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { SITE_URL } from "@/lib/site";

const TITLE = "Mónica Calle — Diseñadora UX/UI & Front-End";
const DESC =
  "Portafolio de Mónica Calle. Diseño UX/UI, diseño gráfico y desarrollo front-end con una mirada visual, estratégica y cuidada.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  metadataBase: new URL(SITE_URL),
  applicationName: "Portafolio Mónica Calle",
  authors: [{ name: "Mónica Calle" }],
  creator: "Mónica Calle",
  keywords: [
    "Mónica Calle",
    "Diseñadora UX/UI",
    "Diseño de producto",
    "Diseño web",
    "Front-End",
    "Figma",
    "Branding",
    "React",
    "WordPress",
    "Valencia",
    "portafolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "Mónica Calle — Portafolio",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} ${theSeasons.variable}`} suppressHydrationWarning>
      <body className="grain">
        <Backdrop />
        <Preloader />
        <Cursor />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
        <NegativeReveal />
      </body>
    </html>
  );
}
