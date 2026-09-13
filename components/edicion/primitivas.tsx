"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";

/**
 * The Edition's shared primitives — brief section 102.
 *
 * §102 lists fifteen reusable primitives. Most of them already exist here under
 * this page's own names, and renaming working components to match a list would
 * be the kind of change that reads as architecture and is only relabelling:
 *
 *   CinematicScene    → Lienzo            (components/edicion/lienzo.tsx)
 *   ChapterIntro      → Capitulo's intro  (components/edicion/capitulo.tsx)
 *   EditorialSection  → Capitulo's body   (same file)
 *   FeatureCard       → Ficha             (same file)
 *   MediaFeature      → ParedDeObras      (components/edicion/cuerpos.tsx)
 *   RiveMedia         → Plancha           (components/edicion/plancha.tsx)
 *   VideoFeature      → VideoFeature      (components/edicion/video.tsx)
 *   CompactUpdateList → ListaCompacta     (components/edicion/lista-compacta.tsx)
 *   StickyNarrative   → Triptico          (components/edicion/triptico.tsx)
 *   SkillTag          → declined, see edicion-declinaciones.md (§33–36)
 *
 * What was genuinely DUPLICATED, and is here: the modal, the pill, and the
 * underlined action link. The pill existed three times in the stylesheet at
 * three slightly different sizes; the arrow that rides on it existed twice; the
 * dialog existed once but the brief asks four separate sections to share "the
 * same shared modal system", so it needed a name before a second one could use
 * it rather than after.
 *
 * SectionHeading and InlineLink are deliberately NOT here. Headings differ by
 * role (a chapter's h2, a section's h3, a card's h4) and are one element each;
 * the inline prose link is `t.rich`'s own element, so it cannot be a component
 * at the call site, and `.edicion-capitulo__cuerpo p a` styles it in one place
 * already. A primitive whose body is one styled tag is indirection, not reuse.
 */

/**
 * A real `<dialog>` rather than a div with role="dialog": the browser then owns
 * the top layer, the backdrop, Escape, and the focus trap, all of which are
 * easy to hand-roll incorrectly and tedious to hand-roll well.
 */
export function Modal({
  etiqueta,
  etiquetaCerrar,
  onCerrar,
  children,
}: {
  /** Accessible name for the dialog. */
  etiqueta: string;
  etiquetaCerrar: string;
  onCerrar: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    d.showModal();
    // showModal() alone leaves the page behind it scrollable on some engines,
    // and a scrolling background under a full-screen overlay is disorienting.
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

  // <dialog> fires `close` for Escape as well as for close(), so one handler
  // covers both routes out and the parent's state cannot drift from the DOM's.
  const alCerrar = useCallback(() => onCerrar(), [onCerrar]);

  return (
    <dialog
      ref={ref}
      className="edicion-modal"
      aria-label={etiqueta}
      onClose={alCerrar}
      // Clicking the backdrop closes it. The dialog element itself IS the
      // backdrop, so a click whose target is the dialog rather than its
      // contents is a backdrop click.
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="edicion-modal__panel">{children}</div>
      <button
        type="button"
        className="edicion-modal__cerrar"
        onClick={() => ref.current?.close()}
      >
        {etiquetaCerrar}
      </button>
    </dialog>
  );
}

/**
 * Where a link goes decides what renders it.
 *
 * An in-site path has to go through the locale-aware `Link`, because the plain
 * one drops the segment and an English visitor lands back in Spanish. A mailto,
 * an external URL or a file under /assets is a plain anchor.
 */
function esInterno(href: string) {
  return href.startsWith("/") && !href.startsWith("/assets/");
}

/** §102's CTA: the pill. One size on the whole page, which it was not. */
export function CTA({
  href,
  flecha = false,
  children,
}: {
  href: string;
  /** The ↗, for a link that leaves the page it is on. */
  flecha?: boolean;
  children: ReactNode;
}) {
  const contenido = (
    <>
      {children}
      {flecha ? <span aria-hidden> ↗</span> : null}
    </>
  );
  if (esInterno(href)) {
    return (
      <Link className="edicion-cta" href={href}>
        {contenido}
      </Link>
    );
  }
  const externo = href.startsWith("http");
  return (
    <a
      className="edicion-cta"
      href={href}
      {...(externo ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {contenido}
    </a>
  );
}

/** §102's InlineLink at its loudest: an underlined action, not a pill. */
export function Enlace({
  href,
  flecha = true,
  children,
}: {
  href: string;
  flecha?: boolean;
  children: ReactNode;
}) {
  const contenido = (
    <>
      {children}
      {flecha ? <span aria-hidden> ↗</span> : null}
    </>
  );
  if (esInterno(href)) {
    return (
      <Link className="edicion-enlace" href={href}>
        {contenido}
      </Link>
    );
  }
  const externo = href.startsWith("http");
  return (
    <a
      className="edicion-enlace"
      href={href}
      {...(externo ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {contenido}
    </a>
  );
}
