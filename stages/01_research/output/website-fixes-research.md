# website-fixes -- research
Run slug: `website-fixes`. Date: 2026-09-03. Stage: 01_research.

Sources: `documents/website-issues-monicacalle-es.md`, `upskill/report-2026-09-03.md`
(both in `personal_projects/ai-job-search/monica/`), the live site, and this repo.
Everything below was verified today against monicacalle.es, not taken on trust.

## The change in one sentence
Fix the defects on monicacalle.es that cost Monica applications, in the order of what
they cost her.

## Findings, ordered by cost

### 1. The canonical URL points at the wrong domain. NEW, not in either doc.
monicacalle.es tells search engines that the real version of every page lives at
`portafolio-en-espa-ol-monica-calle.vercel.app`. Verified on the live site:

- `<link rel="canonical" href="https://portafolio-en-espa-ol-monica-calle.vercel.app"/>`
- `og:url` the same
- JSON-LD `url` the same, three times
- `sitemap.xml` `<loc>` the same
- `robots.txt` `Host:` and `Sitemap:` the same

Consequences. Her own domain accumulates no search authority, because she is telling
Google to credit the throwaway preview instead. A link pasted into LinkedIn or an email
carries an og:url on a different domain. The schema.org Person entity that identifies
her is bound to a Vercel subdomain.

Cause: `lib/site.ts`, `SITE_URL`. Everything else derives from that one constant.
Fix: one line. Set it to `https://monicacalle.es`. The domain is confirmed live and
serving this exact build.

### 2. Graphic portfolio card has no link. The PDF is already published.
This is the defect with a confirmed cost. Anid at Kazaar, 2026-08-14: "your graphic and
branding work is mentioned on your site but the project has no link, so I cannot open
it." Still open today.

**The website-issues doc is out of date on the remedy.** Its first step is to put the
PDF in `public/`. That is already done:

- `public/assets/portafolio-grafico.pdf` exists, 2.6 MB
- `https://monicacalle.es/assets/portafolio-grafico.pdf` returns HTTP 206,
  `application/pdf`

So a shareable URL already exists. Nobody can reach it from the page.

The real defect is one branch in `components/site/sections.tsx`. Line 227 marks the item
`inModalPdf: true`. In `renderMedia` and `renderAction` that flag swaps the anchor for
`<DialogTrigger render={<div className="card__link cursor-pointer" />}>`, so the correct
`href` is computed on line 227 and then discarded. Every other card falls through to
`<Tag href={href}>` and resolves.

Fix: keep the flipbook, and give the card a real anchor plus a visible download control
pointing at the URL that already works. Roughly ten lines, not an afternoon.

Same applies to Vibe and Voluntee, whose PDFs are also live and unreachable from the
page: `/assets/vibe-app-memoria.pdf` and `/assets/voluntee-app-slides.pdf`.

### 3. The site claims a Master. The diploma does not support it.
`messages/es/curriculum.json` line 9: "Master en Diseno Grafico, UX/UI y Diseno Web".
`messages/en/curriculum.json` line 9: "Master's in Graphic Design, UX/UI & Web Design".

The diploma says "Titulo Superior en Diseno Grafico, Conceptualizacion (UX/UI) y Diseno
Web" and, in its footer, "titulo privado de ensenanza no reglada y sin caracter oficial".
Every CV this repo generates already says postgraduate diploma, not a Master.

Risk. Nerdio rejected her against a stated design-degree requirement. Three different
names for one credential, one of them inflated, is worse than not holding a Master.
Fix: two strings, both locales, in the same change per the es/en parity rule.

### 4. No downloadable CV. Blocked, not just unwired.
"Abrir mi CV" (`messages/es/about.json`, `ctaCv`) points at the on-page anchor
`#curriculum`. Confirmed live: zero `.pdf` hrefs and zero `download` attributes on the
whole page. No CV file exists in `public/`.

The wiring is one line. It is blocked on the file: the website-issues doc says do not
publish `documents/cv/monicacalle_cv.pdf`, which is stale and carries the same banned
Master claim plus a "70% of development tasks" figure. A fresh CV has to exist first.

### 5. The Voluntee case study is strong on discovery and thin on the middle.
Its five sections cover the problem, the Double Diamond process, research findings,
competitor benchmarking, and the solution, plus four research statistics. That is real
evidence of research-led thinking.

What it does not show: flows, empty, loading and error states, or a version she rejected
and why. Aphex, strike.me and Cimpress screen for exactly that, and the upskill report
calls this the highest-leverage item in the whole search. This is production work rather
than a bug, so it is the one item here that is not a quick fix.

## Corrections to the website-issues doc
- **Internationalisation is not broken.** The doc flagged it unverified. The ES/EN
  switcher renders on the live site, twice (desktop and mobile), and `lang="es"` is set.
  The earlier fetch missed a client-side control. Her CV claim is accurate. Do not
  remove it.
- **The PDF-into-public step is already complete.** See finding 2.
- **Luxe Estate is live on the site**, so the profile that still calls it in progress is
  what needs correcting, not the site.

## Verified working, no action needed
- Open Graph image returns HTTP 200, `image/png`.
- Every other project card is a real anchor and resolves: `/proyectos/vibe`,
  `/proyectos/voluntee`, estudio-raiz.webflow.io, experiencia.monicacalle.es, Luxe
  Estate, Selvatica.
- Selvatica is present on the live site, so the deploy matches this repo.
- Accessibility basics are clean: 11 of 11 images carry alt text, no button lacks an
  accessible name, exactly one `h1`, heading order does not skip levels, and the canvas
  elements are not exposed to assistive technology.

## What I could not check
- Colour contrast and focus order against WCAG 2.2 AA. The upskill report makes this a
  study item; a real audit needs a contrast tool and keyboard testing, not a DOM query.
- One link on the page has no accessible name. I did not identify which.
- Whether the Vibe case study has the same discovery-heavy shape as Voluntee.
- Whether the corrected graphic-portfolio PDF mentioned in the doc has replaced the one
  currently deployed. The deployed file is the one with the reported copy-paste error
  unless it was re-uploaded.

## Recommended order
1. `SITE_URL` in `lib/site.ts`. One line, unblocks all search and link-preview value.
2. Anchor plus download control on the graphic portfolio card, and the same for Vibe and
   Voluntee. Restores the thing a hiring manager asked for in writing.
3. The Master string in both locales. Removes a checkable inflated claim.
4. CV download, once a clean CV file exists.
5. Voluntee case study: add flows, states, and one rejected direction.
