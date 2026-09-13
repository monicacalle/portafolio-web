"use client";

import { useEffect, useRef } from "react";
import { medidas } from "@/lib/edicion/medidas";
import { useTranslations } from "next-intl";
import { CAPITULOS } from "@/lib/edicion/capitulos";
import { MarcaTema } from "./estado";
import { Geometria } from "./geometria";

/**
 * Panel geometry, as fractions of the 1680x1050 composition that
 * produccion/edicion.py lays out. Kept in the same order and the same numbers
 * as the pipeline so the live fold and the baked fallback cannot drift: change
 * one, change the other, and the numbers are right here to compare.
 */
const PANELES = [
  { src: "/edicion/panel-7.avif", x: 3.571, y: 28.571, w: 21.429, h: 44.762, eje: "left" },
  { src: "/edicion/panel-3.avif", x: 26.786, y: 3.81, w: 34.524, h: 96.19, eje: "center" },
  { src: "/edicion/panel-6.avif", x: 63.214, y: 23.81, w: 18.452, h: 38.095, eje: "right" },
  { src: "/edicion/panel-9.avif", x: 83.333, y: 37.143, w: 14.286, h: 28.571, eje: "right" },
] as const;

/**
 * El retablo — the hero, and the answer to brief section 17.
 *
 * Section 17 (hero → rail morph) is the hardest and least specified seam in the
 * whole brief, and its trap is specific: two implementations can look identical
 * at both endpoints and completely different halfway, which is exactly where
 * section 1.2 says a reader must be able to stop and inspect. A crossfade
 * between a big thing and a small thing has no honest middle — halfway through
 * it is two ghosts.
 *
 * An altarpiece has hinged wings. Folding one has nothing BUT middle: every
 * intermediate position is a legible half-open polyptych, correct by
 * construction at any value of t. That is why the hero is a retablo and not a
 * fresco composite, and it is built from her four painted portraits, which are
 * already panel paintings — one figure each on one flat, unmodulated ground.
 *
 * It is CSS 3D plus a scroll value, so it survives WebGL-off completely intact.
 */
export function Hero() {
  const t = useTranslations("edicion");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The fold is written to a CSS custom property, not to React state. At 120Hz
    // this runs twice per frame of a fast flick; re-rendering six elements and
    // reconciling them each time is work the browser then has to redo. A single
    // style write lets the compositor own the rest.
    let pendiente = false;
    const leer = () => {
      pendiente = false;
      const r = el.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const p = recorrido <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / recorrido));
      el.style.setProperty("--p", p.toFixed(4));
      // Published to <html> as well, because the rail is a SIBLING of the hero
      // rather than a descendant and still has to follow the same morph.
      document.documentElement.style.setProperty("--hp", p.toFixed(4));
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

  return (
    <div id="edicion-hero" className="edicion-hero" ref={ref}>
      <MarcaTema tema="oscuro" />
      <div className="edicion-hero__pegajoso">
        <div className="edicion-hero__escena">
          {PANELES.map((p) => (
            <img
              key={p.src}
              src={p.src}
              alt=""
              className="edicion-hero__panel"
              data-eje={p.eje}
              // Custom properties, not direct left/top/width/height. Inline
              // styles beat any stylesheet rule short of !important, so setting
              // the geometry directly made the panels impossible to recompose
              // for mobile -- the phone layout silently kept the desktop's
              // percentages and cropped her portrait to fit them.
              style={
                {
                  "--x": `${p.x}%`,
                  "--y": `${p.y}%`,
                  "--w": `${p.w}%`,
                  "--h": `${p.h}%`,
                } as React.CSSProperties
              }
              // The hero is the largest paint on the page and it is above the
              // fold by definition, so it must not be lazy and it must be the
              // LCP candidate rather than competing with one.
              fetchPriority="high"
              decoding="async"
              {...medidas(p.src, `(max-width: 1023px) 100vw, ${Math.round(p.w)}vw`)}
            />
          ))}

          {/* The one anachronism: her Ceguera Digital figure, flat vector and
              saturated cobalt, walking in front of painted panels on her own
              native cream. It is cut by the bottom of the frame rather than
              floated inside it, because a foreground figure that fits entirely
              within the composition reads as just another panel.

              It keeps moving through the fold while the panels close. */}
          <img
            src="/edicion/ceguera-figura.avif"
            alt=""
            className="edicion-hero__anacronismo"
            decoding="async"
            /* Measured, not guessed: 44.2vw at 390 and 13.9vw at 1024, 1440
               and 1680. `sizes` is a PROMISE, and 27vw was twice the truth on
               every desktop width, which is what made the browser reach past
               the 640px variant for a 200px slot. */
            {...medidas("/edicion/ceguera-figura.avif", "(max-width: 1023px) 45vw, 14vw")}
          />
        </div>

        <Geometria />

        {/* The thin-rule frame, sitting across the panel joins: wordmark, a
            two-line standfirst carrying the positioning, and the six chapters
            with their numerals down the right edge. */}
        <div className="edicion-hero__marco">
          <h1 className="edicion-hero__titulo">
            <span>{t("marca.linea1")}</span>
            <span className="edicion-hero__acento">{t("marca.linea2")}</span>
            <span>{t("marca.linea3")}</span>
          </h1>
          <p className="edicion-hero__pie">{t("hero.entradilla")}</p>
          <ol className="edicion-hero__indice">
            {CAPITULOS.map((c) => (
              <li key={c.anclaje}>
                <a href={`#${c.anclaje}`}>{t(`capitulos.${c.anclaje}.titulo`)}</a>
                <span aria-hidden>{c.numeral}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
