/**
 * The thirteen conceptual background scenes of brief section 20 — here, FIVE.
 *
 * This used to say seven, "the hero plus six chapters", and neither number is
 * the file's: the hero's retablo is CSS 3D rather than a scene (see the note
 * on the array), and chapter VI has none because §23 sends the closing chapter
 * into the light world. Five chapters with a cinematic intro, five scenes.
 *
 * Each scene is a stack of PLANES at different depths. The brief asks for GLB
 * foreground models over KTX2 backgrounds; her work is painted illustration,
 * print and app screens, so the foreground "models" are alpha-cut planes of her
 * own artwork placed in real 3D space. The camera dollies and trucks through
 * them exactly as section 22 specifies, and depth separation is real rather
 * than faked with 2D parallax — which is what makes the exit move in section 21
 * ("depth separation increases") possible at all.
 *
 * `z` is in world units. The camera sits at z = 5 looking down -Z, so a plane
 * at z = 0 is 5 units away and one at z = -8 is 13. Section 22's parallax bands
 * (foreground 10–30%, background 2–8%) fall out of that spacing automatically:
 * a plane four times farther away moves a quarter as much on screen.
 */

export interface Plano {
  /** Texture. Alpha-cut for foreground planes, full-bleed for backgrounds. */
  src: string;
  /** World-space depth. Negative is farther from the camera. */
  z: number;
  /** World-space size. Height is derived from the texture's aspect. */
  ancho: number;
  /** Offset from scene centre, world units. */
  x?: number;
  y?: number;
  /** Resting opacity. Backgrounds sit lower so her foreground work dominates. */
  opacidad?: number;
  /**
   * Section 95 ambient motion: amplitude in world units and period in seconds.
   * Tiny — the brief says the page "must not feel alive in a distracting
   * videogame sense", so this is drift, not float.
   */
  deriva?: number;
  /**
   * §86's "reduce environmental layers": true for a plane that is environment
   * rather than subject, so the canvas can drop it on a machine that has
   * measured slow.
   *
   * Marked in the data rather than inferred from `z` or `opacidad`, because
   * both of those are art direction and would tie a performance decision to a
   * number someone will reasonably want to change. Every one of these is a
   * `plano-*-bg` plate: her own ground, blurred to a field, sitting at 28–34%
   * behind the work. The scene's colour is not lost with it — `FondoEscena`
   * carries that on its own plane.
   */
  ambiental?: boolean;
}

export interface Escena {
  /** Chapter anchor, or "hero". */
  clave: string;
  planos: readonly Plano[];
  /** The ground behind everything, from the chapter's own sampled colour. */
  fondo: string;
  /**
   * Camera move for this scene, as deltas applied across its own progress.
   * Section 22: position delta 5–15% of scene scale, rotation 1–6 degrees.
   * Dolly is z, truck is x, pedestal is y. No full rotations, ever.
   */
  camara: {
    dollyZ: number;
    truckX: number;
    pedestalY: number;
    /** Degrees. Kept inside section 22's 1–6 band. */
    giro: number;
  };
}

export const ESCENAS: readonly Escena[] = [
  /*
    NO "hero" SCENE HERE, on purpose.

    Section 20 asks for a scene per chapter plus the hero, and the hero has one
    -- el retablo -- but it is built in CSS 3D because it is also section 17's
    hero-to-rail morph, which has to survive WebGL being off. Rendering the same
    four panels again inside the canvas simply doubled them on screen. Sections
    81 and 82 bless a non-WebGL cinematic path explicitly; this is one.
  */
  {
    clave: "ilustracion",
    fondo: "#888866",
    planos: [
      { src: "/edicion/plano-i-fg.avif", z: 1.2, ancho: 3.4, x: -0.6, deriva: 0.007 },
      { src: "/edicion/panel-6.avif", z: -2.6, ancho: 1.9, x: 2.7, y: 0.3, opacidad: 0.9, deriva: 0.004 },
      { src: "/edicion/plano-i-bg.avif", z: -7.5, ancho: 13, opacidad: 0.34, deriva: 0.002, ambiental: true },
    ],
    camara: { dollyZ: -1.1, truckX: -0.6, pedestalY: 0.18, giro: 2.0 },
  },
  {
    clave: "marca",
    fondo: "#4E0909",
    planos: [
      { src: "/edicion/plano-ii-fg.avif", z: 0.9, ancho: 3.6, x: 0.5, deriva: 0.0055 },
      { src: "/trabajo/t-esmeralda.avif", z: -2.4, ancho: 1.8, x: -2.8, y: 0.4, deriva: 0.0045 },
      { src: "/trabajo/t-isabella.avif", z: -4.2, ancho: 1.3, x: 3.2, y: -0.6, opacidad: 0.85, deriva: 0.0035 },
      { src: "/edicion/plano-ii-bg.avif", z: -8, ancho: 14, opacidad: 0.3, deriva: 0.0015, ambiental: true },
    ],
    camara: { dollyZ: -1.3, truckX: 0.7, pedestalY: -0.2, giro: 2.8 },
  },
  {
    clave: "campana",
    fondo: "#1B2C47",
    planos: [
      { src: "/edicion/ceguera-figura.avif", z: 1.5, ancho: 2.8, x: -1.9, y: -0.7, deriva: 0.0075 },
      { src: "/cine/a3-loreal.avif", z: -1.8, ancho: 2.6, x: 1.8, y: 0.3, deriva: 0.0045 },
      { src: "/cine/a3-ingres.avif", z: -4.4, ancho: 2.0, x: -3.4, y: 0.5, opacidad: 0.8, deriva: 0.003 },
      { src: "/edicion/plano-iii-bg.avif", z: -8.5, ancho: 15, opacidad: 0.32, deriva: 0.0015, ambiental: true },
    ],
    camara: { dollyZ: -1.5, truckX: -0.8, pedestalY: 0.26, giro: 3.2 },
  },
  {
    clave: "producto",
    fondo: "#141019",
    planos: [
      /*
        DETAILS, not whole screens. These were the full-length captures, so a
        141px chapter title landed on a wall of legible Spanish body copy and
        dozens of readable UI labels -- which contradicts this build's own rule
        that no chapter plate may be lettering. The planchas show the screens
        entire, in the editorial body below, at a size where they can be read.
      */
      { src: "/edicion/detalle-vibe.avif", z: 0.6, ancho: 1.7, x: -1.9, y: -0.2, deriva: 0.005 },
      { src: "/edicion/detalle-voluntee.avif", z: -1.4, ancho: 1.5, x: 2.0, y: 0.4, opacidad: 0.9, deriva: 0.005 },
      { src: "/edicion/plano-iv-bg.avif", z: -7, ancho: 13, opacidad: 0.28, deriva: 0.002, ambiental: true },
    ],
    camara: { dollyZ: -0.8, truckX: 0.4, pedestalY: 0.3, giro: 1.6 },
  },
  {
    clave: "impreso",
    fondo: "#6B2F14",
    planos: [
      { src: "/edicion/plano-v-fg.avif", z: 1.0, ancho: 3.8, x: 0.3, deriva: 0.006 },
      { src: "/trabajo/t-lobo.avif", z: -2.2, ancho: 1.7, x: -2.9, y: -0.3, deriva: 0.004 },
      { src: "/trabajo/t-nespresso.avif", z: -4.0, ancho: 1.5, x: 3.0, y: 0.5, opacidad: 0.85, deriva: 0.0035 },
      { src: "/edicion/plano-v-bg.avif", z: -8, ancho: 14, opacidad: 0.3, deriva: 0.0015, ambiental: true },
    ],
    camara: { dollyZ: -1.2, truckX: -0.5, pedestalY: -0.24, giro: 2.6 },
  },
  // Chapter VI has no scene: section 23 sends the closing chapter into the
  // light world, and the reference's Developer chapter does the same. A
  // cinematic ground under contact details would fight them.
];

export const ESCENA_POR_CLAVE = new Map(ESCENAS.map((e) => [e.clave, e]));
