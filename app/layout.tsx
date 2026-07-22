import type { Metadata } from "next";
import { geist, theSeasons } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mónica Calle — Diseñadora UX/UI & Front-End",
  description:
    "Portafolio de Mónica Calle. Diseño UX/UI, diseño gráfico y desarrollo front-end con una mirada visual, estratégica y cuidada.",
  metadataBase: new URL("https://portafolio-en-espa-ol-monica-calle.vercel.app"),
  openGraph: {
    title: "Mónica Calle — Diseñadora UX/UI & Front-End",
    description:
      "Diseño UX/UI, diseño gráfico y desarrollo front-end con una mirada visual, estratégica y cuidada.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} ${theSeasons.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
