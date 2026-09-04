# 03_validate -- prove the change works before it ships
Last updated: 2026-09-03

One job: run the checks and write down what actually happened, including failures.

## Inputs
- Working (this run): ../02_draft/output/[slug]-implementation-plan.md, and the
  working tree as edited.
- Reference (every run): ../../_shared/engineering/conventions.md
- Reference (before any merge to main): ../../_shared/engineering/branching-and-review.md
- Reference (every run): the QA workflow below, run in this order.

Do NOT load: the research output, the market research, past validation reports.

## Process
1. Run `pnpm lint` and `pnpm build`. Paste the real result, pass or fail.
2. Check locale parity: same keys in `messages/es/` and `messages/en/`, and both
   `index.ts` barrels updated if a namespace was added.
3. Run the gstack `/browse` skill against http://localhost:3000 and load every affected
   page in **both** locales. There is no test suite, so this is the only check that
   catches a visual or interactive regression.
4. If the change touched layout, spacing, typography, or motion, run `/design-review`
   as well. This is a portfolio: visual polish is the product, not a finish.
5. If the change touched user-facing copy, confirm it went through `ghost` (step 2 of
   the copy rule in `_shared/engineering/conventions.md`). Copy that never passed the
   slop linter has not been validated, however good it reads.
6. Record anything you did not check, and say why.

## Outputs
- [slug]-validation-report.md -> output/

## Human check
Read the report and confirm every line says what was run, not what was assumed. A check
that was skipped must be named as skipped. For any copy change, read the Spanish aloud
and confirm it sounds like a person, not a model. Then decide whether it ships.
