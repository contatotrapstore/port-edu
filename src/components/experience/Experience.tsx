"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { chapterTargets } from "@/lib/constants";

// Shared scroll ref — updated by animation loop, read by CameraController
const scrollRef = { current: 0 };

// Silver floating particles (optimized: 250 count, 4-segment spheres)
function Particles({ count = 250 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 100,
      z: (Math.random() - 0.5) * 15,
      speed: 0.05 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      scale: 0.015 + Math.random() * 0.04,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    data.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 1.5,
        p.y + Math.cos(t * p.speed * 0.7 + p.offset) * 0.8,
        p.z + Math.sin(t * p.speed * 0.4 + p.offset) * 0.5
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#aaaaaa" transparent opacity={0.4} />
    </instancedMesh>
  );
}

// Wireframe icosahedron
function FloatingGeo() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.08;
    ref.current.rotation.y = t * 0.12;
    ref.current.rotation.z = t * 0.05;
  });
  return (
    <mesh ref={ref} position={[5, -8, -4]}>
      <icosahedronGeometry args={[3, 1]} />
      <meshBasicMaterial color="#888888" wireframe transparent opacity={0.06} />
    </mesh>
  );
}

// Second wireframe geometry
function FloatingGeo2() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = -t * 0.06;
    ref.current.rotation.y = t * 0.1;
  });
  return (
    <mesh ref={ref} position={[-6, -35, -5]}>
      <octahedronGeometry args={[2.5, 0]} />
      <meshBasicMaterial color="#666666" wireframe transparent opacity={0.05} />
    </mesh>
  );
}

// DNA Helix in silver tones (optimized: 60 count, 4-segment spheres)
function DNAHelix() {
  const group = useRef<THREE.Group>(null);
  const count = 60;
  const meshA = useRef<THREE.InstancedMesh>(null);
  const meshB = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshA.current || !meshB.current || !group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.04;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 6 + t * 0.25;
      const y = (i / count) * 20 - 10;
      const radius = 2;

      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      dummy.scale.setScalar(0.07 + Math.sin(t + i * 0.2) * 0.02);
      dummy.updateMatrix();
      meshA.current.setMatrixAt(i, dummy.matrix);

      dummy.position.set(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
      dummy.updateMatrix();
      meshB.current.setMatrixAt(i, dummy.matrix);
    }
    meshA.current.instanceMatrix.needsUpdate = true;
    meshB.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group} position={[-5, -55, -5]}>
      <instancedMesh ref={meshA} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#aaaaaa" transparent opacity={0.35} />
      </instancedMesh>
      <instancedMesh ref={meshB} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#666666" transparent opacity={0.25} />
      </instancedMesh>
    </group>
  );
}

// Matrix rain (optimized: 80 count)
function MatrixRain({ count = 80 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 30,
      y: Math.random() * 100,
      z: -8 - Math.random() * 10,
      speed: 1 + Math.random() * 3,
      size: 0.02 + Math.random() * 0.04,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    data.forEach((p, i) => {
      let y = p.y - ((t * p.speed) % 100);
      if (y < -50) y += 100;
      dummy.position.set(p.x, y - 50, p.z);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 3, 0.1]} />
      <meshBasicMaterial color="#4ade80" transparent opacity={0.06} />
    </instancedMesh>
  );
}

// Grid plane (Tron-style) — static, no useFrame needed
function GridPlane() {
  return (
    <group position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper
        args={[200, 60, "#1a1a1a", "#141414"]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

// Floating brackets (optimized: 20 count)
function FloatingBrackets() {
  const count = 20;
  const meshes = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const brackets = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 25,
      y: Math.random() * -80,
      z: (Math.random() - 0.5) * 12,
      rotSpeed: 0.1 + Math.random() * 0.3,
      scale: 0.08 + Math.random() * 0.15,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshes.current) return;
    const t = clock.getElapsedTime();
    brackets.forEach((b, i) => {
      dummy.position.set(
        b.x + Math.sin(t * 0.2 + b.offset) * 0.5,
        b.y + Math.cos(t * 0.15 + b.offset) * 0.3,
        b.z
      );
      dummy.rotation.set(t * b.rotSpeed, t * b.rotSpeed * 0.7, 0);
      dummy.scale.setScalar(b.scale);
      dummy.updateMatrix();
      meshes.current!.setMatrixAt(i, dummy.matrix);
    });
    meshes.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshes} args={[undefined, undefined, count]}>
      <torusGeometry args={[1, 0.3, 4, 4]} />
      <meshBasicMaterial color="#555555" wireframe transparent opacity={0.08} />
    </instancedMesh>
  );
}

// Silver rain (optimized: 100 count, 4-segment spheres)
function SilverRain({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 25,
      y: Math.random() * 20,
      z: (Math.random() - 0.5) * 10,
      speed: 0.5 + Math.random() * 1.5,
      size: 0.008 + Math.random() * 0.02,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    data.forEach((p, i) => {
      let y = p.y - ((t * p.speed) % 20);
      if (y < -5) y += 20;
      dummy.position.set(p.x, y - 75, p.z);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#999999" transparent opacity={0.3} />
    </instancedMesh>
  );
}

// Camera reads from shared ref — no React re-renders
function CameraController() {
  useFrame(({ camera }) => {
    const p = scrollRef.current;
    const targetY = -p * 80;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z = 10 + Math.sin(p * Math.PI) * 2;
  });
  return null;
}

interface ExperienceProps {
  onLoaded: () => void;
  onProgress: (progress: number) => void;
}

export default function Experience({ onLoaded, onProgress }: ExperienceProps) {
  const lastReported = useRef(0);
  const canvasReadyRef = useRef(false);

  // a11y: honor reduced-motion (freeze the scene). perf: lighter scene on small/low-memory devices.
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [lowPower] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || ((navigator as { deviceMemory?: number }).deviceMemory ?? 8) < 4)
  );

  useEffect(() => {
    // Loader exits as soon as the WebGL canvas is ready — with a short minimum so the
    // boot sequence still reads, and a hard cap so the hero is never blocked for long.
    let done = false;
    let poll: ReturnType<typeof setInterval> | undefined;
    const finish = () => {
      if (done) return;
      done = true;
      if (poll) clearInterval(poll);
      clearTimeout(cap);
      onLoaded();
    };
    const min = setTimeout(() => {
      if (canvasReadyRef.current) finish();
      else poll = setInterval(() => { if (canvasReadyRef.current) finish(); }, 120);
    }, 650);
    const cap = setTimeout(finish, 1200);
    return () => {
      clearTimeout(min);
      clearTimeout(cap);
      if (poll) clearInterval(poll);
    };
  }, [onLoaded]);

  useEffect(() => {
    let target = 0;
    let current = 0;

    // Retorna a section ativa (opacity > 0.5) para decidir se deve delegar scroll.
    // NodeList é cacheado — as sections são estáticas após o mount (INP win).
    let cachedSections: HTMLElement[] | null = null;
    const getVisibleSection = (): HTMLElement | null => {
      if (!cachedSections || cachedSections.length === 0) {
        cachedSections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
      }
      for (const s of cachedSections) {
        if (parseFloat(s.style.opacity || "0") > 0.5) return s;
      }
      return null;
    };

    // Timestamp of the last user scroll input — drives the idle snap-to-chapter.
    let lastInput = 0;

    const handleWheel = (e: WheelEvent) => {
      if (document.documentElement.hasAttribute("data-modal-open")) return;
      const section = getVisibleSection();
      if (section) {
        const st = section.scrollTop;
        const max = section.scrollHeight - section.clientHeight;
        if (max > 4) {
          // Scroll down com conteúdo abaixo → deixa scroll nativo
          if (e.deltaY > 0 && st < max - 2) return;
          // Scroll up com conteúdo acima → deixa scroll nativo
          if (e.deltaY < 0 && st > 2) return;
        }
      }
      e.preventDefault();
      target += e.deltaY * 0.0006;
      target = Math.max(0, Math.min(1, target));
      lastInput = performance.now();
    };

    let touchY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };

    // PASSIVE listener: NUNCA chama preventDefault, deixa native scroll iOS rolar
    // Chapter advance só dispara quando section está NO LIMITE (top ou bottom)
    // ou quando section não tem overflow (max <= 4).
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      if (document.documentElement.hasAttribute("data-modal-open")) return;
      const section = getVisibleSection();
      const dy = touchY - e.touches[0].clientY; // dy>0: swipe up (quer scroll down)
      touchY = e.touches[0].clientY;

      if (!section) {
        target += dy * 0.0012;
        target = Math.max(0, Math.min(1, target));
        lastInput = performance.now();
        return;
      }

      const st = section.scrollTop;
      const max = section.scrollHeight - section.clientHeight;
      const noOverflow = max <= 4;
      const atBottom = st >= max - 2;
      const atTop = st <= 2;

      // Avança chapter quando: sem overflow OU (swipe up & no fundo) OU (swipe down & no topo)
      if (noOverflow || (dy > 0 && atBottom) || (dy < 0 && atTop)) {
        target += dy * 0.0012;
        target = Math.max(0, Math.min(1, target));
        lastInput = performance.now();
      }
      // Senão: deixa native scroll do iOS lidar (já está rolando porque listener é passive)
    };

    const goToChapter = (idx: number) => {
      if (idx >= 0 && idx < chapterTargets.length) target = chapterTargets[idx];
    };
    const handleGoto = (e: Event) => goToChapter((e as CustomEvent).detail.index);

    // Keyboard navigation (a11y) — arrows / PageUp-Down / Home / End jump between chapters.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.documentElement.hasAttribute("data-modal-open")) return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el?.isContentEditable) return;

      // Scroll the inner content of long sections first (parity with wheel/touch),
      // only jumping chapters once the section is at its boundary.
      const section = getVisibleSection();
      if (section) {
        const st = section.scrollTop;
        const max = section.scrollHeight - section.clientHeight;
        const step = e.key === "PageDown" || e.key === "PageUp" ? section.clientHeight * 0.85 : 140;
        if ((e.key === "ArrowDown" || e.key === "PageDown") && max > 4 && st < max - 2) {
          e.preventDefault();
          section.scrollBy({ top: step, behavior: "smooth" });
          return;
        }
        if ((e.key === "ArrowUp" || e.key === "PageUp") && max > 4 && st > 2) {
          e.preventDefault();
          section.scrollBy({ top: -step, behavior: "smooth" });
          return;
        }
      }

      let idx = 0;
      let best = Infinity;
      chapterTargets.forEach((t, i) => {
        const d = Math.abs(current - t);
        if (d < best) { best = d; idx = i; }
      });
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault(); goToChapter(Math.min(idx + 1, chapterTargets.length - 1)); break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault(); goToChapter(Math.max(idx - 1, 0)); break;
        case "Home":
          e.preventDefault(); goToChapter(0); break;
        case "End":
          e.preventDefault(); goToChapter(chapterTargets.length - 1); break;
        default:
          return;
      }
    };

    let raf: number;
    const animate = () => {
      // Idle snap: shortly after the user stops scrolling, the target eases into the
      // nearest chapter — no more half-faded "stuck between sections" states.
      if (
        lastInput > 0 &&
        performance.now() - lastInput > 240 &&
        !document.documentElement.hasAttribute("data-modal-open")
      ) {
        let nearest = chapterTargets[0];
        for (const t of chapterTargets) {
          if (Math.abs(t - target) < Math.abs(nearest - target)) nearest = t;
        }
        target += (nearest - target) * 0.07;
        if (Math.abs(nearest - target) < 0.0004) {
          target = nearest;
          lastInput = 0;
        }
      }

      // Softer glide (silkier settle than the old 0.12)
      current += (target - current) * 0.095;
      if (Math.abs(target - current) < 0.0001) current = target;

      // Update shared ref (no re-render) — 3D reads this at 60fps
      scrollRef.current = current;

      // Finer throttle: fades/drifts get ~2x more steps → visibly smoother
      if (Math.abs(current - lastReported.current) > 0.0015) {
        lastReported.current = current;
        onProgress(current);
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("gotoChapter", handleGoto);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("gotoChapter", handleGoto);
      cancelAnimationFrame(raf);
    };
  }, [onProgress]);

  return (
    <Canvas
      gl={{ antialias: !lowPower, alpha: false, powerPreference: "high-performance" }}
      dpr={lowPower ? [1, 1] : [1, 1.5]}
      frameloop={reduced ? "demand" : "always"}
      camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 200 }}
      style={{ background: "#0a0a0a" }}
      onCreated={() => { canvasReadyRef.current = true; }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <CameraController />
      <Particles count={lowPower ? 140 : 250} />
      <FloatingGeo />
      <FloatingGeo2 />
      <DNAHelix />
      <MatrixRain count={lowPower ? 48 : 80} />
      <GridPlane />
      <FloatingBrackets />
      <SilverRain count={lowPower ? 50 : 100} />
    </Canvas>
  );
}
