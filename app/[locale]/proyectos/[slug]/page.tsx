import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
// Locale-aware Link: the plain next/link one drops the locale, so an English
// visitor clicking through landed back in Spanish.
import { Link } from "@/lib/i18n/navigation";
import { notFound } from "next/navigation";
import { CASE_STUDY_SLUGS } from "@/lib/case-studies";
import { type Locale } from "@/lib/i18n/config";
import { routing } from "@/lib/i18n/routing";
import { localePath } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/site";
import { shareImage } from "@/lib/og/card";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ArrowLeft } from "lucide-react";
import vibe from "@/public/images/vibe.png";
import voluntee from "@/public/images/voluntee.png";

// Structural (non-copy) data per case study — image + full-deck PDF.
const MEDIA: Record<string, { image: StaticImageData; pdf: string }> = {
  vibe: { image: vibe, pdf: "/assets/vibe-app-memoria.pdf" },
  voluntee: { image: voluntee, pdf: "/assets/voluntee-app-slides.pdf" },
};

// The slugs that have written content. The list lives in lib/case-studies.ts so
// the sitemap cannot disagree with it.
//
// Note this does NOT pre-render anything today: reading the locale cookie in
// lib/i18n/request.ts opts every route out of static generation, so the build
// reports this route as Dynamic. generateStaticParams is kept because it is
// still the declaration of which slugs exist, and it would start pre-rendering
// the moment the locale stops coming from a cookie -- see MP-17.
// Restored. Removing this in 92ae560 traded one framework log line for four
// defects, verified by rebuilding both ways: an unknown slug went from a real
// 404 to a 38-byte empty <body> with no lang attribute, /proyectos/constructor
// went from 404 to an unauthenticated 500, and the route started emitting two
// contradictory robots metas. The NoFallbackError it logs is noise; a blank
// page is not.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_STUDY_SLUGS.map((slug) => ({ locale, slug })),
  );
}

type CaseStudy = {
  title: string;
  tagline: string;
  meta: { role: string; year: string; type: string; platform: string };
  overview: { product: string; role: string; audience: string; challenge: string; limitations: string };
  sections: { heading: string; body: string }[];
  stats?: { value: string; label: string }[];
};

async function loadCase(slug: string) {
  const t = await getTranslations("caseStudies");
  // next-intl's server translator types `.raw()` against inferred message keys,
  // which the arrays in this namespace confuse — read it through a string accessor.
  const raw = t.raw as (key: string) => unknown;
  const items = raw("items") as Record<string, CaseStudy>;
  // hasOwn, not bracket access: items["constructor"] resolves up the prototype
  // chain to a function, which is truthy, so the guard below passed and the
  // render threw a 500. Belt and braces with dynamicParams above, because the
  // 500 must not come back if that flag is ever dropped again.
  const cs = Object.hasOwn(items, slug) ? items[slug] : undefined;
  const media = Object.hasOwn(MEDIA, slug) ? MEDIA[slug] : undefined;
  if (!cs || !media) return null;
  return { cs, media, ui: raw("ui") as CaseStudyUi };
}

type CaseStudyUi = {
  back: string;
  eyebrow: string;
  overview: Record<keyof CaseStudy["overview"], string>;
  meta: Record<keyof CaseStudy["meta"], string>;
  cta: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const data = await loadCase(slug);
  if (!data) return {};
  const { cs } = data;
  const title = `${cs.title} — ${cs.tagline}`;
  const description = cs.overview.product;
  const path = localePath(locale, `/proyectos/${slug}`);
  const url = `${SITE_URL}${path}`;
  // Without these the page inherits the root layout's canonical ("/") and its
  // openGraph block, which had two consequences: Google consolidated every case
  // study into the homepage and dropped the URL, cancelling out the sitemap
  // entries; and pasting a case-study link anywhere rendered the homepage
  // title, description and image. These are the two pages a hiring manager is
  // most likely to be sent, so both mattered.
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        es: `/proyectos/${slug}`,
        en: `/en/proyectos/${slug}`,
        "x-default": `/proyectos/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: shareImage(locale, `/proyectos/${slug}`, cs.title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImage(locale, `/proyectos/${slug}`, cs.title),
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const data = await loadCase(slug);
  if (!data) notFound();
  const { cs, media, ui } = data;

  const overviewRows = (["product", "role", "audience", "challenge", "limitations"] as const).map(
    (key) => ({ label: ui.overview[key], value: cs.overview[key] }),
  );
  const metaRows = (["role", "year", "type", "platform"] as const).map((key) => ({
    label: ui.meta[key],
    value: cs.meta[key],
  }));

  return (
    <>
      <Header />
      <main className="cs">
        <div className="cs__shell shell">
          <Link className="cs__back" href="/#projects" data-cursor="←">
            <ArrowLeft className="cs__back-icon" size={14} />
            {ui.back}
          </Link>

          <header className="cs__head">
            <p className="eyebrow">{ui.eyebrow}</p>
            <h1 className="cs__title serif">{cs.title}</h1>
            <p className="cs__tagline">{cs.tagline}</p>
          </header>

          <dl className="cs__meta">
            {metaRows.map((m) => (
              <div key={m.label} className="cs__meta-item">
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="cs__hero">
            <Image src={media.image} alt={cs.title} sizes="(max-width: 900px) 100vw, 72rem" placeholder="blur" priority />
          </div>

          <dl className="cs__overview">
            {overviewRows.map((row) => (
              <div key={row.label} className="cs__overview-item">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          {cs.stats && cs.stats.length > 0 && (
            <div className="cs__stats">
              {cs.stats.map((s) => (
                <div key={s.label} className="cs__stat">
                  <span className="cs__stat-value serif">{s.value}</span>
                  <span className="cs__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="cs__body">
            {cs.sections.map((sec) => (
              <section key={sec.heading} className="cs__section">
                <h2 className="cs__section-title">{sec.heading}</h2>
                <p className="cs__section-body">{sec.body}</p>
              </section>
            ))}
          </div>

          <div className="cs__foot">
            <Link className="cs__back cs__back--foot" href="/#projects">
              <ArrowLeft className="cs__back-icon" size={14} />
              {ui.back}
            </Link>
            <a className="btn btn--solid" href={media.pdf} target="_blank" rel="noopener noreferrer" data-cursor="PDF">
              {ui.cta}
            </a>
          </div>
        </div>
      </main>
      <div className="contact" style={{ overflow: "hidden" }}>
        <Footer />
      </div>
    </>
  );
}
