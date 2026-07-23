/**
 * Tiny shared loader state so the Preloader, Hero, and WebGL canvas coordinate
 * the intro without touching the DOM before hydration (which caused a
 * hydration mismatch). Module-level flag + pub/sub, no globals on document.
 */
let ready = false;
const subs = new Set<() => void>();

export const loader = {
  get isReady() {
    return ready;
  },
  markReady() {
    if (ready) return;
    ready = true;
    subs.forEach((f) => f());
  },
  subscribe(fn: () => void): () => void {
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  },
};
