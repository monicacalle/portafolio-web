# Setup questionnaire -- configure the factory once

**Status: answered 2026-09-03. Do not ask these again.** Answers landed in
`stages/03_validate/CONTEXT.md` (Q1, Q3), `_shared/engineering/conventions.md` (Q2, Q5),
and `_shared/product/market-research.md` is confirmed as the only case-study source (Q4).
Q5 was derived from the repo rather than asked.

Five questions, asked once. Answers are written into the files named beside them and no
run should ever re-ask them. Setup is complete when a scan finds zero `{{` patterns left
outside this file.

1. Beyond `pnpm dev`, is there a QA or preview step a change should go through (a browse
   or screenshot workflow, a Vercel preview URL, a device check)? Name the actual
   commands or "none".
   -> fills `{{QA_COMMANDS}}` in `stages/03_validate/CONTEXT.md`

2. How does a change reach production, and what is the real domain? `lib/site.ts` still
   points at `portafolio-en-espa-ol-monica-calle.vercel.app`.
   -> updates the SEO open item in `_shared/engineering/conventions.md`

3. Who signs off on Spanish copy before it ships, and does English need a separate
   sign-off?
   -> becomes the human check line in `stages/03_validate/CONTEXT.md`

4. What source material should case-study runs reuse (Figma files, project write-ups,
   client assets)? Give locations, not copies.
   -> becomes a linked note in `_shared/product/`, one home per fact

5. Beyond `components/ui/` and `AGENTS.md`, are there paths an agent must never edit by
   hand?
   -> extends the Avoid list in `CLAUDE.md`
