"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import profile from "@/public/images/profilepicture.png";
import { loader } from "@/lib/loader";
import { prefersReducedMotion } from "@/lib/motion-gate";

/*
  The 3D centerpiece — progressive enhancement.

  The real portrait is ALWAYS rendered as a plain <Image> base layer, so the
  arch is never empty. A WebGL plane fades in on top of it: a displacement
  shader that ripples from the cursor, splits RGB on the wave, keeps a slow
  idle flow, and enters with a soft rise + zoom. If WebGL is missing or the
  canvas errors, the photo underneath simply stays visible.
*/

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

const vertex = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  void main() {
    vUv = uv;
    vec3 p = position;
    float d = distance(uv, uMouse);
    float ripple = sin(d * 16.0 - uTime * 2.2) * 0.028 * uHover * smoothstep(0.55, 0.0, d);
    float idle = sin(uv.y * 6.0 + uTime * 0.6) * 0.004;
    p.z += ripple + idle;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uEnter;   // 0 hidden -> 1 shown
  uniform vec2 uCover;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec2 cover(vec2 uv, vec2 s){ return (uv - 0.5) / s + 0.5; }

  void main() {
    vec2 buv = cover(vUv, uCover);

    // enter: rise up + slight settle-zoom
    float e = clamp(uEnter, 0.0, 1.0);
    vec2 euv = buv + vec2(0.0, (1.0 - e) * 0.07);
    float zoom = mix(1.06, 1.0, e);
    euv = (euv - 0.5) / zoom + 0.5;

    // cursor ripple
    float d = distance(vUv, uMouse);
    float wave = sin(d * 22.0 - uTime * 2.4) * smoothstep(0.55, 0.0, d) * uHover;
    vec2 disp = normalize(vUv - uMouse + 0.0001) * wave * 0.03;
    vec2 rShift = vec2(0.006, 0.0) * (0.4 + uHover);

    float r = texture2D(uTex, euv + disp + rShift).r;
    float g = texture2D(uTex, euv + disp).g;
    float b = texture2D(uTex, euv + disp - rShift).b;
    vec3 col = vec3(r, g, b);

    col = mix(col, col * vec3(1.05, 0.99, 0.93), 0.4);
    col += wave * vec3(0.22, 0.05, 0.02);
    float grain = hash(vUv * vec2(900.0, 1300.0) + uTime) - 0.5;
    col += grain * 0.05;
    float vig = smoothstep(1.2, 0.35, distance(vUv, vec2(0.5)));
    col *= mix(0.86, 1.0, vig);

    gl_FragColor = vec4(col, e);
  }
`;

function Plane({ src, aspect }: { src: string; aspect: number }) {
  const tex = useTexture(src);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const hover = useRef(0);
  const enterTarget = useRef(0);

  useEffect(() => {
    // Configuring a THREE texture means mutating it. There is no immutable
    // form of this in three.js, and useTexture returns the shared object on
    // purpose so the settings apply for every consumer.
    // eslint-disable-next-line react-hooks/immutability
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
  }, [tex]);

  const planeAspect = viewport.width / viewport.height;
  const cover: [number, number] =
    planeAspect > aspect ? [1, planeAspect / aspect] : [aspect / planeAspect, 1];

  const uniforms = useRef({
    uTex: { value: tex },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uEnter: { value: 0 },
    uCover: { value: new THREE.Vector2(cover[0], cover[1]) },
  });

  useEffect(() => {
    uniforms.current.uTex.value = tex;
    uniforms.current.uCover.value.set(cover[0], cover[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tex, cover[0], cover[1]]);

  useEffect(() => {
    const el = document.getElementById("hero-canvas");
    if (!el) return;
    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.current.set((ev.clientX - r.left) / r.width, 1 - (ev.clientY - r.top) / r.height);
      hover.current = 1;
    };
    const onLeave = () => (hover.current = 0);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    // begin the entrance after the preloader; guaranteed to run either way
    const start = () => (enterTarget.current = 1);
    let unsub: (() => void) | undefined;
    if (loader.isReady) setTimeout(start, 150);
    else unsub = loader.subscribe(start);
    // hard safety net: never stay hidden
    const safety = setTimeout(start, 4000);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      clearTimeout(safety);
      unsub?.();
    };
  }, []);

  // Reduced motion is read once: the shader still renders the portrait, it
  // just stops rippling. Backgrounded tabs skip the work entirely, since a
  // WebGL shader is the most expensive thing on the page to run unseen.
  const still = prefersReducedMotion();

  useFrame((_, delta) => {
    if (still || document.hidden) return;
    const u = uniforms.current;
    const dt = Math.min(delta, 0.05);
    u.uTime.value += dt;
    u.uMouse.value.lerp(mouse.current, 0.08);
    u.uHover.value += (hover.current - u.uHover.value) * 0.06;
    u.uEnter.value += (enterTarget.current - u.uEnter.value) * dt * 2.2;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 40, 56]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        // A ref, not a memo: shaderMaterial needs one stable object whose
        // .value fields useFrame mutates every frame. Tried useMemo first and
        // it is worse, because the compiler then treats the object as
        // immutable and rejects the per-frame writes that are the entire
        // point. Reading .current here is deliberate.
        // eslint-disable-next-line react-hooks/refs
        uniforms={uniforms.current}
        transparent
      />
    </mesh>
  );
}

export default function HeroCanvas({
  src = "/images/profilepicture.png",
  aspect = 832 / 1248,
}: {
  src?: string;
  aspect?: number;
}) {
  const [gl, setGl] = useState<"pending" | "on" | "off">("pending");
  useEffect(() => {
    // WebGL support cannot be probed during SSR: it needs a real canvas. The
    // component renders the plain <Image> fallback first and upgrades on the
    // client, which is the progressive enhancement described at the top of
    // this file, so the extra render is intended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGl(supportsWebGL() ? "on" : "off");
  }, []);

  return (
    <div id="hero-canvas" className="hero__canvas">
      {/* Base layer — the real photo, always visible. */}
      <Image
        className="hero__fallback-img"
        src={profile}
        alt="Retrato de Mónica Calle"
        priority
        sizes="(max-width: 720px) 60vw, 26rem"
        placeholder="blur"
      />

      {/* Enhancement — the shader, fading in over the photo. */}
      {gl === "on" && (
        <Canvas
          className="hero__gl"
          orthographic
          camera={{ position: [0, 0, 1], zoom: 1 }}
          gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false }}
          dpr={[1, 2]}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          onError={() => setGl("off")}
        >
          <Suspense fallback={null}>
            <Plane src={src} aspect={aspect} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
