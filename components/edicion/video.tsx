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
  const marco = useRef<HTMLDivElement>(null);

  /*
    Section 90 asks for media to load when it is within a viewport or two, not
    at first paint. The film and its poster were being requested at 71ms on a
    390px phone for a feature sixteen screens down. Pausing it off-screen also
    stops a decode loop running behind an opaque cream body.
  */
  useEffect(() => {
    const el = marco.current?.querySelector("video");
    if (!el) return;
    let armado = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          el.pause();
          return;
        }
        if (!armado) {
          armado = true;
          // Attached on first approach, not at parse time.
          const p = el.dataset.poster;
          if (p) el.poster = p;
          const add = (src?: string, type?: string) => {
            if (!src) return;
            const s = document.createElement("source");
            s.src = src;
            if (type) s.type = type;
            el.appendChild(s);
          };
          add(el.dataset.webm, "video/webm");
          add(el.dataset.mp4, "video/mp4");
          el.load();
        }
        void el.play().catch(() => {});
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(marco.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div className="edicion-video animate-show-media">
      <div
        ref={marco}
        className="edicion-video__marco"
        // Section 25 centres a play affordance ON the media block, so the whole
        // frame is the target rather than the 130px pill inside it.
        role="button"
        tabIndex={0}
        aria-label={etiquetaVer}
        onClick={() => setAbierto(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setAbierto(true);
          }
        }}
        // Consumed by the reduced-motion rule, which hides the <video> and
        // paints this instead. It was referenced in CSS and defined nowhere, so
        // a reduced-motion reader got a blank black box where the film is.
        style={{ "--poster": `url(${poster})` } as React.CSSProperties}
      >
        <video
          className="edicion-video__medio"
          /*
            NO autoPlay, and no poster or sources in the markup.

            autoPlay overrides preload="none" -- the browser must fetch to
            autoplay -- so the 540kB film and its poster were both requested at
            71ms on a 390px phone, for a feature sixteen screens down. The
            observer below attaches the sources and starts playback when the
            frame is within a viewport, which is what section 90 asks for.

            muted + playsInline stay: they are what let it start without a
            gesture and stop iOS taking it fullscreen.
          */
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          data-poster={poster}
          data-mp4={src}
          {...(webm ? { "data-webm": webm } : {})}
        />

        {/* Decorative now: the frame above carries the role and the label, so
            a second focusable control announcing the same action would make a
            keyboard user Tab through it twice. */}
        <span className="edicion-video__play" aria-hidden>
          <span className="edicion-video__play-icono" aria-hidden>
            ▶
          </span>
          {etiquetaVer}
        </span>
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
