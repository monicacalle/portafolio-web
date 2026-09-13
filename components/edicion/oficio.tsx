"use client";

import { useTranslations } from "next-intl";
import { PERSON } from "@/lib/site";
import { GRAFICO_ROUTE } from "@/lib/case-studies";
import { Link } from "@/lib/i18n/navigation";

interface Entrada {
  when: string;
  title: string;
  place: string;
  body: string;
}

/**
 * Chapter VI — OFICIO. The practical close: where she has worked, what she
 * uses, and how to write to her.
 *
 * This chapter writes NO new copy. Every string comes from the `curriculum`,
 * `skills` and `contact` namespaces, which are already bilingual, already
 * through ghost, and already say these things in her own first person. Drafting
 * a second version would mean two descriptions of the same career drifting apart
 * in two languages, and the new one would be the unreviewed one.
 *
 * It is also the only chapter that never goes dark. After five cinematic
 * chapters the page has to land somewhere plain, or the contact details read as
 * part of the performance.
 */
export function Oficio() {
  const c = useTranslations("curriculum");
  const s = useTranslations("skills");
  const k = useTranslations("contact");

  const trabajo = c.raw("work") as Entrada[];
  const formacion = c.raw("education") as Entrada[];

  return (
    <>
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
          <ul className="edicion-oficio__etiquetas">
            {(k.raw("tags") as string[]).map((tag) => (
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
          {/* The graphic portfolio is a 30-page document, not a written case
              study, so it keeps its own route and its own viewer rather than
              being flattened into a card here. */}
          <Link href={GRAFICO_ROUTE}>{c("ctaCv")}</Link>
        </div>
      </div>
    </>
  );
}
