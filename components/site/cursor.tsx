"use client";

import { useEffect, useState } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion-gate";
import { useMotionValue, useSpring, motion, AnimatePresence } from "motion/react";

/**
 * Custom cursor. A soft ring that follows on a spring plus an instant dot.
 * Grows and shows a label over elements marked with data-cursor="…".
 * Hidden entirely on touch / coarse pointers and under reduced-motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });

  useEffect(() => {
    // The shared gate, so this and negative-reveal cannot disagree about what
    // "there is a cursor here" means. They did: this asked ontouchstart and a
    // width threshold, that one asked the pointer media query, so on a
    // touchscreen laptop the inverting trail ran with no dot anchoring it.
    if (!hasFinePointer() || prefersReducedMotion()) return;
    
    // Feature detection has to run on the client: touch support, viewport
    // width and the reduced-motion query do not exist during SSR. Setting
    // state from the effect is the SSR-safe way to do that, so the compiler's
    // cascading-render warning is accepted here on purpose.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    // Only hide the native cursor once ours is guaranteed to render.
    document.body.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (el) {
        setActive(true);
        setLabel(el.dataset.cursor || null);
      } else {
        setActive(false);
        setLabel(null);
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div
        className={`cursor-ring ${active ? "is-active" : ""} ${label ? "has-label" : ""}`}
        style={{ x: ringX, y: ringY }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              className="cursor-label"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
