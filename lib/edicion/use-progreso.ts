"use client";

import { useEffect, useRef, type RefObject } from "react";

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
  /**
   * Optional observer, called with the same value on the same frame.
   *
   * It exists so a component that needs a DISCRETE fact about the scroll — the
   * index of the state currently on screen, say — can have it without opening a
   * second scroll listener and forcing a second layout read per frame for a
   * rect this one has already measured. Callers are expected to no-op unless
   * the discrete value actually changed; anything that calls setState on every
   * frame here defeats the reason this hook writes a CSS variable at all.
   */
  alLeer?: (p: number) => void,
) {
  /* Held in a ref so an inline arrow at the call site does not re-run the
     effect — and assigned in its own effect rather than during render, which
     is a side effect in the render phase and a lint error in this project. */
  const observador = useRef(alLeer);
  useEffect(() => {
    observador.current = alLeer;
  }, [alLeer]);

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
      const v = Math.min(1, Math.max(0, p));
      el.style.setProperty(propiedad, v.toFixed(4));
      observador.current?.(v);
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
