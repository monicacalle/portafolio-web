"use client";

import { useTranslations } from "next-intl";
import { Ficha } from "./capitulo";
import { Plancha } from "./plancha";
import { VideoFeature } from "./video";

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

/**
 * Chapter IV's editorial body — the two apps, demonstrated by her own screens
 * rather than by a rebuilt mock. See plancha.tsx for why this is not Rive.
 */
export function CuerpoProducto() {
  const t = useTranslations("edicion");
  return (
    <>
      <div className="edicion-declaracion">
        <p>{t("capitulos.producto.planchasTitulo")}</p>
      </div>
      <Plancha
        src="/edicion/plancha-vibe.avif"
        ancho={428}
        alto={3012}
        titulo={t("capitulos.producto.planchas.vibe.titulo")}
        nota={t("capitulos.producto.planchas.vibe.nota")}
        href="/proyectos/vibe"
        verLabel={t("cta.ver")}
      />
      <Plancha
        src="/edicion/plancha-voluntee.avif"
        ancho={375}
        alto={1471}
        titulo={t("capitulos.producto.planchas.voluntee.titulo")}
        nota={t("capitulos.producto.planchas.voluntee.nota")}
        href="/proyectos/voluntee"
        verLabel={t("cta.ver")}
      />
    </>
  );
}

/**
 * Chapter III's editorial body. The film leads, because the chapter's claim is
 * about SCALE -- a drawing that ended up at bus-shelter size -- and scale is the
 * one thing a moving camera shows that a fixed crop cannot.
 */
export function CuerpoCampana() {
  const t = useTranslations("edicion");
  return (
    <>
      <div className="edicion-declaracion">
        <p>{t("capitulos.campana.declaracion")}</p>
      </div>
      <VideoFeature
        src="/edicion/campana-marquesina.mp4"
        webm="/edicion/campana-marquesina.webm"
        poster="/edicion/campana-marquesina-poster.avif"
        titulo={t("capitulos.campana.video.titulo")}
        nota={t("capitulos.campana.video.nota")}
        etiquetaVer={t("cta.verVideo")}
        etiquetaCerrar={t("cta.cerrar")}
      />
      <Ficha ancho="medio">
        <img src="/cine/a3-loreal.avif" alt="" loading="lazy" decoding="async" />
      </Ficha>
      <Ficha ancho="medio">
        <img src="/cine/a3-ingres.avif" alt="" loading="lazy" decoding="async" />
      </Ficha>
    </>
  );
}
