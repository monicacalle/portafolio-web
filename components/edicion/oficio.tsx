"use client";

import { useLocale, useTranslations } from "next-intl";
import { PERSON } from "@/lib/site";
import { GRAFICO_ROUTE } from "@/lib/case-studies";
import { Link } from "@/lib/i18n/navigation";
import { medidas } from "@/lib/edicion/medidas";

interface Entrada {
  when: string;
  title: string;
  place: string;
  body: string;
}

interface Habilidad {
  kicker: string;
  title: string;
  body: string;
  tags: string[];
}

/**
 * Chapter VI — OFICIO. The practical close: who she is, what she can hand you,
 * where she has worked, what she uses, and how to write to her.
 *
 * This chapter writes ALMOST no new copy. The story, the lists and the contact
 * block come from the `about`, `curriculum`, `skills` and `contact` namespaces,
 * which are already bilingual, already through ghost, and already say these
 * things in her own first person. Drafting a second version would mean two
 * descriptions of the same career drifting apart in two languages, and the new
 * one would be the unreviewed one. Four strings are new — the story's heading,
 * the documents' heading, and the CV card's line and page count — and they went
 * through ghost like everything else.
 *
 * `about` is worth calling out: it was the old homepage's About section, which
 * this page replaced, so that copy has been on disk and off the site ever
 * since. It is her statement about her own work and it belongs here.
 *
 * SECTION 67 is what the top of this now answers. It asks the closing chapter
 * to open with "a full-width major story" that "should feel like the chapter
 * hero after the chapter intro", then "two major media cards". The chapter was
 * three lists and a mailto: no image of the person the other five chapters are
 * about, and no sight of either document a reader can actually take away.
 *
 * It is also the only chapter that never goes dark. After five cinematic
 * chapters the page has to land somewhere plain, or the contact details read as
 * part of the performance.
 */
export function Oficio() {
  const t = useTranslations("edicion");
  const a = useTranslations("about");
  const c = useTranslations("curriculum");
  const s = useTranslations("skills");
  const k = useTranslations("contact");
  const g = useTranslations("grafico");
  const locale = useLocale();

  const trabajo = c.raw("work") as Entrada[];
  const formacion = c.raw("education") as Entrada[];
  const habilidades = s.raw("items") as Habilidad[];

  return (
    <>
      {/* §67's full-width major story. The portrait is NOT the one on the
          graphic portfolio's cover, which is the card below it — both are hers
          and both are inside that document, so using the cover's own portrait
          here would have put the same photograph on screen twice. */}
      <section className="edicion-historia animate-show-media">
        <figure className="edicion-historia__retrato">
          <img
            src="/edicion/oficio-retrato.avif"
            alt={a("imageAlt")}
            loading="lazy"
            decoding="async"
            {...medidas("/edicion/oficio-retrato.avif", "(max-width: 899px) 78vw, 32vw")}
          />
        </figure>
        <div className="edicion-historia__texto">
          <h3>{t("capitulos.oficio.historiaTitulo")}</h3>
          <p>{a("p1")}</p>
          <p>{a("p2")}</p>
        </div>
      </section>

      {/* §67's two major media cards. They are the only two things on this site
          a reader can take away whole, and until now the graphic portfolio was
          a text link and the CV was a link whose label said "the full CV" and
          opened the graphic portfolio instead. */}
      <section className="edicion-documentos">
        <h3 className="edicion-documentos__titulo animate-show-media">
          {t("capitulos.oficio.documentosTitulo")}
        </h3>

        <article className="edicion-documento animate-show-media">
          <Link className="edicion-documento__hoja" href={GRAFICO_ROUTE}>
            <img
              src="/edicion/oficio-doc-grafico.avif"
              alt={g("title")}
              loading="lazy"
              decoding="async"
              {...medidas("/edicion/oficio-doc-grafico.avif", "(max-width: 899px) 78vw, 30vw")}
            />
          </Link>
          <div className="edicion-documento__pie">
            <h4>{g("title")}</h4>
            <p>{g("tagline")}</p>
            <span className="edicion-documento__meta">{g("pages")}</span>
            <Link className="edicion-documento__accion" href={GRAFICO_ROUTE}>
              {g("open")}
              <span aria-hidden> ↗</span>
            </Link>
          </div>
        </article>

        <article className="edicion-documento animate-show-media">
          {/* The CV plate is cut per language, because the document is: an
              English reader following "Open my CV" gets the English PDF, and
              the thumbnail above the link has to be the page that opens. */}
          <a className="edicion-documento__hoja" href={a("cvHref")} target="_blank" rel="noreferrer noopener">
            <img
              src={`/edicion/oficio-doc-cv-${locale === "en" ? "en" : "es"}.avif`}
              alt={c("eyebrow")}
              loading="lazy"
              decoding="async"
              {...medidas(
                `/edicion/oficio-doc-cv-${locale === "en" ? "en" : "es"}.avif`,
                "(max-width: 899px) 78vw, 30vw",
              )}
            />
          </a>
          <div className="edicion-documento__pie">
            <h4>{c("eyebrow")}</h4>
            <p>{t("capitulos.oficio.documentos.cv.nota")}</p>
            <span className="edicion-documento__meta">
              {t("capitulos.oficio.documentos.cv.meta")}
            </span>
            <a
              className="edicion-documento__accion"
              href={a("cvHref")}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t("cta.cv")}
              <span aria-hidden> ↗</span>
            </a>
          </div>
        </article>
      </section>

      <div className="edicion-oficio">
        <section className="edicion-oficio__col">
          <h3>{c("workHeading")}</h3>
          <ol>
            {trabajo.map((e) => (
              <li key={e.title + e.when}>
                <span className="edicion-oficio__cuando">{e.when}</span>
                <span className="edicion-oficio__que">{e.title}</span>
                <span className="edicion-oficio__donde">{e.place}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="edicion-oficio__col">
          <h3>{c("educationHeading")}</h3>
          <ol>
            {formacion.map((e) => (
              <li key={e.title + e.when}>
                <span className="edicion-oficio__cuando">{e.when}</span>
                <span className="edicion-oficio__que">{e.title}</span>
                <span className="edicion-oficio__donde">{e.place}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="edicion-oficio__col">
          <h3>{s("title")}</h3>
          {/* The tools, not the service lines. This heading reads "Tools and
              strengths" and sat over `contact.tags` — "UX/UI design, graphic
              design, front-end, WordPress" — which is what she offers, not what
              she uses. The tags under every `skills` item are the tools, and
              they are what the heading has been promising all along. */}
          <ul className="edicion-oficio__etiquetas">
            {habilidades.flatMap((h) => h.tags).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="edicion-oficio__cierre">
        <p className="edicion-oficio__lead">{k("lead")}</p>
        <div className="edicion-oficio__acciones">
          <a href={`mailto:${PERSON.email}`}>{k("mailCursor")}</a>
          <a href={PERSON.linkedin} target="_blank" rel="noreferrer noopener">
            {k("linkedin")}
          </a>
        </div>
      </div>
    </>
  );
}
