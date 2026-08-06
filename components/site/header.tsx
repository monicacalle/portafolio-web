"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import logo from "@/public/assets/logo-oscuro.svg";
import { LanguageSwitcher } from "./language-switcher";

// Links are absolute (`/#id`) so the header works from sub-pages (case studies)
// too, not just the homepage. On the homepage they resolve to in-page anchors.
const LINKS = [
  { id: "home", key: "home" },
  { id: "about", key: "about" },
  { id: "skills", key: "skills" },
  { id: "curriculum", key: "curriculum" },
  { id: "projects", key: "projects" },
  { id: "contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view (homepage only).
  useEffect(() => {
    const ids = LINKS.map((l) => l.id);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className={`hdr ${scrolled ? "hdr--scrolled" : ""}`}>
      <div className="hdr__inner shell">
        <Link href="/#home" className="hdr__brand" onClick={() => setOpen(false)} aria-label={t("brandAria")}>
          <Image src={logo} alt={t("logoAlt")} className="hdr__logo" priority />
        </Link>

        <nav className={`hdr__nav ${open ? "hdr__nav--open" : ""}`}>
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={`/#${l.id}`}
              className={`hdr__link ${active === l.id ? "is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {t(l.key)}
            </Link>
          ))}
          <LanguageSwitcher className="hdr__lang--mobile" />
        </nav>

        <div className="hdr__actions">
          <LanguageSwitcher className="hdr__lang--desktop" />
          <button
            className={`hdr__burger ${open ? "is-open" : ""}`}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
