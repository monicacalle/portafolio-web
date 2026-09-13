/**
 * Single source of truth for site-level SEO data.
 *
 * SITE_URL is the production canonical. The sitemap, robots.txt, the canonical
 * tag, og:url and the JSON-LD all derive from it, so changing it here changes
 * every one of them. Only ever set it to the domain the site is actually
 * served from: pointing it elsewhere tells search engines to credit that other
 * domain instead, which is what happened until 2026-09-04.
 */
export const SITE_URL = "https://monicacalle.es";

export const PERSON = {
  name: "Mónica Calle",
  // NOTE: the user-facing jobTitle/description are localized in messages/{es,en}
  // (used by generateMetadata + the JSON-LD in page.tsx). These fields are kept
  // as a default/structural fallback and mirror the ES positioning.
  jobTitle: "Diseñadora gráfica y UX/UI",
  email: "monicacalle369@gmail.com",
  locality: "Valencia",
  region: "Comunidad Valenciana",
  country: "ES",
  description:
    "Diseñadora gráfica y UX/UI en Valencia. Ilustración, identidad de marca, campaña y diseño de producto. Trabaja con base en desarrollo front-end.",
  linkedin: "https://www.linkedin.com/in/monica-calle-betancourt/",
  knowsAbout: [
    "Diseño UX/UI",
    "Diseño de producto",
    "Figma",
    "Branding",
    "Diseño web",
    "Front-End",
    "React",
    "WordPress",
    "Diseño gráfico",
  ],
  alumniOf: [
    "CEI, Centro de Estudios de Innovación",
    "4Geeks Academy",
    "Unidad Central del Valle",
  ],
};
