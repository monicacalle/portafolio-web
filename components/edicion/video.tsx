"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * VideoFeature and VideoModal — brief sections 25, 26 and 40.
 *
 * A large media block with a restrained centred play affordance, which opens a
 * full-screen overlay. Section 26's entrance is exact: the panel scales 0.97 → 1
 * and fades in.
 *
 * No library. This is a <video> element and a dialog; the brief's requirement
 * needed neither WebGL nor a paid runtime, and an earlier pass on this branch
 * wrongly let "no WebGL" mean "no motion beyond CSS", which does not follow.
 *
 * The inline video is muted, looped and autoplaying, which is the only
 * combination browsers will start without a gesture. The modal copy is NOT:
 * opening it is a deliberate act, so it gets sound-capable controls and starts
 * from the beginning.
 */
export function VideoFeature({
  src,
  webm,
  poster,
  titulo,
  nota,
  etiquetaVer,
  etiquetaCerrar,
}: {
  src: string;
  webm?: string;
  poster: string;
  titulo: string;
  nota: string;
  etiquetaVer: string;
  etiquetaCerrar: string;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="edicion-video animate-show-media">
      <div
        className="edicion-video__marco"
        // Consumed by the reduced-motion rule, which hides the <video> and
        // paints this instead. It was referenced in CSS and defined nowhere, so
        // a reduced-motion reader got a blank black box where the film is.
        style={{ "--poster": `url(${poster})` } as React.CSSProperties}
      >
        <video
          className="edicion-video__medio"
          poster={poster}
          // The four attributes that make an inline video start at all, and the
          // two that keep it from hijacking the page: no sound, no fullscreen
          // takeover on iOS.
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          <source src={src} type="video/mp4" />
        </video>

        <button
          type="button"
          className="edicion-video__play"
          onClick={() => setAbierto(true)}
        >
          <span className="edicion-video__play-icono" aria-hidden>
            ▶
          </span>
          {etiquetaVer}
        </button>
      </div>

      <div className="edicion-video__pie">
        <h3>{titulo}</h3>
        <p>{nota}</p>
      </div>

      {abierto ? (
        <VideoModal
          src={src}
          webm={webm}
          poster={poster}
          titulo={titulo}
          etiquetaCerrar={etiquetaCerrar}
          onCerrar={() => setAbierto(false)}
        />
      ) : null}
    </div>
  );
}

/**
 * The full-screen overlay (section 26).
 *
 * A real <dialog> rather than a div with role="dialog": the browser then owns
 * the top layer, the backdrop, Escape, and the focus trap, all of which are
 * easy to hand-roll incorrectly and tedious to hand-roll well.
 */
function VideoModal({
  src,
  webm,
  poster,
  titulo,
  etiquetaCerrar,
  onCerrar,
}: {
  src: string;
  webm?: string;
  poster: string;
  titulo: string;
  etiquetaCerrar: string;
  onCerrar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    d.showModal();
    // showModal() alone leaves the page behind it scrollable on some engines,
    // and a scrolling background under a full-screen video is disorienting.
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
      aria-label={titulo}
      onClose={alCerrar}
      // Clicking the backdrop closes it. The dialog element itself IS the
      // backdrop, so a click whose target is the dialog rather than its
      // contents is a backdrop click.
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="edicion-modal__panel">
        <video
          className="edicion-modal__medio"
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="auto"
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          <source src={src} type="video/mp4" />
        </video>
      </div>
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
