"use client";

import { useTranslations } from "next-intl";

/**
 * The compact update list.
 *
 * Measured off the live reference (see _shared/engineering/referencia-shopify.md):
 * two columns, a bold label left and a grey sentence right, many rows, on a
 * warm paper ground. It is how that page carries density without the density
 * reading as documentation, and section 37 asks for exactly this register after
 * a heavy section -- "compact textual updates follow without requiring
 * elaborate animations".
 *
 * Section 78 governs it: this is the white editorial world, the breathing
 * mechanism, so there is no scrub and no per-row reveal. It is a table you read.
 *
 * The content is the research she actually ran. The market research on her own
 * job market is blunt that screens are table stakes and thinking is the
 * differentiator, and this is the only block on the page where the method is
 * the subject rather than the artefact.
 */
const FILAS = [
  "desk",
  "netnografia",
  "benchmarking",
  "dafo",
  "encuesta",
  "entrevistas",
  "personas",
  "journeys",
] as const;

export function ListaCompacta() {
  const t = useTranslations("edicion");

  return (
    <section className="edicion-lista" aria-labelledby="lista-metodo">
      <h3 id="lista-metodo">{t("capitulos.producto.metodo.titulo")}</h3>
      <dl>
        {FILAS.map((f) => (
          <div key={f} className="edicion-lista__fila">
            <dt>{t(`capitulos.producto.metodo.filas.${f}.q`)}</dt>
            <dd>{t(`capitulos.producto.metodo.filas.${f}.a`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
