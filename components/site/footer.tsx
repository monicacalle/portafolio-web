import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import logo from "@/public/images/asset4.png";

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
