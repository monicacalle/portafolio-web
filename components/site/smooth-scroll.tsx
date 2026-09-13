"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "@/lib/i18n/navigation";
import { prefersReducedMotion, subscribeToReducedMotion } from "@/lib/motion-gate";

/*
  Land where the URL says, and let Lenis be the one that puts you there.

  Next resets the scroll on navigation, but Lenis owns the scroll position in
  root mode and writes its own animated value back on the next frame -- so a
  case study opened from halfway down the homepage arrived ~930px down and then
  glided to the top over about a second. Lenis also cancels that glide on any
  wheel or touch input, so a visitor who reached for the scroll wheel was left
  stranded mid-page, having to scroll up to read the title of the thing they
  had just clicked.

  THE FRAGMENT CASE USED TO BE LEFT TO THE BROWSER, and the browser lost the
  race. Measured at 1440x900 on 2026-09-13: /es#impreso settled at 17048
  against the chapter's own layout offset of 16643, and /es#oficio at 24027
  against 23622 -- both 405px INSIDE the chapter rather than at its top, and
  the overshoot changed with the viewport (60px at 600, 449px at 1000), which
  is the signature of a scroll computed against a layout that is still moving.
  Handing the fragment to `lenis.scrollTo(element)` makes it deterministic: it
  resolves the offset itself, at the moment it runs, on the scroller that
  actually owns the position.

  immediate: true skips the easing in both branches. There is nothing to
  animate between two different pages, and the animation was the whole problem.
*/
function ScrollToTop() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    // A hash is an explicit request for somewhere else on the page -- the
    // "volver a proyectos" link is /#projects, and the header's chapter jumps
    // are /#producto and its five siblings.
    const hash = window.location.hash;
    if (!hash) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }
    let destino: Element | null = null;
    try {
      destino = document.querySelector(hash);
    } catch {
      // A fragment that is not a valid selector is not ours to honour.
      return;
    }
    if (destino) lenis.scrollTo(destino as HTMLElement, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

/**
 * Lenis smooth scroll — the spine of the whole feel. Everything scroll-driven
 * (velocity skew, parallax, reveals) reads from this. Tuned for a heavy,
 * expensive glide rather than a snappy default.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  // Someone who has asked their operating system for reduced motion gets native
  // scrolling. Inertial scroll-hijacking is the specific thing that setting
  // exists to prevent -- it is motion from interaction under WCAG 2.3.3, and
  // for a vestibular disorder it is not a stylistic preference. Native scroll
  // is the correct behaviour here, not a degraded one.
  //
  // useSyncExternalStore rather than useState + effect: the first client render
  // must already know, or Lenis mounts for a frame before we take it away.
  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    () => prefersReducedMotion(),
    () => false,
  );

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.25,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      <ScrollToTop />
      {children}
    </ReactLenis>
  );
}
