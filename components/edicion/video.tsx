"use client";

import { useEffect, useRef, useState } from "react";
import { MODAL_MS, Modal } from "./primitivas";

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
 * The dialog itself is `Modal` in primitivas.tsx — §102 asks for one shared
 * modal system and the brief hands it to four separate sections, so it has a
 * name of its own. What is left here is the only part that is about video.
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
  /*
    §26: "playback begins when transition ends." `autoPlay` starts it at mount,
    which is 320ms too early — the film's first third played while the panel
    was still scaling up behind a backdrop that had not finished fading.
  */
  const medio = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const t = window.setTimeout(() => {
      void medio.current?.play().catch(() => {});
    }, MODAL_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <Modal etiqueta={titulo} etiquetaCerrar={etiquetaCerrar} onCerrar={onCerrar}>
      <video
        ref={medio}
        className="edicion-modal__medio"
        poster={poster}
        controls
        playsInline
        preload="auto"
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={src} type="video/mp4" />
      </video>
    </Modal>
  );
}
