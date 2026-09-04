"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname } from "@/lib/i18n/navigation";
import { localePath } from "@/lib/i18n/paths";
import { LOCALES, type Locale } from "@/lib/i18n/config";

/**
 * Compact ES/EN segmented control.
 *
 * It used to set a cookie and refresh in place, which meant both languages
 * lived at one address: Google could only index one of them, and a link sent to
 * an English-reading recruiter opened in Spanish. It navigates now, so the
 * language is in the URL and every page has an address in both.
 *
 * usePathname here is next-intl's, not Next's: it returns the path WITHOUT the
 * locale prefix, so switching keeps you on the page you were reading instead of
 * sending you home.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("languageSwitcher");
  const active = useLocale() as Locale;
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const select = (locale: Locale) => {
    if (locale === active) return;
    // A full navigation rather than the router.
    //
    // usePathname never carries the hash, and next-intl's router drops it
    // whether it is passed as a string href or as a UrlObject -- tried both.
    // Switching from /en#projects landed on / and lost the reader's place, and
    // the homepage is one long scroll with anchored sections, so that is the
    // common case rather than an edge one.
    //
    // Changing language changes the whole document, so a reload is honest here,
    // and localePath is the same rule the canonical tags and the sitemap use.
    const hash = window.location.hash;
    startTransition(() => {
      window.location.href = `${localePath(locale, pathname)}${hash}`;
    });
  };

  return (
    <div className={`lang ${className ?? ""}`} role="group" aria-label={t("ariaLabel")}>
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => select(locale)}
          disabled={isPending}
          aria-pressed={locale === active}
          aria-label={locale === "en" ? t("english") : t("spanish")}
          className={`lang__btn ${locale === active ? "is-active" : ""}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
