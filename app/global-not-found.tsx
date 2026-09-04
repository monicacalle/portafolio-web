import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { geist, newYork } from "./fonts";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";
import es from "@/messages/es";
import en from "@/messages/en";

/*
  The 404 for paths that never reach a locale.

  It renders its own <html> because it has to: the Next docs are explicit that
  this file is served with rendering skipped, so no layout runs and nothing
  above it supplies <html>, the fonts or the stylesheet.

  That same skipped rendering means there are no route params here, so the
  locale cannot be read the way every other route reads it. next-intl's proxy
  resolves it during negotiation and forwards it on x-next-intl-locale, which
  is the one locale signal that survives. Without this the page was hardcoded
  Spanish, so /en/nope answered an English visitor in Spanish under
  <html lang="es"> -- wrong content, and a screen reader announcing Spanish
  text in an English voice.
*/
const MESSAGES: Record<Locale, typeof es> = { es, en };

async function requestLocale(): Promise<Locale> {
  const forwarded = (await headers()).get("x-next-intl-locale");
  return isLocale(forwarded) ? forwarded : DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  const { notFound } = MESSAGES[await requestLocale()];
  return { title: `404 — ${notFound.title}`, description: notFound.body };
}

export default async function GlobalNotFound() {
  const locale = await requestLocale();
  const { notFound } = MESSAGES[locale];

  return (
    <html lang={locale} className={`${geist.variable} ${newYork.variable}`}>
      <body className="grain">
        <main className="section shell notfound">
          <p className="eyebrow">404</p>
          <h1 className="notfound__title">{notFound.title}</h1>
          <p className="notfound__body">{notFound.body}</p>
          {/* Home in the visitor's own locale: a plain "/" sent an English
              visitor to the Spanish homepage, losing the language twice. */}
          <Link className="btn btn--solid" href={localePath(locale, "/")}>
            {notFound.cta}
          </Link>
        </main>
      </body>
    </html>
  );
}
