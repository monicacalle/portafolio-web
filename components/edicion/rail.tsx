"use client";

import { useTranslations } from "next-intl";
import { CAPITULOS } from "@/lib/edicion/capitulos";
import { useEdicion } from "./estado";

/**
 * The desktop story rail — the left 20% of the composition.
 *
 * Art direction, not a dashboard sidebar (brief section 18). It keeps its own
 * dark panel even when the main column turns light editorial, which is what the
 * live reference does and what stops the page reading as a document with a nav
 * bolted to it.
 *
 * The dotted leader between a chapter name and its Roman numeral is a table-of-
 * contents device lifted straight off a printed book, and it is the one piece of
 * the rail that moves: only the active chapter draws its leader.
 */
export function Rail() {
  const t = useTranslations("edicion");
  const { activo } = useEdicion();

  return (
    <div
      className="edicion-rail"
      // The rail is decoration plus navigation. The nav inside carries the
      // landmark; the wrapper must not, or screen readers announce two.
      aria-hidden={false}
    >
      {/* Section 17 step 4: the Renaissance proportion frame that becomes the
          sidebar boundary. 340:464 is the section's own ratio. */}
      <div className="edicion-rail__frame" aria-hidden />

      <div className="edicion-rail__marca">
        {/* The wordmark is three lines at a small size, like the reference's
            "The Ren(ai)ssance Edition". Split in the message so the accent can
            fall on a different word in each language. */}
        <span className="edicion-rail__marca-1">{t("marca.linea1")}</span>
        <span className="edicion-rail__marca-2">{t("marca.linea2")}</span>
        <span className="edicion-rail__marca-3">{t("marca.linea3")}</span>
      </div>

      <nav id="edicion-indice" className="edicion-rail__indice" aria-label={t("marca.indiceRail")}>
        <ol>
          {CAPITULOS.map((c) => {
            const activa = activo === c.anclaje;
            return (
              <li key={c.anclaje} data-activo={activa || undefined}>
                <a href={`#${c.anclaje}`} aria-current={activa ? "true" : undefined}>
                  <span className="edicion-rail__titulo">
                    {t(`capitulos.${c.anclaje}.titulo`)}
                  </span>
                  {/* aria-hidden: the numeral is a visual index, and read aloud
                      after every chapter name it is noise. The order is already
                      carried by the <ol>. */}
                  <span className="edicion-rail__guia" aria-hidden />
                  <span className="edicion-rail__numeral" aria-hidden>
                    {c.numeral}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="edicion-rail__pie">
        <span>{t("pie.derechos")}</span>
      </div>
    </div>
  );
}
