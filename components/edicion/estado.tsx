"use client";

import {
  createContext,
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

/** Where the page decides which chapter you are on: just under the header. */
const LINEA = 64;

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

      // Last marker at or above the line wins. Markers are in document order,
      // so this is a single pass with no sorting and no stored history.
      let tema: string | null = null;
      let cap: string | null = null;
      for (const m of marcas) {
        if (m.getBoundingClientRect().top > LINEA) break;
        tema = m.dataset.marcaTema ?? tema;
        cap = m.dataset.marcaCapitulo ?? null;
      }
      if (tema) raiz.dataset.navTheme = tema;
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
}: {
  tema: "oscuro" | "claro";
  capitulo?: string | null;
}) {
  return (
    <div
      aria-hidden
      data-marca-tema={tema === "oscuro" ? "dark" : "light"}
      {...(capitulo ? { "data-marca-capitulo": capitulo } : {})}
      style={{ position: "absolute", top: 0, height: 1, width: "100%" }}
    />
  );
}

export { CAPITULOS };
