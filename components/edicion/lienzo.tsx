"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ESCENAS, type Escena, type Plano } from "@/lib/edicion/escenas";

/**
 * The persistent cinematic canvas — brief sections 20, 21, 22, 82, 94, 95.
 *
 * ONE fixed WebGL canvas, created once and never destroyed (section 20 says
 * this in as many words). Chapters do not get their own canvas; they get their
 * own scene inside this one, and scenes crossfade.
 *
 * It sits BEHIND the static plates rather than replacing them. Section 81
 * requires every cinematic chapter to have a static fallback that "is not a
 * broken state", and section 82 requires the canvas to start at opacity 0 and
 * fade in over ~700ms once its first stable frame is ready, never showing a
 * black flash. So the plates are the floor, the canvas is the ceiling, and if
 * WebGL never arrives the page is exactly what it was.
 */

const GRADOS = Math.PI / 180;

/** Where each scene's progress comes from: its chapter section's own --p. */
function useProgresos() {
  const [mapa, setMapa] = useState<Record<string, number>>({});

  useEffect(() => {
    const objetivos = ESCENAS.map((e) => ({
      clave: e.clave,
      el:
        e.clave === "hero"
          ? document.getElementById("edicion-hero")
          : document.getElementById(e.clave),
    })).filter((o): o is { clave: string; el: HTMLElement } => !!o.el);

    let pendiente = false;
    const leer = () => {
      pendiente = false;
      const vh = window.innerHeight;
      const siguiente: Record<string, number> = {};
      for (const { clave, el } of objetivos) {
        const r = el.getBoundingClientRect();
        // Progress across the element's own travel through the viewport, which
        // is what sections 21's percentages are expressed against.
        const recorrido = r.height + vh;
        siguiente[clave] = Math.min(1, Math.max(0, (vh - r.top) / recorrido));
      }
      setMapa(siguiente);
    };
    const alScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(leer);
    };
    leer();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, []);

  return mapa;
}

/**
 * One textured plane.
 *
 * Depth is real: the plane sits at its own z and the perspective camera does
 * the parallax. Section 22's bands (foreground 10–30%, background 2–8%) are not
 * coded as numbers anywhere — they emerge from the spacing in escenas.ts,
 * because a plane four times farther away moves a quarter as much on screen.
 */
function PlanoObra({ plano, vis }: { plano: Plano; vis: number }) {
  const tex = useLoader(THREE.TextureLoader, plano.src);
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  const alto = useMemo(() => {
    const img = tex.image as { width: number; height: number } | undefined;
    const aspecto = img && img.width ? img.height / img.width : 1;
    return plano.ancho * aspecto;
  }, [tex, plano.ancho]);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    // Her work is the subject; a wrongly-filtered edge on an alpha cut is the
    // one artefact that would read as a mistake rather than a choice.
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame((state) => {
    if (!ref.current || !mat.current) return;
    const t = state.clock.elapsedTime;
    // Section 95: ambient motion, and the page "must not feel alive in a
    // distracting videogame sense". Amplitudes are hundredths of a world unit.
    const d = plano.deriva ?? 0;
    ref.current.position.x = (plano.x ?? 0) + Math.sin(t * 0.21 + plano.z) * d;
    ref.current.position.y = (plano.y ?? 0) + Math.cos(t * 0.17 + plano.z) * d;
    mat.current.opacity = (plano.opacidad ?? 1) * vis;
  });

  return (
    <mesh ref={ref} position={[plano.x ?? 0, plano.y ?? 0, plano.z]}>
      <planeGeometry args={[plano.ancho, alto]} />
      <meshBasicMaterial
        ref={mat}
        map={tex}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * One scene, and the whole of section 21's transition grammar.
 *
 *   enter   0–20%    farther from camera, offset, lower opacity, settling
 *   calm    20–70%   still, only ambient drift, the work can be studied
 *   exit    70–100%  camera drifts, foreground leaves frame, depth separation
 *                    increases, background loses dominance
 *
 * Explicitly not a spin: section 21 forbids "spinny 3D showcase" animation and
 * section 22 forbids full rotations, so the only rotation here is a fraction of
 * a degree of roll applied to the group, inside the 1–6 degree band.
 */
function EscenaCapitulo({ escena, p }: { escena: Escena; p: number }) {
  const grupo = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  /*
    Section 2: the cinematic background may fill the viewport, but important 3D
    compositions must respect the 20/80 relationship "so foreground subjects do
    not fight with the navigation". The canvas IS full-bleed, correctly; the
    SUBJECTS are pushed into the right-hand 80% by half the rail's world width,
    so the rail never sits on top of her work.
  */
  const desplazeRail = useMemo(() => {
    if (typeof window === "undefined") return 0;
    if (window.innerWidth < 1024) return 0; // no rail below the breakpoint
    const railPx = Math.min(336, Math.max(240, window.innerWidth * 0.2));
    return (railPx / window.innerWidth) * viewport.width * 0.5;
  }, [viewport.width]);

  // Visibility: fades in over the first 8% and out over the last 12%, which is
  // the 400–700ms crossfade of section 94 expressed in scroll rather than time.
  const vis = Math.min(
    1,
    Math.min(p / 0.08, (1 - p) / 0.12) < 0 ? 0 : Math.min(p / 0.08, (1 - p) / 0.12),
  );

  useFrame(() => {
    const g = grupo.current;
    if (!g) return;

    // Enter easing: 0 at p=0, 1 by p=0.20. Cubic out, so it settles rather
    // than arriving — "camera settles" in section 21's words.
    const entrada = Math.min(1, p / 0.2);
    const e = 1 - Math.pow(1 - entrada, 3);
    // Exit ramp: 0 until 70%, 1 at 100%.
    const salida = Math.max(0, (p - 0.7) / 0.3);

    const { dollyZ, truckX, pedestalY, giro } = escena.camara;

    // Enter: begins farther from the camera and offset, arrives at rest.
    // Exit: the group drifts and separates in depth.
    g.position.z = (1 - e) * -2.2 + salida * dollyZ * 2.4;
    g.position.x = desplazeRail + (1 - e) * 0.7 + salida * truckX;
    g.position.y = (1 - e) * -0.35 + salida * pedestalY;
    g.rotation.z = ((1 - e) * -0.6 + salida * giro) * GRADOS;
    // Depth separation increases on exit: the group scales slightly, which
    // pushes near planes out of frame faster than far ones.
    const s = 1 + salida * 0.16;
    g.scale.setScalar(s);
  });

  if (vis <= 0) return null;

  return (
    <group ref={grupo}>
      {escena.planos.map((pl) => (
        <PlanoObra key={pl.src + pl.z} plano={pl} vis={vis} />
      ))}
    </group>
  );
}

/**
 * Section 80: adaptive DPR.
 *
 * Capped at 1.5–2 on high-density desktops and dropped to 1 when frames are
 * slow. Measured from real frame times rather than guessed from a user-agent
 * string, because device sniffing is wrong about exactly the machines that
 * matter.
 */
function DprAdaptativo() {
  const setDpr = useThree((s) => s.setDpr);
  const muestras = useRef<number[]>([]);
  const decidido = useRef(false);

  useFrame((_, delta) => {
    if (decidido.current) return;
    muestras.current.push(delta);
    if (muestras.current.length < 45) return;
    const media =
      muestras.current.reduce((a, b) => a + b, 0) / muestras.current.length;
    // Over ~22ms per frame is a machine that will not hold 60fps here.
    setDpr(media > 0.022 ? 1 : Math.min(window.devicePixelRatio, 1.75));
    decidido.current = true;
  });

  return null;
}

/** Tells the shell its first stable frame has painted, for section 82. */
function AvisoPrimerCuadro({ onListo }: { onListo: () => void }) {
  const n = useRef(0);
  useFrame(() => {
    n.current += 1;
    // Not frame 1: the first frame can paint before textures have uploaded,
    // and fading in over a half-decoded scene is the flash section 82 forbids.
    if (n.current === 8) onListo();
  });
  return null;
}

export function Lienzo() {
  const progresos = useProgresos();
  const [listo, setListo] = useState(false);
  const [soportado, setSoportado] = useState<boolean | null>(null);

  useEffect(() => {
    // Section 81: if WebGL is unavailable the page must still feel designed,
    // so ask before mounting rather than letting R3F throw into an error
    // boundary and leave a hole where the scene was.
    try {
      const c = document.createElement("canvas");
      setSoportado(
        !!(c.getContext("webgl2") || c.getContext("webgl")),
      );
    } catch {
      setSoportado(false);
    }
  }, []);

  useEffect(() => {
    // Section 82: once the canvas has a stable frame, the static fallback is
    // hidden. Flagged on <html> so the CSS owns the crossfade and no component
    // re-renders to do it.
    if (listo) document.documentElement.dataset.lienzo = "activo";
    return () => {
      delete document.documentElement.dataset.lienzo;
    };
  }, [listo]);

  if (!soportado) return null;

  return (
    <div
      className="edicion-lienzo"
      data-listo={listo || undefined}
      aria-hidden
    >
      <Canvas
        // dpr is driven by DprAdaptativo; this is only the starting guess.
        dpr={1}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 42 }}
        // The canvas is decoration behind the real DOM content, so it must
        // never take pointer input away from it.
        style={{ pointerEvents: "none" }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <DprAdaptativo />
          <AvisoPrimerCuadro onListo={() => setListo(true)} />
          {ESCENAS.map((e) => {
            const p = progresos[e.clave] ?? 0;
            if (p <= 0 || p >= 1) return null;
            return <EscenaCapitulo key={e.clave} escena={e} p={p} />;
          })}
        </Suspense>
      </Canvas>
    </div>
  );
}
