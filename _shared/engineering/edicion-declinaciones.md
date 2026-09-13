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
interactive product demonstration" and the planchas satisfy it as written. The
departure is that a plancha is a single linear pan, not a state machine.

Rive would have lost on merits at $0 anyway: 882kB gzip of runtime before any
content, text baked out of `messages/` and out of `ghost`, and a blank rectangle
with JS off — on the chapter carrying her two finished case studies.

---

## 2. Declined because the content is hers, not Shopify's

The brief describes twelve chapters of Shopify product launches. This is a
portfolio. These sections have no equivalent to build.

| § | Requirement | Why it is not here |
|---|---|---|
| 54, 56, 58, 60, 62, 64 | Checkout, Operations, Shop app, B2B, Finance, Shipping chapters | Six chapters, not twelve. Her body of work supports six; padding to twelve would put single images under chapter titles. Settled with the user at the start. |
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
| 29 | Card constellation with hover | The editorial grid is uneven per §44 but there is no constellation layout. |
| 39, 40, 45, 52 | A second dark featured beat inside chapters | Every chapter currently cuts dark→light exactly once. |
| 42 | A state-to-state scrubbed product sequence | The planchas pan; they do not transition between states. |
| 67, 69 | Chapter VI media | The closing chapter is text only. |
| 73 | Inline link underline treatment | Links are styled but not to §73's spec. |
| 103 | Full data consolidation | `PLACAS`, `OBRAS` and the piece lists still live beside the components rather than inside the chapter records. |

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

**§47 / §48 — the sticky triptych is in chapter V, not chapter IV.** §48 is
about circling a physical artifact, and her printed portfolio is the only thing
on the page that genuinely is one.

**§91 — no `next/image`.** Every plate is pre-cut by `produccion/edicion.py` at
delivery size as AVIF and served static. `next/image` would re-encode files that
are already optimal and add a loader hop. Intrinsic `width`/`height` are set on
all 26 images, which is what §91 is actually protecting against.

---

## 6. The honest state

The compliance audit against all 105 sections is in the session record. At the
time of writing the build had moved from 10 passing sections to substantially
more, with the cinematic layer, the video, the geometry, the triptych, the
reveal system, the escape control and the state machine all landed since. It is
not at 105 of 105 and this document is the list of why.
