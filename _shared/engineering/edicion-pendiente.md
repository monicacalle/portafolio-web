# The Edition — what is still open

Written 2026-09-14. Branch `epic/MP-94-renaissance-edition`, 82 commits, nothing
pushed. Pick this up from the top.

## State

`pnpm lint` 0 errors (13 `no-img-element` warnings, the documented §91
departure). `pnpm build` clean. Eight routes 200. No horizontal overflow at 320
through 2400. Six chapter anchors and three list anchors land at delta 0.
Console clean end to end in both locales. 75fps median over the canvas. ghost 0
FAIL in both languages.

Seven compliance passes have run against all 105 sections of `shopify-script.md`.
Sections 1 to 6 of `edicion-declinaciones.md` are the record of what is
deliberately not built and why; section 6 carries the audit history.

## Open work, in order

### 1. Finish the seventh pass

The seventh audit died on a session token limit: 46 of its 51 agents errored.
What it produced is NOT a clean result and must not be read as one.

- **Sections 1 to 45 were never audited in that round.** Three of seven readers
  failed before running. Re-run them.
- **21 findings from sections 46 to 105 were raised and never verified.** They
  appear under `refutados` in the run's output with EMPTY reason strings, which
  means their verifiers errored, not that they were cleared.

An eighth pass was launched to close both halves and was interrupted when the
session ended; it had emitted 35 of its 42 verdicts. Re-run it rather than trust
a partial result. The 21 findings are listed in the run's own output file, and
the workflow script that carries them is at
`~/.claude/projects/-Users-tomwilson-Desktop-workspace-monica-portfolio-next/<session>/workflows/scripts/edicion-cierre-105-*.js`.

Of those 21, these were verified by hand and are already FIXED — do not
re-report them: §100 (the film was a black rectangle without JavaScript), §91
(chapter intro plates served upscaled), §49 (the eyebrow at 3.45:1), §88 (the
z-index arithmetic), §103 (the dead `CAPITULOS` re-export), §81 (chapter I's
portrait desktop fallback), §82 (WebGL context loss), §71 (the reduced-motion
cancel targeting the sheet rather than the image).

Thirteen remain unverified. The ones worth checking first, by the size of what
they would mean:

- **§50** — "release the sticky scene, the 3D environment gently loses opacity,
  a warm light background rises underneath". Three clauses that may be neither
  built nor recorded.
- **§49** — the short-viewport tightening's third declaration may be dead under
  a comment asserting the opposite.
- **§47** — the two off-screen triptych readings may still take pointer events
  and still be announced, since they are faded by opacity alone.
- **§90** — the preload ladder's third rung may be a rung late.
- **§52, §67, §71, §78, §93, §95, §99, §47, §90** — records and comments that
  may describe code the build does not have. Every previous round found several
  of these and they count as findings in this project.

### 2. The review gate

`_shared/engineering/branching-and-review.md` requires six passes before
anything reaches `main`. None of them has been run against this branch. The
compliance audits are not a substitute: they check the brief, not the code's
security, its UX, or its visual consistency.

### 3. Nothing has been pushed

Local commits only, by instruction. No PR, no deploy.

## Things that are true and easy to get wrong

- `produccion/fuentes` and `produccion/originales` are gitignored. This repo is
  public. Do not commit anything from them.
- The asset pipeline is `produccion/edicion.py`. It is the only thing that
  writes `public/edicion/*`. Re-run it after touching a plate; it is idempotent
  apart from the film, which ffmpeg re-encodes.
- `lib/edicion/medidas.ts` is maintained BY HAND against the sizes the pipeline
  prints. If a plate changes size, that file changes with it.
- Verification means a headed browser with a real WebGL2 context. Headless has
  none, and four rounds of findings turned on numbers only a real context
  produces.
