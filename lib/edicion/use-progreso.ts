"use client";

import { useEffect, type RefObject } from "react";

/**
 * Write an element's scroll progress to a CSS custom property on itself.
 *
 * 0 when its top edge reaches the bottom of the viewport, 1 when its bottom
 * edge reaches the top. Everything scroll-driven on the Edition reads this one
 * value, which is why it lives here rather than being written out per scene.
 *
 * IT IS A CSS VARIABLE, NOT REACT STATE, and that is the whole point. A scroll
 * value in state re-renders its subtree on every frame of every scroll; the
 * Edition had exactly that in its page context and paid a full tree render per
 * frame to move one retablo. A single style write hands the rest to the
 * compositor and React never hears about it.
 *
 * rAF-gated because a fast wheel fires scroll dozens of times between paints,
 * and reading a rect in each one forces that many layouts.
 */
export function useProgreso(
  ref: RefObject<HTMLElement | null>,
  propiedad = "--p",
  /**
   * `dentro` measures the element travelling THROUGH the viewport (0 as it
   * enters at the bottom, 1 as it leaves at the top) — right for a scene that
   * plays while passing.
   *
   * `pegajoso` measures a tall element's own scroll length against a sticky
   * child (0 at its top, 1 when its last screen is reached) — right for the
   * hero and for pinned sequences.
   */
  modo: "dentro" | "pegajoso" = "dentro",
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pendiente = false;
    const leer = () => {
      pendiente = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;

      let p: number;
      if (modo === "pegajoso") {
        const recorrido = r.height - vh;
        p = recorrido <= 0 ? 0 : -r.top / recorrido;
      } else {
        const recorrido = r.height + vh;
        p = recorrido <= 0 ? 0 : (vh - r.top) / recorrido;
      }
      el.style.setProperty(propiedad, Math.min(1, Math.max(0, p)).toFixed(4));
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
  }, [ref, propiedad, modo]);
}
