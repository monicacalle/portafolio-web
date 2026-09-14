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

/**
 * Where a case study came FROM, so it can send the reader back to it.
 *
 * Every "volver a proyectos" link on every detail route pointed at
 * `/#projects`, and there is no `#projects` on this site: the Edition replaced
 * the old homepage and its only ids are its six chapter anchors. So the one
 * control a reader uses to get out of a case study dropped them at the top of
 * a 29,000px homepage with no idea where they had been. The footer was fixed
 * for exactly this reason and its comment says so; these three links were
 * missed.
 *
 * Keyed rather than hardcoded, so a slug added to CASE_STUDY_SLUGS without a
 * chapter is a type error rather than another silent `/#projects`.
 */
export const CAPITULO_DE: Record<CaseStudySlug, string> = {
  vibe: "producto",
  voluntee: "producto",
};

/** The graphic portfolio belongs to chapter V, the printed one. */
export const GRAFICO_CAPITULO = "impreso";
