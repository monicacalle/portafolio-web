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
    <a className="edicion-volver" href="#edicion-indice">
      {etiqueta}
    </a>
  );
}
