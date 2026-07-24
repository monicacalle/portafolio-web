"use client";

import { useEffect, useRef } from "react";

/*
  Negative reveal — a small liquid, viscous cursor trail that inverts whatever
  is beneath it (photographic negative).

  It's a full-viewport <canvas> above the content with CSS mix-blend-mode:
  difference AND an SVG blur+threshold "goo" filter (see .negative-reveal in
  backdrop.css and the <filter> below). We paint white shapes; the goo filter
  fuses overlapping ones into a smooth liquid body and lets separated ones pinch
  off into their own rounded drops; difference-blending the white result flips
  the page to its negative inside the shapes.

  Shapes drawn each frame:
    • a small wavy main blob at the (smoothed) cursor,
    • a short tapering tail of recent positions → the viscous trail,
    • droplets that spawn as you move, drift outward and shrink until they
      vanish → little drops separating from the main body.

  Tuning in REVEAL below. COLOR white = a true negative; a colour tints it.
*/

const REVEAL = {
  // Fill for mix-blend-mode: difference. Tuned so the cream paper (#f7f1e6)
  // inverts to the brand burgundy #4E0909: fill = cream − target = 169,232,221.
  COLOR: "169, 232, 221",
  MAIN: 60, // main blob radius (css px) — small
  WAVE: 0.10, // wavy edge amplitude (a clean wave, not noise)
  TAIL: 15, // trail length (frames of history)
  FOLLOW: 0.92, // how fast the body chases the cursor (0..1)
  FADE: 0.92, // fade in/out on enter/leave (0..1)
  MAX_DROPS: 106, // droplet cap
};

const TAU = 6.283185307179586;

export function NegativeReveal() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0,
      dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let tgtX = -9999,
      tgtY = -9999,
      curX = -9999,
      curY = -9999,
      prevX = -9999,
      prevY = -9999,
      lastTgtX = -9999,
      lastTgtY = -9999,
      iTarget = 0,
      intensity = 0;
    const onMove = (e: PointerEvent) => {
      tgtX = e.clientX;
      tgtY = e.clientY;
      iTarget = 1;
    };
    const onLeave = () => {
      iTarget = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    type Drop = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      seed: number;
      decay: number; // per-drop shrink rate (spray = fast, shed = slow)
    };
    const history: { x: number; y: number }[] = [];
    const drops: Drop[] = [];

    // a wavy circle (gentle sine wobble = wave, not noise)
    const wavyCircle = (cx: number, cy: number, r: number, t: number, seed: number) => {
      if (r <= 0.4) return;
      ctx.beginPath();
      const N = 22;
      for (let k = 0; k <= N; k++) {
        const a = (k / N) * TAU;
        const wob =
          REVEAL.WAVE *
          (Math.sin(a * 3 + t * 2.2 + seed) + 0.6 * Math.sin(a * 5 - t * 1.6 + seed * 1.7)) *
          0.6;
        const rr = r * (1 + wob);
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    };

    let raf = 0;
    let startMs = 0;
    const draw = (nowMs: number) => {
      if (!startMs) startMs = nowMs;
      const t = (nowMs - startMs) / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      if (curX < -9000 && tgtX > -9000) {
        curX = tgtX;
        curY = tgtY;
        prevX = curX;
        prevY = curY;
      }
      curX += (tgtX - curX) * REVEAL.FOLLOW;
      curY += (tgtY - curY) * REVEAL.FOLLOW;
      intensity += (iTarget - intensity) * REVEAL.FADE;

      // cursor speed drives droplet emission
      const sx = curX - prevX;
      const sy = curY - prevY;
      const speed = Math.hypot(sx, sy);
      prevX = curX;
      prevY = curY;

      if (curX > -9000) {
        history.push({ x: curX, y: curY });
        while (history.length > REVEAL.TAIL) history.shift();
      }

      // SPLASH: little drops keep flicking off the main body's wavy edge —
      // a steady bubble at rest, a burst when you move (scaled by speed). They
      // launch outward from the surface, inherit some of the cursor's motion,
      // and fade quickly.
      if (intensity > 0.4 && drops.length < REVEAL.MAX_DROPS) {
        const rate = 0.07 + Math.min(0.3, speed * 0.03); // few drops
        let emit = Math.floor(rate);
        if (Math.random() < rate - emit) emit += 1;
        const bodyR = REVEAL.MAIN * intensity;
        for (let s = 0; s < emit && drops.length < REVEAL.MAX_DROPS; s++) {
          const ang = Math.random() * TAU;
          const edge = bodyR * (1.0 + Math.random() * 0.2); // just off the edge
          const spd = 0.3 + Math.random() * 0.8; // very slow launch — creeps out
          drops.push({
            x: curX + Math.cos(ang) * edge,
            y: curY + Math.sin(ang) * edge,
            vx: Math.cos(ang) * spd + sx * 0.1,
            vy: Math.sin(ang) * spd + sy * 0.1,
            r: 4.5 + Math.random() * 4.5, // little droplets
            seed: Math.random() * 10,
            decay: 0.995, // slow fade — takes a while to vanish
          });
        }
      }

      // FAST flick: the body can't keep up, so it sheds drops LEFT BEHIND along
      // the path. They barely move and fade slowly over time.
      const moveDist =
        lastTgtX > -9000 ? Math.hypot(tgtX - lastTgtX, tgtY - lastTgtY) : 0;
      if (intensity > 0.3 && moveDist > 28 && drops.length < REVEAL.MAX_DROPS) {
        const count = Math.max(1, Math.min(4, Math.floor(moveDist / 45)));
        for (let s = 1; s <= count; s++) {
          const f = s / (count + 1);
          drops.push({
            x: lastTgtX + (tgtX - lastTgtX) * f,
            y: lastTgtY + (tgtY - lastTgtY) * f,
            vx: (Math.random() - 0.5) * 0.15, // stays roughly put
            vy: (Math.random() - 0.5) * 0.15,
            r: 6 + Math.random() * 7,
            seed: Math.random() * 10,
            decay: 0.99, // slow fade — lingers a while
          });
        }
      }
      lastTgtX = tgtX;
      lastTgtY = tgtY;

      // advance droplets: drift out, slow down, shrink, die
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.985; // low friction → they keep drifting out slowly
        d.vy *= 0.985;
        d.r *= d.decay; // shrink/fade at the drop's own rate
        if (d.r < 1.4) drops.splice(i, 1);
      }

      ctx.fillStyle = `rgb(${REVEAL.COLOR})`;

      // the viscous trail: recent positions, tapering toward the tail
      if (intensity > 0.01 && history.length) {
        const last = history.length - 1;
        for (let i = 0; i < history.length; i++) {
          const f = last === 0 ? 1 : i / last; // 0 oldest → 1 newest
          const r = REVEAL.MAIN * (0.3 + 0.7 * f) * intensity;
          wavyCircle(history[i].x, history[i].y, r, t, i * 0.7);
        }
        // main body
        wavyCircle(curX, curY, REVEAL.MAIN * intensity, t, 99);
      }

      // droplets (their own life, independent of hover fade)
      for (const d of drops) wavyCircle(d.x, d.y, d.r, t, d.seed);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <>
      {/* Goo filter: blur then ramp alpha to a hard threshold → overlapping
          shapes fuse into a smooth liquid body, separated ones become drops. */}
      <svg className="reveal-defs" aria-hidden width="0" height="0">
        <defs>
          <filter id="reveal-goo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            />
          </filter>
        </defs>
      </svg>
      <canvas ref={ref} className="negative-reveal" aria-hidden />
    </>
  );
}
