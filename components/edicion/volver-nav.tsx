"use client";

import { useTranslations } from "next-intl";

/**
 * The "back to navigation" escape control — brief section 76.
 *
 * Every chapter carries one. It sits just below its own bottom edge at
 * translateY(calc(100% + 2px)) and slides to 0 on keyboard focus over ~200ms,
 * exactly as the section specifies, so it is invisible to a pointer user and
 * one Tab away for a keyboard user.
 *
 * Section 76 is explicit that this is "principally an accessibility
 * affordance" and that it must not become a permanently floating button. So it
 * is hidden by transform rather than by `display: none` or `visibility:
 * hidden` — both of which would take it out of the tab order and defeat the
 * entire point.
 */
export function VolverNav({ etiqueta }: { etiqueta: string }) {
  return (
    <a
      className="edicion-volver"
      href="#edicion-indice"
      /*
        Below 1024px the rail is display: none, so #edicion-indice is a node
        with no offsetParent -- unreachable and unfocusable, which made this
        control point at nothing on every phone. There it opens the mobile menu
        instead, which is where the chapter index actually lives at that width.
      */
      onClick={(e) => {
        if (window.innerWidth >= 1024) return;
        e.preventDefault();
        const boton = document.querySelector<HTMLButtonElement>(
          ".edicion-movil__boton",
        );
        boton?.click();
        boton?.focus();
      }}
    >
      {etiqueta}
    </a>
  );
}
