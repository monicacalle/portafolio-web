# The Edition — what the brief asks for that this build does not do
Epic MP-94. Last updated: 2026-09-13.

`branching-and-review.md` says a finding is closed when it is "fixed, or
explicitly declined in writing with a reason". `shopify-script.md` is 105
sections of requirements and this build does not satisfy all of them. Every
departure is listed here with its reason, so the gaps are a decision on the
record rather than something that quietly did not happen.

The rule that governs the list: **a section that was not built is recorded as
not built. It is never reported as clean.**

---

## 1. Declined because it costs money

The user's constraint on this build was that everything be free to use. One
thing in the brief is not.

### §79 — Rive

Rive's **runtime** is MIT and free. Its **editor export is not**:
`rive.app/docs/editor/exporting/exporting-for-runtime` reads "Exporting for
runtime is available on paid plans", and the pricing page's own headline is
"Free to create, $9/mo to ship".

Rive also ships a CLI that builds a `.riv` locally, signed out, with no account.
That is a genuinely free authoring path — but the commercial terms for an
artefact built that way are documented nowhere: not in the pricing page, not in
the CLI docs, not in the Terms of Service. An undocumented grant is not a grant.

**Replaced by** `components/edicion/plancha.tsx`: her own full-length delivered
app screens scrubbed through a phone-sized frame. §43 asks for "a major
interactive product demonstration" and the planchas satisfy it as written. A
plancha is a single linear pan; the state-to-state half of what a `.riv` would
have carried is `components/edicion/secuencia.tsx`, built for §42 and sitting
directly above them in the same chapter.

Rive would have lost on merits at $0 anyway: 882kB gzip of runtime before any
content, text baked out of `messages/` and out of `ghost`, and a blank rectangle
with JS off — on the chapter carrying her two finished case studies.

---

## 2. Declined on the merits

Two different arguments used to sit under one heading that only described the
first of them. It read "declined because the content is hers, not Shopify's",
and six of its nineteen rows were nothing of the kind — §1, §10, §20, §32, §86
and §92 are engineering and editorial judgements about a section this site
could build and chose not to. A heading narrower than its own table is the kind
of thing this document exists to catch, so they are separated below.

### 2a. There is no equivalent to build

The brief describes twelve chapters of Shopify product launches. This is a
portfolio.

| § | Requirement | Why it is not here |
|---|---|---|
| 54, 56, 58, 60, 62, 64 | Checkout, Operations, Shop app, B2B, Finance, Shipping chapter intros | Six chapters, not twelve. Her body of work supports six; padding to twelve would put single images under chapter titles. Settled with the user at the start. |
| 55, 57, 59, 61, 63, 65 | The light content sections belonging to those six chapters | Declined with their intros. Named explicitly here because an audit counted them as unscored otherwise. |
| 52 | "Products surfacing across multiple merchant surfaces" | The dark featured story §52 asks for is built (see §39/40/45 below); its SUBJECT is not. One designer's two apps do not surface across a network of merchant surfaces, and drawing a diagram that says they do would be the only invented claim on the page. |
| 69 | Chapter VI's full-bleed video story | §69 asks the closing chapter for "one full-bleed video story" on top of §67's hero and cards. There is no film of her practice, and the only two this page could cut are of work that belongs to chapters III and V. A second showing of the campaign film or the printed portfolio, dressed as a new story in the closing chapter, is repetition. §69's other half — media cards and compact capability updates — is built: the two document cards and the three list columns. |
| 74 | "Coming soon / get notified" product modal | Nothing on this site is unreleased. |
| 75 | Product / merch modal | There is no merchandise. |
| 33–36 | Skill tags, elastic tag motion, tag popups, emoji particles | Shopify's playful register. Applying it to a designer's own portfolio would read as borrowed, and §99 restricts the elastic curve to "playful Sidekick Skill elements" that do not exist here. |
| 9 | Editions dropdown | The reference's menu switches between separately published editions. There is one of these. A menu that opens to reveal a single item is theatre; the six chapters are in the header, the rail and the hero index instead. |
| 18 | The rail's middle standfirst, and Terms / Privacy links | The reference's sidebar carries a second line of copy and two legal links. There are no such routes on this site and inventing a Terms page for a personal portfolio would be furniture. The standfirst it would carry is the hero's own `entradilla`, a screen above; repeating it in the rail is the same sentence twice on one viewport. |
| 66 | "3D environment should transition toward a brighter technical world" | Chapter VI has no scene at all, which is a different thing from a scene that brightens. §23 sends the closing chapter into the light world and a cinematic ground under contact details would fight it; the brightening is the cut itself. |
| 53 | Chapter III's compact product updates | The section's other clauses are built — two-column media, the standard reveal, restrained text movement. Its compact list is not, because chapter III is one campaign and a film, and a list of "updates" about it would be four rows of copy invented to fill a register. Chapters I, II and IV carry that register on material that exists, and chapter V's is inside §49. |
| 68 | A second subsection of two half-width cards in the closing chapter | Chapter VI has one card pair and it is §67's, the graphic portfolio and the CV. Those are the only two documents that exist; a second pair would have to be invented. The compact-updates half of §68 is the chapter's three list columns. |
| 101 | The twelve required DOM anchors | `#sidekick #agentic #online #retail #marketing #checkout #operations #shop-app #b2b #finance #shipping #developer` are Shopify's chapter slugs, and six of them name products this site has no relationship to. Aliasing `#b2b` onto a chapter about printed portfolios would be a lie in the URL bar. What §101 says it is protecting — "desktop sidebar, mobile navigation, deep linking, and history behavior consistent" — is met by six stable anchors that the rail, the header, the hero index and the sitemap all read from one list. |

### 2b. There is an equivalent and it is declined

These could be built on this content. Each row says what was weighed.

| § | Requirement | Why it is not here |
|---|---|---|
| 10 | Search | The find already exists and the jump already exists, and neither of them is this. **Find:** the page's entire text is 8,982 characters, 1,562 words, and it is byte-identical at scroll 0 and at the foot of 28,000px — nothing here is virtualised, lazily mounted, paginated or behind a tab, which is precisely the condition under which the browser's own ⌘F is complete. A custom search would be searching the same DOM the browser already searches, with a worse matcher, no accent folding it did not write itself, and no screen-reader support it did not build. The index it would hold is 26 strings: six chapter titles and twenty card titles, all distinct. **Jump:** §10's other half is already there four times over — the header's six chapter links, the rail's index, the hero's index and the mobile menu — and all four read from one list in `lib/edicion/capitulos.ts`, so they cannot disagree. What §10 adds over that is a fifth. The section's spec is mechanics for a search that has a corpus: the 200ms slide from `translateX(-101%)`, the mobile `translateY(100%)`, the clear button that fades in on input. Building the mechanics around 26 strings would be the interaction, faithfully reproduced, with nothing behind it. |
| 20 | A Theatre.js timeline per chapter | The camera moves are hand-written deltas in `lib/edicion/escenas.ts`: five scenes of four numbers each. A timeline runtime to hold twenty numbers is machinery for its own sake, and `@theatre/studio`, the part that would make authoring them worth it, is AGPL-3.0 and declined above. `@theatre/core` was installed and imported nowhere for the whole build; it has been removed rather than left in a public repository as a dependency nothing uses. |
| 86 | A distinct mobile 3D build | Five of §86's six bullets are met and the sixth has nothing to simplify. "Switch some scenes entirely to optimized static images" is applied to ALL of them: the canvas is removed below 1024px, which is also why tablets between 768 and 1023 get the static path although §85 gives them 110svh of intro for 3D choreography. "Preserve DOM product animations" and "retain dark/light chapter transitions" hold at every width. "Use lower-resolution textures" and "reduce environmental layers" are built, but on the low end of the range where the canvas actually runs rather than on a phone — the background plates are capped at a 512px long edge (55.7–58.1 dB against the originals, 24.69 MiB of VRAM down to 3.68) and every plane marked `ambiental` stops rendering when the adaptive DPR verdict drops to 1. "Simplify 3D objects" has no content here: every object in the scene is one quad. What is genuinely NOT built is a second, separate mobile scene graph, and the reason is that there is no mobile scene graph at all to simplify. |
| 1 | Step 2 of §1.1's grammar, "text begins to leave" | Six of the seven steps are built; this is the one that is not. The chapter title enters (step 6) and never exits. The reason is §78, which is the section that governs the thing an exit would have to animate: it calls the light editorial blocks "a breathing mechanism" and warns against scroll-scrubbing them, so `Revelar` unobserves after revealing and NOTHING on this page animates on the way out. An exit for the chapter titles alone would be the only outbound animation in the build, and it would run on a title the reader has already scrolled past — a second scrubbed value per chapter, six of them, for a moment nobody is looking at. What §1.1 is protecting, "never make each section look like an independent rectangular webpage module", is carried by steps 3, 4 and 5: §77's three scrubbed cuts, which are what actually dissolve one chapter into the next. |
| 32 | An action on the ten plate-wall cards (the other half of §32 is built) | Title and description are built everywhere. So is the action, on every card that has somewhere to go: the planchas, the two documents, and — since the §30 work — the five constellation cards, which open her own painting at 2000px. The ten plate-wall cards in chapters II, III and V get none, and the file sizes are the reason. The shared modal panel is `min(92vw, 1400px)` wide. Six of the ten sources are 900 × 640, so "see it larger" would put them on screen at 1.56x upscale; a seventh, the Isabella poster, is 596px wide and would sit at 2.35x. They would be bigger and visibly worse — a control that promises more detail and delivers interpolation. Behind each of the five constellation cards there is a 2000px file against a card that renders at 146–307px, which is 7–14x of real headroom and no upscale at any viewport. The split is by whether the pixels exist, not by which chapter the card is in. |
| 92 | Three of the per-chapter transitional sub-states | The machine publishes `data-fase` (hero / capitulos / fin), `data-subfase` (intro / editorial, carried explicitly by each block rather than inferred from its colour) and `data-capitulo`. BOOT and HERO_LOADING have no equivalent because there is no loading state to be in — the page is server-rendered complete and the canvas fades in over it. SIDEBAR_TRANSITION is `--hp`, a continuous value, because §17 asks for a scrub rather than a step. INTRO_ENTER, CONTENT_TRANSITION and INTRO_EXIT are not built: they are transitional states with nothing to read them, and a state nothing consumes is a value computed every frame for nobody. |

---

## 3. Declined on licence grounds

### §80 — Draco / Meshopt / KTX2 / glTF / GLB

The canvas is built, and §80's adaptive DPR and progressive loading are
implemented. The compression formats are not, because there is no mesh to
compress: her work is painted illustration, print and app screens, and the
scene's "models" are alpha-cut planes of her own artwork. Inventing geometry
would put shapes on her page that are not hers. AVIF textures over
`TextureLoader` is the correct equivalent for a page whose entire subject is
2D artwork.

### `@theatre/studio`

AGPL-3.0-only, in a public repository with no licence of its own. It is the
dev-only editor and nothing here needs it. `@theatre/core` is Apache-2.0 and
installed.

---

## 4. Not built yet — no argument either way

These are absent. They are not declined, they are unfinished.

| § | Requirement | Note |
|---|---|---|
| — | — | Empty. Every section that was on this list has since been built or moved to a written decline. This is not a claim that all 105 are clean — that is what the audit in section 6 measures, and it is rerun, not inferred. |

§81 (a portrait fallback plate per chapter), §85 (mobile intro heights that
vary with content), §80's DPR re-evaluation and §92's END state and sub-phase
have all since been built and are struck from the table above.

§8 has gone with them, and the decline it replaced was wrong about its own
reason. It said "gradients do not interpolate, so a real transition means two
stacked pseudo-elements cross-fading" — true of gradients, and beside the
point: a COLOUR inside a gradient interpolates perfectly well once it is
registered with `@property { syntax: "<color>" }`. The veil is one now, the
gradient is built where it is used, and it crosses over in 300ms, which is the
number §8 asks for. The same registration fixed the rail's ground, which was
snapping from #120f0e to #f4f2f0 while the type it carries faded across on its
own timing. Two defects turned up underneath: `transition: background-image
300ms` had been decorative for the whole build, because `background-image` is
not an animatable property, and a second `.edicion-rail { transition: opacity }`
nine hundred lines below the first had been silently replacing the rail's
colour fade rather than adding to it.

§29 and §30 (the five-card constellation, its hover, and — since the cards
became links to her own paintings — the focus parity §30 asks for) landed in
`components/edicion/constelacion.tsx`; §39, §40 and §45 (a second dark featured
beat inside a chapter) landed in `components/edicion/beat-oscuro.tsx`, wrapping
chapter III's film. Both were on this list and are struck from it. §52's dark
featured story is the same beat; the part of §52 that is not built is its
subject, "products surfacing across multiple merchant surfaces", which is in
section 2's table with the rest of Shopify's own content.

---

## 5. Departures that are deliberate, and visible

Not gaps — different answers, with reasons.

**§4 — the display face.** The brief asks for a modern grotesque for headings,
and the measured reference uses NeueMontreal. This uses **Bodoni Moda**, a
didone, for chapter titles and the wordmark. The reason: the Edition's whole
conceit is a Renaissance printed object, Bodoni is the typographic argument for
it, and Geist carries the grotesque role for UI and body. It is a departure from
§4 and it is the one place the build deliberately overrides the brief on taste.

**§13 / §20 — the hero has no WebGL scene.** It has a cinematic scene: el
retablo, built in CSS 3D. It is built that way because it is also §17's
hero-to-rail morph, which has to survive WebGL being off. §81 and §82 bless a
non-WebGL cinematic path explicitly.

**§102 — eleven of the fifteen primitives exist under this page's own names.**
`components/edicion/primitivas.tsx` carries the three that were genuinely
duplicated: the modal, the pill and the underlined action link. Its header maps
the rest — CinematicScene is Lienzo, FeatureCard is Ficha, RiveMedia is
Plancha, CompactUpdateList is ListaCompacta, StickyNarrative is Triptico — and
renaming working components to match a list would be relabelling presented as
architecture. `SectionHeading` and `InlineLink` are deliberately absent:
headings differ by role and are one element each, and the inline prose link is
`t.rich`'s own element, so it cannot be a component at the call site. A
primitive whose body is one styled tag is indirection, not reuse.

**§103 — data-driven, but not a layout engine.** `placa` and `obras` (with the
section's own `layout` field on each card) are in `lib/edicion/capitulos.ts`
now, where the anchors, heights, themes and grounds already were. What the
section protects against is real and was present: two `Record<string, …>` maps
inside `edicion.tsx`, one of them holding entries for chapters whose bodies
never reached that renderer, while the chapter record carried an `obras` field
of slugs that nothing read — so the authoritative-looking list was the dead one.

What is NOT data-driven is the bodies. §103 exists to stop "150 individual
product modules" being hand-written; there are six chapters here, four of whose
bodies are one-off compositions (a constellation, a state sequence with two
planchas, a film inside a dark beat, a triptych). Expressing four bespoke
compositions through a layout engine would be more machinery than the thing it
renders.

**§67 — the closing chapter's hero and its two cards are documents, not
product stories.** §67 asks for "a full-width major story" that "should feel
like the chapter hero", then "two major media cards". Chapter VI was three
lists and a mailto: no photograph of the person the other five chapters are
about, and no sight of either thing a reader can take away. The story is her
own `about` copy, which had been off the site since this page replaced the old
homepage, beside her portrait. The two cards are the graphic portfolio and the
CV, each showing its real first page.

It also closed a defect rather than only adding a section: the chapter's one
document link was labelled "Abrir el CV completo" / "Open the full CV" and
opened the graphic portfolio. Both documents have their own card and their own
correct destination now, and the "Herramientas y fortalezas" heading sits over
the tool tags rather than over `contact.tags`, which are the service lines.

**§45 against §97 — the dark beat ends chapter III, and the next chapter is
dark too.** §97 says "never place cinematic scene after cinematic scene with no
informational relief". §45 places its second dark beat "near the end" of a
chapter and then says "once finished, move into Retail" — and §46 opens Retail
with a dark cinematic intro. The reference does the thing §97 forbids, in the
section that describes it. This build follows §45, which is the specific
instruction for this placement, over §97, which is the general rhythm; the beat
is the last block in chapter III and hands into chapter IV's dark intro. The
alternative was moving it to the middle of the chapter, which satisfies §97 and
breaks §45's "near the end", and turns an unexpected second beat into an
extension of the first.

**§42 — the four states are Vibe's, not Rollouts'.** The section is built:
`components/edicion/secuencia.tsx`, a pinned stage in chapter IV where four
states wipe one into the next under the scroll, with 25vh of breathing room
before it settles and a media layer that fades in over 700ms ease-in-out. What
differs is the content. §42 offers "website version A / website version B /
experiment controls / timing states", which is an A/B testing product she has
never worked on. The four states are the ones her own app performs: the two
questions onboarding asks, the day-23 cycle it computes from them, the daily
check-in that corrects the prediction, and the week the phase rewrites.

This is NOT the four-phase state machine refused under §79 above, and the line
between them is worth keeping. That one would have meant writing three phases
of health advice about a shipped product under her name, because only `fase
lútea` exists at high fidelity. Nothing is authored here: the four plates are
cropped out of her own Figma exports by `produccion/edicion.py`, and the loop
between them is stated on the screens themselves.

**§47 / §48 — the sticky triptych is in chapter V, not chapter IV.** §48 is
about circling a physical artifact, and her printed portfolio is the only thing
on the page that genuinely is one.

**§32 — the cards name the work now, five of them open it, and one mark went
back on its own colour.** §32 asks every editorial card for a title and a short description and
they had neither: four pieces of her branding work were on screen unnamed, and
chapter II's statement above them names one of the three studios. The captions
are at `capitulos.<anclaje>.obras.<clave>` and every line is checkable against
her own printed portfolio.

Naming them turned up a second thing. The Estudio Raíz wordmark is white on
transparent — 90% of `a2-raiz.avif` has alpha 0 — so on the cream editorial
ground it rendered as white type on off-white and read as an empty cell.
`produccion/edicion.py` composites it onto #513329, which is the median of the
lower right quadrant of page 8 of her portfolio, the Estudio Raíz spread. The
mark is back on the ground she gave it.

Chapter II's fourth card was also the open printed portfolio, which is chapter
V's subject sitting unlabelled in the brand chapter. It is five cards now:
three marks, then two of them applied.

The five constellation cards got the other half of §32 — an action — and with
it the focus parity of §30, which was on the declined list because a `<figure>`
with nothing focusable inside it can never match `:focus-within`. Each card is
now an `<a href>` to her own painting at 2000px, taken over on a plain left
click to open in §26's shared modal and left alone on a modified one, so
⌘-click and "save image as" still reach the file. The destination is the
`lamina-*` plate, not the `panel-*` one: `panel()` rescales her subject onto a
synthesised altarpiece ground, which would make each card's own caption —
"3000 × 3000 px" — a claim about a composite. The modal's alt text is her own
`linea`. The ten plate-wall cards still get nothing, and section 2 now carries
the file sizes that decide it.

**§37 — chapter I's compact register, out of copy that existed.** The five
`linea` texts were written for her five drawings, went through ghost, and
rendered nowhere: a constellation card is 22% of the column wide and carries a
title and the file's dimensions, because a forty-word paragraph inside it would
break §29's cloud. They are the chapter's compact list now, which is where §37
puts that register — after the heavy block.

**§49 / §50 — the technical items moved up, they were not duplicated.** §49
wants technical capability items inside the third story, revealed progressively;
§50 wants media cards and then compact updates after the sticky sequence ends.
Chapter V has exactly one list of technical items — her five print specs — and
it used to sit after the whole sequence. It is inside the third reading now,
where the object it describes is still on screen, which is where §49 puts it.
So §50's media cards are built and §50's "then compact product updates" is
answered by a list that has already been read a screen earlier. Showing the
same five rows twice to satisfy both sections would be padding, and the page
would be the thing that paid for it.

**§91 — no `next/image`.** Every plate is pre-cut by `produccion/edicion.py` at
delivery size as AVIF and served static. `next/image` would re-encode files that
are already optimal and add a loader hop. What §91 actually protects against is
covered directly: intrinsic `width`/`height` on every image, and `srcset` with
narrow variants generated by the same pipeline, so a 390px phone serves a 640px
plate rather than a 1680px one.

**§96 — the lighting rig.** Built, and worth stating because the obvious reading
of the section would have been wrong here. Her planes are finished paintings and
printed pieces, so a real rig with a `MeshStandardMaterial` would RELIGHT work
that is already lit and tint her artwork with a light she never painted — which
§96 itself forbids, "unless [the colour] exists naturally in the artwork". The
rig is what a gallery does to a hung picture instead: a soft key and fill
falling off with depth, as a neutral grey multiplier on her own colour.

---

## 6. The honest state

Three full compliance audits against all 105 sections are in the session
record, plus one verification pass over the fixes. The first found 10 PASS / 44
PARTIAL / 39 FAIL of 93 applicable sections. The second, after the cinematic
layer, the video, the geometry, the triptych, the reveal system, the escape
control and the state machine landed, found 19 PASS and 22 FAIL.

The third read all 105 against the code with five readers and found the
problems below. They are listed because the rule at the top of this file is
that a defect is recorded, not quietly repaired, and because every one of them
had a comment beside it claiming the opposite:

1. **Chapter VI opened on a blank screen.** Its intro is the one §23 sends into
   the light world, and the title inherited the cream it was painted on. 1.00:1.
2. **The §28 reveal system never animated.** Two copies of the same reset, one
   of them outside the reduced-motion query, and a CSS transition reads its
   duration from the after-change style.
3. **Chapter I's entire editorial body was invisible with JavaScript off** at
   1024px and up, which §100 names as disqualifying.
4. **React discarded and re-rendered the whole page on every load.** A lazy
   `useState` initialiser answered the WebGL question differently on the server
   and on the first client render.
5. **§17's step 7 was dead code** — `length × length` inside a `calc`.
6. **§82 left her artwork double-imaged** on every WebGL desktop.
7. **§20's scene ground did not exist**, while the stylesheet gave away 78% of
   every chapter's colour on the strength of a comment saying it did.
8. **§31's own fix broke the 768–1023 band**: 10,612px of cards inside an 805px
   scroller.
9. **§26's modal close never ran**, leaving a full-viewport dialog painted with
   the video playing for 320ms.
10. **Deep links landed up to 320px inside their chapter**, and before that, two
    smooth scrollers were animating the same property.
11. **The hero label overlapped the art** by up to 75px, and the rail's active
    numeral sat at 1.24:1.

All of them are fixed and each fix is measured in its commit message.

A twelfth was found afterwards, while checking that §30's new card links
behaved on a phone, and it is the largest of the set:

12. **§31's carousel was the whole chapter body, not the card group.** §31
    replaces one thing below 1024px — "the desktop floating constellation" of
    app cards — and this build made the entire editorial body the scroller.
    Measured at 390×844: chapter I was a 375px-wide horizontal scroller holding
    three items, each 250px wide and 2,040px tall, so reading it meant scrolling
    2,000px down an almost-empty column and then sideways. `.edicion-lista` had
    `scroll-snap-align: none` inside `scroll-snap-type: x mandatory` and was
    therefore UNREACHABLE — setting scrollLeft to centre it snapped back to 0
    and left 45px of a 254px block visible — so §37's compact register, ten rows
    of her own writing across chapters I and II, could not be read on any phone
    or tablet. And chapters IV, V and VI, which had already opted out of the
    flow one id at a time, kept the carousel's centring padding: 121px of a
    390px phone was empty margin either side of the contact chapter, against
    §3's "main content becomes full width". The carousel moved onto
    `[data-carril]` — the plate wall and the constellation, which are the card
    groups §31 is about — and the body is a six-track reading column at every
    width. §45's dark beat got to be a full-bleed band on a phone for the first
    time as a side effect, and 967px of reserved empty page went with it.

It is not at 105 of 105 and this document is the list of why. A section that
was not built is recorded here as not built; it is never reported as clean.
