"use client";

import { useTranslations } from "next-intl";
import { CAPITULOS } from "@/lib/edicion/capitulos";
import { EstadoEdicion } from "./estado";
import { Espina } from "./espina";
import { Cabecera } from "./cabecera";
import { Rail } from "./rail";
import { Hero } from "./hero";
import { Capitulo, Ficha } from "./capitulo";
import { Oficio } from "./oficio";
import { CuerpoIlustracion, CuerpoProducto } from "./cuerpos";

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
  /*
    No chapter plate may be LETTERING. The chapter title is set at ~150px in
    white Bodoni across this image, and two of these were her own wordmarks:
    MARCA landed on top of the Viña Esmeralda lockup and PRODUCTO on a page of
    Vibe body copy. Type on type, both illegible, and it disrespected the work
    it was sitting on. Plates are objects and photographs now; her lettering
    appears in the light editorial bodies below, at a size where it can be read.
  */
  const PLACAS: Record<string, string> = {
    ilustracion: "/cine/pelo-cobre.avif",
    marca: "/images/mockupraiz.png",
    campana: "/cine/a3-loreal.avif",
    producto: "/images/iphone.webp",
    impreso: "/images/portafolioabierto.png",
  };
  const src = PLACAS[anclaje];
  if (!src) return null;
  return <img src={src} alt="" decoding="async" loading="lazy" />;
}

/** The light editorial body under each chapter intro. */
function Cuerpo({ anclaje }: { anclaje: string }) {
  if (anclaje === "oficio") return <Oficio />;
  if (anclaje === "ilustracion") return <CuerpoIlustracion />;
  if (anclaje === "producto") return <CuerpoProducto />;
  return <CuerpoPlacas anclaje={anclaje} />;
}

/**
 * The three chapters whose body is her statement followed by a plate wall.
 * Kept apart from Cuerpo so the hook below is not called conditionally, which
 * the rules of hooks forbid and which the earlier shape would have done as soon
 * as a translator was needed here.
 */
function CuerpoPlacas({ anclaje }: { anclaje: string }) {
  const t = useTranslations("edicion");
  const DECLARACION: Record<string, string> = {
    marca: t("capitulos.marca.declaracion"),
    campana: t("capitulos.campana.declaracion"),
    impreso: t("capitulos.impreso.declaracion"),
  };

  const OBRAS: Record<string, { src: string; ancho: "completo" | "medio" | "tercio" | "dos-tercios" }[]> = {
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
    impreso: [
      { src: "/trabajo/t-libro.avif", ancho: "medio" },
      { src: "/trabajo/t-lobo.avif", ancho: "medio" },
      { src: "/images/portafolioabierto.png", ancho: "completo" },
    ],
  };

  const obras = OBRAS[anclaje] ?? [];
  const declaracion = DECLARACION[anclaje];
  return (
    <>
      {declaracion ? (
        <div className="edicion-declaracion">
          <p>{declaracion}</p>
        </div>
      ) : null}
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
