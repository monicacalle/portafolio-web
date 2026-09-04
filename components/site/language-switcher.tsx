"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const select = (locale: Locale) => {
    if (locale === active) return;
    startTransition(() => {
      router.replace(pathname, { locale });
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
