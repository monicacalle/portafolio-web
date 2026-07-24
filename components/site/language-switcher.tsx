"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleCookie } from "@/lib/i18n/actions";
import { LOCALES, type Locale } from "@/lib/i18n/config";

/**
 * Compact ES/EN segmented control. Sets the locale cookie that request.ts reads
 * first (via a server action), then refreshes so the new locale renders. No DB /
 * auth — safe on the public page.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("languageSwitcher");
  const active = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const select = (locale: Locale) => {
    if (locale === active) return;
    startTransition(async () => {
      await setLocaleCookie(locale);
      router.refresh();
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
