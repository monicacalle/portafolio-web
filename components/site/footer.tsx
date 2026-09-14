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
        {/* These pointed at /#about /#skills /#projects /#contact, which the
            Edition deleted. The homepage's only ids are its six chapter
            anchors, so all four links landed at the top of the page and did
            nothing -- on the case-study routes, which is where a recruiter
            actually reads. */}
        <Link href="/#ilustracion">{nav("ilustracion")}</Link>
        <Link href="/#marca">{nav("marca")}</Link>
        <Link href="/#producto">{nav("producto")}</Link>
        <Link href="/#oficio">{nav("oficio")}</Link>
      </nav>
      <p className="footer__fine">{t("footer.fine")}</p>
    </footer>
  );
}
