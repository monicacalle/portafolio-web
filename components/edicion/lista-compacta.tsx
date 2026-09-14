"use client";


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
type Fila = { q: string; a: string };

/**
 * `titulo` and `filas` are RESOLVED BY THE CALLER, row by row, rather than
 * looked up from a chapter key here.
 *
 * Two reasons, both the same reason: next-intl types its message keys as a
 * literal union, so a key threaded through a prop widens to `string` and loses
 * the compile-time guarantee that the message exists, and `t.raw()` on a nested
 * object is not in that union at all. Resolving leaf keys at the call site
 * keeps a missing row a build error instead of a runtime crash -- which matters
 * because global.d.ts type-checks the Spanish tree only.
 */
export function ListaCompacta({
  titulo,
  filas,
  id,
}: {
  titulo: string;
  filas: readonly Fila[];
  id: string;
}) {
  return (
    <section className="edicion-lista" aria-labelledby={id}>
      <h3 id={id}>{titulo}</h3>
      <dl>
        {filas.map((f) => (
          <div key={f.q} className="edicion-lista__fila">
            <dt>{f.q}</dt>
            <dd>{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
