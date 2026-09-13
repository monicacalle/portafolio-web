"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
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
/** Where each path was left, for the back button. Session-scoped on purpose:
 *  a position restored a week later is not where the reader was. */
const GUARDADO = "edicion:scroll";

/**
 * Rendered in BOTH branches, with and without Lenis.
 *
 * It used to live only inside `ReactLenis`, which is not mounted under reduced
 * motion — so exactly the readers who need a page to stay where they put it got
 * neither §84's restoration nor the fragment's settle re-issue. `useLenis`
 * returns undefined outside its provider rather than throwing, so the same
 * component covers both by falling back to the native scroller.
 */
function Aterrizaje() {
  const lenis = useLenis();
  const pathname = usePathname();
  /* One mover for both worlds: Lenis when it is there, the browser when it is
     not. `behavior: auto` because both branches are landings, not journeys. */
  const irA = (destino: HTMLElement | number) => {
    if (lenis) {
      lenis.scrollTo(destino, { immediate: true });
      return;
    }
    if (typeof destino === "number") {
      window.scrollTo({ top: destino, behavior: "auto" });
    } else {
      const y = destino.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "auto" });
    }
  };
  const posicion = () => (lenis ? lenis.scroll : window.scrollY);
  /* Set by popstate, which fires before React re-renders, so the landing
     effect below can tell a back/forward navigation from a fresh one. */
  const volviendo = useRef(false);

  useEffect(() => {
    const alVolver = () => {
      volviendo.current = true;
    };
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, []);

  /*
    §84: "restore scroll position when possible… do not always reset the long
    experience to zero."

    Recorded on the way OUT, in the cleanup, because that is the last moment
    the old path's position is still true. Lenis owns the number, so it is
    Lenis that is asked for it — `window.scrollY` lags its animated value.
  */
  useEffect(() => {
    const clave = `${GUARDADO}:${pathname}`;
    const guardar = () => {
      try {
        sessionStorage.setItem(clave, String(Math.round(posicion())));
      } catch {
        // Private mode, quota, a browser that has none. Losing the position is
        // the old behaviour, which is survivable; throwing here is not.
      }
    };
    /* `pagehide` as well as the cleanup: a same-tab external link or a closed
       tab never runs a React cleanup, and those are the two ways a reader most
       often leaves a page they intend to come back to. */
    window.addEventListener("pagehide", guardar);
    return () => {
      window.removeEventListener("pagehide", guardar);
      guardar();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, lenis]);

  useEffect(() => {
    // A hash is an explicit request for somewhere else on the page -- the
    // "volver a proyectos" link is /#projects, and the header's chapter jumps
    // are /#producto and its five siblings.
    const hash = window.location.hash;
    if (hash) {
      let destino: Element | null = null;
      try {
        destino = document.querySelector(hash);
      } catch {
        // A fragment that is not a valid selector is not ours to honour.
        volviendo.current = false;
        return;
      }
      /* Cleared here too. It used to survive the hash branch, so a popstate
         that did not change the pathname left the flag armed and the NEXT
         forward navigation restored a position nobody asked for. */
      volviendo.current = false;
      if (!destino) return;

      /*
        Three times, not once, and the repeats are the point.

        The first lands where the chapter is AT MOUNT. The page is 28,000px of
        scroll-driven layout and some of it settles after that: the sticky
        triptych's three readings overlap only once its component has armed
        itself, which changes chapter V's height and moves everything below it.
        Measured before this: /es#oficio landed 161px to 320px past its
        chapter, varying by load, and stable afterwards — the signature of a
        scroll computed against a layout that was still moving.

        Any real input cancels the repeats. A reader who has started scrolling
        has said where they want to be, and yanking them back to the anchor a
        second later is worse than landing 200px off.
      */
      const ir = () => irA(destino as HTMLElement);
      ir();

      let cancelado = false;
      const cancelar = () => {
        cancelado = true;
      };
      const reintentar = () => {
        if (!cancelado) ir();
      };
      window.addEventListener("wheel", cancelar, { once: true, passive: true });
      window.addEventListener("touchstart", cancelar, { once: true, passive: true });
      window.addEventListener("keydown", cancelar, { once: true });

      void document.fonts?.ready.then(() => requestAnimationFrame(reintentar));
      if (document.readyState === "complete") {
        const t = window.setTimeout(reintentar, 400);
        return () => {
          cancelar();
          window.clearTimeout(t);
        };
      }
      window.addEventListener("load", reintentar, { once: true });
      return () => {
        cancelar();
        window.removeEventListener("load", reintentar);
        window.removeEventListener("wheel", cancelar);
        window.removeEventListener("touchstart", cancelar);
        window.removeEventListener("keydown", cancelar);
      };
    }

    if (volviendo.current) {
      volviendo.current = false;
      let guardado = NaN;
      try {
        guardado = Number(sessionStorage.getItem(`${GUARDADO}:${pathname}`));
      } catch {
        // See above: no storage is survivable, a throw here is not.
      }
      if (Number.isFinite(guardado) && guardado > 0) {
        irA(guardado);
        return;
      }
    }

    irA(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (reduced) {
    return (
      <>
        <Aterrizaje />
        {children}
      </>
    );
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.25,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        /* §19: "anchor links should smooth-scroll to the beginning of their
           chapter." Every in-page jump on this page is an anchor -- the rail,
           the header's chapter list, the hero index, the mobile menu -- and
           they were all hard cuts: `html.lenis { scroll-behavior: auto }`
           switches the browser's own smooth scroll off (it has to, or two
           scrollers animate the same property), and nothing replaced it.
           Lenis handles the click itself with this on. */
        anchors: true,
      }}
    >
      <Aterrizaje />
      {children}
    </ReactLenis>
  );
}
