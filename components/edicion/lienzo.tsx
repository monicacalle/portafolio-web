"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ESCENAS, type Escena, type Plano } from "@/lib/edicion/escenas";
import { prefersReducedMotion, subscribeToReducedMotion } from "@/lib/motion-gate";

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
/**
 * Section 96's lighting, done honestly for flat artwork.
 *
 * The section asks for soft key, broad fill, rim where needed, and the look of
 * "editorial photography / museum display", while warning against saturated
 * coloured point lights "unless they exist naturally in the artwork".
 *
 * Her planes are finished paintings and printed pieces. Lighting them with a
 * real rig and a MeshStandardMaterial would RELIGHT work that is already lit --
 * the copper hair has its own highlights, the poster has its own flat colour --
 * and the result would be her artwork tinted by a light she never painted.
 *
 * So the rig is what a gallery actually does to a hung picture: a soft
 * falloff with depth, so the near plane reads as under the key and the far
 * ones sit back in fill. It is a multiplier on the plane's own colour, never a
 * hue shift, so nothing is recoloured.
 */
function luzPorProfundidad(z: number) {
  // z runs roughly +1.6 (foreground) to -8.5 (environment).
  const t = Math.min(1, Math.max(0, (z + 8.5) / 10.1));
  // Key 1.0 at the front, broad fill never below 0.72 so nothing goes muddy.
  return 0.72 + t * 0.28;
}

function PlanoObra({ plano, vis }: { plano: Plano; vis: number }) {
  const tex = useLoader(THREE.TextureLoader, plano.src);
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  /*
    useLoader caches by URL, so the texture it returns is SHARED by every plane
    using that file. Configuring it in place both trips the immutability rule
    and means two planes would fight over its settings -- and this scene reuses
    the Ceguera figure and the retablo panels across chapters. Clone, configure
    the clone, dispose it on unmount.
  */
  const mapa = useMemo(() => {
    const t = tex.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    // Her work is the subject; a badly filtered edge on an alpha cut is the one
    // artefact that would read as a mistake rather than a choice.
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }, [tex]);

  useEffect(() => () => mapa.dispose(), [mapa]);

  const alto = useMemo(() => {
    const img = mapa.image as { width: number; height: number } | undefined;
    const aspecto = img && img.width ? img.height / img.width : 1;
    return plano.ancho * aspecto;
  }, [mapa, plano.ancho]);

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
        map={mapa}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
        // Section 96's key/fill, as a neutral multiplier on her own colour.
        // Grey, never a hue: a coloured light here would recolour a finished
        // painting, which the section forbids "unless [the colour] exists
        // naturally in the artwork".
        color={new THREE.Color().setScalar(luzPorProfundidad(plano.z))}
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
 * section 22 forbids full rotations, so the only rotation is a roll applied to
 * the group, inside §22's 1–6 degree band — −0.6° on entry to between 1.6° and
 * 3.2° on exit, per scene. This used to call that "a fraction of a degree",
 * which is a different claim and not one the numbers support.
 */
function EscenaCapitulo({ escena, p }: { escena: Escena; p: number }) {
  const grupo = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  /* §86: on a machine that has measured slow, the environment goes and the
     work stays. See the note beside the store in DprAdaptativo. */
  const reducido = useSyncExternalStore(suscribirLigero, leerLigero, leerLigero);
  const planos = useMemo(
    () => (reducido ? escena.planos.filter((pl) => !pl.ambiental) : escena.planos),
    [escena.planos, reducido],
  );

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

  /*
    Visibility: in over the first 15%, out over the last 15% — §94's 400–700ms
    crossfade expressed in scroll rather than in time.

    THE WINDOWS ARE WIDE ENOUGH THAT TWO SCENES CANNOT BOTH BE AT 1, and the
    8% / 12% they replace were not. The square root below is real and the
    comment that used to sit here was wrong about what it fixed: `Math.sqrt` is
    applied AFTER `Math.min(1, …)`, and the square root of 1 is 1, so the
    plateau it was supposed to remove was exactly as wide as before.

    The geometry decides the number. `p` is `(vh - top) / (height + vh)`, so
    for two contiguous chapters the scroll during which both sit at full
    strength is `(1 − in − out)·vh − out·hA − in·hB`. With 8% and 12% and this
    page's own measured heights — 300svh and 343svh for the first pair — that
    is 166px at the ilustracion→marca handover and 88px at marca→campana: two
    unrelated compositions at full strength on top of each other, which §94's
    last line rules out by name. Setting both to 0.15 makes the expression
    negative once `hA + hB` reaches `0.7 / 0.15 = 4.67` viewport-heights —
    about 2.33 each. An earlier version of this note said 1.2, which is half the
    real bound: at 1.2 each the overlap is still +0.34 vh, and at the 1.9 it
    cited as the check it is still +0.13 vh. The chapters that have scenes
    measure 300 / 343 / 375 / 661 / 773 svh, all above 2.33, so the page is
    clear today — but the number a future reader would shorten a chapter
    against has to be the true one.

    It cannot open a gap either: a scene reaches 0 at p = 1, and at that moment
    the next one's own p is vh / (hB + vh) — 0.23 for the shortest pair, well
    past the 0.15 where it has already reached 1.

    The square root stays: during the crossfade, two values ramping linearly
    sum to more than one, and squaring them back does not.
  */
  const VENTANA = 0.15;
  const bruto = Math.min(p / VENTANA, (1 - p) / VENTANA);
  const vis = bruto <= 0 ? 0 : Math.sqrt(Math.min(1, bruto));

  useFrame(() => {
    const g = grupo.current;
    if (!g) return;

    // Enter easing: 0 at p=0, 1 by p=0.20. Cubic out, so it settles rather
    // than arriving — "camera settles" in section 21's words.
    const entrada = Math.min(1, p / 0.2);
    const e = 1 - Math.pow(1 - entrada, 3);
    /*
      Exit ramp: 0 until 70%, 1 at 100%, EASED.

      §22's last line is "use cinematic easing even though timeline is scrubbed
      by scroll", and this was `(p - 0.7) / 0.3` applied raw to position,
      rotation and scale — a linear ramp, which is the one thing a cinematic
      exit is not. A cubic in-out gives it a departure and an arrival.
    */
    const rampa = Math.max(0, (p - 0.7) / 0.3);
    const salida =
      rampa < 0.5 ? 4 * rampa * rampa * rampa : 1 - Math.pow(-2 * rampa + 2, 3) / 2;

    const { dollyZ, truckX, pedestalY, giro } = escena.camara;

    /*
      §22's band is "camera position delta: 5–15% of scene scale", and these
      numbers were outside it. A scene here is about 12 world units across its
      deepest axis; the entrance began 2.2 units back (18%) and the exit ran to
      dollyZ x 2.4, up to 3.6 units (30%). Measured against 12: the entrance is
      7.5% now and the deepest exit 11%, both inside the band, and the two
      never overlap — the entrance is spent by 20% and the exit starts at 70%.
    */
    g.position.z = (1 - e) * -0.9 + salida * dollyZ * 0.9;
    g.position.x = desplazeRail + (1 - e) * 0.45 + salida * truckX;
    g.position.y = (1 - e) * -0.25 + salida * pedestalY;
    g.rotation.z = ((1 - e) * -0.6 + salida * giro) * GRADOS;
    // Depth separation increases on exit: the group scales slightly, which
    // pushes near planes out of frame faster than far ones.
    const s = 1 + salida * 0.1;
    g.scale.setScalar(s);
  });

  if (vis <= 0) return null;

  return (
    <group ref={grupo}>
      <FondoEscena color={escena.fondo} vis={vis} />
      {planos.map((pl) => (
        <PlanoObra key={pl.src + pl.z} plano={pl} vis={vis} />
      ))}
    </group>
  );
}

/**
 * The scene's own ground — brief section 20, "the scene owns the environment".
 *
 * IT WAS NEVER BUILT, and the stylesheet was written as though it had been.
 * `html[data-lienzo="activo"] .edicion-capitulo__intro` drops the chapter's
 * sampled colour to 22% alpha once the canvas has a stable frame, justified in
 * its own comment by "the scene's own background plane carries the chapter
 * colour instead" — and `escena.fondo` was declared on all five scenes and read
 * by nothing. So on a WebGL desktop 78% of each chapter's ground was simply
 * gone, backed by the page's near-black.
 *
 * A plane rather than `scene.background`, because the canvas is alpha: true and
 * two scenes overlap during §94's crossfade; a single scene-level background
 * cannot belong to both. Far enough back to sit behind every plate (the
 * deepest is z −8.5) and large enough to cover the frustum at that distance
 * with the exit's 10% group scale applied.
 */
function FondoEscena({ color, vis }: { color: string; vis: number }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null!);
  const tono = useMemo(() => new THREE.Color(color), [color]);
  useFrame(() => {
    if (mat.current) mat.current.opacity = vis;
  });
  return (
    <mesh position={[0, 0, -14]}>
      <planeGeometry args={[52, 32]} />
      <meshBasicMaterial
        ref={mat}
        color={tono}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
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
/*
  §86's OTHER bullet, on the same measurement: "reduce environmental layers".

  The section is written for mobile and mobile has no canvas here — the whole
  thing is removed below 1024px, which is §86's fourth bullet applied to every
  scene. What is left is the low end of the range where the canvas DOES run,
  and the honest signal for it is the one already being taken: a machine whose
  frames measure slow enough to drop the density is the machine that should not
  also be compositing a 15-unit blurred field behind everything else.

  So the same verdict does both. When the density drops to 1, every plane marked
  `ambiental` in escenas.ts — the five `plano-*-bg` plates — stops rendering,
  and when it recovers they come back. The chapter's colour is not lost with
  them: `FondoEscena` is a separate plane and it stays.

  A module-level store rather than context: this changes at most a couple of
  times in a session because of the hysteresis below, and a context provider
  inside the Canvas would put every scene's re-render on R3F's tree.
*/
let ligero = false;
const oyentes = new Set<() => void>();
function suscribirLigero(fn: () => void) {
  oyentes.add(fn);
  return () => {
    oyentes.delete(fn);
  };
}
function leerLigero() {
  return ligero;
}
function ponerLigero(v: boolean) {
  if (v === ligero) return;
  ligero = v;
  for (const fn of oyentes) fn();
}

/** Frames per window. ~0.75s at 60fps: long enough to average out a texture
 *  upload, short enough to react inside one chapter. */
const MUESTRA = 45;
/** Over ~22ms per frame is a machine that will not hold 60fps here. */
const LENTO = 0.022;
/** And under ~13ms is one that clearly will. The gap between the two is the
 *  hysteresis: a machine measuring between them keeps whatever it has, so the
 *  density cannot oscillate mid-scroll, which is the failure that makes an
 *  adaptive setting worse than a fixed one. */
const RAPIDO = 0.013;

function DprAdaptativo() {
  const setDpr = useThree((s) => s.setDpr);
  const muestras = useRef<number[]>([]);
  /* null until the first verdict; after that, the density in force. */
  const actual = useRef<number | null>(null);

  useFrame((_, delta) => {
    muestras.current.push(delta);
    if (muestras.current.length < MUESTRA) return;
    const media =
      muestras.current.reduce((a, b) => a + b, 0) / muestras.current.length;
    muestras.current = [];

    /*
      IT KEEPS MEASURING, and the first version did not.

      One 45-frame sample decided the session, and the first 45 frames of this
      canvas are the worst 45 it will ever run: the textures are still
      uploading. A machine busy at that moment — a cold tab, a background
      export, another window compositing — was pinned at DPR 1 until reload,
      which is a permanently softer page for a transient reason. And a machine
      that got a good verdict and then genuinely struggled had no way back.
    */
    const alto = Math.min(window.devicePixelRatio, 1.75);
    let siguiente = actual.current;
    if (media > LENTO) siguiente = 1;
    else if (media < RAPIDO) siguiente = alto;
    else if (siguiente === null) siguiente = alto;

    if (siguiente !== null && siguiente !== actual.current) {
      actual.current = siguiente;
      setDpr(siguiente);
      // The same verdict, §86's second half: density 1 means this machine is
      // not holding the frame, so the environment goes too.
      ponerLigero(siguiente === 1);
    }
  });

  return null;
}

/** Tells the shell its first stable frame has painted, for section 82. */
function AvisoPrimerCuadro({ onListo }: { onListo: (v: boolean) => void }) {
  const n = useRef(0);
  useFrame(() => {
    n.current += 1;
    // Not frame 1: the first frame can paint before textures have uploaded,
    // and fading in over a half-decoded scene is the flash section 82 forbids.
    if (n.current === 8) onListo(true);
  });

  return null;
}

export function Lienzo() {
  const progresos = useProgresos();
  const [listo, setListo] = useState(false);
  /*
    Section 81: if WebGL is unavailable the page must still feel designed, so
    ask BEFORE mounting rather than letting R3F throw into an error boundary and
    leave a hole where the scene was.

    A STORE, not a lazy state initialiser, and the difference is a hydration
    error. The server cannot ask for a WebGL context, so the answer is false
    there and true on almost every client — and a lazy initialiser gives React
    that different answer during the FIRST client render, which is the one it
    matches against the server's HTML. React logged "Hydration failed because
    the server rendered HTML didn't match the client" on every load and threw
    the whole tree away to re-render it. `useSyncExternalStore` reads the
    server snapshot during hydration and the real one immediately after, which
    is exactly what it is for.
  */
  const conContexto = useSyncExternalStore(sinCambios, haySoporte, () => false);
  const anchoSuficiente = useSyncExternalStore(suscribirAncho, hayAncho, () => false);
  /*
    THREE CONDITIONS, and two of them were missing.

    `.edicion-lienzo { display: none }` appears twice in the stylesheet — once
    below 1024px for §86 and once under `prefers-reduced-motion: reduce` for
    §87, whose comment reads "with reduced motion there is no canvas at all".
    Hiding a wrapper does not stop React mounting the `<Canvas>` inside it, so
    both readers still got a WebGL context, R3F's loop and, through
    `usePrecarga`, the scene textures. The width went first; this is the other
    one. §87's own words are the test: no canvas at all.
  */
  const conMovimiento = useSyncExternalStore(
    subscribeToReducedMotion,
    () => !prefersReducedMotion(),
    () => false,
  );
  const soportado = conContexto && anchoSuficiente && conMovimiento;
  usePrecarga(progresos, soportado);

  /*
    §82's own sentence, finally with something behind it. The stylesheet hides
    the static plate rather than removing it "because the canvas can lose its
    context at any moment, and the plate has to be there to come back" — and
    nothing was listening, so a lost context left `data-lienzo="activo"` set
    and all five chapters showing a hidden plate over a 22% ground with no
    scene behind it. A browser drops a WebGL context on its own terms: a GPU
    reset, a driver update, too many live contexts across tabs.

    ON `document`, IN THE CAPTURE PHASE, and both halves are load-bearing.
    `webglcontextlost` does not bubble, so a listener on an ancestor only ever
    sees it going DOWN — capture is the one phase it passes through. And it is
    here rather than inside the Canvas because a listener attached to
    `gl.domElement` from an R3F child never fired: measured, three's own
    handler logged "Context Lost" and ours did not run at all.

    `preventDefault` is what makes restoration possible: without it the browser
    never fires `webglcontextrestored`.
  */
  useEffect(() => {
    if (!soportado) return;
    const perdido = (e: Event) => {
      if (!(e.target instanceof HTMLCanvasElement)) return;
      e.preventDefault();
      setListo(false);
    };
    document.addEventListener("webglcontextlost", perdido, true);
    return () => document.removeEventListener("webglcontextlost", perdido, true);
  }, [soportado]);

  useEffect(() => {
    /*
      Section 82: once the canvas has a stable frame, the static fallback is
      hidden. Flagged on <html> so the CSS owns the crossfade and no component
      re-renders to do it.

      `soportado` IS A DEPENDENCY, and leaving it out was a hole with nothing
      at the bottom of it. All three of its inputs answer live — the WebGL
      store, the 1024px media query, the reduced-motion store — so the Canvas
      unmounts when a desktop window is narrowed past 1024 or the reader flips
      the system preference mid-session. `listo` never returns to false, so the
      flag stayed on <html> for the rest of the document's life, and with it on
      `html[data-lienzo="activo"] .edicion-capitulo__escena img { opacity: 0 }`
      hides the static plate of all five chapters while the intro's own ground
      sits at 22% — five chapter intros with no scene, no plate and almost no
      colour. §82's whole point is that the plate is the ground the page comes
      back to.
    */
    if (listo && soportado) {
      document.documentElement.dataset.lienzo = "activo";
    } else {
      delete document.documentElement.dataset.lienzo;
    }
    return () => {
      delete document.documentElement.dataset.lienzo;
    };
  }, [listo, soportado]);

  /*
    THE WRAPPER RENDERS ON THE SERVER TOO, and only the Canvas inside it is
    client-only.

    `soportado` is false during SSR by design — the server cannot ask for a
    WebGL context — so returning null here meant the server sent no
    `.edicion-lienzo` at all and the client sent one. React called that a
    hydration mismatch and REGENERATED THE WHOLE TREE on every load: "Hydration
    failed because the server rendered HTML didn't match the client", pointing
    at this line. An empty aria-hidden div with pointer-events: none costs
    nothing in the markup and costs a full client re-render when it is absent.
  */
  return (
    <div
      className="edicion-lienzo"
      data-listo={listo || undefined}
      aria-hidden
    >
      {soportado ? (
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
        <DprAdaptativo />
        <AvisoPrimerCuadro onListo={setListo} />
        {/*
          Section 90: only the current scene renders, and only while it is on
          screen. The brief's rule is "continue one chapter ahead" and "do not
          download all 150+ product assets at initial render" -- a scene whose
          progress is 0 or 1 is off screen, so its textures are never
          requested until the reader is within a viewport of it.

          The next scene warms below, one ahead, exactly as the section asks.
        */}
        {/*
          ONE SUSPENSE BOUNDARY PER SCENE, and that is §94's crossfade.

          §94 says that at the midpoint of a scene change "both exist" —
          outgoing 1 → 0 while incoming 0 → 1. There used to be a single
          `<Suspense fallback={null}>` around this whole map, and a scene only
          mounts once its progress leaves 0, which is exactly the boundary. Its
          three `useLoader` calls suspend on first mount, and in React 19 a
          synchronous update that suspends an already-revealed boundary hides
          the revealed content and shows the fallback — so the OUTGOING scene
          went with it and the canvas was empty for the length of a texture
          load, at every one of the five handovers.

          `usePrecarga` does not save it: `new Image()` warms the HTTP cache,
          which is not suspend-react's cache, so the first mount still
          suspends. What it does do is make that suspension short.

          The canvas being empty is worse here than a missing crossfade, because
          two other rules assume it is not: the static intro plate is at
          `opacity: 0` once `data-lienzo="activo"` and the chapter's own ground
          is at 22%, so an arriving chapter with no scene behind it is a
          near-black wash. A boundary each means the outgoing scene simply
          stays on screen while the incoming one loads.
        */}
        {ESCENAS.map((e) => {
          const p = progresos[e.clave] ?? 0;
          if (p <= 0 || p >= 1) return null;
          return (
            <Suspense key={e.clave} fallback={null}>
              <EscenaCapitulo escena={e} p={p} />
            </Suspense>
          );
        })}
      </Canvas>
      ) : null}
    </div>
  );
}


/**
 * Is this a width the canvas is FOR? — §86 and §3.
 *
 * `.edicion-lienzo { display: none }` below 1024px has been in the stylesheet
 * all along, and it was doing less than it looked like. Hiding the wrapper
 * does not stop React mounting the `<Canvas>` inside it, so a phone still got
 * a WebGL context, R3F's loop, and — through `usePrecarga`, whose own comment
 * claimed the opposite — the scene textures. Measured at 390x844 scrolled to
 * 3,000px: 184,131 bytes of plate downloaded for a renderer that is
 * `display: none`.
 *
 * 1024px, matching the stylesheet and §3's large breakpoint. It is a store
 * rather than a `useState` + effect for the same reason `haySoporte` is: the
 * server cannot answer it, so the first client render has to.
 */
const CONSULTA_ANCHO = "(min-width: 1024px)";
function suscribirAncho(fn: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(CONSULTA_ANCHO);
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
}
function hayAncho() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(CONSULTA_ANCHO).matches;
}

/**
 * Does this browser have a WebGL context to give?
 *
 * Answered once and cached, because `useSyncExternalStore` calls its snapshot
 * on every render and a function that built a fresh canvas each time would
 * both leak and churn. It never changes within a document, so `subscribe` has
 * nothing to subscribe to.
 */
let soporteCache: boolean | null = null;
function haySoporte() {
  if (soporteCache !== null) return soporteCache;
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    soporteCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    soporteCache = false;
  }
  return soporteCache;
}
function sinCambios() {
  return () => {};
}

/**
 * Section 90's preloading strategy, in the shape the brief asks for: one chapter
 * ahead, never the whole page.
 *
 * When a scene passes halfway, the NEXT scene's textures are fetched into the
 * browser cache with a plain Image(), so R3F's loader finds them warm when the
 * reader arrives. Nothing is downloaded at initial render beyond the hero.
 */
/** The planes a warm-up should actually fetch. Under §86's reduced mode the
 *  ambient plates are never rendered, so downloading them is bytes and a decode
 *  spent on a machine that has already measured slow. */
function porCalentar(escena: Escena) {
  return leerLigero() ? escena.planos.filter((pl) => !pl.ambiental) : escena.planos;
}

function usePrecarga(progresos: Record<string, number>, soportado: boolean) {
  const hecho = useRef<Set<string>>(new Set());

  /*
    §90's ladder has four rungs and this covers the first two of them:
    "Priority 2: Sidekick scene" and "after hero becomes stable: preload
    Agentic" — the first chapter's scene and the one after it. The comment here
    used to present those as a single quotation, welding two rungs together and
    assigning chapter I to both; the effect below then warmed chapter II's
    scene only once the reader was halfway through chapter I, which is a rung
    later than §90 asks.

    Idle, not immediate: the hero's own retablo and the fonts are what matter
    for the first paint, and this is explicitly the priority below them. The
    loop further down covers the other two rungs, one chapter ahead.
  */
  useEffect(() => {
    // Nothing to warm for a canvas that will not mount. `soportado` now means
    // a WebGL context AND a viewport at or above 1024px AND a reader who has
    // not asked for reduced motion — it used to mean only the first, so this
    // guard let 184kB of plate through to every phone while this comment said
    // it did not.
    if (!soportado) return;
    const iniciales = ESCENAS.slice(0, 2).filter((e) => !hecho.current.has(e.clave));
    if (iniciales.length === 0) return;
    for (const e of iniciales) hecho.current.add(e.clave);
    const calentar = () => {
      iniciales.forEach((e) =>
        porCalentar(e).forEach((pl) => {
          const img = new Image();
          img.decoding = "async";
          img.src = pl.src;
        }),
      );
    };
    const ric = window.requestIdleCallback;
    if (ric) {
      const id = ric(calentar, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(calentar, 1200);
    return () => window.clearTimeout(t);
  }, [soportado]);

  useEffect(() => {
    if (!soportado) return;
    ESCENAS.forEach((e, i) => {
      const p = progresos[e.clave] ?? 0;
      /*
        ONE CHAPTER AHEAD, and the upper bound is what makes that true.

        §90 says "continue one chapter ahead" and §80 that "only current,
        previous, and next major scene should need high-priority resources".
        The test was `p < 0.5 → return` with no ceiling, and `useProgresos`
        clamps anything scrolled fully past the viewport to exactly 1 — so
        every chapter ABOVE the reader passed it. Deep-linking or jumping to a
        late chapter warmed all of their successors at once: measured for a
        jump to #oficio, chapters I to IV all read p = 1, so marca, campana,
        producto and impreso were all fetched — 15 files, 442,055 bytes, for
        four scenes behind the reader that the render guard above will never
        mount.
      */
      if (p < 0.5 || p >= 1) return;
      const siguiente = ESCENAS[i + 1];
      if (!siguiente || hecho.current.has(siguiente.clave)) return;
      hecho.current.add(siguiente.clave);
      porCalentar(siguiente).forEach((pl) => {
        const img = new Image();
        img.decoding = "async";
        img.src = pl.src;
      });
    });
  }, [progresos, soportado]);
}
