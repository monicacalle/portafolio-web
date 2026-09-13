"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { PERSON } from "@/lib/site";
import { CAPITULOS } from "@/lib/edicion/capitulos";
import { MenuMovil } from "./menu-movil";

/**
 * The fixed global header (brief sections 6–8).
 *
 * 50px on desktop, 60px on mobile, above everything, floating transparently over
 * the cinematic world and taking its foreground colour from
 * <html data-nav-theme> rather than from a fixed white bar.
 *
 * THE LOAD ANIMATION IS CSS, NOT JS. The brief's stagger (500/540/580/620/660ms,
 * ease-out cubic, each item dropping in from minus its own height) is a fixed
 * sequence with no state, so an effect would only add a frame of delay and a
 * flash of the finished position before it starts. Declaring it in CSS also
 * means it is gated by the `.motion` class the layout sets inline before paint —
 * so with reduced motion on, or with JS broken, the header is simply already
 * there, which is the correct fallback rather than a degraded one.
 */
export function Cabecera() {
  const t = useTranslations("edicion");

  return (
    <header className="edicion-cabecera" data-edicion-cabecera>
      <div className="edicion-cabecera__izq">
        <Link href="/" className="edicion-cabecera__marca" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="edicion-cabecera__nombre">{PERSON.name}</span>
          <span className="edicion-cabecera__edicion">{t("marca.etiqueta")}</span>
        </Link>
      </div>

      <nav className="edicion-cabecera__centro" aria-label={t("marca.indice")}>
        {/* A jump list, not a dropdown. The reference's Editions menu switches
            between separate published editions; there is only one of these, so
            a menu that opens to reveal one item would be theatre. These are the
            six chapters, which is the thing a reader actually wants to jump to. */}
        {CAPITULOS.map((c, i) => (
          <a
            key={c.anclaje}
            href={`#${c.anclaje}`}
            className="edicion-cabecera__salto"
            style={{ "--i": i + 1 } as React.CSSProperties}
          >
            {t(`capitulos.${c.anclaje}.titulo`)}
          </a>
        ))}
      </nav>

      <div className="edicion-cabecera__der">
        <span style={{ "--i": 7 } as React.CSSProperties}>
          <LanguageSwitcher />
        </span>
        <a
          href={`mailto:${PERSON.email}`}
          className="edicion-cabecera__cta"
          style={{ "--i": 8 } as React.CSSProperties}
        >
          {t("cta.escribir")}
        </a>
        <MenuMovil />
      </div>
    </header>
  );
}
