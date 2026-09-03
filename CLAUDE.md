# Portfolio -- Monica Calle

Bilingual portfolio site for Monica Calle, Product Designer (UX/UI) in Valencia. What leaves this workspace is a shipped change to the live site, with the reasoning behind it written down first.

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + next-intl (es default, en) + React Three Fiber + motion.

Built on ICM: folders carry sequencing, hierarchy carries context, files carry state. If something needs explaining, the explanation goes in that folder's CONTEXT.md.

## Commands
`pnpm dev` | `pnpm lint` | `pnpm build` | `pnpm start`

There is no test suite. `pnpm lint` and `pnpm build` are the only automated checks -- do not report a change as verified without also checking it in the browser.

## Route by task
| Task | Go to | Then stop at |
|---|---|---|
| Understand a change and pick an approach | `stages/01_research/CONTEXT.md` | human reads the output |
| Research approved, plan the edit | `stages/02_draft/CONTEXT.md` | human reads the plan |
| Plan executed, check it before it ships | `stages/03_validate/CONTEXT.md` | human reads the report |
| Asked for status | scan `stages/*/output/` | report what exists |
| Writing or changing any user-facing copy | `ghost` first, then `stages/02_draft/` | copy passed the slop linter |
| Setting up | `setup/questionnaire.md` | already answered 2026-09-03 |
| Positioning, labels, copy decisions | `_shared/product/market-research.md` | -- |
| Where copy, SEO, and components live | `_shared/engineering/conventions.md` | -- |

## Where things live
| Folder | What it holds |
|---|---|
| `stages/` | the pipeline, in execution order |
| `_shared/` | factory: rules and reference that never change per run |
| `setup/` | one-time factory configuration |
| `_archive/` | superseded files, kept not deleted |
| `app/`, `components/`, `lib/`, `hooks/`, `messages/`, `public/` | product code, never restructured by this workspace |

## Avoid
Never hand-edit `components/ui/` or `AGENTS.md`, never put a user-facing string in a
component, and never ship copy that has not been through `ghost`. Why, and what to do
instead: `_shared/engineering/conventions.md`.

## The one rule
Nothing moves to the next stage until a person has read the output of the last one.

@AGENTS.md
