# Reference: Shopify Editions Winter '26 — measured, not guessed

Captured 2026-09-13 from https://www.shopify.com/editions/winter2026 with headed
Chromium at 1680x1050. `shopify-script.md` repeatedly says "use the supplied HTML
as the source of truth" but no HTML was ever supplied to this repo, so these are
the numbers read off the live page instead.

Screenshots: /tmp/ref-hero.png, /tmp/ref-chapter.png, /tmp/ref-grid.png

## Chapter geometry (measured section heights)

| # | id | height | in viewports |
|---|---|---|---|
| I | `sidekick` | 7969px | 924svh |
| II | `agentic` | 2449px | 284svh |
| III | `online` | 5456px | 633svh |
| IV | `retail` | 7831px | 908svh |
| V | `marketing` | 3837px | 445svh |
| VI | `checkout` | 2112px | 245svh |
| VII | `operations` | 2827px | 328svh |
| VIII | `shop-app` | 2256px | 262svh |
| IX–XII | `b2b`, `finance`, `shipping`, `developer` | — | — |

Chapters are wildly uneven on purpose: 245svh to 924svh. That unevenness is the
rhythm. Equal-length chapters would read as a template, which is the one thing
the brief forbids.

Each chapter root carries `data-section-id` and `data-section-index` and the
classes `relative overflow-clip flex justify-end` — the `justify-end` is what
pushes content into the right 80% past the rail.

## Theme switching

`data-nav-theme` is real and sits on `<html>` (initial `dark`) plus a wrapper per
content block (`dark` | `light`). The header and rail read it and recolour. This
is exactly what section 5 of the brief describes, so implement it the same way
rather than inventing a mechanism.

## Type

- `NeueMontreal, Helvetica, Arial, sans-serif` — headings and UI
- `HWCigars, Georgia, "Times New Roman", serif` — the Renaissance accent face,
  used for chapter sub-headings with a decorative swash initial
- `Inter-Variable` — incidental

Chapter titles are enormous (~200px), tight, and optically centred in the 80%
column, not the viewport.

## The left rail

20% wide, its own dark panel with the cinematic scene visible through it.
- top: "The Ren*ai*ssance Edition" wordmark, small
- bottom: the twelve chapters, bold, with Roman numerals I–XII right-aligned and
  a dotted leader connecting the active chapter to its numeral
- below that: copyright and legal, tiny

The rail stays dark even when the main column goes light editorial.

## Light editorial grid

Uneven card widths in one row (full / half / third). Card = image, bold title,
grey body, then a bordered pill link with a ↗ glyph. Below the cards, a
"compact update list": two columns, bold label left, grey sentence right, many
rows, set on a warm paper texture.

## Hero

Renaissance painting composite. Two figures in the Creation of Adam gesture
reaching across a centred thin-rule frame that holds the title, a two-line
standfirst, and the chapter list. Anachronistic modern objects (coffee cup,
shopping bags, skateboard) in hot magenta are the only saturated colour. Roman
numerals run down the frame's right edge.

The magenta matters: one violent accent against an otherwise muted painting is
what stops it reading as a stock art background.
