"use client";

import { useTranslations } from "next-intl";
import { medidas } from "@/lib/edicion/medidas";
import { POR_ANCLAJE } from "@/lib/edicion/capitulos";
import { Ficha } from "./capitulo";
import { Plancha } from "./plancha";
import { VideoFeature } from "./video";
import { BeatOscuro } from "./beat-oscuro";
import { Triptico } from "./triptico";
import { Constelacion } from "./constelacion";
import { ListaCompacta } from "./lista-compacta";
import { Secuencia } from "./secuencia";

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

      {/*
        §37: after the heavy block, the compact register — "compact textual
        updates follow without requiring elaborate animations". Chapter I ended
        on the constellation and had none of it.

        The rows are the five `linea` texts, which were written for these
        drawings, went through ghost, and rendered NOWHERE: the constellation
        card is 22% of the column wide and carries a title and the file's
        dimensions, because a forty-word paragraph inside it would break §29's
        cloud. This is where they fit.
      */}
      <ListaCompacta
        id="piezas-ilustracion"
        titulo={t("capitulos.ilustracion.piezasTitulo")}
        filas={(["pelo-cobre", "panuelo", "modigliani", "nube", "ceguera"] as const).map((k) => ({
          q: t(`capitulos.ilustracion.piezas.${k}.titulo`),
          a: t(`capitulos.ilustracion.piezas.${k}.linea`),
        }))}
      />
    </>
  );
}

/**
 * Chapter IV's editorial body, in the brief's own order: section 42's
 * state-to-state sequence first, then section 43's demonstration.
 *
 * They are two different things and the sequence exists because reading 43 as
 * covering both was wrong. The sequence swaps STATES behind a frame that never
 * moves; the planchas PAN one long delivered screen through the same frame.
 * The handover is deliberate too — the sequence ends on the Agenda, and the
 * first plancha is that screen at full length, where it can be read.
 */
/**
 * The editorial plate wall — brief section 103's `mediaCards`, with its
 * `layout` field.
 *
 * What each chapter shows, and at what width, is in `lib/edicion/capitulos.ts`
 * and nowhere else. It used to be a `Record<string, ...>` inside edicion.tsx
 * beside two more maps keyed the same way, one of which held entries for
 * chapters whose bodies never reached that renderer — dead configuration that
 * read as live configuration — while the chapter record carried an `obras`
 * field of slugs that nothing rendered at all.
 *
 * The uneven widths are section 44's point: a row mixes a full-bleed card with
 * a half and two thirds, and that unevenness is what stops the light sections
 * reading as a CMS listing.
 */
export function ParedDeObras({
  obras,
  etiqueta,
}: {
  obras: readonly ObraConTexto[];
  /** Accessible name for the rail below 1024px. See `data-carril`. */
  etiqueta: string;
}) {
  return (
    /*
      §31's carousel is THIS element, not the chapter body.

      `[data-carril]` is `display: contents` at 1024px and up, so the cards go
      straight into the body's six-track grid and §44's uneven row is untouched
      — the wrapper costs nothing there. Below it, the wrapper becomes the snap
      scroller, which is what §31 actually asks for: it replaces "the desktop
      card constellation", not the chapter.

      tabIndex and the name are here rather than on the body for the same
      reason: this is the element that scrolls, and a plate wall contains no
      focusable children, so without a tab stop on the scroller itself the work
      inside it is unreachable without a pointer.
    */
    <div className="edicion-carril" data-carril tabIndex={0} role="group" aria-label={etiqueta}>
      {obras.map((o, i) => (
        <Ficha key={o.src + i} ancho={o.ancho}>
          {/* alt is empty on purpose: the figcaption below carries the name and
              the line, so a screen reader hears each piece once rather than
              twice. Plates whose meaning a sighted reader gets ONLY from the
              image are given real alt text where they appear. */}
          <img src={o.src} alt="" loading="lazy" decoding="async" {...medidas(o.src)} />
          <h3>{o.titulo}</h3>
          <p>{o.nota}</p>
        </Ficha>
      ))}
    </div>
  );
}

interface ObraConTexto {
  src: string;
  ancho: "completo" | "medio" | "tercio" | "dos-tercios";
  titulo: string;
  nota: string;
}



/**
 * Chapter II's editorial body: her statement, the branding method, and the
 * plate wall.
 *
 * It is the one chapter with no bespoke composition of its own, which is why
 * the generic renderer this replaced existed. That renderer served exactly one
 * chapter while carrying maps keyed for three.
 */
export function CuerpoMarca() {
  const t = useTranslations("edicion");
  return (
    <>
      <div className="edicion-declaracion animate-show-media">
        <p>{t("capitulos.marca.declaracion")}</p>
      </div>
      {/*
        MEDIA FIRST, THEN THE COMPACT REGISTER, and this chapter had it the
        other way round.

        §44: "Prominent media features first... Then transition into more
        compact textual updates." §37 says the same thing in its own words —
        the compact register follows the heavy block. Chapters I, IV and V all
        do it; chapter II opened on a five-row table and put the three marks
        after it, which is the one chapter where the reader met the method
        before anything it was a method for.
      */}
      <ParedDeObras
        etiqueta={t("capitulos.marca.titulo")}
        obras={POR_ANCLAJE.marca.obras.map((o) => ({
          ...o,
          titulo: t(`capitulos.marca.obras.${o.clave}.titulo`),
          nota: t(`capitulos.marca.obras.${o.clave}.nota`),
        }))}
      />
      <ListaCompacta
        id="metodo-marca"
        titulo={t("capitulos.marca.metodo.titulo")}
        filas={(["logotipo", "color", "tipografia", "aplicacion", "manual"] as const).map((k) => ({
          q: t(`capitulos.marca.metodo.filas.${k}.q`),
          a: t(`capitulos.marca.metodo.filas.${k}.a`),
        }))}
      />
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
      <Secuencia />
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
      <ParedDeObras
        etiqueta={t("capitulos.campana.titulo")}
        obras={POR_ANCLAJE.campana.obras.map((o) => ({
          ...o,
          titulo: t(`capitulos.campana.obras.${o.clave}.titulo`),
          nota: t(`capitulos.campana.obras.${o.clave}.nota`),
        }))}
      />

      {/* Sections 40 and 45: the film continues the chapter's dark atmosphere
          rather than sitting in the light body, and it arrives near the end as
          a second cinematic beat. */}
      <BeatOscuro capitulo="campana">
      <VideoFeature
        src="/edicion/campana-marquesina.mp4"
        webm="/edicion/campana-marquesina.webm"
        poster="/edicion/campana-marquesina-poster.avif"
        titulo={t("capitulos.campana.video.titulo")}
        nota={t("capitulos.campana.video.nota")}
        etiquetaVer={t("cta.verVideo")}
        etiquetaCerrar={t("cta.cerrar")}
      />
      </BeatOscuro>
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
      {/* §50: "after the sticky sequence ends… show media cards". The compact
          list that used to sit here is §49's now, inside the third reading,
          where the object it describes is still on screen. */}
      <ParedDeObras
        etiqueta={t("capitulos.impreso.titulo")}
        obras={POR_ANCLAJE.impreso.obras.map((o) => ({
          ...o,
          titulo: t(`capitulos.impreso.obras.${o.clave}.titulo`),
          nota: t(`capitulos.impreso.obras.${o.clave}.nota`),
        }))}
      />
    </>
  );
}
