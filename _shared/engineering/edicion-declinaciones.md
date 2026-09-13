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

## 2. Declined because the content is hers, not Shopify's

The brief describes twelve chapters of Shopify product launches. This is a
portfolio. These sections have no equivalent to build.

| § | Requirement | Why it is not here |
|---|---|---|
| 54, 56, 58, 60, 62, 64 | Checkout, Operations, Shop app, B2B, Finance, Shipping chapter intros | Six chapters, not twelve. Her body of work supports six; padding to twelve would put single images under chapter titles. Settled with the user at the start. |
| 55, 57, 59, 61, 63, 65 | The light content sections belonging to those six chapters | Declined with their intros. Named explicitly here because an audit counted them as unscored otherwise. |
| 52 | "Products surfacing across multiple merchant surfaces" | The dark featured story §52 asks for is built (see §39/40/45 below); its SUBJECT is not. One designer's two apps do not surface across a network of merchant surfaces, and drawing a diagram that says they do would be the only invented claim on the page. |
| 74 | "Coming soon / get notified" product modal | Nothing on this site is unreleased. |
| 75 | Product / merch modal | There is no merchandise. |
| 33–36 | Skill tags, elastic tag motion, tag popups, emoji particles | Shopify's playful register. Applying it to a designer's own portfolio would read as borrowed, and §99 restricts the elastic curve to "playful Sidekick Skill elements" that do not exist here. |
| 9 | Editions dropdown | The reference's menu switches between separately published editions. There is one of these. A menu that opens to reveal a single item is theatre; the six chapters are in the header, the rail and the hero index instead. |
| 10 | Search | Six chapters and roughly forty pieces of work is not a corpus to search. **This one is a genuine gap rather than a clean adaptation** — §10 describes a find-and-jump interaction, and the build supplies the jump without the find. |

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
| 67, 69 | Chapter VI media | The closing chapter is text only. |
| 102 | Extracted primitives | `ChapterIntro`, `SectionHeading`, `CTA`, `InlineLink` and `Modal` exist as markup inside their own components rather than as named primitives. |
| 103 | Full data consolidation | `PLACAS`, `OBRAS` and the piece lists still live beside the components rather than inside the chapter records. |

§29 and §30 (the five-card constellation and its hover) landed in
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

Two full compliance audits against all 105 sections are in the session record.
The first found 10 PASS / 44 PARTIAL / 39 FAIL of 93 applicable sections. The
second, after the cinematic layer, the video, the geometry, the triptych, the
reveal system, the escape control and the state machine landed, found 19 PASS
and 22 FAIL — and then found three blockers, all since fixed:

1. A screenshot of Apple's iPhone "Titanium" marketing page was chapter IV's
   ground. Inherited from the old site, run through this project's own pipeline
   by me, and visible on every phone. Purged.
2. The `.motion` gate never reached the browser: React owns `className` on
   `<html>` and stripped it on hydration about 10ms after paint, on every load,
   so the desktop page shipped permanently in its reduced-motion presentation
   and ten sections failed from one cause.
3. The hero never pinned, because `overflow-x: hidden` made its ancestor a
   scroll container.

Since that audit: §29 and §30 (the constellation and its hover), §39/§40/§45
(the second dark beat), and §42 (the state-to-state sequence) have landed, and
one horizontal-overflow defect the sequence exposed has been fixed — `MarcaTema`
was absolutely positioned with `width: 100%` and no `left`, so inside the dark
beat it hung 48px past the right edge of the document on every desktop width.

It is not at 105 of 105 and this document is the list of why. A section that
was not built is recorded here as not built; it is never reported as clean.
