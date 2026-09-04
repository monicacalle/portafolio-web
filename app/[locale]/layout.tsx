import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { geist, newYork } from "../fonts";
import "../globals.css";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Backdrop } from "@/components/site/backdrop";
import { NegativeReveal } from "@/components/site/negative-reveal";
import { Preloader } from "@/components/site/preloader";
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { SITE_URL, PERSON } from "@/lib/site";
import { OG_LOCALE, type Locale } from "@/lib/i18n/config";
import { routing } from "@/lib/i18n/routing";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
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
    alternates: {
      canonical: "/",
      // Impossible before this change: hreflang annotates alternate URLs, and
      // with a cookie-based locale there were none.
      languages: { es: "/", en: "/en", "x-default": "/" },
    },
    icons: {
      icon: "/assets/favicon.svg",
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: t("ogSiteName"),
      locale: OG_LOCALE[l],
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
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  // Opts this tree into static rendering per locale instead of forcing every
  // route dynamic, which is what reading the cookie used to do.
  setRequestLocale(l);
  const messages = await getMessages();

  return (
    <html lang={l} className={`${geist.variable} ${newYork.variable}`} suppressHydrationWarning>
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
