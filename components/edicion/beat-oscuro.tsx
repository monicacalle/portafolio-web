"use client";

import type { ReactNode } from "react";
import { MarcaTema } from "./estado";

/**
 * A second cinematic beat inside a chapter — brief sections 39, 40 and 45.
 *
 * Section 45 is the clearest statement of it: a chapter "contains another dark
 * cinematic insert near the end", with roughly 25vh of separation before it,
 * a light→dark transition, media animating in, and a play affordance. Its last
 * line is the point: "This creates an unexpected second cinematic beat within
 * one chapter."
 *
 * Every chapter here cut dark→light exactly once, so the page had a single
 * rhythm repeated six times. This is the break in it.
 *
 * It drops its own theme marker, so the header and rail follow it back to dark
 * and then to light again when the editorial body resumes — without that the
 * navigation would sit in light colours over a dark block.
 */
export function BeatOscuro({
  capitulo,
  vuelveAClaro = false,
  children,
}: {
  capitulo: string;
  /**
   * Whether the chapter's light editorial world resumes after this block.
   *
   * Default false, because section 45 places the insert "near the end" and
   * then says "move into Retail" -- the next chapter's dark intro. Handing back
   * to light when nothing light follows paints a scrim over the next chapter's
   * ground and puts a stray light band between two dark blocks.
   */
  vuelveAClaro?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="edicion-beat-oscuro" data-vuelve={vuelveAClaro || undefined}>
      <MarcaTema tema="oscuro" capitulo={capitulo} />
      <div className="edicion-beat-oscuro__interior">{children}</div>
      {vuelveAClaro ? (
        <MarcaTema tema="claro" capitulo={capitulo} borde="abajo" />
      ) : null}
    </section>
  );
}
