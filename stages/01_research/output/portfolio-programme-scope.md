# portfolio-programme -- scope and sequencing
Run slug: `portfolio-programme`. Date: 2026-09-03. Stage: 01_research.

The agreed shape of the portfolio work, settled through a structured grilling pass on
2026-09-03. Jira holds state; this file holds the reasoning behind it.

Jira project: `MP` (monica-portfolio), team-managed,
https://tfuenteswilson.atlassian.net/browse/MP

## The decision that shapes everything
Fix first, rebuild second, and never in the other order.

The brief asked for a top-tier designer and studio-grade site. The evidence pointed
somewhere else. Of the failures on record: 35 of 56 jobs filtered her on years of
experience, a hiring manager at Kazaar could not open her graphic work, Huspy does not
consider applications without a portfolio, and Nerdio rejected her against a degree
requirement the site inflates. None of those is a craft failure. They are findability
and credibility failures, and a heavier site fixes none of them.

Corroborating: NN/g's State of UX in 2026 finds that portfolios leading with visual
polish are the ones being displaced by AI. See `_shared/product/market-research.md`
section 2.

So the craft work is not cancelled, it is sequenced behind two things: the defects, and
knowing who she actually is.

## Epic MP-1 -- Urgent credibility fixes
Owner: agent. Timebox: this week. Six tickets, MP-3 to MP-8.

Scope came from `website-fixes-research.md`, verified against the live site rather than
taken from the source documents. Two corrections to those documents came out of the
verification: the site's internationalisation is not broken (the ES/EN switcher renders
and `lang="es"` is set, so her CV claim is accurate), and the graphic portfolio PDF is
already published and reachable, which makes the remedy far smaller than proposed.

Out of scope by decision: case study depth, restructure, motion, 3D, tone rewrite.

## Epic MP-2 -- Discovery: taste, voice and direction
Owner: Monica supplies the input. Four tickets, MP-9 to MP-12.

A long-form discovery document in Spanish, then deep research driven by her answers,
then a written direction. The document lives in Drive:
https://drive.google.com/drive/folders/11JKum1ufINiVVTGaONb7SojP2UBuTt5M

The document is deliberately not a briefing. Obvious questions produce unusable answers,
so it asks oblique ones: an object she has not thrown away, a website she finds ugly and
uses anyway, which of her projects survives being stripped of colour. Part four asks her
to write at length without polishing, which is the only way to get real samples of her
voice.

That last point matters beyond tone. `.ghost/voice.md` is currently measured from
borrowed reference prose (Chimero, Godin, Zhuo) and marked provisional, because she has
nothing published of her own. Part four of the discovery document is what replaces it.

## What is deliberately not decided yet
Tooling. Motion, 3D, video and image pipelines are all downstream of what she wants to
be. Choosing React Three Fiber, Blender or a video pipeline before her answers land is
choosing before we know. A background research pass on code-driven motion and video
tooling has been run and is an input to MP-12, not a decision already taken.

Also open: whether the site foregrounds product design or graphic and brand work.
Question 33 of the discovery document asks her directly. Fallback if her answer is
ambiguous: Product Designer primary, graphic and branding a clearly separated secondary,
per the label decision already made in `market-research.md` section 3.

## Assumptions worth revisiting
- That Monica has 6 to 8 hours a week for this. The upskill report already books about
  87 hours of her time for its first four steps, plus English practice in parallel.
- That she completes a long-form document. Confirmed by Tom, who will review it and send
  it himself rather than have it arrive automatically.
- That her CV needs only a clean regeneration for now. Flagged for a proper revisit once
  the site work settles.
