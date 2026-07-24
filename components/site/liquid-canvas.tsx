"use client";

import { useEffect, useRef } from "react";

/*
  Flowing wave field — the animated background.

  A plain 2D <canvas> driven by its own requestAnimationFrame loop (no
  react-three-fiber, so nothing can gate or stall it). It draws a few horizontal
  lines that flow like travelling sound waves. The lines are iso-contours of a
  height field: F = v*BANDS - displacement, where the displacement is a sum of
  travelling sines (low noise). Because they're contours, when two lines swing
  into each other they MERGE into one and then split again — for free, from the
  contour topology. Not interactive: the field ignores the pointer. (The hover
  "negative" reveal is a separate overlay — see negative-reveal.tsx.)

  Tuning lives in CONFIG: BANDS (line count), CYCLES (wave length), AMP (swing /
  how often lines merge), WARP (non-uniformity), NOISE (organic jitter, keep
  low), SPEED, COLOR/ALPHA.
*/

const CONFIG = {
  BANDS: 6, // draws BANDS-1 flowing lines
  CYCLES: 1.5, // horizontal wave cycles across the width (fewer = longer waves)
  AMP: 0.8, // wave swing in band-units — higher = lines cross/merge more
  WARP: 5.0, // irregular 2D swell that tilts/bunches the stack — higher = less uniform
  NOISE: 0.1, // subtle organic jitter (keep low for a clean wave)
  SPEED: 1, // global time multiplier
  GRID: 9, // marching-squares cell in px — smaller = smoother, more cost
  COLOR: "90, 26, 18", // warm burgundy-brown (rgb)
  ALPHA: 0.32, // line opacity
  WIDTH: 1.1, // line width (css px)
};

const TAU = 6.283185307179586;

// --- compact 2D Perlin noise (seeded, deterministic) -----------------------
function makeNoise(seed: number) {
  const perm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) perm[i] = i;
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const t = perm[i];
    perm[i] = perm[j];
    perm[j] = t;
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const grad = (h: number, x: number, y: number) => {
    switch (h & 3) {
      case 0:
        return x + y;
      case 1:
        return -x + y;
      case 2:
        return x - y;
      default:
        return -x - y;
    }
  };
  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const aa = p[p[X] + Y];
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];
    return lerp(
      lerp(grad(aa, x, y), grad(ba, x - 1, y), u),
      lerp(grad(ab, x, y - 1), grad(bb, x - 1, y - 1), u),
      v,
    );
  };
}

export default function LiquidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise = makeNoise(1337);

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

    let raf = 0;
    let startMs = 0;

    const draw = (nowMs: number) => {
      if (!startMs) startMs = nowMs;
      const t = ((nowMs - startMs) / 1000) * CONFIG.SPEED;

      const { BANDS, CYCLES, AMP, WARP, NOISE, GRID } = CONFIG;
      const cols = Math.ceil(W / GRID);
      const rows = Math.ceil(H / GRID);
      const nx = cols + 1;
      const ny = rows + 1;

      // Height field: rises with y (→ horizontal lines), minus a travelling
      // sound-wave displacement whose amplitude varies with height so lines
      // occasionally swing together and merge.
      const field = (px: number, py: number) => {
        const u = px / W;
        const v = py / H;
        const env = 0.75 + 0.55 * Math.sin(v * TAU * 0.9 + t * 0.5);
        let d =
          Math.sin(u * TAU * CYCLES - t * 0.9) +
          0.55 * Math.sin(u * TAU * CYCLES * 2.1 + t * 0.6 + 1.3);
        d *= env;
        d += NOISE * noise(u * 2.3 + t * 0.12, v * 2.6);
        // An IRREGULAR low-frequency swell (Perlin, not a clean sine) bends and
        // bunches the stack unevenly, so the lines are random and non-uniform —
        // they tilt, cross and merge differently everywhere. Big smooth shapes,
        // no high-frequency jitter.
        const warp =
          noise(u * 1.2 + 4.0, v * 1.5 + t * 0.05) +
          0.5 * noise(u * 2.4 - 7.0, v * 2.7 - t * 0.06) +
          0.3 * Math.sin((u * 0.7 + v * 1.2) * TAU * 0.5 + t * 0.12);
        return v * BANDS + WARP * warp - AMP * d;
      };

      const vals = new Float32Array(nx * ny);
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          vals[j * nx + i] = field(i * GRID, j * GRID);
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = CONFIG.WIDTH;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Trace every iso-line with the current ctx.strokeStyle. Reuses the
      // already-sampled `vals`, so calling it twice (dark, then light inside
      // the blob) is cheap.
      const strokeContours = () => {
        for (let level = 1; level < BANDS; level++) {
          ctx.beginPath();
          for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
              const x0 = i * GRID,
                y0 = j * GRID,
                x1 = x0 + GRID,
                y1 = y0 + GRID;
              const tl = vals[j * nx + i];
              const tr = vals[j * nx + i + 1];
              const br = vals[(j + 1) * nx + i + 1];
              const bl = vals[(j + 1) * nx + i];
              let idx = 0;
              if (tl > level) idx |= 8;
              if (tr > level) idx |= 4;
              if (br > level) idx |= 2;
              if (bl > level) idx |= 1;
              if (idx === 0 || idx === 15) continue;

              const T = () => x0 + ((level - tl) / (tr - tl)) * GRID;
              const B = () => x0 + ((level - bl) / (br - bl)) * GRID;
              const L = () => y0 + ((level - tl) / (bl - tl)) * GRID;
              const R = () => y0 + ((level - tr) / (br - tr)) * GRID;
              const seg = (ax: number, ay: number, bx: number, by: number) => {
                ctx.moveTo(ax, ay);
                ctx.lineTo(bx, by);
              };

              switch (idx) {
                case 1:
                case 14:
                  seg(x0, L(), B(), y1);
                  break;
                case 2:
                case 13:
                  seg(B(), y1, x1, R());
                  break;
                case 3:
                case 12:
                  seg(x0, L(), x1, R());
                  break;
                case 4:
                case 11:
                  seg(T(), y0, x1, R());
                  break;
                case 6:
                case 9:
                  seg(T(), y0, B(), y1);
                  break;
                case 7:
                case 8:
                  seg(T(), y0, x0, L());
                  break;
                case 5: // saddle
                  seg(T(), y0, x0, L());
                  seg(B(), y1, x1, R());
                  break;
                case 10: // saddle
                  seg(T(), y0, x1, R());
                  seg(x0, L(), B(), y1);
                  break;
              }
            }
          }
          ctx.stroke();
        }
      };

      // The flowing dark lines over the cream page.
      ctx.strokeStyle = `rgba(${CONFIG.COLOR}, ${CONFIG.ALPHA})`;
      strokeContours();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="backdrop__canvas" aria-hidden />;
}
