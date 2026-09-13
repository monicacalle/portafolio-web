"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The scroll spine: makes GSAP's ScrollTrigger read Lenis's scroll position
 * instead of the browser's.
 *
 * Without this every scrubbed timeline on the page lags the content by roughly
 * the smoothing duration, because Lenis animates the scroll position on its own
 * rAF while ScrollTrigger is still sampling the native one. The symptom is
 * subtle and maddening: pinned sections drift a few pixels behind the cursor and
 * scrubbed animations feel rubbery rather than attached.
 *
 * Mounted from the Edition page rather than from SmoothScroll, which wraps every
 * route. The case-study routes and the flipbook do not use ScrollTrigger, and
 * putting the bridge in the shared provider would pull GSAP into their bundles
 * for nothing.
 */
export function Espina() {
  // Undefined when the visitor has asked for reduced motion: SmoothScroll
  // returns its children WITHOUT the Lenis provider in that case, deliberately,
  // because inertial scroll-hijacking is the exact thing that setting exists to
  // prevent. ScrollTrigger then reads the native scroll position, which is
  // correct and needs no bridge — so this whole component becomes a no-op
  // rather than something that has to be disabled.
  const lenis = useLenis();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis writes the scroll position on its own rAF. lagSmoothing lets GSAP
    // silently drop time after a long frame, which desynchronises the two
    // clocks and shows up as a scrubbed timeline jumping after a stall.
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Every trigger, not just this component's: the Edition creates them from
      // a dozen places and a stale trigger pointing at an unmounted element
      // throws on the next scroll event.
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    // Positions were measured against whatever the layout was at mount. Fonts
    // land late and images resolve late, both of which move everything below
    // them, so refresh once the page has settled.
    ScrollTrigger.refresh();
    return () => {
      lenis.off("scroll", update);
    };
  }, [lenis]);

  return null;
}
