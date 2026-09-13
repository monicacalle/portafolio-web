"use client";

import { useRef, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useProgreso } from "@/lib/edicion/use-progreso";
import { medidas } from "@/lib/edicion/medidas";
import { prefersReducedMotion, subscribeToReducedMotion } from "@/lib/motion-gate";

/**
 * The three-part sticky story — brief sections 47 and 48.
 *
 * Three sequential beats of ~165svh. A viewport-height block is sticky at
 * top: 110px for the whole 495svh, so the browser keeps scrolling through the
 * parent while the story stays pinned.
 *
 * ONE IMAGE, ONE PROGRESS VALUE, THREE TEXTS, and that is the rewrite. §48's
 * rule is the important one: the SAME composition runs through all three beats
 * and is never reset — "the viewer should feel they are circling one artifact
 * through three ideas."
 *
 * The first build had three beats, each with its own <img> and its own
 * `useProgreso` in `dentro` mode. That is three compositions, and it reset
 * twice. It was also measurably still: on a 165svh beat at a 1000px viewport,
 * a beat's own `dentro` progress reads 0.34 when the block pins and 0.62 when
 * it releases, so the entire time the reader was looking at the pinned story
 * the camera moved 2.9% of its scale. The other 71% of the range played while
 * the block was sliding in and out of frame, where nobody was watching it.
 *
 * One `pegajoso` value across the whole triptych fixes both: 0 at the pin, 1 at
 * the release, moving only while the thing is on screen, and never restarting.
 *
 * It lives in chapter V rather than chapter IV because §48 is about circling a
 * physical artifact, and a printed object is the only thing on this page that
 * genuinely is one. §104 names the feeling this structure should produce: "I am
 * inspecting a physical artifact in a gallery."
 */
const BEATS = ["objeto", "reticula", "tinta"] as const;

/**
 * §49's technical capability items, on the third reading.
 *
 * "Third POS story includes technical capability items. Reveal them
 * progressively as the user scrolls. Use minimal line/icon animations. Do not
 * create floating neon labels. The visual language remains industrial /
 * editorial."
 *
 * They are her print specs, and they were already written: the same five rows
 * that used to sit in a compact list after the whole sticky sequence. MOVED,
 * not copied — they are about the object being circled, so they belong inside
 * the reading that is about committing ink to paper, and one list shown twice
 * would be padding.
 *
 * The animation is a hairline drawing in under each line. No icons, no glow,
 * no floating labels: §49 forbids the last of those by name and the page has
 * no icon set to be consistent with.
 */
const ESPECIFICACIONES = ["sangre", "perfil", "tinta", "tipo", "prueba"] as const;

/**
 * Where each reading arrives and leaves, as a share of the triptych's own
 * scroll. Thirds, with the swap inside a tenth of the travel.
 *
 * THE TWO RAMPS ARE STAGGERED INSIDE THAT TENTH, and the first version of this
 * was not: reading 1's departure and reading 2's arrival both ran over
 * [0.33, 0.43], so at 0.38 two headings and two paragraphs sat on top of one
 * another at half opacity each, 7px apart, for about 395px of scroll at a
 * 1000px viewport. Twice. The comment above them claimed the opposite.
 *
 * The outgoing one leaves over the first 45% of the window and the incoming
 * arrives over the last 45%, which is the shape `secuencia.tsx` already uses
 * for exactly this reason.
 */
const VENTANAS = [
  { desde: -1, hasta: 0.33 },
  { desde: 0.33, hasta: 0.66 },
  { desde: 0.66, hasta: 9 },
] as const;

export function Triptico() {
  const t = useTranslations("edicion");
  const recorrido = useRef<HTMLDivElement>(null);
  useProgreso(recorrido, "--t", "pegajoso");

  /* Self-arming, the same contract as the constellation and the sequence: with
     the scrub off, the object rests at its first framing and all three
     readings stack in the flow, which is a complete account of the story. */
  const armado = useSyncExternalStore(
    subscribeToReducedMotion,
    () => !prefersReducedMotion(),
    () => false,
  );

  return (
    <div
      className="edicion-triptico"
      ref={recorrido}
      {...(armado ? { "data-scrub": "" } : {})}
    >
      <div className="edicion-triptico__fijo">
        <figure className="edicion-triptico__objeto">
          {/* ONE image for all three beats. §48 forbids resetting the
              composition, and three <img> elements are three compositions. */}
          <img
            src="/edicion/cap-impreso.avif"
            alt=""
            loading="lazy"
            decoding="async"
            {...medidas("/edicion/cap-impreso.avif")}
          />
        </figure>

        <div className="edicion-triptico__lecturas">
          {BEATS.map((clave, i) => (
            <div
              key={clave}
              className="edicion-triptico__texto"
              style={
                {
                  "--d": VENTANAS[i].desde,
                  "--ds": VENTANAS[i].hasta,
                } as React.CSSProperties
              }
            >
              <h3>{t(`capitulos.impreso.triptico.${clave}.titulo`)}</h3>
              <p>{t(`capitulos.impreso.triptico.${clave}.cuerpo`)}</p>

              {clave === "tinta" ? (
                <div className="edicion-triptico__especificaciones">
                  <h4>{t("capitulos.impreso.metodo.titulo")}</h4>
                  <ul>
                    {ESPECIFICACIONES.map((k, j) => (
                      <li
                        key={k}
                        /* Each item opens its own slice of the last third, so
                           they arrive one after another rather than together —
                           §49's "reveal them progressively". */
                        style={{ "--e": 0.72 + j * 0.05 } as React.CSSProperties}
                      >
                        <strong>{t(`capitulos.impreso.metodo.filas.${k}.q`)}</strong>
                        <span>{t(`capitulos.impreso.metodo.filas.${k}.a`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
