/**
 * The six chapters of the Edition — structure only, never copy.
 *
 * Every user-facing string lives in messages/{es,en}/edicion.json under the key
 * `capitulos.<anchor>`. What is here is the stuff a translator has no opinion
 * about: anchors, order, heights, themes, and which of her files each chapter
 * shows. Keeping the two apart is the project rule (conventions.md), and it is
 * also what lets the rail, the scroll spine and the sitemap read one list
 * instead of three that drift.
 *
 * Heights are deliberately uneven. The live Shopify page measures 245svh to
 * 924svh across its twelve chapters, and that 3.8x spread is the rhythm; six
 * chapters of equal length would read as a template no matter how good the
 * motion is. The spread here is 3.9x.
 *
 * THEY ARE FLOORS, NOT MEASUREMENTS. `alturaSvh` becomes a min-height, and as
 * the editorial bodies filled every chapter grew past its own number. Measured
 * at 1680x1000 on 2026-09-13: 300 / 343 / 375 / 661 / 773 / 421 against the
 * 300 / 260 / 280 / 340 / 700 / 190 declared below. The numbers are kept as
 * the reserved minimum each chapter gets before its content is counted, and
 * the ratio between them is still what sets the rhythm; they are not a claim
 * about what the page measures.
 *
 * These were CUT after the gate measured 12,739px of empty near-black across
 * the page -- 11.7 viewport-heights of nothing, 5,455px of it inside chapter IV
 * alone, which holds her two finished case studies. The extra length was
 * reserved for the R3F scenes that were then deleted on the free-to-use
 * constraint, so it was reserving room for something that is not coming.
 * Reserved emptiness is not a placeholder a reader can recognise as one.
 *
 * The allocation is by CONTENT READINESS, not by importance. An earlier draft
 * gave the illustration chapter 720svh when it had four images and not one
 * written word, while PRODUCTO had 780svh behind two finished bilingual case
 * studies, eight real survey statistics and 95 slide pages. The longest budget
 * was going to the emptiest chapter. Corrected below.
 */

export type Tema = "oscuro" | "claro";

/**
 * Deliberately NOT annotated `: readonly Capitulo[]`.
 *
 * An explicit annotation widens `anclaje` from its six literals to `string`,
 * and next-intl's typed message keys then reject `t(\`capitulos.${anclaje}\`)`
 * because it cannot prove the key exists. Letting `as const` infer the type and
 * deriving `Capitulo` back out of it keeps the literals, so a typo in an anchor
 * is a build error rather than a missing-message crash at runtime — which
 * matters here because `global.d.ts` type-checks the Spanish tree only.
 *
 * Fields are documented on the derived interface below.
 */
export const CAPITULOS = [
  {
    anclaje: "ilustracion",
    numeral: "I",
    alturaSvh: 300,
    tema: "oscuro",
    // The sage-olive of Untitled_Artwork 3, corner-sampled. It is the ground of
    // the retablo's centre panel, so the page opens without a colour change.
    fondo: "#888866",
    placa: "/cine/pelo-cobre.avif",
    // Already 1150x3229, taller than 9:16. It fills a phone as it is, so §81's
    // portrait fallback is the same file.
    placaRetrato: undefined,
    // Chapter I's body is the constellation (§29), which carries its own five
    // cards with their titles and dimensions. No plate wall after it.
    obras: [],
  },
  {
    anclaje: "marca",
    numeral: "II",
    alturaSvh: 260,
    tema: "oscuro",
    // Estudio Raíz oxblood. Also the page's one structural accent.
    fondo: "#4E0909",
    placa: "/edicion/cap-marca.avif",
    placaRetrato: "/edicion/cap-marca-retrato.avif",
    // Three marks, then two of them applied. The fourth card used to be the
    // open printed portfolio, which is chapter V's subject sitting unlabelled
    // in the brand chapter.
    obras: [
      { clave: "esmeralda", src: "/trabajo/t-esmeralda.avif", ancho: "tercio" },
      { clave: "raiz-marca", src: "/edicion/marca-raiz.avif", ancho: "tercio" },
      { clave: "isabella", src: "/trabajo/t-isabella.avif", ancho: "tercio" },
      { clave: "raiz-aplicada", src: "/edicion/cap-marca.avif", ancho: "medio" },
      { clave: "isabella-aplicada", src: "/cine/a2-isabella.avif", ancho: "medio" },
    ],
  },
  {
    anclaje: "campana",
    numeral: "III",
    alturaSvh: 280,
    tema: "oscuro",
    // The cobalt of the Ceguera sweater, measured #3060A0 and darkened for a
    // ground. The figure itself never sits on it — at 1.06:1 the sweater would
    // vanish and the black contour would drop from 18.4:1 to 3.5:1.
    fondo: "#1B2C47",
    placa: "/cine/a3-loreal.avif",
    placaRetrato: "/edicion/cap-campana-retrato.avif",
    // Two, not the four the dead map in edicion.tsx carried. That map listed
    // Nespresso and an illustration plate for this chapter and never rendered
    // them, because chapter III's body never reached the renderer holding it;
    // Nespresso is chapter V's Plakatstil homage besides. What ships here is
    // what shipped before: the two plates the chapter's own body drew.
    // Uneven on purpose, and in this direction on purpose: her campaign is the
    // subject and the public-domain portrait beside it is the reference.
    obras: [
      { clave: "loreal", src: "/cine/a3-loreal.avif", ancho: "dos-tercios" },
      { clave: "ingres", src: "/cine/a3-ingres.avif", ancho: "tercio" },
    ],
  },
  {
    anclaje: "producto",
    numeral: "IV",
    alturaSvh: 340,
    tema: "oscuro",
    placa: "/edicion/cap-producto.avif",
    placaRetrato: "/edicion/cap-producto-retrato.avif",
    // Chapter IV's body is §42's sequence and §43's two planchas, each of which
    // names its own screen. A plate wall of the same two apps after them would
    // be the third showing.
    obras: [],
    // Vibe's own dark. This is the longest chapter after V, because it is the
    // only one with two finished bilingual case studies already written behind
    // it -- and since §42's four-state sequence landed in its body it measures
    // ~661svh against the 340 reserved here.
    fondo: "#141019",
  },
  {
    anclaje: "impreso",
    numeral: "V",
    // The only chapter whose height is dictated rather than chosen: sections 47
    // and 48 specify three sticky beats of 165svh, which is 495svh before the
    // intro or the cards are counted.
    alturaSvh: 700,
    tema: "oscuro",
    // Plakatstil burnt orange, from her Nespresso homage.
    fondo: "#6B2F14",
    placa: "/edicion/cap-impreso.avif",
    placaRetrato: "/edicion/cap-impreso-retrato.avif",
    obras: [
      { clave: "portafolio", src: "/trabajo/t-libro.avif", ancho: "dos-tercios" },
      { clave: "lobo", src: "/trabajo/t-lobo.avif", ancho: "tercio" },
      { clave: "nespresso", src: "/trabajo/t-nespresso.avif", ancho: "medio" },
    ],
  },
  {
    anclaje: "oficio",
    numeral: "VI",
    alturaSvh: 190,
    tema: "claro",
    // The chapter that closes is the only one that never goes dark: it is the
    // practical one — who she is, what she can hand you, where she has worked,
    // what she uses, how to write to her. §67's story and its two document
    // cards took it from 190svh of lists to ~421svh measured.
    fondo: "#F4F2F0",
    // Declared and undefined, not omitted. `as const` would otherwise leave
    // this record without the property at all, and `Capitulo` is the union of
    // the six, so `capitulo.placa` would not type-check on it.
    //
    // No plate because §23 sends the closing chapter into the light world, and
    // a cinematic ground under contact details would fight it. `placaDe`
    // decides truthiness from this field, because `escena={<Escena/>}` is an
    // object and therefore truthy even when the component returns null.
    placa: undefined,
    placaRetrato: undefined,
    obras: [],
  },
] as const;

/**
 * One chapter.
 *
 * - `anclaje`   URL hash. Lowercase, no accents — a fragment identifier, not prose.
 * - `numeral`   Roman numeral in the rail. Editorial, so written not derived.
 * - `alturaSvh` Reserved minimum scroll length, not the measured height. See
 *               the header note.
 * - `tema`      Where the INTRO sits. The body that follows always turns light;
 *               that alternation is the page's pulse (brief section 77).
 * - `fondo`     The flat ground, sampled from her own files, not chosen at a desk.
 * - `placa`     The chapter intro's plate. Absent means no cinematic ground.
 * - `placaRetrato` §81's mobile fallback: "desktop: landscape fallback.
 *               mobile: PORTRAIT fallback." One landscape plate served both
 *               orientations and `object-fit: scale-down` letterboxed it, so a
 *               390px phone got a horizontal band of imagery in the chapter's
 *               ground with the 141px title straddling its lower edge — which
 *               is §81's own "title legibility" clause failing on the plate
 *               that exists to guarantee it. Cut by produccion/edicion.py,
 *               which chooses per plate between extending its field and
 *               reframing it, because one of those is wrong for a photograph
 *               and the other is wrong for her own artwork.
 * - `obras`     The editorial plate wall under the body, with §103's layout
 *               field on each and the message key its caption lives under.
 *               Empty where the chapter's body is a bespoke composition that
 *               already shows its own work.
 *
 * `clave` exists because §32 asks every card for a title and a short
 * description and these had neither. Four pieces of her branding work were on
 * screen unnamed; the chapter statement above them names one of the three
 * studios. The copy is at `capitulos.<anclaje>.obras.<clave>` and the caller
 * resolves it, because a message key threaded through a prop widens to
 * `string` and loses next-intl's compile-time guarantee.
 *
 * SECTION 103 is why `placa` and `obras` are here rather than in the
 * components. They were two `Record<string, ...>` maps inside edicion.tsx, next
 * to a third that mapped anchors to message keys, while this record carried an
 * `obras` field of slugs that nothing read -- so the authoritative-looking list
 * was the dead one. Two of the three maps also had entries for chapters whose
 * bodies never reached that renderer, which is dead configuration that reads as
 * live configuration. One record per chapter, and the renderer reads it.
 */
export type Capitulo = (typeof CAPITULOS)[number];

export const ANCLAJES = CAPITULOS.map((c) => c.anclaje);
export type Anclaje = Capitulo["anclaje"];

/**
 * The same six, by anchor, keeping each record's own literal types.
 *
 * `CAPITULOS.find(...)` returns the UNION of all six, so `obras[n].clave`
 * widens to every card key on the page and next-intl then rejects
 * `capitulos.marca.obras.${clave}` because the cross product contains keys
 * that do not exist. Indexing this map with a literal anchor keeps one
 * chapter's card keys, which is what makes the caption lookup type-check.
 */
export const POR_ANCLAJE = Object.fromEntries(
  CAPITULOS.map((c) => [c.anclaje, c]),
) as { [C in Capitulo as C["anclaje"]]: C };

/**
 * The hero's own length, before chapter I begins. 150svh per brief section 13:
 * enough for the retablo to hold, then fold, then hand over to the rail.
 */
export const HERO_SVH = 150;
