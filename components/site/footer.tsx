import Image from "next/image";
// Locale-aware Link: the plain next/link one drops the locale, so an English
// visitor clicking through landed back in Spanish.
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import logo from "@/public/assets/logo-claro.svg";

export function Footer() {
  const t = useTranslations("contact");
  const nav = useTranslations("nav");

  return (
    <footer className="footer shell">
      <Link href="/">
        <Image src={logo} alt={t("footer.logoAlt")} className="footer__logo" />
      </Link>
      <nav className="footer__links">
        <Link href="/#about">{nav("about")}</Link>
        <Link href="/#skills">{nav("skills")}</Link>
        <Link href="/#projects">{nav("projects")}</Link>
        <Link href="/#contact">{nav("contact")}</Link>
      </nav>
      <p className="footer__fine">{t("footer.fine")}</p>
    </footer>
  );
}
