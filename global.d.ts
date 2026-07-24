import type messages from "@/messages/es";
import type { Locale } from "@/lib/i18n/config";

// next-intl type-safety: keys and locale are checked against the ES message set.
declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
    Locale: Locale;
  }
}
