"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useProgreso } from "@/lib/edicion/use-progreso";
import { medidas } from "@/lib/edicion/medidas";

/**
 * The three-part sticky story — brief sections 47 and 48.
 *
 * Three sequential beats of ~165svh. Inside each, a viewport-height block is
 * sticky at top: 110px, so the browser keeps scrolling through the 165svh
 * parent while the story stays pinned.
 *
 * Section 48's rule is the important one: the SAME composition runs through all
 * three beats and is never reset. The camera reframes, the copy changes, and
 * "the viewer should feel they are circling one artifact through three ideas."
 * So the artifact here is one object — her thirty-page printed portfolio — held
 * still while three readings of it pass, rather than three pictures of three
 * things.
 *
 * It lives in chapter V rather than chapter IV because section 48 is about
 * circling a physical artifact, and a printed object is the only thing on this
 * page that genuinely is one. Section 104 names the feeling this structure
 * should produce: "I am inspecting a physical artifact in a gallery."
 */
const BEATS = ["objeto", "reticula", "tinta"] as const;

export function Triptico() {
  const t = useTranslations("edicion");

  return (
    <div className="edicion-triptico">
      {BEATS.map((clave, i) => (
        <Beat
          key={clave}
          indice={i}
          titulo={t(`capitulos.impreso.triptico.${clave}.titulo`)}
          cuerpo={t(`capitulos.impreso.triptico.${clave}.cuerpo`)}
        />
      ))}
    </div>
  );
}

function Beat({
  indice,
  titulo,
  cuerpo,
}: {
  indice: number;
  titulo: string;
  cuerpo: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useProgreso(ref, "--b");

  return (
    <section className="edicion-beat" ref={ref} data-beat={indice}>
      <div className="edicion-beat__fijo">
        <figure className="edicion-beat__objeto">
          {/* One artifact, three readings. The image is identical in all three
              beats on purpose -- section 48 forbids resetting the composition,
              and the reframing is done by the crop, which --b drives. */}
          <img
            src="/edicion/cap-impreso.avif"
            alt=""
            loading="lazy"
            decoding="async"
            {...medidas("/edicion/cap-impreso.avif")}
          />
        </figure>
        <div className="edicion-beat__texto">
          <h3>{titulo}</h3>
          <p>{cuerpo}</p>
        </div>
      </div>
    </section>
  );
}
