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
 *
 * Deliberately `pointer`/`hover` (the PRIMARY input) and not `any-pointer`/
 * `any-hover`. The `any-` forms are true when any attached mechanism
 * qualifies, and `fine` covers a stylus as well as a mouse, so `any-pointer:
 * fine` is true on a phone with an active stylus. This gate exists to keep
 * negative-reveal -- a full-viewport canvas compositing mix-blend-mode:
 * difference through an SVG goo filter -- off phones, which is what made the
 * site lag on mobile. Widening to `any-` would put it back on exactly the
 * devices the gate protects.
 *
 * The cost of choosing primary: a tablet with an attached trackpad loses a
 * decorative cursor trail. That is the cheaper mistake.
 */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
