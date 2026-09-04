# Engineering conventions
Last updated: 2026-09-03

The rules that hold for every change to this site. Read this before planning an edit.

## Copy is never in components
All user-facing strings live in `messages/es/` and `messages/en/`, 13 JSON namespaces
per locale plus an `index.ts` barrel that imports them. The two locales carry
**identical file sets and identical key trees**.

- Adding or renaming a key means editing both `messages/es/<ns>.json` and
  `messages/en/<ns>.json` in the same change. A key present in one locale only is a bug
  that shows as a missing-message error at runtime, not at build.
- Adding a whole namespace means adding the import and the object entry to
  **both** `messages/es/index.ts` and `messages/en/index.ts`.
- Spanish is the source language. English is the translation, not a separate rewrite.

## Locale routing
Cookie-based, with no `[locale]` route segment. `lib/i18n/config.ts` is the single
source of truth: `LOCALES` (`es`, `en`), `DEFAULT_LOCALE` (`es`), `LOCALE_COOKIE_NAME`,
and the BCP-47 `OG_LOCALE` map used for `<html lang>` and OpenGraph.

## SEO has two homes, on purpose
- `lib/site.ts` holds the structural, non-localized truth: `SITE_URL` and the `PERSON`
  record feeding schema.org. Sitemap, robots, canonical tag, and JSON-LD all follow
  `SITE_URL`.
- The user-facing title and description are localized in `messages/{es,en}/meta.json`
  and consumed by `generateMetadata` and the JSON-LD in `app/page.tsx`. The `PERSON`
  fields are a structural fallback mirroring the ES positioning.
- Changing how Monica is labelled therefore touches **both** homes. Check
  the positioning research in the private mirror before changing a label.
- **Pending, decided but not applied**: the real domain is `monicacalle.es`. `SITE_URL`
  still points at `portafolio-en-espa-ol-monica-calle.vercel.app`. Flip it to
  `https://monicacalle.es` once the domain resolves on Vercel, and sitemap, robots, the
  canonical tag, and JSON-LD all follow from that one line. Flipping it before the
  domain is live publishes canonical URLs that 404.

## Copy goes through ghost
No user-facing string ships in the wording a model first produced.

1. Draft or change the Spanish. Spanish is the source; English is translated from it.
2. Run it through `ghost` (`/ghost:write` for new copy, `/ghost:edit` for existing) so
   the slop linter catches machine-like phrasing before it reaches the site.
3. The voice the linter measures against lives in the private mirror, not here.
   That is the one home for tone and rhythm -- do not restate voice rules here.
4. Then apply the es/en parity rules above.

This is a hard gate, not a preference. The market research is explicit that what
differentiates her is thinking, not surface polish, and copy that reads as generated
undercuts exactly that claim.

## Deployment
Push to `main` on `github.com:monicacalle/portafolio-web`; Vercel builds from there.

## Components
- `components/site/` is hand-written and owned by this project.
- `components/ui/` is shadcn output. Regenerate it, never hand-edit it.
- Styles are split by concern in `app/`: `globals.css`, `site.css`, `sections.css`,
  `case-study.css`, `award.css`, `backdrop.css`.
- Never hand-edit generated files: `pnpm-lock.yaml`, `next-env.d.ts`,
  `tsconfig.tsbuildinfo`, and the `<!-- BEGIN:nextjs-agent-rules -->` block in
  `AGENTS.md`. (Derived from the repo, not asked at setup -- correct it if wrong.)

## Checks
`pnpm lint` and `pnpm build`. **There is no test suite**, so "it builds" is not
"it works" -- anything visual or interactive needs a browser check before it ships.
