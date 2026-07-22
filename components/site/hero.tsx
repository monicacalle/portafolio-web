"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import profile from "@/public/images/profilepicture.png";

/*
  The award moment.

  A giant serif "PORTA · FOLIO" splits around a portrait that rises out of the
  page. Letters stagger in with a clip + blur wipe; the portrait tracks the
  cursor with a soft spring and drifts on scroll. Everything is built on the
  reference site's own palette and type, so it reads as the same brand turned up,
  not a different site bolted on.
*/

const LEFT = ["P", "O", "R", "T", "A"];
const RIGHT = ["F", "O", "L", "I", "O"];

const letter: Variants = {
  hidden: { y: "115%", opacity: 0, filter: "blur(14px)" },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.1,
      delay: 0.35 + i * 0.06,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll parallax: portrait drifts up, title drifts down, as you leave.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Cursor parallax on the portrait (spring-smoothed).
  const px = useSpring(0, { stiffness: 60, damping: 18, mass: 0.6 });
  const py = useSpring(0, { stiffness: 60, damping: 18, mass: 0.6 });

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    px.set(nx * 26);
    py.set(ny * 26);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="hero"
    >
      <motion.div style={{ opacity: heroFade }} className="hero__inner">
        {/* Screen-reader title */}
        <h1 className="visually-hidden">Portafolio de Mónica Calle</h1>

        <motion.span style={{ y: titleY }} className="hero__word hero__word--left" aria-hidden>
          {LEFT.map((c, i) => (
            <span key={i} className="hero__letter">
              <motion.span
                className="hero__glyph"
                custom={i}
                variants={letter}
                initial="hidden"
                animate="show"
              >
                {c}
              </motion.span>
            </span>
          ))}
        </motion.span>

        <motion.div style={{ x: px, y: portraitY }} className="hero__portrait-wrap">
          <motion.div
            style={{ y: py }}
            initial={{ scale: 1.14, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hero__portrait"
          >
            <Image
              src={profile}
              alt="Retrato de Mónica Calle"
              priority
              sizes="(max-width: 720px) 60vw, 26rem"
              placeholder="blur"
            />
          </motion.div>
          <span className="hero__ring" aria-hidden />
        </motion.div>

        <motion.span style={{ y: titleY }} className="hero__word hero__word--right" aria-hidden>
          {RIGHT.map((c, i) => (
            <span key={i} className="hero__letter">
              <motion.span
                className="hero__glyph"
                custom={i + 5}
                variants={letter}
                initial="hidden"
                animate="show"
              >
                {c}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </motion.div>

      {/* Standfirst + role, revealed after the title lands */}
      <motion.div
        className="hero__meta shell"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="hero__name serif">Mónica Calle</p>
        <p className="hero__role">
          Diseñadora UX/UI &amp; Front-End · Valencia, España
        </p>
        <a className="hero__cue" href="#about" aria-label="Ir a la sección sobre mí">
          <span>Desliza</span>
          <span className="hero__cue-line" aria-hidden />
        </a>
      </motion.div>

      <span className="hero__mark" aria-hidden>
        © 2026
      </span>
    </section>
  );
}
