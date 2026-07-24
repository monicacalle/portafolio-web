"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, isLocale } from "./config";

// Persist the choice for a year so it survives across sessions.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Sets the locale cookie that `request.ts` reads first, then the caller refreshes
 * so the new locale renders. Plain server action (no DB / auth) — safe on the
 * public page.
 */
export const setLocaleCookie = async (locale: string) => {
  // Server-action args are untrusted — only persist a locale we support.
  if (!isLocale(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
};
