// Locale-aware Link: the plain next/link one drops the locale, so an English
// visitor clicking through landed back in Spanish.
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/site/header";

/*
  404. Deliberately a server component with no client-side anything: the
  previous behaviour was Next's built-in error page, which ships an empty
  <body> and puts its message in the JS payload, so a visitor with slow or
  blocked JavaScript got a blank white screen with no way out. It also carried
  no lang attribute and was English-only in both locales.

  This matters more since Epic 1, not less: the canonical domain changed and two
  new routes were advertised in the sitemap, so stale and mistyped URLs are
  likelier for a while.
*/
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <>
      <Header />
      <main className="section shell notfound">
        <p className="eyebrow">404</p>
        <h1 className="notfound__title">{t("title")}</h1>
        <p className="notfound__body">{t("body")}</p>
        <Link className="btn" href="/">
          {t("cta")}
        </Link>
      </main>
    </>
  );
}
