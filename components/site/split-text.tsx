"use client";

import { createElement, Fragment, useEffect, useRef, type ElementType } from "react";

/**
 * Split-text reveal. Splits on words, wraps each in a masked line, and lifts
 * them in with a stagger the first time the block scrolls into view. Words stay
 * as whole units so wrapping and selection behave. Reduced-motion → instant.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("split--in");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    Tag,
    // Deliberate. JSX does not type-check with a polymorphic `as` prop:
    // TypeScript cannot resolve children for a generic ElementType and fails
    // the build with "children prop expects type 'never'". Tried that,
    // reverted it, so the ref is passed through createElement instead.
    // eslint-disable-next-line react-hooks/refs
    { ref, className: `split ${className ?? ""}` },
    words.map((w, i) => (
      // The space is a sibling BETWEEN words, not inside .split__word (which is
      // inline-block + overflow:hidden and would trim/clip a trailing space).
      <Fragment key={i}>
        <span className="split__word">
          <span className="split__inner" style={{ transitionDelay: `${delay + i * stagger}s` }}>
            {w}
          </span>
        </span>
        {i < words.length - 1 ? " " : ""}
      </Fragment>
    )),
  );
}
