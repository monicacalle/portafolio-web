import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { geist, newYork } from "./fonts";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import es from "@/messages/es";

/*
  The 404 for paths that never reach a locale.

  It renders its own <html> because it has to: this file bypasses layout
  rendering by design, which is the whole reason it exists. app/[locale]/
  not-found.tsx still handles a 404 inside a known locale, where the real
  layout, header and footer are available.

  Spanish only, deliberately. There is no locale segment to read here, and
  Spanish is the default the canonical tag and the OG image already assume.
*/
export const metadata: Metadata = {
  title: `404 — ${es.notFound.title}`,
  description: es.notFound.body,
};

export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={`${geist.variable} ${newYork.variable}`}>
      <body className="grain">
        <main className="section shell notfound">
          <p className="eyebrow">404</p>
          <h1 className="notfound__title">{es.notFound.title}</h1>
          <p className="notfound__body">{es.notFound.body}</p>
          <Link className="btn" href="/">
            {es.notFound.cta}
          </Link>
        </main>
      </body>
    </html>
  );
}
