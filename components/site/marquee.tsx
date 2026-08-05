"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react";

/**
 * Kinetic marquee. Scrolls on its own, and scroll velocity bends the speed and
 * direction — the signature "the page reacts to how fast you scroll" moment.
 */
export function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVel = useVelocity(scrollY);
  const smoothVel = useSpring(scrollVel, { damping: 50, stiffness: 380 });
  const velFactor = useTransform(smoothVel, [-2500, 0, 2500], [-4, 0, 4], { clamp: false });

  const dir = useRef(1);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * 2.4 * (delta / 1000);
    const v = velFactor.get();
    if (v < 0) dir.current = -1;
    else if (v > 0) dir.current = 1;
    move += dir.current * Math.abs(v) * (delta / 1000);
    // wrap within one copy width (we render the list 4x → 25%)
    let next = baseX.get() + move;
    next = ((next % 25) + 25) % 25;
    baseX.set(next);
  });

  const x = useTransform(baseX, (v) => `-${v}%`);
  const copies = [0, 1, 2, 3];

  return (
    <div className="marquee" ref={ref} aria-hidden>
      <motion.div className="marquee__track" style={reduce ? undefined : { x }}>
        {copies.map((c) => (
          <div className="marquee__group" key={c}>
            {items.map((it, i) => (
              <span className="marquee__item" key={`${c}-${i}`}>
                {it}
                <span className="marquee__star">-</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
