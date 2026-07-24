import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { geist, theSeasons } from "./fonts";
import "./globals.css";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Backdrop } from "@/components/site/backdrop";
import { NegativeReveal } from "@/components/site/negative-reveal";
import { Preloader } from "@/components/site/preloader";
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { SITE_URL, PERSON } from "@/lib/site";
import { OG_LOCALE, type Locale } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("meta");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    applicationName: t("applicationName"),
    authors: [{ name: PERSON.name }],
    creator: PERSON.name,
    keywords: t.raw("keywords") as string[],
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: t("ogSiteName"),
      locale: OG_LOCALE[locale],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geist.variable} ${theSeasons.variable}`} suppressHydrationWarning>
      <body className="grain">
        <NextIntlClientProvider messages={messages}>
          <Backdrop />
          <Preloader />
          <Cursor />
          <ScrollProgress />
          <SmoothScroll>{children}</SmoothScroll>
          <NegativeReveal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
