"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { loader } from "@/lib/loader";

/**
 * Preloader: a serif counter races 0 → 100 while a warm curtain holds the page,
 * then splits away to reveal the hero. Locks scroll until it clears and fires a
 * `portfolio:ready` event the hero listens for to start its own entrance.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Lock scroll while the curtain is up (client-only, no SSR class → no
    // hydration mismatch). The curtain itself is server-rendered, so there is
    // no flash of content before this runs.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finish = () => {
      setDone(true);
      document.body.style.overflow = "";
      loader.markReady();
    };

    if (reduce) {
      finish();
      return () => {
        document.body.style.overflow = prev;
      };
    }

    const start = performance.now();
    const DURATION = 2000;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 2.2); // ease-out; lingers near the end
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else timer = setTimeout(finish, 320);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <motion.div
            className="preloader__panel"
            initial={{ y: 0 }}
            exit={{ y: "-101%" }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="preloader__inner">
              <span className="preloader__word">Portafolio</span>
              <span className="preloader__count">
                {String(count).padStart(3, "0")}
              </span>
            </div>
            <div className="preloader__bar">
              <motion.span
                className="preloader__fill"
                style={{ scaleX: count / 100 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
