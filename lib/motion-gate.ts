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
 * Is there a real cursor that can hover?
 *
 * Used to switch off effects that exist only to follow a mouse pointer. The
 * previous version asked `"ontouchstart" in window || maxTouchPoints > 0`,
 * which is true on any touchscreen laptop with a trackpad and a real cursor,
 * so those users lost the effect for no reason. This asks the question that
 * actually matters, and the media query answers it directly.
 */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
