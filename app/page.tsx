import { getLocale, getTranslations } from "next-intl/server";
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

export default async function Home() {
  const locale = await getLocale();
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
