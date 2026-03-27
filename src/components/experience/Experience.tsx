"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

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
function MatrixRain() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 80;

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
function SilverRain() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 100;

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

  useEffect(() => {
    const timer = setTimeout(onLoaded, 2000);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  useEffect(() => {
    let target = 0;
    let current = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      target += e.deltaY * 0.0006;
      target = Math.max(0, Math.min(1, target));
    };

    let touchY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      target += (touchY - e.touches[0].clientY) * 0.002;
      target = Math.max(0, Math.min(1, target));
      touchY = e.touches[0].clientY;
    };

    const handleGoto = (e: Event) => {
      const idx = (e as CustomEvent).detail.index;
      const targets = [0, 0.2, 0.4, 0.65, 0.85];
      if (idx >= 0 && idx < targets.length) target = targets[idx];
    };

    let raf: number;
    const animate = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0001) current = target;

      // Update shared ref (no re-render) — 3D reads this at 60fps
      scrollRef.current = current;

      // Throttle React updates — only when changed significantly
      if (Math.abs(current - lastReported.current) > 0.003) {
        lastReported.current = current;
        onProgress(current);
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("gotoChapter", handleGoto);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("gotoChapter", handleGoto);
      cancelAnimationFrame(raf);
    };
  }, [onProgress]);

  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 200 }}
      style={{ background: "#0a0a0a" }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <CameraController />
      <Particles />
      <FloatingGeo />
      <FloatingGeo2 />
      <DNAHelix />
      <MatrixRain />
      <GridPlane />
      <FloatingBrackets />
      <SilverRain />
    </Canvas>
  );
}
