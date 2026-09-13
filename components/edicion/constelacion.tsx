"use client";

import { useRef, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useProgreso } from "@/lib/edicion/use-progreso";
import { medidas } from "@/lib/edicion/medidas";
import { prefersReducedMotion, subscribeToReducedMotion } from "@/lib/motion-gate";

/**
 * The constellation — brief sections 29 and 30.
 *
 * Section 29 asks for five floating cards "arranged like a loose cloud", each
 * expanding from its own origin at its own rate, with one primary card at full
 * scale and the peripheral ones smaller and partly transparent.
 *
 * It lands on chapter I because the section wants exactly FIVE and she has
 * exactly five drawings. The reference's version generates possibilities around
 * the user; hers shows the five things nobody asked her for, which is what the
 * chapter's own copy says.
 *
 * Every number below is section 29's. The base scales (0.80 / 0.65 / 0.75 /
 * 0.80 / 1.00), the initial scales (.40 / .325 / .375 / .40 / .50), and the
 * reveal windows: hidden to 20%, expanding 20–45%, opacity arriving 40–65%,
 * resting by 100%.
 */
/*
  `fase` is each card's offset into section 29's windows, and the numbers matter.

  At a flat i * 0.05 stagger the last two cards' opacity ramps ran from 60% to
  85% -- outside the section's own 40-65% band -- so the PRIMARY card never
  appeared at all before the block scrolled away. The phases are explicit now
  and the widest one still finishes inside 65%.

  The primary card also leads rather than trails: it is the anchor the cloud
  forms around, so it arrives first and the peripherals gather after it.
*/
const CARTAS = [
  // slug, src, final scale, initial scale, position, parallax rate, phase
  { slug: "panuelo",    src: "/edicion/panel-7.avif", esc: 0.80, ini: 0.40,  x: 4,  y: 8,  par: 0.10, fase: 0.04 },
  { slug: "modigliani", src: "/edicion/panel-6.avif", esc: 0.65, ini: 0.325, x: 71, y: 3,  par: 0.22, fase: 0.09 },
  { slug: "nube",       src: "/edicion/panel-9.avif", esc: 0.75, ini: 0.375, x: 76, y: 52, par: 0.16, fase: 0.12 },
  { slug: "ceguera",    src: "/cine/a4-ceguera.avif", esc: 0.80, ini: 0.40,  x: 3,  y: 50, par: 0.13, fase: 0.07 },
  // The primary card: scale 1, opacity 1, section 29's own hierarchy.
  { slug: "pelo-cobre", src: "/edicion/panel-3.avif", esc: 1.00, ini: 0.50,  x: 34, y: 22, par: 0.05, fase: 0 },
] as const;

export function Constelacion() {
  const t = useTranslations("edicion");
  const ref = useRef<HTMLDivElement>(null);
  useProgreso(ref, "--c");

  /*
    SELF-ARMING, the same contract as the media reveal and the state sequence.

    The scrub used to be declared unconditionally in CSS against `--c`, which
    only this component writes. With JavaScript off at 1024px and up, --c fell
    back to 0, every card's opacity resolved to 0, and chapter I's entire
    editorial body — all five drawings — rendered invisible. §100 lists exactly
    that as a condition that makes the result unacceptable. The resting state
    is "arrived" now, and this attribute is what adds the motion.
  */
  const armado = useSyncExternalStore(
    subscribeToReducedMotion,
    () => !prefersReducedMotion(),
    () => false,
  );

  return (
    <div
      className="edicion-constelacion"
      ref={ref}
      {...(armado ? { "data-scrub": "" } : {})}
    >
      {CARTAS.map((c) => (
        <figure
          key={c.slug}
          className="edicion-carta"
          data-primaria={c.esc === 1 || undefined}
          style={
            {
              "--esc": c.esc,
              "--ini": c.ini,
              "--cx": `${c.x}%`,
              "--cy": `${c.y}%`,
              "--par": c.par,
              // Section 29: cards expand from their OWN origins, so each gets
              // its own slice of the window rather than all five starting at
              // once. See the note on CARTAS for why these are explicit.
              "--fase": c.fase,
            } as React.CSSProperties
          }
        >
          <img
            src={c.src}
            alt={t(`capitulos.ilustracion.piezas.${c.slug}.titulo`)}
            loading="lazy"
            decoding="async"
            {...medidas(c.src, "(max-width: 767px) 60vw, 26vw")}
          />
          <figcaption>
            <strong>{t(`capitulos.ilustracion.piezas.${c.slug}.titulo`)}</strong>
            <span>{t(`capitulos.ilustracion.piezas.${c.slug}.meta`)}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
