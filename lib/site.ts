/**
 * Single source of truth for site-level SEO data.
 *
 * NOTE: SITE_URL is the production canonical. It currently points at the
 * existing deployment; update it to the new domain when this project is
 * deployed, and the sitemap, robots, canonical tag, and JSON-LD all follow.
 */
export const SITE_URL = "https://portafolio-en-espa-ol-monica-calle.vercel.app";

export const PERSON = {
  name: "Mónica Calle",
  jobTitle: "Diseñadora UX/UI & Front-End",
  email: "monicacalle369@gmail.com",
  locality: "Valencia",
  region: "Comunidad Valenciana",
  country: "ES",
  description:
    "Diseñadora UX/UI y diseñadora gráfica con base en front-end. Diseño de producto, branding y desarrollo web con una mirada visual, estratégica y cuidada.",
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
    "CEI, Escuela de Diseño y Marketing",
    "4Geeks Academy",
    "Unidad Central del Valle",
  ],
};
