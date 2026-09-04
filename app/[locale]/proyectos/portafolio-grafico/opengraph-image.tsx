import { ImageResponse } from "next/og";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
  The share card for the graphic portfolio.

  Same reason as the case studies: page.tsx sets its own openGraph block, so the
  personal card never reached this route and the link shared as text alone. This
  is the most visual thing on the site, which made it the worst one to have no
  picture on.
*/
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portafolio gráfico";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function GraficoOgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("grafico");
  const og = await getTranslations("og");
  const [font, image] = await Promise.all([
    seasonsFont(),
    imageDataUrl("images/portafolioabierto.png"),
  ]);

  return new ImageResponse(
    (
      <ProjectCard
        wordmark={og("wordmark")}
        title={t("title")}
        subtitle={t("tagline")}
        footnote={og("role")}
        image={image}
        imageAlt={t("title")}
      />
    ),
    { ...size, fonts: [{ name: "Seasons", data: font, style: "normal", weight: 400 }] },
  );
}
