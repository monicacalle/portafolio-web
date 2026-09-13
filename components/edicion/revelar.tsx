"use client";

import { useEffect } from "react";

/**
 * The generic media reveal of brief section 28.
 *
 * Section 28 defines the CSS; this only flips `data-visible` when an element
 * enters the viewport. One observer for the whole page rather than one per
 * element, because the editorial bodies hold dozens of cards and an observer
 * each is a lot of bookkeeping for one boolean.
 *
 * It UNOBSERVES after revealing. Section 78 is explicit that the white
 * editorial sections are "a breathing mechanism" and warns against
 * scroll-scrubbing every sentence, so these reveal once and then stay put
 * rather than animating again on the way back up.
 *
 * The class is added by CSS-less markup and the initial hidden state is gated
 * on `.motion`, so with JS broken or motion reduced everything is simply
 * visible -- the same progressive-enhancement contract the rest of the site
 * uses.
 */
export function Revelar() {
  useEffect(() => {
    const objetivos = document.querySelectorAll<HTMLElement>(
      ".animate-show-media:not([data-visible])",
    );
    if (!objetivos.length) return;

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.visible = "";
          io.unobserve(e.target);
        }
      },
      // A little before the edge, so the reveal is finishing as the element
      // arrives rather than starting once the reader is already looking at it.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    objetivos.forEach((o) => io.observe(o));
    return () => io.disconnect();
  }, []);

  return null;
}
