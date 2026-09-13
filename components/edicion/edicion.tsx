"use client";

import { CAPITULOS } from "@/lib/edicion/capitulos";
import { EstadoEdicion } from "./estado";
import { Espina } from "./espina";
import { Cabecera } from "./cabecera";
import { Rail } from "./rail";
import { Hero } from "./hero";
import { Capitulo, Ficha } from "./capitulo";
import { Oficio } from "./oficio";

/**
 * The Edition — the whole homepage.
 *
 * One continuous journey rather than a stack of independent rectangles (brief
 * section 1.1): a persistent rail and header over six chapters that each cut
 * from a dark cinematic intro into a light editorial body.
 *
 * Order is read from lib/edicion/capitulos.ts, never written out here, so the
 * rail, the hero's index, the header's jump list and the page itself cannot
 * disagree about how many chapters there are or what they are called.
 */
export function Edicion() {
  return (
    <EstadoEdicion>
      <Espina />
      <div className="edicion">
        <Cabecera />
        <Rail />

        <main>
          <Hero />

          {CAPITULOS.map((c, i) => (
            <Capitulo
              key={c.anclaje}
              capitulo={c}
              indice={i}
              escena={<Escena anclaje={c.anclaje} />}
            >
              <Cuerpo anclaje={c.anclaje} />
            </Capitulo>
          ))}
        </main>
      </div>
    </EstadoEdicion>
  );
}

/**
 * The cinematic world behind a chapter intro.
 *
 * Static plates today. The persistent WebGL canvas replaces these per chapter
 * later, but it replaces them by drawing OVER this layer rather than instead of
 * it — brief sections 81 and 82 want the fallback to be the thing that is
 * already there, not a thing that appears when something fails. Building it
 * first is also what makes the mobile path (section 86) free.
 */
function Escena({ anclaje }: { anclaje: string }) {
  const PLACAS: Record<string, string> = {
    ilustracion: "/edicion/hero-retablo.avif",
    marca: "/cine/a2-esmeralda.avif",
    campana: "/cine/a3-loreal.avif",
    producto: "/cine/a2-vibe.avif",
    impreso: "/cine/a3-lobo.avif",
  };
  const src = PLACAS[anclaje];
  if (!src) return null;
  return <img src={src} alt="" decoding="async" loading="lazy" />;
}

/** The light editorial body under each chapter intro. */
function Cuerpo({ anclaje }: { anclaje: string }) {
  if (anclaje === "oficio") return <Oficio />;

  const OBRAS: Record<string, { src: string; ancho: "completo" | "medio" | "tercio" | "dos-tercios" }[]> = {
    ilustracion: [
      { src: "/edicion/panel-3.avif", ancho: "dos-tercios" },
      { src: "/edicion/panel-7.avif", ancho: "tercio" },
      { src: "/edicion/panel-6.avif", ancho: "tercio" },
      { src: "/edicion/panel-9.avif", ancho: "tercio" },
      { src: "/cine/a4-ceguera.avif", ancho: "tercio" },
    ],
    marca: [
      { src: "/trabajo/t-esmeralda.avif", ancho: "medio" },
      { src: "/images/mockupraiz.png", ancho: "medio" },
      { src: "/trabajo/t-isabella.avif", ancho: "tercio" },
      { src: "/images/portafolioabierto.png", ancho: "dos-tercios" },
    ],
    campana: [
      { src: "/cine/a3-loreal.avif", ancho: "dos-tercios" },
      { src: "/cine/a3-ingres.avif", ancho: "tercio" },
      { src: "/trabajo/t-nespresso.avif", ancho: "medio" },
      { src: "/trabajo/t-ilustracion.avif", ancho: "medio" },
    ],
    producto: [
      { src: "/trabajo/t-vibe.avif", ancho: "medio" },
      { src: "/trabajo/t-voluntee.avif", ancho: "medio" },
      { src: "/images/iphone.webp", ancho: "tercio" },
      { src: "/images/vibe.png", ancho: "tercio" },
      { src: "/images/voluntee.png", ancho: "tercio" },
    ],
    impreso: [
      { src: "/trabajo/t-libro.avif", ancho: "medio" },
      { src: "/trabajo/t-lobo.avif", ancho: "medio" },
      { src: "/images/portafolioabierto.png", ancho: "completo" },
    ],
  };

  const obras = OBRAS[anclaje] ?? [];
  return (
    <>
      {obras.map((o, i) => (
        <Ficha key={o.src + i} ancho={o.ancho}>
          {/* alt is empty on purpose: every plate here is decorative repetition
              of work the surrounding copy already names, and a screen-reader
              user hearing "t-esmeralda dot avif" twelve times is worse served
              than one who hears the chapter's prose once. Plates that carry
              information a sighted reader gets ONLY from the image are given
              real alt text where they appear. */}
          <img src={o.src} alt="" loading="lazy" decoding="async" />
        </Ficha>
      ))}
    </>
  );
}
