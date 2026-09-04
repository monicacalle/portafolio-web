import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // The only layout now lives under app/[locale], and the Next docs name that
    // exact shape as when a 404 cannot be composed from layout.js plus
    // not-found.js: an unmatched path like /nope binds to [locale] as
    // locale="nope", the layout rejects it, and a notFound() thrown from a
    // layout cannot render inside that same layout.
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
