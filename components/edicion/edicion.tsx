"use client";

import { medidas } from "@/lib/edicion/medidas";
import { CAPITULOS, type Capitulo } from "@/lib/edicion/capitulos";
import { EstadoEdicion } from "./estado";
import { Lienzo } from "./lienzo";
import { Revelar } from "./revelar";
import { Cabecera } from "./cabecera";
import { Rail } from "./rail";
import { Hero } from "./hero";
import { Capitulo as Seccion } from "./capitulo";
import { Oficio } from "./oficio";
import {
  CuerpoIlustracion,
  CuerpoProducto,
  CuerpoCampana,
  CuerpoImpreso,
  CuerpoMarca,
} from "./cuerpos";

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
      <div className="edicion">
        <Lienzo />
        <Revelar />
        <Cabecera />
        <Rail />

        <main>
          <Hero />

          {CAPITULOS.map((c, i) => (
            <Seccion key={c.anclaje} capitulo={c} indice={i} escena={placaDe(c)}>
              <Cuerpo capitulo={c} />
            </Seccion>
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
 *
 * Returns undefined rather than a component when a chapter has no plate.
 * `escena={<Escena .../>}` was always truthy even when Escena returned null,
 * because a JSX element is an object. So chapter VI, which has no plate, still
 * rendered the scene wrapper and its ::after scrim painted a grey wash over the
 * cream ground — with the cream title on top of it at 1.00:1 before the
 * gradient. The truthiness has to be decided here, not inside the component.
 */
/*
  No chapter plate may be LETTERING. The chapter title is set at ~150px in white
  Bodoni across this image, and two of these were her own wordmarks: MARCA
  landed on the Viña Esmeralda lockup and PRODUCTO on a page of Vibe body copy.
  Type on type, both illegible, and it disrespected the work it sat on. Plates
  are objects and photographs; her lettering appears in the light editorial
  bodies below, at a size where it can be read.

  All cut by produccion/edicion.py. Two of these were previously raw PNGs from
  the old site served straight to the browser -- mockupraiz at 19.1 MB and
  portafolioabierto at 2.2 MB, against ~450 KB for the rest of the page
  combined. main rendered them through next/image; the Edition used a plain
  <img> and bypassed the optimiser.

  Which plate belongs to which chapter is in lib/edicion/capitulos.ts, per
  section 103.
*/
function placaDe(capitulo: Capitulo) {
  const src = capitulo.placa;
  if (!src) return undefined;
  const retrato = capitulo.placaRetrato;
  /*
    §91's `sizes`, and the default was wrong for this slot by 1.6x.
    `medidas()` defaults to "(max-width: 767px) 100vw, 50vw", which is the
    editorial column's shape, not the chapter intro's. The intro scene is the
    full width below 1024 and the content column above it — `calc(100% -
    var(--edicion-rail))`, measured at 79vw on 1440 and 1680, 75vw at 1024 and
    85vw at 2400. Promising 50vw made the browser pick a candidate for a slot
    two thirds the real size: at 1440 it served `cap-marca-w1024` into a 1137px
    box, a 1.11x upscale, and at 1680 into 1329px, 1.30x — with the 1680px
    original sitting unused. `sizes` that understates degrades the picture as
    surely as one that overstates wastes bytes.
  */
  const img = (
    <img
      src={src}
      alt=""
      decoding="async"
      loading="lazy"
      {...medidas(src, "(max-width: 1023px) 100vw, 80vw")}
    />
  );
  if (!retrato) return img;
  /*
    §81's two fallbacks, chosen by the browser rather than by JavaScript.

    `<picture>` with an orientation media query is the art-direction mechanism:
    it is the only way to serve a different CROP per orientation, which is what
    the section asks for and what `srcset` alone cannot do — srcset picks a size
    of the same image, not a different framing. It needs no script, so a phone
    with JS off gets the portrait plate too.
  */
  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={retrato} />
      {img}
    </picture>
  );
}

/** The light editorial body under each chapter intro. */
function Cuerpo({ capitulo }: { capitulo: Capitulo }) {
  switch (capitulo.anclaje) {
    case "oficio":
      return <Oficio />;
    case "ilustracion":
      return <CuerpoIlustracion />;
    case "producto":
      return <CuerpoProducto />;
    case "campana":
      return <CuerpoCampana />;
    case "impreso":
      return <CuerpoImpreso />;
    case "marca":
      return <CuerpoMarca />;
  }
}
