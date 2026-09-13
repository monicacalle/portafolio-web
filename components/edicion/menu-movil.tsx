"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CAPITULOS } from "@/lib/edicion/capitulos";

/**
 * The mobile chapter menu (brief sections 3 and 11).
 *
 * Below the large breakpoint the rail is gone and the header's jump list will
 * not fit, so the six chapters move in here. It is a disclosure, not an overlay:
 * a panel that pushes down from the header rather than a full-screen takeover,
 * which keeps the chapter you were reading visible behind it.
 *
 * The open/close animation is grid-template-rows 0fr → 1fr. Animating height to
 * a fixed value means guessing the content's height and being wrong in the other
 * language; animating max-height means the easing is wrong by whatever the guess
 * overshot by. The fr trick animates to the content's real height with no
 * measurement and no JS.
 */
export function MenuMovil() {
  const t = useTranslations("edicion");
  const [abierto, setAbierto] = useState(false);
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);

  // Escape closes, and focus returns to the trigger. Without the second half a
  // keyboard user who closes the menu is left with focus on a hidden element
  // and no idea where they are in the page.
  useEffect(() => {
    if (!abierto) return;
    const alTeclado = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("keydown", alTeclado);
    return () => document.removeEventListener("keydown", alTeclado);
  }, [abierto]);

  return (
    <div className="edicion-movil" ref={ref}>
      <button
        type="button"
        className="edicion-movil__boton"
        aria-expanded={abierto}
        aria-controls={panelId}
        onClick={() => setAbierto((v) => !v)}
      >
        {/* The label is the accessible name; the bars are decoration. A bare
            icon button with no name is the single most common a11y failure in
            a mobile header. */}
        <span className="edicion-movil__etiqueta">{t("marca.indice")}</span>
        <span className="edicion-movil__barras" aria-hidden data-abierto={abierto || undefined}>
          <i />
          <i />
        </span>
      </button>

      <div
        id={panelId}
        className="edicion-movil__panel"
        data-abierto={abierto || undefined}
        // inert rather than display:none so the grid-rows transition can run;
        // inert also takes the links out of the tab order while collapsed,
        // which display:none would have done for free and visibility:hidden
        // would not. React 19 types this as a real boolean, not the legacy
        // empty-string attribute.
        inert={!abierto}
      >
        <div className="edicion-movil__interior">
          <ol>
            {CAPITULOS.map((c) => (
              <li key={c.anclaje}>
                <a href={`#${c.anclaje}`} onClick={() => setAbierto(false)}>
                  <span>{t(`capitulos.${c.anclaje}.titulo`)}</span>
                  <span aria-hidden>{c.numeral}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
