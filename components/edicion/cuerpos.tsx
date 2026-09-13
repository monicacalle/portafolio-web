"use client";

import { useTranslations } from "next-intl";
import { medidas } from "@/lib/edicion/medidas";
import { Ficha } from "./capitulo";
import { Plancha } from "./plancha";
import { VideoFeature } from "./video";
import { Triptico } from "./triptico";
import { Constelacion } from "./constelacion";
import { ListaCompacta } from "./lista-compacta";

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
export function CuerpoIlustracion() {
  const t = useTranslations("edicion");

  return (
    <>
      <div className="edicion-declaracion animate-show-media">
        {/* Section 73: an understated inline link in running prose, not a pill.
            The sentence already points forward to the campaign chapter, so the
            link is a real cross-reference rather than an affordance invented to
            satisfy the section. */}
        <p>
          {t.rich("capitulos.ilustracion.declaracion", {
            enlace: (chunks) => <a href="#campana">{chunks}</a>,
          })}
        </p>
      </div>

      {/*
        Section 29's constellation, not a grid. The section specifies five
        cards in a loose cloud and she has exactly five drawings, so the
        structure and the content want the same number without either being
        bent to fit the other. Each card's title and dimensions ride with it.
      */}
      <Constelacion />
    </>
  );
}

export function CuerpoProducto() {
  const t = useTranslations("edicion");
  return (
    <>
      <div className="edicion-declaracion animate-show-media">
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
      <ListaCompacta
        id="metodo-producto"
        titulo={t("capitulos.producto.metodo.titulo")}
        filas={(["desk", "netnografia", "benchmarking", "dafo", "encuesta", "entrevistas", "personas", "journeys"] as const).map(
          (k) => ({
            q: t(`capitulos.producto.metodo.filas.${k}.q`),
            a: t(`capitulos.producto.metodo.filas.${k}.a`),
          }),
        )}
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
      <div className="edicion-declaracion animate-show-media">
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
        <img src="/cine/a3-loreal.avif" alt="" loading="lazy" decoding="async" {...medidas("/cine/a3-loreal.avif")} />
      </Ficha>
      <Ficha ancho="medio">
        <img src="/cine/a3-ingres.avif" alt="" loading="lazy" decoding="async" {...medidas("/cine/a3-ingres.avif")} />
      </Ficha>
    </>
  );
}

/**
 * Chapter V's editorial body: her statement, then the three-part sticky story
 * of sections 47 and 48 circling the printed portfolio.
 */
export function CuerpoImpreso() {
  const t = useTranslations("edicion");
  return (
    <>
      <div className="edicion-declaracion animate-show-media">
        <p>{t("capitulos.impreso.declaracion")}</p>
      </div>
      <Triptico />
      <ListaCompacta
        id="metodo-impreso"
        titulo={t("capitulos.impreso.metodo.titulo")}
        filas={(["sangre", "perfil", "tinta", "tipo", "prueba"] as const).map((k) => ({
          q: t(`capitulos.impreso.metodo.filas.${k}.q`),
          a: t(`capitulos.impreso.metodo.filas.${k}.a`),
        }))}
      />
      <Ficha ancho="medio">
        <img src="/trabajo/t-libro.avif" alt="" loading="lazy" decoding="async" {...medidas("/trabajo/t-libro.avif")} />
      </Ficha>
      <Ficha ancho="medio">
        <img src="/trabajo/t-lobo.avif" alt="" loading="lazy" decoding="async" {...medidas("/trabajo/t-lobo.avif")} />
      </Ficha>
    </>
  );
}
