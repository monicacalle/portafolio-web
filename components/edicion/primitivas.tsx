"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { Link } from "@/lib/i18n/navigation";

/**
 * The Edition's shared primitives — brief section 102.
 *
 * §102 lists FOURTEEN reusable primitives — this said fifteen, and the list is
 * countable: ChapterIntro, CinematicScene, EditorialSection, FeatureCard,
 * MediaFeature, RiveMedia, VideoFeature, CompactUpdateList, StickyNarrative,
 * SectionHeading, CTA, InlineLink, SkillTag, Modal.
 *
 * Nine of them already exist here under this page's own names, and renaming
 * working components to match a list would be the kind of change that reads as
 * architecture and is only relabelling:
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
 * That is twelve of fourteen. SectionHeading is the one genuinely not built:
 * headings differ by role (a chapter's h2, a section's h3, a card's h4) and are
 * one element each, and a primitive whose body is one styled tag is
 * indirection, not reuse.
 *
 * This paragraph used to put InlineLink beside it as "deliberately NOT here",
 * contradicting `Enlace` forty lines below, which its own docstring calls
 * "§102's InlineLink at its loudest". The true statement is narrower: the
 * UNDERSTATED inline link inside running prose is `t.rich`'s own element and
 * cannot be a component at the call site, so `.edicion-capitulo__cuerpo p a`
 * styles that one in a single place while `Enlace` is the primitive for the
 * loud case.
 */

/**
 * A real `<dialog>` rather than a div with role="dialog": the browser then owns
 * the top layer, the backdrop, Escape, and the focus trap, all of which are
 * easy to hand-roll incorrectly and tedious to hand-roll well.
 */
/** §26's entrance and exit both run for this long. The section gives 250–350ms
 *  for the backdrop and says the close is the reverse. */
export const MODAL_MS = 320;

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
  /* §26: "close: reverse". A React unmount is instantaneous, so the exit needs
     a state of its own — the dialog stays OPEN and in the top layer for one
     more transition while the panel scales back down and the backdrop fades. */
  const [cerrando, setCerrando] = useState(false);
  const salida = useRef<number | null>(null);
  /* Undefined outside the provider, which is the reduced-motion branch — there
     Lenis is not mounted and the browser owns the scroll, so there is nothing
     to stop. */
  const lenis = useLenis();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    d.showModal();
    /*
      §26: "lock background scrolling while open". TWO LOCKS, because on this
      page the first one does nothing.

      `document.body.style.overflow = "hidden"` is the standard remedy and it
      only works against the browser's own scroller. Lenis runs in root mode
      here: its wheel listener is on `window`, it calls `preventDefault()` and
      then `window.scrollTo({ behavior: "instant" })`, which an overflow rule
      does not block. Measured at 1440x900 with the dialog open and the body at
      `overflow-y: hidden`: a wheel of deltaY 600 dispatched on the dialog came
      back `defaultPrevented: true` and the page went from 8,842 to 9,442 —
      600px of background scroll under an open modal, on the default path for
      every reader who has not asked for reduced motion. It affected both
      modals, the film's and the five drawings'.

      `lenis.stop()` is the lock that matters; the overflow line stays for the
      reduced-motion branch, where Lenis is not mounted at all.
    */
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = previo;
      lenis?.start();
      if (salida.current !== null) window.clearTimeout(salida.current);
    };
  }, [lenis]);

  /*
    EVERY ROUTE OUT GOES THROUGH HERE, and the dialog is not closed until the
    exit has played.

    The first version listened for the dialog's own `close` event and set the
    exit state from it, which never worked: `close` fires AFTER the browser has
    removed the `open` attribute and taken the element out of the top layer, so
    `.edicion-modal[open][data-cerrando]` could not match and `::backdrop` had
    no box to paint into. Worse, `.edicion-modal { display: grid }` outranks the
    user-agent's `dialog:not([open]) { display: none }`, so what actually
    happened was a full-viewport non-modal dialog left painted, with the video
    still playing inside it, for the whole 320ms hold.
  */
  const cerrar = useCallback(() => {
    if (salida.current !== null) return;
    setCerrando(true);
    salida.current = window.setTimeout(() => {
      ref.current?.close();
      onCerrar();
    }, MODAL_MS);
  }, [onCerrar]);

  return (
    <dialog
      ref={ref}
      className="edicion-modal"
      {...(cerrando ? { "data-cerrando": "" } : {})}
      aria-label={etiqueta}
      // Escape asks to close; the browser's default would close it instantly,
      // so the request is taken over and answered with the exit above.
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
      // Clicking the backdrop closes it. The dialog element itself IS the
      // backdrop, so a click whose target is the dialog rather than its
      // contents is a backdrop click.
      onClick={(e) => {
        if (e.target === ref.current) cerrar();
      }}
    >
      <div className="edicion-modal__panel">{children}</div>
      <button type="button" className="edicion-modal__cerrar" onClick={cerrar}>
        {etiquetaCerrar}
      </button>
    </dialog>
  );
}

/**
 * §72's push out / pop in, which needs two glyphs to be either of those.
 *
 * The first leaves the 1em container diagonally and fades; the second arrives
 * from the opposite corner. Both are inside one aria-hidden wrapper, so a
 * screen reader hears the link's words and not two arrows.
 */
function Flecha() {
  return (
    <span className="edicion-flecha" aria-hidden>
      <span>↗</span>
      <span>↗</span>
    </span>
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
      {flecha ? <Flecha /> : null}
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
      {flecha ? <Flecha /> : null}
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
