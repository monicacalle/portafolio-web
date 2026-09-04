"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { usePathname } from "@/lib/i18n/navigation";

/*
  Land at the top of the page you navigated to.

  Next resets the scroll on navigation, but Lenis owns the scroll position in
  root mode and writes its own animated value back on the next frame -- so a
  case study opened from halfway down the homepage arrived ~930px down and then
  glided to the top over about a second. Lenis also cancels that glide on any
  wheel or touch input, so a visitor who reached for the scroll wheel was left
  stranded mid-page, having to scroll up to read the title of the thing they
  had just clicked.

  immediate: true skips the easing. There is nothing to animate between two
  different pages, and the animation was the whole problem.
*/
function ScrollToTop() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    // A hash is an explicit request for somewhere else on the page -- the
    // "volver a proyectos" link is /#projects -- so leave those alone.
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

/**
 * Lenis smooth scroll — the spine of the whole feel. Everything scroll-driven
 * (velocity skew, parallax, reveals) reads from this. Tuned for a heavy,
 * expensive glide rather than a snappy default.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
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
