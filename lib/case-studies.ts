/**
 * The case studies that have written content and therefore a real route.
 *
 * One home for this list. It is consumed by generateStaticParams in
 * app/proyectos/[slug]/page.tsx and by app/sitemap.ts, which previously kept
 * their own answers and drifted: the detail routes shipped while the sitemap
 * still described the project as a single-page site, so neither case study was
 * ever submitted to a search engine.
 *
 * Adding a slug here is all that is needed for it to be pre-rendered AND
 * indexed. Keys must match the `items` keys in messages/{es,en}/case-studies.json.
 */
export const CASE_STUDY_SLUGS = ["vibe", "voluntee"] as const;

export type CaseStudySlug = (typeof CASE_STUDY_SLUGS)[number];

/**
 * The graphic portfolio is a document, not a written case study, so it is not
 * in CASE_STUDY_SLUGS. It still needs one home for its path: the card links to
 * it, its own page serves it, and the sitemap submits the route.
 */
export const GRAFICO_PDF = "/assets/portafolio-grafico.pdf";
export const GRAFICO_ROUTE = "/proyectos/portafolio-grafico";
