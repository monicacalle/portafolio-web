"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { loader } from "@/lib/loader";

// WebGL portrait — client-only, never SSR'd.
const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

const letter: Variants = {
  hidden: { y: "118%", opacity: 0, filter: "blur(16px)" },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.15, delay: i * 0.055, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // The display word is split around the portrait; both halves come from the
  // messages so the word (PORTA·FOLIO / PORT·FOLIO) adapts per language.
  const left = t("wordLeft").split("");
  const right = t("wordRight").split("");

  // Seed from the loader so we don't setState on the first commit; only
  // subscribe if the intro hasn't finished yet.
  const [ready, setReady] = useState(() => loader.isReady);
  useEffect(() => {
    if (loader.isReady) return;
    return loader.subscribe(() => setReady(true));
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -110]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const px = useSpring(0, { stiffness: 55, damping: 18, mass: 0.6 });
  const py = useSpring(0, { stiffness: 55, damping: 18, mass: 0.6 });
  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 22);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 22);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <section id="home" ref={sectionRef} onMouseMove={onMove} onMouseLeave={onLeave} className="hero">
      <motion.div style={{ opacity: heroFade }} className="hero__inner">
        <h1 className="visually-hidden">{t("hiddenTitle")}</h1>

        <motion.span style={{ y: titleY }} className="hero__word hero__word--left" aria-hidden>
          {left.map((c, i) => (
            <span key={i} className="hero__letter">
              <motion.span
                className="hero__glyph"
                custom={i}
                variants={letter}
                initial="hidden"
                animate={ready ? "show" : "hidden"}
              >
                {c}
              </motion.span>
            </span>
          ))}
        </motion.span>

        <motion.div style={{ x: px, y: portraitY }} className="hero__portrait-wrap">
          <motion.div
            style={{ y: py }}
            className="hero__portrait"
            data-cursor={t("portraitCursor")}
          >
            <HeroCanvas />
          </motion.div>
          <span className="hero__ring" aria-hidden />
          <span className="hero__badge" aria-hidden>
            {t("badge")}
          </span>
        </motion.div>

        <motion.span style={{ y: titleY }} className="hero__word hero__word--right" aria-hidden>
          {right.map((c, i) => (
            <span key={i} className="hero__letter">
              <motion.span
                className="hero__glyph"
                custom={i + left.length}
                variants={letter}
                initial="hidden"
                animate={ready ? "show" : "hidden"}
              >
                {c}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </motion.div>

      <motion.div
        className="hero__meta shell"
        initial={{ opacity: 0, y: 24 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="hero__name serif">{t("name")}</p>
        <p className="hero__role">{t("role")}</p>
        <a className="hero__cue" href="#about" aria-label={t("cueAria")} data-cursor={t("cueCursor")}>
          <span>{t("cue")}</span>
          <span className="hero__cue-line" aria-hidden />
        </a>
      </motion.div>

      <span className="hero__mark" aria-hidden>
        {t("mark")}
      </span>
    </section>
  );
}
