"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";
import { useTranslations } from "next-intl";
import { useProgreso } from "@/lib/edicion/use-progreso";
import { medidas } from "@/lib/edicion/medidas";
import { prefersReducedMotion, subscribeToReducedMotion } from "@/lib/motion-gate";

/**
 * The state-to-state sequence — brief section 42.
 *
 * Section 42 is the Rollouts story: "an oversized light editorial sequence",
 * about 25vh of breathing room before the content settles, a dedicated media
 * layer fading in over ~700ms ease-in-out, and the rule that decides the shape
 * of the whole thing — "scroll should reveal one state transitioning into
 * another", followed by "avoid a basic static screenshot."
 *
 * The planchas below this are section 43's demonstration and they PAN: one long
 * delivered screen travelling through a frame. That is a different thing, and
 * reading section 42 as already satisfied by it was the gap this closes.
 *
 * WHAT IS ON SCREEN IS FOUR REAL STATES OF VIBE, and the distinction from the
 * four-phase state machine this build refused is the point. That one was
 * refused because only `fase lútea` exists at high fidelity in the memoria, so
 * building it would have meant WRITING three phases of health advice about a
 * shipped product and publishing it under her name. Nothing is authored here.
 * These are four screens she delivered, cropped out of her own Figma exports by
 * produccion/edicion.py, in the order the product itself puts them in:
 *
 *   Datos de tu ciclo → Mi ciclo → Check in → Agenda
 *
 * The loop between them is the product's own claim rather than an edge invented
 * to make a sequence: screen 2 carries a button reading "Ver mi agenda /
 * Optimiza tu semana por fase", and screen 3 reads "Tu actualización diaria nos
 * ayudará a mejorar nuestras predicciones".
 *
 * THE FRAME NEVER MOVES. Opacity belongs to the whole state and the push
 * belongs to the screen inside it, so what travels is the picture behind a
 * fixed white card rather than the card itself — which is the difference
 * between one device being used and four photographs being cross-faded.
 */

/**
 * How long a transition lasts, as a share of the sequence's own scroll.
 *
 * Each state's arrival ramp starts at its `desde` and finishes TRANSICION
 * later. The gaps between are the dwells, where a state sits still long enough
 * to be read: 18%, 11%, 11% and 12% of the travel. The first dwell is the
 * longest on purpose — it is the one state the reader meets cold.
 */
const TRANSICION = 0.16;

const ESTADOS = [
  // The first state's `desde` is negative on purpose: its arrival ramp has
  // already finished at progress 0, so it is fully present before the sequence
  // has been scrolled at all rather than fading up out of an empty frame.
  { clave: "datos", src: "/edicion/estado-vibe-1.avif", desde: -1 },
  { clave: "ciclo", src: "/edicion/estado-vibe-2.avif", desde: 0.18 },
  { clave: "checkin", src: "/edicion/estado-vibe-3.avif", desde: 0.45 },
  { clave: "agenda", src: "/edicion/estado-vibe-4.avif", desde: 0.72 },
] as const;

/** Where each state's dwell is centred. The index chips scroll here. */
const CENTROS = ESTADOS.map((e, i) => {
  const llegada = Math.max(0, e.desde + TRANSICION);
  const salida = i + 1 < ESTADOS.length ? ESTADOS[i + 1].desde : 1;
  return (llegada + salida) / 2;
});

/** The midpoint of each transition, which is where the active chip changes. */
const UMBRALES = ESTADOS.slice(1).map((e) => e.desde + TRANSICION / 2);

function indiceDe(p: number) {
  let i = 0;
  while (i < UMBRALES.length && p >= UMBRALES[i]) i += 1;
  return i;
}

/** A state's departure is the next one's arrival, read off the same list so the
 *  two numbers cannot drift. 9 for the last state: it is never departed from. */
function ventana(i: number) {
  return {
    "--d": ESTADOS[i].desde,
    "--ds": i + 1 < ESTADOS.length ? ESTADOS[i + 1].desde : 9,
  } as React.CSSProperties;
}

export function Secuencia() {
  const t = useTranslations("edicion");
  const recorrido = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

  /*
    SELF-ARMING, for the reason the media reveal is (see revelar.tsx): a global
    flag on <html> does not survive hydration, and a scrubbed layout that needs
    JS must not be what the markup defaults to. Unarmed — JS off, JS broken, or
    motion reduced — the four states are a plain vertical strip with their
    captions beside them, which is a complete and readable account of the
    sequence rather than a pinned screen waiting for a value that never comes.

    A store rather than a state set from an effect: the server snapshot is
    false, so the HTML that ships IS the strip, and the OS setting can be
    changed while the page is open without leaving the scrub half-applied.
  */
  const armado = useSyncExternalStore(
    subscribeToReducedMotion,
    () => !prefersReducedMotion(),
    () => false,
  );

  /*
    setState only when the INDEX changes, never per frame. The scrub itself is a
    CSS variable and React never hears about it; this is the one discrete fact
    the chips need, and it changes three times across the whole sequence.
  */
  const alLeer = useCallback((p: number) => {
    setActivo((previo) => {
      const siguiente = indiceDe(p);
      return siguiente === previo ? previo : siguiente;
    });
  }, []);
  useProgreso(recorrido, "--s", "pegajoso", armado ? alLeer : undefined);

  /*
    Through Lenis when Lenis is there.

    window.scrollTo would be undone on the next frame: Lenis owns the scroll
    position in root mode and writes its own animated value back, which is the
    same fault that once left a case study opened from mid-page gliding 930px
    up on its own. useLenis returns undefined under reduced motion, because
    SmoothScroll deliberately does not mount the provider then — and the chips
    are not rendered at all in that case, so the native branch is only there for
    a page where the provider is genuinely absent.
  */
  const lenis = useLenis();
  const irA = (i: number) => {
    const el = recorrido.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const viaje = r.height - window.innerHeight;
    if (viaje <= 0) return;
    // The inverse of the hook's `pegajoso` reading: progress p is reached when
    // the element's top sits at -p * viaje, so the document offset that puts it
    // there is its current top, plus the current scroll, plus p * viaje.
    const destino = r.top + window.scrollY + CENTROS[i] * viaje;
    if (lenis) lenis.scrollTo(destino);
    else window.scrollTo({ top: destino });
  };

  return (
    <section className="edicion-secuencia" {...(armado ? { "data-scrub": "" } : {})}>
      <header className="edicion-secuencia__titular animate-show-media">
        <h3>{t("capitulos.producto.secuencia.titulo")}</h3>
        <p>{t("capitulos.producto.secuencia.nota")}</p>
      </header>

      <div className="edicion-secuencia__recorrido" ref={recorrido}>
        <div className="edicion-secuencia__fijo">
          {/* Section 42's "dedicated canvas/media layer", and the thing that
              fades in over 700ms ease-in-out. It trails the heading above by
              the same 110ms every other pairing on the page uses (§28). */}
          <div className="edicion-secuencia__escenario animate-show-media">
            {ESTADOS.map((e, i) => (
              <figure
                key={e.clave}
                className="edicion-secuencia__estado"
                style={{ ...ventana(i), zIndex: i }}
              >
                <div className="edicion-secuencia__marco">
                  <img
                    className="edicion-secuencia__pantalla"
                    src={e.src}
                    alt={t(`capitulos.producto.secuencia.estados.${e.clave}.etiqueta`)}
                    loading="lazy"
                    decoding="async"
                    {...medidas(e.src, "(max-width: 899px) 62vw, 20rem")}
                  />
                </div>
                <figcaption className="edicion-secuencia__nota">
                  <strong>
                    <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                    {t(`capitulos.producto.secuencia.estados.${e.clave}.etiqueta`)}
                  </strong>
                  <p>{t(`capitulos.producto.secuencia.estados.${e.clave}.nota`)}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Rendered only once the scrub is armed: unarmed, these buttons would
              scroll to positions inside a section that is not pinned. */}
          {armado ? (
            <nav
              className="edicion-secuencia__indice"
              aria-label={t("capitulos.producto.secuencia.indice")}
            >
              {ESTADOS.map((e, i) => (
                <button
                  key={e.clave}
                  type="button"
                  onClick={() => irA(i)}
                  {...(i === activo ? { "aria-current": "true" } : {})}
                >
                  {t(`capitulos.producto.secuencia.estados.${e.clave}.etiqueta`)}
                </button>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </section>
  );
}
