"use client";

import { useRef } from "react";
import { useProgreso } from "@/lib/edicion/use-progreso";
import { CTA } from "./primitivas";

/**
 * A plancha: one of her delivered app screens, scrubbed through a phone-sized
 * frame by scroll position.
 *
 * This is what ships instead of Rive. The brief names Rive for the product
 * demonstrations (sections 79 and 105) and Rive is out on the free-to-use
 * constraint: exporting a .riv needs a paid plan, and while its CLI can build
 * one locally, the commercial terms for that artefact are documented nowhere —
 * an undocumented grant is not a grant. It would also have cost 882kB gzip of
 * runtime before any content, baked every word out of messages/ and out of
 * ghost, and drawn a blank rectangle with JS off.
 *
 * What replaces it is not a rebuilt mock of her work; it IS her work. These are
 * the full-length scrolling captures embedded in her own delivered decks —
 * 428×3012 of the Vibe AGENDA, 375×1471 of Voluntee's filter flow — moving
 * through a frame. Nothing is redrawn, so nothing can drift from what she
 * actually shipped, and the fidelity problem every alternative had disappears.
 *
 * Deliberately NOT a four-phase Vibe state machine, which is what the obvious
 * version of this would be. Only `fase lútea` exists at high fidelity in the
 * 51-page memoria; the other three phases are medium-fidelity wireframes on a
 * single page. Building the state machine would mean writing three phases of
 * health advice about a real product she shipped, and publishing it under her
 * name. The rule that governs chapter I forbids exactly that.
 *
 * With reduced motion on, or with JS off, the screen simply sits at its top —
 * a still of a real interface, which is a fair fallback rather than a broken
 * one.
 */
export function Plancha({
  src,
  alto,
  ancho,
  titulo,
  nota,
  href,
  verLabel,
}: {
  src: string;
  /** The capture's real pixel height. Drives the travel, so it is not guessed. */
  alto: number;
  ancho: number;
  /* Resolved strings, not message keys. next-intl types its keys as a literal
     union, and a key threaded through a prop widens to `string`, which loses
     the compile-time guarantee that the message exists. Translating at the call
     site keeps it. */
  titulo: string;
  nota: string;
  /** The written case study this screen came out of. */
  href: string;
  verLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useProgreso(ref, "--s");

  return (
    <div className="edicion-plancha animate-show-media" ref={ref}>
      <div className="edicion-plancha__marco" style={{ aspectRatio: `${ancho} / 812` }}>
        <img
          src={src}
          alt={titulo}
          className="edicion-plancha__pantalla"
          // The travel is (capture height - frame height) expressed as a share
          // of the capture, so the CSS needs no pixel values and the frame can
          // be any size.
          style={{ "--recorrido": `${(1 - 812 / alto) * 100}%` } as React.CSSProperties}
          loading="lazy"
          decoding="async"
          width={ancho}
          height={alto}
        />
      </div>
      <div className="edicion-plancha__pie">
        <h3>{titulo}</h3>
        <p>{nota}</p>
        {/* The case studies were completely orphaned: the homepage linked to
            neither /proyectos/vibe nor /proyectos/voluntee, so the two pieces
            of deep written work on the whole site -- the ones the market
            research calls the highest-leverage thing she has -- were reachable
            only by typing the URL. */}
        <CTA href={href} flecha>
          {verLabel}
        </CTA>
      </div>
    </div>
  );
}
