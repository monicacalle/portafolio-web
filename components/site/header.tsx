"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/images/asset4.png";

const LINKS = [
  { href: "#home", label: "Inicio" },
  { href: "#about", label: "Sobre mí" },
  { href: "#skills", label: "Habilidades" },
  { href: "#curriculum", label: "Currículum" },
  { href: "#projects", label: "Proyectos" },
  { href: "#contact", label: "Contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
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
        <a href="#home" className="hdr__brand" onClick={() => setOpen(false)} aria-label="Mónica Calle — inicio">
          <Image src={logo} alt="Logo de Mónica Calle" className="hdr__logo" priority />
        </a>

        <nav className={`hdr__nav ${open ? "hdr__nav--open" : ""}`}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`hdr__link ${active === l.href ? "is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          className={`hdr__burger ${open ? "is-open" : ""}`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
