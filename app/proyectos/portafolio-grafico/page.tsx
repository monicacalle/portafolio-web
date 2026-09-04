import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SITE_URL } from "@/lib/site";
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
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("grafico");
  const title = `${t("title")} — ${t("tagline")}`;
  const description = t("body");
  const url = `${SITE_URL}/proyectos/portafolio-grafico`;
  return {
    title,
    description,
    alternates: { canonical: "/proyectos/portafolio-grafico" },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function GraphicPortfolioPage() {
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
            <a className="btn" href={GRAFICO_PDF} download>
              {t("download")}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
