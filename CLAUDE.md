# Portfolio -- Monica Calle

Bilingual portfolio site for Monica Calle, Product Designer (UX/UI) in Valencia. What leaves this workspace is a shipped change to the live site, with the reasoning behind it written down first.

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + next-intl (es default, en) + React Three Fiber + motion.

The working notes and planning for this site live in the private mirror, not here. See below.

## Commands
`pnpm dev` | `pnpm lint` | `pnpm build` | `pnpm start`

There is no test suite. `pnpm lint` and `pnpm build` are the only automated checks -- do not report a change as verified without also checking it in the browser.

## Route by task
| Task | Go to | Then stop at |
|---|---|---|
| Where copy, SEO, and components live | `_shared/engineering/conventions.md` | -- |
| Branching, and the gate before merging to main | `_shared/engineering/branching-and-review.md` | six passes, all findings fixed |
| Writing or changing any user-facing copy | `ghost` first | copy passed the slop linter |
| Planning work, positioning, research, voice | the private mirror, see below | -- |

## The workspace is not in this repository
This repo is **public**. The ICM workspace (`stages/`, `setup/`, `_shared/product/`)
and the `.ghost/` voice profile hold candid working material about Monica's job
search: target employers, an assessment of her weaknesses, salary positioning.
None of that belongs on a public URL under her own name, so it lives in the
private mirror at `github.com/tomas-fw/monica-portfolio` and is gitignored here.

`_shared/engineering/` stays, because coding conventions and the review gate are
about the code and are useful to anyone reading it.

## Where things live
| Folder | What it holds |
|---|---|
| `_shared/engineering/` | coding conventions, and the gate before merging to main |
| `_archive/` | superseded files, kept not deleted |
| `app/`, `components/`, `lib/`, `hooks/`, `messages/`, `public/` | the site itself |

## Avoid
Never hand-edit `components/ui/` or `AGENTS.md`, never put a user-facing string in a
component, and never ship copy that has not been through `ghost`. Why, and what to do
instead: `_shared/engineering/conventions.md`.

## The one rule
Nothing reaches `main` until the six review passes in
`_shared/engineering/branching-and-review.md` have run and their findings are fixed
or declined in writing.

@AGENTS.md
