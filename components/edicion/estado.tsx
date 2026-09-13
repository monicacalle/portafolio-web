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
  Section 93 also says: "Avoid jitter around boundaries. Use hysteresis."

  A single threshold flickers when a marker sits within a pixel or two of the
  line and the scroll oscillates -- which a trackpad does constantly at rest.
  The incoming chapter has to cross the line by this margin before it takes
  over, so a boundary is crossed once rather than argued over.
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
      let tema: string | null = null;
      let cap: string | null = null;
      for (const m of marcas) {
        const top = m.getBoundingClientRect().top;
        // Hysteresis: a marker that is not already active must clear the line
        // by HISTERESIS before it can take over.
        const umbral = m.dataset.marcaCapitulo === activoRef.current
          ? linea + HISTERESIS
          : linea;
        if (top > umbral) break;
        tema = m.dataset.marcaTema ?? tema;
        cap = m.dataset.marcaCapitulo ?? null;
      }
      if (tema) raiz.dataset.navTheme = tema;

      /*
        Section 92's page state machine, as a data attribute rather than React
        state. The brief models the page as BOOT -> HERO_LOADING -> HERO_ACTIVE
        -> SIDEBAR_TRANSITION -> CHAPTER_* -> END, with each chapter carrying
        its own INTRO_ENTER / INTRO_ACTIVE / CONTENT_TRANSITION /
        EDITORIAL_ACTIVE / INTRO_EXIT.

        Written to <html> so CSS owns every response to a phase change and no
        component re-renders for one. The rail reads `hero` vs `capitulos` to
        stay out of the way until the retablo has handed over, which is the
        SIDEBAR_TRANSITION step of section 17.
      */
      raiz.dataset.fase = cap ? "capitulos" : "hero";
      if (cap) raiz.dataset.capitulo = cap;
      else delete raiz.dataset.capitulo;
      // The sub-phase: which half of the chapter the reader is in.
      raiz.dataset.subfase = tema === "light" ? "editorial" : "intro";
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
}: {
  tema: "oscuro" | "claro";
  capitulo?: string | null;
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
