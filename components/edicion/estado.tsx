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
  /** 0 → 1 across the hero's own scroll length. Drives the retablo fold. */
  progresoHero: number;
}

const Ctx = createContext<EstadoEdicion>({ activo: null, progresoHero: 0 });

export const useEdicion = () => useContext(Ctx);

/**
 * Active-chapter detection and the dark/light switch for the header and rail.
 *
 * Two decisions worth stating, because both have an obvious wrong version.
 *
 * FIRST: the active chapter is the one crossing a line just under the header,
 * not the one occupying the most screen. "Most visible" flickers between two
 * chapters at the boundary and, worse, disagrees with what the reader is
 * actually reading — during a chapter transition the outgoing chapter still
 * owns most of the pixels while the incoming title is the thing being read.
 * A single line is stable, cheap, and matches where a reader's attention is.
 *
 * SECOND: this is an IntersectionObserver over sentinels rather than a scroll
 * handler. It stays off the main thread, it does not fight Lenis for the scroll
 * event, and it keeps working when the visitor has reduced motion on and there
 * is no Lenis at all.
 *
 * The theme lands on <html data-nav-theme>, which is what the live Shopify page
 * does and what the brief specifies in section 5. CSS reads it; no component
 * needs to know the current theme, so nothing re-renders on a theme change.
 */
export function EstadoEdicion({ children }: { children: ReactNode }) {
  const [activo, setActivo] = useState<string | null>(null);
  const [progresoHero, setProgreso] = useState(0);

  useEffect(() => {
    const raiz = document.documentElement;

    // Sentinels are 1px tall and sit at the top of each themed block, so the
    // observer fires on the block's leading edge rather than when some fraction
    // of a 780svh chapter happens to be on screen.
    const marcas = Array.from(
      document.querySelectorAll<HTMLElement>("[data-marca-tema]"),
    );
    if (!marcas.length) return;

    // rootMargin pulls the detection line down to just below the header and
    // collapses the rest of the viewport, leaving a 1px band. Whatever crosses
    // that band is what the reader is on.
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const tema = el.dataset.marcaTema;
          const cap = el.dataset.marcaCapitulo ?? null;
          if (tema) raiz.dataset.navTheme = tema;
          setActivo(cap);
        }
      },
      { rootMargin: "-64px 0px -100% 0px", threshold: 0 },
    );

    marcas.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hero = document.getElementById("edicion-hero");
    if (!hero) return;

    // The hero's progress drives the retablo fold, which must be inspectable at
    // any intermediate position (brief 1.2), so it is read every frame rather
    // than thresholded. rAF-throttled to one write per frame: without the gate
    // a fast wheel fires this dozens of times between paints.
    let pendiente = false;
    const leer = () => {
      pendiente = false;
      const r = hero.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      setProgreso(
        recorrido <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / recorrido)),
      );
    };
    const alScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(leer);
    };

    leer();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, []);

  const valor = useMemo(() => ({ activo, progresoHero }), [activo, progresoHero]);
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

/**
 * The 1px sentinel a themed block drops at its own leading edge.
 *
 * `capitulo` is null for the hero and for any block that belongs to no chapter,
 * which is how the rail clears its active state instead of leaving the last
 * chapter lit while the reader is back at the top.
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
