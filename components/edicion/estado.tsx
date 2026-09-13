"use client";

import {
  createContext,
  useRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CAPITULOS } from "@/lib/edicion/capitulos";

interface EstadoEdicion {
  /** Anchor of the chapter currently under the header, or null while in the hero. */
  activo: string | null;
}

/*
  Deliberately NOT carrying the hero's fold progress.

  It was here, updated every frame. That re-rendered the entire Edition tree on
  every scroll event of the opening 150svh to move one retablo. hero.tsx writes
  the value straight to a CSS custom property instead, so the compositor owns
  the fold and React never hears about it. Anything else that needs a per-frame
  scroll value should do the same rather than put it back in this context.
*/
const Ctx = createContext<EstadoEdicion>({ activo: null });

export const useEdicion = () => useContext(Ctx);

/*
  Section 93: "Do not determine active section merely when its top reaches the
  viewport. Use a weighted center threshold... closest to 40-50% of viewport
  height." 64px was the top-of-viewport reading the section warns against.
*/
const LINEA_FRACCION = 0.45;

/*
  §5's line is a DIFFERENT line, and using §93's for both was a real defect.

  §93 decides which chapter is ACTIVE, and it is explicit that the test is a
  weighted centre near 40-50% of the viewport. §5 decides what colour the header
  and the rail wear, and its test is the block "under them" — which for a 50px
  header means the first 50px of the viewport, not the 405px mark.

  One line was doing both jobs, so at every theme boundary the header switched
  its foreground up to 405px before the thing under it changed colour. Measured
  by walking the page in 100px steps at 1440x900: 32 of 280 positions, 3,200px
  of scroll in twelve bands, had the header printing the wrong world. At y=9000
  that is dark ink over chapter III's navy intro — the nav links measured
  1.77:1 against what was actually behind them.

  The header line is the header's own height plus a few pixels of margin, so
  the marker that decides the colour is the one the header is genuinely sitting
  on. The chapter machine below keeps §93's line untouched.
*/
const MARGEN_CABECERA = 8;

/*
  Section 93 also says: "Avoid jitter around boundaries. Use hysteresis."

  A single threshold flickers when a marker sits within a pixel or two of the
  line and the scroll oscillates -- which a trackpad does constantly at rest.
  The margin goes to the marker that is ALREADY active, not to the incoming
  one: `umbral` is `linea + HISTERESIS` for the current chapter and a bare
  `linea` for every other, so a new chapter takes over exactly at the 45% line
  on the way down and the outgoing one holds 56px longer on the way back up.
  Either direction gives the dead band §93 asks for; this comment used to
  describe the opposite asymmetry, which is the one a reader would try to
  re-derive from it.
*/
const HISTERESIS = 56;

/**
 * Active-chapter detection and the dark/light switch for the header and rail.
 *
 * The active chapter is the one crossing a line just under the header, not the
 * one occupying the most screen. "Most visible" flickers at every boundary and
 * disagrees with what is actually being read: during a transition the outgoing
 * chapter still owns most of the pixels while the incoming title is the thing
 * the eye is on.
 *
 * DETECTION IS BY POSITION, NOT BY CROSSING. An IntersectionObserver over
 * sentinels is the obvious implementation and it is subtly wrong: it only fires
 * when a sentinel passes through the band, so any jump that skips the band
 * leaves the rail showing whatever was last crossed. Landing on /es#producto
 * from outside, or clicking a rail link, never crosses the sentinels for the
 * chapters in between — so the rail lit nothing at all. Asking "which marker is
 * the last one above the line" is the same cost over a dozen elements and has
 * no history to get wrong.
 *
 * The theme lands on <html data-nav-theme>, which is what the live reference
 * does and what brief section 5 specifies. CSS reads it, so a theme change
 * repaints without re-rendering a single component.
 */
export function EstadoEdicion({ children }: { children: ReactNode }) {
  const [activo, setActivo] = useState<string | null>(null);
  /*
    The hysteresis test needs the CURRENT active chapter inside a scroll
    listener that is registered once, and state would be captured stale there.

    Synced in an effect rather than assigned during render: writing a ref while
    rendering is a lint error and a real hazard, because a render can be thrown
    away and re-run under concurrent React, leaving the ref describing a render
    that never committed.
  */
  const activoRef = useRef<string | null>(null);
  useEffect(() => {
    activoRef.current = activo;
  }, [activo]);

  useEffect(() => {
    const raiz = document.documentElement;
    let marcas: HTMLElement[] = [];

    const recolectar = () => {
      marcas = Array.from(
        document.querySelectorAll<HTMLElement>("[data-marca-tema]"),
      );
    };
    recolectar();

    let pendiente = false;
    const leer = () => {
      pendiente = false;

      // Last marker at or above the weighted line wins. Markers are in
      // document order, so this is a single pass with no sorting.
      const linea = window.innerHeight * LINEA_FRACCION;
      /* §5's line, see above. Read from the token rather than hard-coded: it is
         50px on desktop and 60px below 1024, per §3. */
      const alto = parseFloat(
        getComputedStyle(raiz).getPropertyValue("--edicion-cabecera-h"),
      );
      const lineaCabecera = (Number.isFinite(alto) ? alto : 50) + MARGEN_CABECERA;
      let tema: string | null = null;
      let cap: string | null = null;
      let sub: string | null = null;
      /* Both jobs in ONE pass, which they can share because the header's line
         is always above §93's: a marker that has cleared the header line is a
         prefix of the ones that have cleared the weighted line, so the theme
         accumulates on the way to the break that ends the chapter test. */
      for (const m of marcas) {
        const top = m.getBoundingClientRect().top;
        if (top <= lineaCabecera) tema = m.dataset.marcaTema ?? tema;
        // Hysteresis: a marker that is not already active must clear the line
        // by HISTERESIS before it can take over.
        const umbral = m.dataset.marcaCapitulo === activoRef.current
          ? linea + HISTERESIS
          : linea;
        if (top > umbral) break;
        cap = m.dataset.marcaCapitulo ?? null;
        sub = m.dataset.marcaSubfase ?? sub;
      }
      if (tema) raiz.dataset.navTheme = tema;

      /*
        Section 92's page state machine, as a data attribute rather than React
        state. The brief models the page as BOOT -> HERO_LOADING -> HERO_ACTIVE
        -> SIDEBAR_TRANSITION -> CHAPTER_* -> END, with each chapter carrying
        its own INTRO_ENTER / INTRO_ACTIVE / CONTENT_TRANSITION /
        EDITORIAL_ACTIVE / INTRO_EXIT.

        WHAT IS ACTUALLY HERE is two of those axes, and the mapping is written
        down in edicion-declinaciones.md rather than implied:

          data-fase      hero | capitulos            HERO_ACTIVE, CHAPTER_*
          data-final     present in the last body     END
          data-subfase   intro | editorial           INTRO_ACTIVE, EDITORIAL_ACTIVE
          data-capitulo  the anchor                  which CHAPTER_*

        BOOT and HERO_LOADING have no equivalent because there is no loading
        state to be in: the page is server-rendered complete and the canvas
        fades in over it (§82). SIDEBAR_TRANSITION is `--hp`, a continuous
        value, because §17 asks for a scrub rather than a step. The three
        transitional per-chapter states (INTRO_ENTER, CONTENT_TRANSITION,
        INTRO_EXIT) are not built.

        Written to <html> so CSS owns every response to a phase change and no
        component re-renders for one. The rail reads `hero` vs `capitulos` to
        stay out of the way until the retablo has handed over, which is the
        SIDEBAR_TRANSITION step of section 17.
      */
      raiz.dataset.fase = cap ? "capitulos" : "hero";
      /*
        `data-capitulo` is the machine's per-chapter output, published on <html>
        so anything can respond to it without a render.

        NOTHING IN THE STYLESHEET READS IT TODAY, and that is worth stating
        rather than leaving to be discovered. The one place that needs to know
        which chapter is active is the rail's index, and it cannot use this:
        `aria-current` is an ARIA property, not a CSS one, so the rail takes
        the same fact from React state below and pays one render per chapter
        change — six over the whole page — to keep the index announced
        correctly to a screen reader. The attribute stays because it is the
        state, and because the alternative to publishing a state is a component
        that owns it privately.
      */
      if (cap) raiz.dataset.capitulo = cap;
      else delete raiz.dataset.capitulo;
      // The sub-phase: which half of the chapter the reader is in, from the
      // marker that knows rather than inferred from the colour it happens to
      // be wearing.
      raiz.dataset.subfase = sub ?? (cap ? "editorial" : "intro");

      /*
        §92's END, and it has a consumer: the rail's legal line.

        The brief's diagram ends the machine at END and this build had no
        equivalent. It is the last chapter's editorial body — there is nothing
        after it — and what changes is the one thing a reader at the end of a
        page might want and could not read before: the copyright line, which
        sits at 0.45 opacity for the whole scroll because it is furniture until
        it is not. A state with no consumer is a value computed every frame for
        nobody, so this state got one rather than the attribute alone.

        ITS OWN ATTRIBUTE, because it used to overwrite `data-fase` — and END
        is not an alternative to CHAPTER_*, it is something true AT THE SAME
        TIME as the last chapter. Overwriting it stopped
        `html[data-fase="capitulos"]` matching, and at the time that selector
        carried the rail's frame at 0.18 against a base of 0, so the frame —
        §17 step 4's "draws in as the morph completes and stays as the rail's
        edge" — faded to nothing the moment the reader reached chapter VI's
        body and never came back.

        The frame has since moved off `data-fase` entirely: §17's own fix ties
        it to `--hp` so it draws during the morph rather than a state later.
        The reasoning for a separate attribute is unchanged and the evidence
        is now history, which is why it is written as history.
      */
      const ultimo = CAPITULOS[CAPITULOS.length - 1]?.anclaje;
      if (cap === ultimo && raiz.dataset.subfase === "editorial") {
        raiz.dataset.final = "";
      } else {
        delete raiz.dataset.final;
      }
      // setActivo with an unchanged value is a no-op in React, so the common
      // case -- scrolling within one chapter -- costs nothing.
      setActivo(cap);
    };

    // rAF-gated: a fast wheel fires scroll dozens of times between paints, and
    // reading a rect in each one forces that many layouts.
    const alScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(leer);
    };

    const alResize = () => {
      recolectar();
      alScroll();
    };

    leer();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alResize);
    // Images and fonts land after first paint and move everything below them,
    // so the first reading is measured against a layout that no longer exists.
    window.addEventListener("load", alScroll);
    return () => {
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alResize);
      window.removeEventListener("load", alScroll);
    };
  }, []);

  const valor = useMemo(() => ({ activo }), [activo]);
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

/**
 * The 1px marker a themed block drops at its own leading edge.
 *
 * `capitulo` is null for the hero, which is how the rail clears its active
 * state instead of leaving a chapter lit while the reader is back at the top.
 */
export function MarcaTema({
  tema,
  capitulo = null,
  borde = "arriba",
  subfase,
}: {
  tema: "oscuro" | "claro";
  capitulo?: string | null;
  /**
   * §92's per-chapter sub-phase, carried explicitly.
   *
   * It used to be DERIVED from the theme — dark meant intro, light meant
   * editorial — which is true of five chapters and wrong about the two places
   * that matter. The dark beat sits in the middle of chapter III's editorial
   * body and reported `intro`, and chapter VI's intro is light and reported
   * `editorial`. A state machine that is wrong about exactly the two blocks
   * that are interesting is worse than one that does not exist.
   */
  subfase?: "intro" | "editorial";
  /**
   * Which edge of the parent the marker sits on.
   *
   * It matters: a block that opens one theme and closes another needs its
   * closing marker at the FOOT. With both at top: 0 they land on the same
   * pixel, the later one wins in document order, and the block never takes its
   * own theme at all -- which is exactly what happened to the dark beat.
   */
  borde?: "arriba" | "abajo";
}) {
  return (
    <div
      aria-hidden
      data-marca-tema={tema === "oscuro" ? "dark" : "light"}
      {...(capitulo ? { "data-marca-capitulo": capitulo } : {})}
      {...(subfase ? { "data-marca-subfase": subfase } : {})}
      style={{
        position: "absolute",
        [borde === "arriba" ? "top" : "bottom"]: 0,
        /* left: 0, not just width: 100%.
           Without it the marker takes its STATIC position -- inside the
           parent's left padding -- and then measures 100% of the padding box
           from there, so it hangs off the right edge by exactly one padding.
           Inside the dark beat, whose padding is clamp(1.2rem, 4vw, 3.5rem),
           that was 48px of horizontal document overflow on every desktop. */
        left: 0,
        height: 1,
        width: "100%",
      }}
    />
  );
}

export { CAPITULOS };
