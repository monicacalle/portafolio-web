# 01_research -- understand the change, choose an approach
Last updated: 2026-09-03

One job: turn a request into a written, decided approach before any file is edited.

## Inputs
- Working (this run): the request itself, plus the parts of the codebase it names.
- Reference (every run): ../../_shared/engineering/conventions.md
- Reference (when the change touches copy, labels, or positioning):
  ../../_shared/product/market-research.md

Do NOT load: other stages' outputs, past runs in `output/`, `components/ui/`.

## Process
1. State the change in one sentence, and give the run a slug (`hero-copy`).
2. Find every place the change actually lands. Copy changes fan out across both
   locales; label changes also hit `lib/site.ts` and `meta.json`.
3. List the approaches worth considering, with the trade-off of each. Recommend one.
4. Write down what you could not determine and what you assumed.

## Outputs
- [slug]-research.md -> output/

## Human check
Read the recommended approach and the fan-out list. Confirm the change surface is the
one you expected and nothing obvious is missing. Edit the file in place -- the next
stage reads whatever is here.
