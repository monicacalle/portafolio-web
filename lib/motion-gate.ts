/**
 * Shared gates for the decorative canvas loops.
 *
 * Three full-viewport canvases used to run continuously on every page: the
 * liquid backdrop, the WebGL hero, and the negative-reveal cursor trail. None
 * of them checked whether the user had asked for reduced motion, whether they
 * were visible, or whether the tab was even in front. That is a WCAG 2.2.2
 * failure (Level A, "Pause, Stop, Hide") and it is why the site felt laggy on
 * a phone.
 *
 * One home for the checks, so the three canvases cannot drift apart on what
 * "should this be running" means.
 */

/** The user has asked the OS for less animation. Honour it, always. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A touch device or a narrow viewport. Used to switch off effects that exist
 * only to follow a mouse cursor: there is no cursor to follow, so they are
 * pure cost. Mirrors the thresholds already used in components/site/cursor.tsx.
 */
export function isTouchOrSmallViewport(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth < 1024
  );
}

/**
 * Calls `onChange(running)` whenever the element scrolls in or out of view, or
 * the tab is hidden or restored. Call it to drive a requestAnimationFrame loop
 * so it does no work nobody can see. Returns a cleanup function.
 */
export function observeRunnable(
  el: Element,
  onChange: (running: boolean) => void,
): () => void {
  let onScreen = true;
  const emit = () => onChange(onScreen && !document.hidden);

  const io = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      emit();
    },
    { rootMargin: "128px" },
  );
  io.observe(el);
  document.addEventListener("visibilitychange", emit);

  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", emit);
  };
}
