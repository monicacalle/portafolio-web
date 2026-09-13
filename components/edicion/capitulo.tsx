"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { Capitulo as DatosCapitulo } from "@/lib/edicion/capitulos";
import { MarcaTema } from "./estado";
import { VolverNav } from "./volver-nav";

/**
 * A chapter: a cinematic dark intro, then a light editorial body.
 *
 * The DOM shape mirrors the live reference, measured rather than guessed —
 * `data-section-id` and `data-section-index` on the root, and the content pushed
 * into the right-hand 80% so the rail never fights the composition. The intro is
 * ~140svh on desktop and ~70svh on mobile per brief section 85; the remainder of
 * the chapter's declared height belongs to its editorial body.
 */
/**
 * §31's active card, for the horizontal carousel the editorial body becomes
 * below 1024px.
 *
 * "Active centered card: opacity 1. Inactive cards: opacity approximately 0.7.
 * As snapping changes: smoothly update active card." CSS cannot ask a scroll
 * container which item it is snapped to, so an observer does: the root is the
 * scroller itself and the margins squeeze the detection band to the middle
 * fifth of it, which is where a snapped card sits.
 *
 * It also writes `data-carrusel` on the scroller, and the dimming is gated on
 * that — without it a reader with JS off would get every card at 0.7 and the
 * page would be relying on script to be legible.
 */
/* MarcaTema is a child of the body too: a 1px absolutely positioned marker
   spanning the full width, which intersects the detection band at every scroll
   position and would be permanently "active". Only real cards are observed. */
function tarjetas(caja: HTMLElement) {
  return Array.from(caja.children).filter(
    (n): n is HTMLElement => n instanceof HTMLElement && !n.hasAttribute("aria-hidden"),
  );
}

function useCarrusel(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const caja = ref.current;
    if (!caja) return;
    const mq = window.matchMedia("(max-width: 1023px)");

    let io: IntersectionObserver | null = null;
    const montar = () => {
      desmontar();
      if (!mq.matches) return;
      caja.dataset.carrusel = "";
      io = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            const el = e.target as HTMLElement;
            if (e.isIntersecting) el.dataset.activo = "";
            else delete el.dataset.activo;
          }
        },
        { root: caja, rootMargin: "0px -40% 0px -40%", threshold: 0.01 },
      );
      for (const hijo of tarjetas(caja)) io.observe(hijo);
    };
    const desmontar = () => {
      io?.disconnect();
      io = null;
      delete caja.dataset.carrusel;
      for (const hijo of tarjetas(caja)) delete hijo.dataset.activo;
    };

    montar();
    mq.addEventListener("change", montar);
    return () => {
      mq.removeEventListener("change", montar);
      desmontar();
    };
  }, [ref]);
}

export function Capitulo({
  capitulo,
  indice,
  escena,
  children,
}: {
  capitulo: DatosCapitulo;
  indice: number;
  /** The cinematic world behind the intro. Static image today, scene later. */
  escena?: ReactNode;
  /** The light editorial content that follows the intro. */
  children?: ReactNode;
}) {
  const t = useTranslations("edicion");
  const cuerpo = useRef<HTMLDivElement>(null);
  useCarrusel(cuerpo);
  // Inlined rather than hoisted into a `const`: assigning the template to a
  // variable widens it to `string` and next-intl can no longer prove the key
  // exists, which turns a compile-time guarantee into a runtime crash.
  const a = capitulo.anclaje;

  return (
    <section
      id={capitulo.anclaje}
      className="edicion-capitulo"
      data-section-id={capitulo.anclaje}
      data-section-index={indice}
      // The intro's theme, as a styling hook. MarcaTema below carries the same
      // fact to the state machine, but it is a 1px marker read by an observer,
      // not something CSS can select an ancestor from.
      data-tema={capitulo.tema}
      {...(escena ? {} : { "data-sin-escena": "" })}
      style={
        {
          "--cap-altura": `${capitulo.alturaSvh}svh`,
          "--cap-fondo": capitulo.fondo,
        } as React.CSSProperties
      }
    >
      <div className="edicion-capitulo__intro">
        <MarcaTema tema={capitulo.tema} capitulo={capitulo.anclaje} />
        {escena ? <div className="edicion-capitulo__escena">{escena}</div> : null}

        {/* §1 step 6 and §23's 300ms: the chapter title enters rather than
            being simply present. */}
        <div className="edicion-capitulo__portada animate-show-media">
          {/* The only h2 in the chapter. Everything in the editorial body below
              is h3, so the heading order survives even though the visual jump
              from a 200px title to a 20px card title is enormous. */}
          <h2 className="edicion-capitulo__titulo">{t(`capitulos.${a}.titulo`)}</h2>
          <p className="edicion-capitulo__entradilla">{t(`capitulos.${a}.entradilla`)}</p>
        </div>
        <VolverNav etiqueta={t("marca.volver")} />
      </div>

      {children ? (
        <div
          ref={cuerpo}
          className="edicion-capitulo__cuerpo"
          // Focusable because below 768px this becomes a horizontal snap
          // scroller, and Chrome does not make overflow containers focusable on
          // their own -- so a keyboard-only reader could not reach the work
          // inside it at all. tabIndex 0 plus a name is the standard remedy.
          tabIndex={0}
          role="group"
          aria-label={t(`capitulos.${a}.titulo`)}
        >
          {/* The body always turns light. That alternation is the page's pulse
              (brief 77), and it is what makes a 780svh chapter readable. */}
          <MarcaTema tema="claro" capitulo={capitulo.anclaje} />
          {children}
        </div>
      ) : null}
    </section>
  );
}

/**
 * One editorial card. `ancho` reproduces the reference's uneven grid — a row
 * mixes a full-bleed card with a half and two thirds, and that unevenness is
 * what stops the light sections reading as a CMS listing.
 */
export function Ficha({
  ancho = "medio",
  children,
}: {
  ancho?: "completo" | "medio" | "tercio" | "dos-tercios";
  children: ReactNode;
}) {
  return (
    <article className="edicion-ficha animate-show-media" data-ancho={ancho}>
      {children}
    </article>
  );
}
