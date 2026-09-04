"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Lightweight scroll reveal. Adds `.in-view` when the element enters the
 * viewport, then unobserves. No library, respects reduced-motion via CSS.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
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
    {
      ref,
      "data-reveal": "",
      className,
      style: { "--reveal-delay": `${delay}ms` } as React.CSSProperties,
    },
    children,
  );
}
