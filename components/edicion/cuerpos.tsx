"use client";

import { useTranslations } from "next-intl";
import { Ficha } from "./capitulo";

/**
 * Chapter I's editorial body — the five drawings, each with what she says
 * about it.
 *
 * Every line here is checkable against the file it describes. Nothing claims a
 * motive, a feeling or a date she has not given: where a drawing is unsigned it
 * says unsigned, where the date is ambiguous the date is quoted exactly as she
 * wrote it, and the word "unfinished" appears nowhere, because that is a verdict
 * on her own signed work that she has never passed.
 *
 * Ceguera Digital is last and deliberately spends no campaign facts: no bus
 * shelter, no slogan. It is the hinge that hands the argument to chapter III,
 * where that work actually lives.
 */
const PIEZAS = [
  { slug: "pelo-cobre", src: "/edicion/panel-3.avif", ancho: "medio" },
  { slug: "panuelo", src: "/edicion/panel-7.avif", ancho: "medio" },
  { slug: "modigliani", src: "/edicion/panel-6.avif", ancho: "tercio" },
  { slug: "nube", src: "/edicion/panel-9.avif", ancho: "tercio" },
  { slug: "ceguera", src: "/cine/a4-ceguera.avif", ancho: "tercio" },
] as const;

export function CuerpoIlustracion() {
  const t = useTranslations("edicion");

  return (
    <>
      <div className="edicion-declaracion">
        <p>{t("capitulos.ilustracion.declaracion")}</p>
      </div>

      {PIEZAS.map((p) => (
        <Ficha key={p.slug} ancho={p.ancho}>
          {/* These carry real alt text, unlike the decorative plates elsewhere:
              the drawing IS the content of this chapter, and the caption beside
              it describes the painting rather than naming the subject. */}
          <img
            src={p.src}
            alt={t(`capitulos.ilustracion.piezas.${p.slug}.titulo`)}
            loading="lazy"
            decoding="async"
          />
          <h3>{t(`capitulos.ilustracion.piezas.${p.slug}.titulo`)}</h3>
          <p>{t(`capitulos.ilustracion.piezas.${p.slug}.linea`)}</p>
          <p className="edicion-ficha__meta">
            {t(`capitulos.ilustracion.piezas.${p.slug}.meta`)}
          </p>
        </Ficha>
      ))}
    </>
  );
}
