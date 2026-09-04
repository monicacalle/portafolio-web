# voice-foundation -- research
Run slug: `voice-foundation`. Date: 2026-09-03. Stage: 01_research.

## The change in one sentence
Establish a written voice for the portfolio so that every user-facing string can be
checked against something, instead of being rewritten by feel each time.

## Assumptions and open questions, up front
1. **There are no samples of Monica's own writing in this repo.** The current Spanish
   copy is not a voice sample, it is the thing being fixed. `messages/es/about.json`
   p1 ends "uniendo sensibilidad visual, pensamiento estrategico y criterio tecnico
   para que cada decision tenga intencion y aporte valor" -- three abstract nouns in a
   row attached to no concrete claim. p3, "productos digitales que conecten con las
   personas, resuelvan necesidades reales y dejen una impresion memorable", is a
   tricolon of generalities that would fit any designer alive. That is the machine
   register the ghost gate exists to catch.
2. **Modeling her voice on a famous designer produces borrowed copy, not her voice.**
   This is the one place I am pushing back on the brief. Copy that sounds like Chris Do
   reads as imitation to exactly the audience being targeted. The research below is
   therefore used for **structure**, which is transferable, and not for **voice**,
   which is not.
3. Open: whether Monica wants to sound warm and personal or dry and precise. Not
   determinable from artifacts. Needs her own samples.

## Where this change lands
| Surface | Files |
|---|---|
| Voice definition | `.ghost/voice.md`, `.ghost/facts.md`, `.ghost/audience.md` (new) |
| Spanish copy | `messages/es/*.json`, 13 namespaces |
| English copy | `messages/en/*.json`, 13 namespaces, identical key trees |
| Structural SEO | `lib/site.ts` `PERSON.description` |
| Localized SEO | `messages/{es,en}/meta.json` |

Every copy change is a two-locale change. See `_shared/engineering/conventions.md`.

## Findings

### 1. Consistency beats authenticity (HIGH confidence)
Godin's distinction is the useful one: an audience does not want an authentic voice,
it wants a **consistent** one, a voice that "rhymes" and is recognizably the same
person each time. This is what makes voice checkable rather than a matter of taste,
and it is the premise the ghost linter operates on.

### 2. Specific enough to believe, universal enough to matter (HIGH confidence)
Handley's rule. The failure mode in the current copy is the second half without the
first: it is universal and therefore believable of anyone. Every claim needs one
concrete anchor -- a named tool, a real constraint, an actual outcome.

### 3. Write to one person, not a persona (MEDIUM confidence)
Handley's "pathological empathy": picture a specific reader, obsess over what they
are trying to accomplish and what they are afraid of. For this site the specific
reader is a design lead at a Valencia or remote-EU product company, reading on a
phone, with minutes at most.

### 4. Reviewers read in seconds, and they are designers (HIGH confidence)
Portfolio reviewers are design managers and heads of design with time "measured in
minutes or even seconds", parsing what kind of designer this is. Named mistake:
too much text in project highlights. This constrains structure more than tone.

### 5. Case studies answer three questions (HIGH confidence)
What was the problem, how did you solve it, what were the results. Written in the
same voice as the About section, without jargon. This corroborates the 5-part case
study intro already in `_shared/product/market-research.md` section 7, and the two
should stay consistent.

## Decision (human, 2026-09-03)
Approach 2 chosen, overriding the recommendation below. Monica is early-career with no
public writing yet and is still finding her narrative, so `.ghost/voice.md` is built
from **borrowed reference voices as an explicit placeholder** and replaced once she has
her own material. This is recorded so a later agent does not mistake the borrowed voice
for a considered final answer.

### Reference voices selected
| Voice | Used for | Why this one |
|---|---|---|
| **Julie Zhuo** | primary register | Product design, not visual design. Her rule is that every decision has a logical answer and a great designer communicates the principle behind the thinking. That is the same claim `market-research.md` section 2 makes about what AI cannot replace, so the voice and the positioning agree. |
| **Ann Handley** | sentence craft | Specific enough to believe, universal enough to matter. Write to one named reader, not a persona. |
| **Seth Godin** | rhythm | Short paragraphs, one idea each, declarative. Consistency over authenticity. |
| **Frank Chimero** | warmth | Plain and self-aware without preciousness. Lower confidence: less direct evidence gathered. |

Extraction rule: take **rules**, not phrasing. Copy that reproduces a Zhuo or Godin
sentence pattern verbatim reads as imitation to the exact audience being targeted.

### Known gap
No strong Spanish-language designer-voice model surfaced. The one ES-language reference
found is Emi Pasquier's voz y tono manual, which is method, not a voice to model.
Consequence: the Spanish must be **written natively against these rules**, never
translated from an English draft, or it will carry English cadence.

## Approaches considered
| Approach | Trade-off |
|---|---|
| Structure from research, voice from her own samples. | Blocked: she is early-career with nothing public yet. Revisit once she has written material. |
| **Chosen: model the voice on named designers and speakers, as a placeholder.** | Unblocks the copy work now. Risk is imitation, mitigated by extracting rules rather than phrasing, and by marking `.ghost/voice.md` as provisional. |
| Skip voice work, rewrite copy directly with ghost defaults. | Cheapest, but the linter then measures against a generic baseline, not her. Solves the slop, loses the person. |

## What I could not check
- No Spanish-language source on what Spanish recruiters read first. Findings 3 and 4
  are from English-language sources and are assumed to transfer; the market research
  doc already flags Spanish board conventions as under-verified.
- Whether the existing Spanish copy was written by Monica or generated. It reads as
  generated, but I did not confirm authorship. Git history shows it arriving in one
  commit, `6b3c691 feat(i18n)`, which is consistent with generation.
- `monicacalle.es` resolves and is indexed by search engines, which means the domain
  is live and the `SITE_URL` flip recorded in conventions is now unblocked. Verify
  before flipping.

## Sources
- [Godin on consistent voice / Crafting Your Brand Voice with Ann Handley](https://www.nickwestergaard.com/crafting-your-brand-voice-with-ann-handley/)
- [Ann Handley on voice as differentiator](https://podcast.creatorscience.com/ann-handley/)
- [Copyblogger -- Here's How Ann Handley Writes](https://copyblogger.com/ann-handley-writer-files/)
- [Dribbble -- What Design Recruiters Look For In Your UI/UX Portfolio](https://dribbble.com/resources/career/design-recruiter-portfolio-tips)
- [Dribbble -- Interview-ready product design portfolio](https://content-hub.dribbble.com/career/product-design-portfolio)
- [Format -- How To Write A Case Study For Your Design Portfolio](https://www.format.com/magazine/resources/design/how-to-write-design-case-study)
