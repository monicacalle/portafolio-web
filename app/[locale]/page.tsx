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
import { OG_LOCALE } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";
import { type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";
import { shareImage } from "@/lib/og/card";

/*
  The homepage's whole openGraph block, not just the image.

  It has to live here rather than in layout.tsx because file-based metadata
  outranks config-based metadata within a segment, and app/[locale]/
  opengraph-image.tsx sits in the same segment as that layout -- so anything
  the layout sets is discarded and the Spanish homepage kept advertising
  /es/opengraph-image, which answers 307.

  Declaring only `images` here was worse: Next replaces the whole openGraph
  object rather than merging into it, so og:url, og:site_name, og:locale and
  og:type silently vanished from the site's most-shared URL. Every field the
  layout used to supply is repeated here on purpose -- the merge is shallow,
  so a partial object is a deletion.
*/
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  setRequestLocale(l);
  const t = await getTranslations("meta");
  const title = t("title");
  const description = t("description");
  const images = shareImage(l, "/", PERSON.name);

  return {
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${localePath(l, "/")}`,
      siteName: t("ogSiteName"),
      locale: OG_LOCALE[l],
      type: "website",
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
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
