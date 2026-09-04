import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import {
  About,
  ServicesMarquee,
  Skills,
  Curriculum,
  Projects,
  Contact,
} from "@/components/site/sections";
import { SITE_URL, PERSON } from "@/lib/site";
import { type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";
import { shareImage } from "@/lib/og/card";

/*
  Only the share image, on purpose: everything else about the homepage's
  metadata is set once in layout.tsx and inherited.

  It has to be declared here rather than there because file-based metadata
  outranks config-based metadata within the same segment, and
  app/[locale]/opengraph-image.tsx sits in the same segment as that layout --
  so the layout's own value was silently discarded and the Spanish homepage
  kept advertising /es/opengraph-image, which answers 307. Declared one level
  down, it wins. See lib/og/card.ts for why the redirect matters.
*/
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const images = shareImage(locale, "/", PERSON.name);
  return { openGraph: { images }, twitter: { images } };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("meta");

  // schema.org structured data — helps search engines (and anyone Googling her
  // name) understand who Mónica is, and makes rich results possible.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PERSON.name,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        jobTitle: t("jobTitle"),
        description: t("personDescription"),
        email: `mailto:${PERSON.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: PERSON.locality,
          addressRegion: PERSON.region,
          addressCountry: PERSON.country,
        },
        knowsAbout: PERSON.knowsAbout,
        alumniOf: PERSON.alumniOf.map((name) => ({
          "@type": "EducationalOrganization",
          name,
        })),
        sameAs: [PERSON.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: t("ogSiteName"),
        description: t("personDescription"),
        inLanguage: locale,
        author: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: `${PERSON.name} — ${t("jobTitle")}`,
        about: { "@id": `${SITE_URL}/#person` },
        inLanguage: locale,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD is data, not executed script; this is Next's recommended pattern.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <About />
        <ServicesMarquee />
        <Skills />
        <Curriculum />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
