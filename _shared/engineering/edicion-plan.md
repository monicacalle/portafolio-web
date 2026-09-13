# The Edition — plan of record
Epic MP-94. Last updated: 2026-09-13.

Rebuild the homepage as a scroll-driven cinematic exhibition, following
`shopify-script.md` (the Shopify Editions Winter '26 architecture), with Mónica's
own work as the content. Measured geometry from the live page is in
`referencia-shopify.md` and is the source of truth wherever the brief is vague.

Decided up front, not open: it replaces the homepage; six chapters fitted to her
real work; public positioning is "Diseñadora gráfica y UX/UI" with no seniority
label; bilingual ES-default via next-intl; Lenis + GSAP + Theatre.js + R3F + Rive.

## How this plan was reached

Twelve agents. Four inventoried in parallel (her work, the 105-section spec,
public-domain sources, the codebase). Three proposed independent architectures
(by discipline, by process, by the Renaissance conceit). Three judges ranked them
from different chairs. One synthesised. One adversary attacked the result and
verified every claim against disk.

The adversary earned its place: it found nine real problems, three of them
load-bearing. Its corrections are folded in below and marked **[adv]**.

## The thesis

Six chapters, one per discipline she practises, so a recruiter who reads only the
rail reads six job titles in three seconds.

The Renaissance is never a chapter name and never wallpaper. It is an instrument,
used sparingly and only where it makes an argument.

One law keeps the taxonomy from reading as a services list: **every chapter except
the last shows one thing she drew beside the work somebody commissioned.** Her hand
appears in all six disciplines. That is the argument the page is making.

## The chapters

| # | anchor | ES | EN | svh | rests on |
|---|---|---|---|---|---|
| I | `ilustracion` | ILUSTRACIÓN | ILLUSTRATION | **460** [adv] | 4 painted portraits |
| II | `marca` | MARCA | BRAND | **480** [adv] | Raíz, Esmeralda, Isabella |
| III | `campana` | CAMPAÑA | CAMPAIGN | 540 | Ceguera Digital, L'Oréal, Ingres |
| IV | `producto` | PRODUCTO | PRODUCT | 780 | Vibe, Voluntee |
| V | `impreso` | IMPRESO | PRINT | 380 | Portafolio Gráfico, lobo, Sade, Nespresso |
| VI | `oficio` | OFICIO | PRACTICE | 200 | the professional record |

Heights are deliberately uneven — the live Shopify page spans 245–924svh, and
uniformity is what makes a page read as a template.

**[adv] The original allocation was inverted against content readiness.** Chapter I
had 720svh and not one written word behind it; chapter IV had 780svh and two
finished bilingual case studies, eight real statistics and 95 slide pages. The
longest budget was going to the emptiest chapter. I drops to 460, II rises to 480
(it could not fit its own signature moment inside 260 — a pinned three-state scrub
needs 150–200svh on its own and the chapter-intro floor is 140).

## The hero — el retablo

Her four painted portraits each sit on one flat, unmodulated ground: sage-olive
`#888866`, blue-grey `#B7BEBE`, white `#FFFFFE`, dusty-rose `#CFB5AF`. All four
corner-sampled from the source files and re-verified; the grounds really are flat
at the edges, so extending them to full bleed invents nothing and upscales nothing.

Four portraits on flat grounds is structurally a Renaissance polyptych. So the hero
is an altarpiece built entirely from her own work. No museum art in the hero at all.

**The one anachronism** is her own Ceguera Digital figure — flat vector, cobalt
sweater, orange bob, phone balanced on the head — standing in front of the painted
panels on its native cream. Flat against oil, wrong century, saturated. That
register clash replaces Shopify's hot magenta and it is hers.

It is *not* recoloured onto a cobalt ground: the sweater measures `#3060A0` and
would sit at 1.06:1 against a cobalt field, with the black contour dropping from
18.43:1 to 3.51:1. `produccion/placas.py` already reasoned this and chose cream.

### [adv] Panel widths are centre-plus-wings, not golden-section

Measured subject bounding boxes killed the golden-section idea:

| file | frame | subject span | % width | touches |
|---|---|---|---|---|
| A3 | 3000² | 800–2544 | 58% | bottom |
| A6 | 3000² | 56–2600 | 85% | **top** + bottom |
| A7 | 3000² | 144–2696 | 85% | bottom |
| A9 | 2048×2732 | 120–1976 | 91% | none |

Ground extension only makes a panel wider. Three of four figures already fill
85–91% of their frame, so golden-section panels would require cropping three of her
four portraits — breaking this plan's own law that her illustrations are never
cropped. A6 touches the top edge, so it cannot bleed upward at all.

So: **A3 as a wide centre panel** (the only file with real side margin, and the
intended dominant), the others as narrower wings where any crop is an explicit
editorial act, not a silent one. A three-panel triptych is the fallback if four
will not compose.

Decide this against the composited AVIF in a real browser **before** wiring the
fold, not after.

### The morph (hero progress 35→90%)

An altarpiece has hinged wings. The panels rotate inward on their own edges, the
composition compresses leftward as it closes, and the closed retablo *is* the
340×464 rail frame. `rotateY` transforms driven by one scroll value.

This is the answer to §17, which the spec names as the hardest and least specified
seam in the brief. The trap it names: two implementations look identical at the
endpoints and completely different mid-scrub, which is exactly where §1.2 says the
user must be able to stop and inspect. A half-open polyptych is self-evidently
correct at any value of `t`. A crossfade is not.

CSS 3D + GSAP, so it survives WebGL-off intact.

The static hero (`public/edicion/hero-retablo.avif`) is composited first and is both
the ticket-3 shipping hero and the permanent reduced-motion fallback. The page is
never blocked on the fold.

## Art direction

**Palette, sampled not styled.** Every chapter ground comes from her own files: the
four portrait grounds above, Esmeralda pine, Raíz oxblood, Plakatstil burnt orange,
the walnut and plaster of the Raíz photograph. Six chapters get six genuinely
different colour worlds without one colour being chosen at a desk. The dark world
is a *warm* near-black, never blue-black — her work is warm.

**One structural accent — bordeaux**, the oxblood of the Estudio Raíz mark and the
colour she names herself. Structural only: rail active state, dotted leader, CTA
underline, the numeral in view. It never appears inside an artwork's area.

**Her illustrations are never treated.** No duotone, tint, filter, crop to a card
aspect, drop shadow, corner radius or device frame. Two scales only: full-bleed at
native on their own extended ground, or a small cell on a very large ground. The
only permitted operation is the alpha separation that already exists in
`public/cine` (the copper hair as its own plane). Everything else on the page moves
so her paintings can stay still.

**The small-art law.** Isabella (596×842), the lobo cover and Sade posters (613×860),
the Gestalt pages and the p-29 street mockup (945×746) are never upscaled. The cell
shrinks, the ground grows. A resolution ceiling becomes a visible editorial decision
instead of a soft image.

**Public-domain art is used exactly once** on the whole page: the Ingres
(`public/cine/a3-ingres.avif`, Met 436703, CC0) beside the L'Oréal face in chapter
III, because there it is an argument she already wrote on portfolio pages 17–18.
Never a wash, never a texture, never blurred behind her work — always an adjacent
plate at comparable scale, desaturated ~20%, while her work is left untouched. The
past is the reference, her work is the subject. A colophon credits the Met.

## [adv] Chapter I's signature moment, corrected

The plan staked the lead chapter on Artwork 7's visible graphite "resolving onto her
own construction lines". The adversary rendered the file at 0.5% autocontrast and
found what is actually there: an open contour along the jaw that runs past the chin,
a line down the chest, a brow/nose/cheek edge, two stray hair strands. That is
**unfinished inking**. There is no construction geometry — no axes, no circles, no
proportional grid.

Da Vinci hairlines would have nothing to register onto, and copy asserting "her
construction lines" is a claim a designer would see through in one look.

**Corrected:** the geometry measures the *composition*, not her process — the eye
line, the golden division the bun sits on, the diagonal of the scarf. That is a
defensible analytical overlay and it is honest.

## Build order

Each ticket leaves the site working and viewable.

| # | Jira | Ticket |
|---|---|---|
| T1 | MP-95 | Repo safety + positioning. `produccion/` gitignored (**done**), reference doc tracked (**done**), eslint ignores, positioning rewrite through ghost |
| T1b | — | **[adv] Font licences — a swap, never a delete** (see below) |
| T2 | MP-96 | The plate pipeline: `produccion/edicion.py`, provenance discipline of `placas.py` |
| T3 | MP-97 | The static Edition, chapters I–III. **The fallback is built first**, because §81/82's fallback path is also §86's mobile path |
| T4 | MP-98 | Static chapters IV–VI, and the demolition of the old homepage |
| T5 | MP-99 | The scroll spine: Lenis↔ScrollTrigger bridge inside `smooth-scroll.tsx` |
| T6 | MP-100 | The retablo hero and the fold |
| T7 | MP-101 | One persistent SceneCanvas, never torn down; chapters I–II cinematics |
| T8 | MP-102 | Chapters III and V; Theatre.js enters here only, studio behind `NODE_ENV` |
| T9 | MP-103 | Chapter IV sticky triptych |
| T10 | MP-104 | Chapter I copy, written Spanish-first through ghost |
| T11 | MP-105 | Mobile recomposition — not a scaled desktop |
| T12 | MP-106 | The six-pass gate |

### [adv] T1b — the font problem, and why deleting breaks the build

Two faces currently shipping on `main` are not licensed for it:

- `public/fonts/NewYork PERSONAL USE.otf` — embedded string: *"free for personal
  use"*. It is `--font-heading` for every heading on the site.
- `public/fonts/the-seasons-regular.ttf` — a **FONTSPRING DEMO** build. It is baked
  into the OpenGraph share images, the ones posted to LinkedIn.

The codebase already knows: `lib/og/card.tsx:52` `serifSafe()` exists solely to
strip the slash, because the demo's ornament glyph renders a DEMO watermark and
"Diseño UX/UI" came out as "Diseño UX(DEMO)UI".

The original T1 said "delete both and adjust `serifSafe()`". That is a red build:

- `NewYork` is loaded by `app/fonts.ts:27` through `next/font/local`, which resolves
  `src` at **build time**. Deleting the file while `fonts.ts` references it fails the
  build. `--font-heading` is consumed in `globals.css:110`, `sections.css:121`,
  `site.css:155,366`, `award.css:30,229`, `components/ui/dialog.tsx:125`.
- `the-seasons` is read from **two independent literal paths** —
  `lib/og/card.tsx:25` and `app/[locale]/opengraph-image.tsx:21` — feeding three OG
  routes. Deleting it throws ENOENT on all three.
- `serifSafe()` is a text sanitiser, not the font loader. Naming it as the fix is how
  you can tell that ticket was written from a summary rather than from the files.

So T1b is a **swap**: land the replacement in `fonts.ts`, repoint `seasonsFont()`
*and* the second literal path, verify all three OG routes render, then remove the
files.

## Standing rules for every ticket

1. **[adv] Copy goes through ghost before the keys land.** T3 and T4 create the whole
   `edicion` namespace — six titles, six standfirsts, every card title, body, CTA and
   compact-list row. That is ~85% of the new user-facing strings on the page, and the
   original build order attached no ghost pass to either. CLAUDE.md makes this a hard
   gate. Drafts in this document are input for ghost, not copy to paste.
2. **[adv] Spanish is written first, then translated outward.** Not translated from
   English. The drafts reviewed broke the site's established voice — every existing
   approved string is **first person** ("Soy diseñadora…", "Abrir *mi* CV",
   "Escríbeme") and every new standfirst was third person, including "cómo
   escribirle" two components from the live "Escríbeme". Fix person first. Known
   calques to avoid: *"se sostienen"* for "you hold" (reads as "hold themselves up");
   *"las cifras son de sus encuestas"* (flat — *salen de* is the right verb); mixing
   perfect and preterite inside one parallel list. The artwork says **AJUNTAMENT DE
   VALÈNCIA**, not "Ayuntamiento".
3. **[adv] Namespace rewrites ship in the same commit as their consumers.**
   `components/site/footer.tsx:10` reads `nav("about"|"skills"|"projects"|"contact")`.
   T4 repoints those hrefs and T10 rewrites `nav.json` six tickets later — which would
   throw missing-message errors at runtime on both surviving case-study routes and the
   flipbook. Neither `pnpm lint` nor `pnpm build` catches it, because `global.d.ts`
   type-checks the Spanish tree only.
4. The case-study routes under `app/[locale]/proyectos/` must keep working throughout.
5. Nothing reaches `main` until the six passes in `branching-and-review.md` have run.

## Open, and needing Mónica

**Chapter I has no words.** Four painted portraits, two signed (07-01-2025 and
"January 09 25"), and not one line written about any of them in any of the 15
message namespaces. It is the user's stated priority and the one body of work with
zero copy. No title, no date, no statement of intent, no medium note beyond
"Procreate" in the CV.

This cannot be invented — inventing an artist's statement is exactly the failure the
ghost rules exist to prevent. T10 is a discovery pass with her, and it is on the
critical path for the chapter that opens the page.

Also unresolved: only 4 of her illustrations were pulled from Drive (files 3, 6, 7,
8, 9 — 1, 2, 4 and 5 were never exported). Worth asking whether more exist.

**Rive** is on §105's must-ship list and no `.riv` file exists anywhere in the repo.
Either someone authors one or it comes off the acceptance criteria in writing — the
rule being that a pass which was not run is recorded as not run, never as clean.
