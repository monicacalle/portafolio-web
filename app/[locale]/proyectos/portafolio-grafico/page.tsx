import type { Metadata } from "next";
import Image from "next/image";
// Locale-aware Link: the plain next/link one drops the locale, so an English
// visitor clicking through landed back in Spanish.
import { Link } from "@/lib/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SITE_URL } from "@/lib/site";
import { shareImage } from "@/lib/og/card";
import { type Locale } from "@/lib/i18n/config";
import { routing } from "@/lib/i18n/routing";
import { localePath } from "@/lib/i18n/paths";
import { GRAFICO_PDF } from "@/lib/case-studies";
import { GraficoViewer } from "@/components/site/grafico-viewer";
import grafico from "@/public/images/portafolioabierto.png";

/*
  The graphic portfolio's own page.

  It existed only as a modal before: a hiring manager at Kazaar wrote that the
  work "has no link, so I cannot open it", and while Epic 1 gave the PDF a
  visible download, a modal still changes no route. So there was nothing to
  send, nothing to index, and no link preview -- for what is, by page count,
  her most finished body of work.

  This page has an address. The flipbook is unchanged and still reachable from
  the card; this is the shareable surface around it.
*/
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("grafico");
  const title = `${t("title")} — ${t("tagline")}`;
  const description = t("body");
  const path = localePath(locale, "/proyectos/portafolio-grafico");
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        es: "/proyectos/portafolio-grafico",
        en: "/en/proyectos/portafolio-grafico",
        "x-default": "/proyectos/portafolio-grafico",
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: shareImage(locale, "/proyectos/portafolio-grafico", t("title")),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImage(locale, "/proyectos/portafolio-grafico", t("title")),
    },
  };
}

export default async function GraphicPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("grafico");

  return (
    <>
      <Header />
      <main className="cs">
        <div className="cs__shell shell">
          <Link className="cs__back" href="/#projects" data-cursor="←">
            <ArrowLeft className="cs__back-icon" size={14} />
            {t("back")}
          </Link>

          <header className="cs__head">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h1 className="cs__title serif">{t("title")}</h1>
            <p className="cs__tagline">{t("tagline")}</p>
          </header>

          <Image
            className="grafico__cover"
            src={grafico}
            alt={t("title")}
            sizes="(max-width: 900px) 100vw, 60rem"
            placeholder="blur"
            priority
          />

          <p className="grafico__body">{t("body")}</p>

          <p className="grafico__meta">{t("pages")}</p>

          <div className="grafico__actions">
            <GraficoViewer />
            <a className="btn btn--solid" href={GRAFICO_PDF} download>
              {t("download")}
            </a>
          </div>
        </div>
      </main>
      {/* The burgundy panel is not decoration: .footer colours its children
          cream because it is designed to sit on it. Rendered bare, the
          wordmark, the four nav links and the copyright were all cream on
          cream, measured at 1.00:1. Matches the case-study page. */}
      <div className="contact" style={{ overflow: "hidden" }}>
        <Footer />
      </div>
    </>
  );
}
