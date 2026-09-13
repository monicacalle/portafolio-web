"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useProgreso } from "@/lib/edicion/use-progreso";
import { medidas } from "@/lib/edicion/medidas";
import { prefersReducedMotion, subscribeToReducedMotion } from "@/lib/motion-gate";
import { Modal } from "./primitivas";

/**
 * The constellation — brief sections 29, 30 and 32.
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
 *
 * EVERY CARD NOW GOES SOMEWHERE, which is what makes §30 and §32 buildable
 * rather than declinable. §30 asks that "focus state should behave equivalently
 * to hover", and these were bare <figure> elements with nothing focusable in
 * them, so `:focus-within` could never fire; §32 asks every card for an action.
 * The destination is HER OWN PAINTING — 3000×3000, or 2048×2732 for the one
 * that is not square — reduced to 2000px and opened in the shared modal.
 *
 * Not the retablo panel: `panel()` in the pipeline rescales her subject to
 * 90–96% of an altarpiece aspect over a synthesised ground, so that file is a
 * composite. The lámina is her painting reduced and nothing else, which is what
 * makes each card's own caption — "3000 × 3000 px" — true of the thing that
 * opens when you click it.
 *
 * The ten plate-wall cards in the other chapters deliberately get none, and the
 * measurement is the reason: six of those ten sources are 900px or smaller
 * against a modal panel of min(92vw, 1400px), so "see it larger" would show
 * them upscaled up to 1.56x — a control making a promise the file cannot keep.
 * There is 7–11x of her own headroom behind every one of these five and none
 * behind those ten.
 */
/*
  `fase` is each card's offset into section 29's windows, and the numbers matter.

  At a flat i * 0.05 stagger the last two cards' opacity ramps ran from 60% to
  85% -- outside the section's own 40-65% band -- so the PRIMARY card never
  appeared at all before the block scrolled away. The phases are explicit now
  and the widest one still finishes inside 65%.

  The primary card also leads rather than trails: it is the anchor the cloud
  forms around, so it arrives first and the peripherals gather after it. It is
  FIRST IN THE LIST for the same reason -- position, scale, parallax and phase
  are all per-card data, so the desktop cloud does not care about the order,
  but below 1024px the cloud becomes a vertical stack in DOM order and the
  primary card was arriving last. Tab order follows the list too, and now
  matches both §29's hierarchy and the order of the compact list under it.
*/
const CARTAS = [
  // slug, card plate, her own painting, final scale, initial scale, position, parallax, phase
  { slug: "pelo-cobre", src: "/edicion/panel-3.avif", grande: "/edicion/lamina-pelo-cobre.avif", esc: 1.00, ini: 0.50,  x: 34, y: 22, par: 0.05, fase: 0 },
  { slug: "panuelo",    src: "/edicion/panel-7.avif", grande: "/edicion/lamina-panuelo.avif",    esc: 0.80, ini: 0.40,  x: 4,  y: 8,  par: 0.10, fase: 0.04 },
  { slug: "modigliani", src: "/edicion/panel-6.avif", grande: "/edicion/lamina-modigliani.avif", esc: 0.65, ini: 0.325, x: 71, y: 3,  par: 0.22, fase: 0.09 },
  { slug: "nube",       src: "/edicion/panel-9.avif", grande: "/edicion/lamina-nube.avif",       esc: 0.75, ini: 0.375, x: 76, y: 52, par: 0.16, fase: 0.12 },
  { slug: "ceguera",    src: "/cine/a4-ceguera.avif", grande: "/edicion/lamina-ceguera.avif",    esc: 0.80, ini: 0.40,  x: 3,  y: 50, par: 0.13, fase: 0.07 },
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

  /*
    A MOUNT FLAG, and deliberately NOT `armado` above.

    `armado` answers "does this reader want motion", which is a different
    question from "is JavaScript running" — using it here would strand every
    reduced-motion reader on the bare file with no dialog. This only decides
    whether the link announces itself as opening a dialog, so until it flips
    each card is an ordinary link to the painting, which is also exactly what a
    reader with JavaScript off keeps.

    A store rather than `useState(false)` + an effect: the value differs between
    the server render and the first client one, which is the one thing
    useSyncExternalStore exists for, and setting state from an effect to say "I
    have mounted" costs a second render of the whole cloud on every load.
  */
  const montado = useSyncExternalStore(sinCambios, () => true, () => false);

  const [abierta, setAbierta] = useState<string | null>(null);
  const pieza = CARTAS.find((c) => c.slug === abierta);

  return (
    <div
      className="edicion-constelacion"
      ref={ref}
      {...(armado ? { "data-scrub": "" } : {})}
    >
      {/* One label for all five, referenced by each card's accessible name, so
          a screen reader hears "Cobre, verlo más grande" rather than five
          copies of the same string sitting in the markup. */}
      <span id="carta-ampliar" className="visually-hidden">
        {t("cta.ampliar")}
      </span>

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
          <a
            href={c.grande}
            aria-labelledby={`carta-${c.slug} carta-ampliar`}
            {...(montado ? { "aria-haspopup": "dialog" as const } : {})}
            onClick={(e) => {
              // A modified click is a request for the file itself, so only the
              // plain left click is taken over and the element keeps behaving
              // as the link it is: ⌘-click, middle-click and "save image as"
              // all still reach her painting.
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              setAbierta(c.slug);
            }}
          >
            {/* alt is empty because the figcaption right below names the piece:
                with both, a screen reader announced the title twice per card. */}
            <img
              src={c.src}
              alt=""
              loading="lazy"
              decoding="async"
              {...medidas(c.src, "(max-width: 767px) 60vw, 26vw")}
            />
          </a>
          <figcaption>
            <strong id={`carta-${c.slug}`}>
              {t(`capitulos.ilustracion.piezas.${c.slug}.titulo`)}
            </strong>
            <span>{t(`capitulos.ilustracion.piezas.${c.slug}.meta`)}</span>
          </figcaption>
        </figure>
      ))}

      {pieza ? (
        <Modal
          etiqueta={t(`capitulos.ilustracion.piezas.${pieza.slug}.titulo`)}
          etiquetaCerrar={t("cta.cerrar")}
          onCerrar={() => setAbierta(null)}
        >
          {/* The alt is her own `linea` — already written, already through
              ghost — so a reader on a screen reader gets her description of the
              drawing rather than a filename or a repeat of the title. */}
          <img
            className="edicion-modal__lamina"
            src={pieza.grande}
            alt={t(`capitulos.ilustracion.piezas.${pieza.slug}.linea`)}
            fetchPriority="high"
            {...medidas(pieza.grande)}
          />
        </Modal>
      ) : null}
    </div>
  );
}

/** Nothing ever changes it: it is false on the server and true from the first
 *  client render onward, which is the whole of the subscription. */
function sinCambios() {
  return () => {};
}
