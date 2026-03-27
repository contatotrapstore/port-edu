"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { SceneManager } from "./SceneManager";
import { ScrollController } from "./ScrollController";
import { Preload } from "@react-three/drei";

interface ExperienceProps {
  onLoaded: () => void;
  onProgress: (progress: number) => void;
}

export default function Experience({ onLoaded, onProgress }: ExperienceProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Give a brief delay for WebGL context setup
    const timer = setTimeout(() => {
      setReady(true);
      onLoaded();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 200 }}
      style={{ background: "#0a0a0a" }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 15, 50]} />

      <Suspense fallback={null}>
        <ScrollController onProgress={onProgress} />
        <SceneManager />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
