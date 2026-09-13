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
    alturaSvh: 460,
    tema: "oscuro",
    // The sage-olive of Untitled_Artwork 3, corner-sampled. It is the ground of
    // the retablo's centre panel, so the page opens without a colour change.
    fondo: "#888866",
    obras: ["retablo", "pelo-cobre", "modigliani", "panuelo", "nube", "ceguera"],
  },
  {
    anclaje: "marca",
    numeral: "II",
    alturaSvh: 480,
    tema: "oscuro",
    // Estudio Raíz oxblood. Also the page's one structural accent.
    fondo: "#4E0909",
    obras: ["estudio-raiz", "vina-esmeralda", "isabella-mendoza"],
  },
  {
    anclaje: "campana",
    numeral: "III",
    alturaSvh: 540,
    tema: "oscuro",
    // The cobalt of the Ceguera sweater, measured #3060A0 and darkened for a
    // ground. The figure itself never sits on it — at 1.06:1 the sweater would
    // vanish and the black contour would drop from 18.4:1 to 3.5:1.
    fondo: "#1B2C47",
    obras: ["ceguera-digital", "marquesina", "loreal", "ingres"],
  },
  {
    anclaje: "producto",
    numeral: "IV",
    alturaSvh: 780,
    tema: "oscuro",
    obras: ["vibe", "voluntee"],
    // Vibe's own dark. This is the longest chapter because it is the only one
    // with two finished bilingual case studies already written behind it.
    fondo: "#141019",
  },
  {
    anclaje: "impreso",
    numeral: "V",
    alturaSvh: 380,
    tema: "oscuro",
    // Plakatstil burnt orange, from her Nespresso homage.
    fondo: "#6B2F14",
    obras: ["portafolio-grafico", "lobo-estepario", "sade", "plakatstil", "gestalt"],
  },
  {
    anclaje: "oficio",
    numeral: "VI",
    alturaSvh: 200,
    tema: "claro",
    // The chapter that closes is the only one that never goes dark: it is the
    // practical one — where she has worked, what she uses, how to write to her.
    fondo: "#F4F2F0",
    obras: [],
  },
] as const;

/**
 * One chapter.
 *
 * - `anclaje`   URL hash. Lowercase, no accents — a fragment identifier, not prose.
 * - `numeral`   Roman numeral in the rail. Editorial, so written not derived.
 * - `alturaSvh` Total scroll length. See the header note on why these differ.
 * - `tema`      Where the INTRO sits. The body that follows always turns light;
 *               that alternation is the page's pulse (brief section 77).
 * - `fondo`     The flat ground, sampled from her own files, not chosen at a desk.
 * - `obras`     Her work, by the slug the plate pipeline and message keys use.
 */
export type Capitulo = (typeof CAPITULOS)[number];

export const ANCLAJES = CAPITULOS.map((c) => c.anclaje);
export type Anclaje = Capitulo["anclaje"];

/** Total page length in svh, used to size the scroll spine's master timeline. */
export const ALTURA_TOTAL = CAPITULOS.reduce((n, c) => n + c.alturaSvh, 0);

/**
 * The hero's own length, before chapter I begins. 150svh per brief section 13:
 * enough for the retablo to hold, then fold, then hand over to the rail.
 */
export const HERO_SVH = 150;
