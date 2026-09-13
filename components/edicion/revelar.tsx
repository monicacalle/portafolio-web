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
 * The hidden state is gated on `data-armado`, which this component writes per
 * element, so with JS broken everything is simply visible — the same
 * progressive-enhancement contract the rest of the site uses. This paragraph
 * used to say `.motion`, a global class on <html>, and the comment twelve
 * lines below it already explains why that was removed: React owns <html> and
 * hydration strips the flag. Two accounts of the same gate in one file, one of
 * them describing code that no longer exists.
 */
export function Revelar() {
  useEffect(() => {
    /*
      Under reduced motion nothing is armed AT ALL, so nothing is ever hidden.

      A CSS override could not carry this: the armed selector is
      `.animate-show-media[data-armado]:not([data-visible])` at (0,3,0) and any
      reasonable reduced-motion rule loses to it on specificity, which left
      three fifths of a chapter's media at opacity 0 for exactly the readers who
      asked for less movement. Deciding it here means there is no specificity
      race to lose.
    */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

    /*
      SELF-ARMING. The hidden start state is applied here, by JS, rather than
      declared in CSS behind a global flag.

      The flag used to be `.motion` on <html>, set by an inline script before
      paint -- and React owns <html> because the layout renders it, so
      hydration RESET the element and stripped the flag about 10ms later on
      every load. A data attribute is stripped the same way. Arming each target
      individually means there is no global flag to lose: if this effect never
      runs, nothing is ever hidden, which is the progressive-enhancement
      contract the original class was reaching for and failing to keep.
    */
    objetivos.forEach((o) => {
      o.dataset.armado = "";
      io.observe(o);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
