"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "./ScrollController";
import { HeroScene } from "../scenes/HeroScene";
import { AboutScene } from "../scenes/AboutScene";
import { ProjectsScene } from "../scenes/ProjectsScene";
import { SkillsScene } from "../scenes/SkillsScene";
import { ContactScene } from "../scenes/ContactScene";
import { GradientBackground } from "../effects/GradientBackground";
import { PostProcessingEffects } from "../effects/PostProcessing";

// Camera keyframes for each chapter transition
const cameraPositions = [
  new THREE.Vector3(0, 0, 10),      // Hero
  new THREE.Vector3(0, -15, 8),     // About
  new THREE.Vector3(0, -35, 10),    // Projects
  new THREE.Vector3(0, -60, 8),     // Skills
  new THREE.Vector3(0, -80, 10),    // Contact
];

const cameraLookAts = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, -15, 0),
  new THREE.Vector3(0, -35, 0),
  new THREE.Vector3(0, -60, 0),
  new THREE.Vector3(0, -80, 0),
];

export function SceneManager() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const tempVec = useRef(new THREE.Vector3());
  const tempLookAt = useRef(new THREE.Vector3());

  // Track mouse for parallax
  useFrame(({ camera }) => {
    if (typeof window !== "undefined") {
      const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", handleMouseMove);
      // Clean up inside ref to avoid re-adding
    }
  });

  useFrame(({ camera }) => {
    const p = scrollState.progress;

    // Determine which two keyframes to interpolate between
    const ranges = [0, 0.2, 0.4, 0.65, 0.85, 1.0];
    let fromIdx = 0;
    let toIdx = 1;
    let t = 0;

    for (let i = 0; i < ranges.length - 1; i++) {
      if (p >= ranges[i] && p < ranges[i + 1]) {
        fromIdx = Math.min(i, cameraPositions.length - 1);
        toIdx = Math.min(i + 1, cameraPositions.length - 1);
        t = (p - ranges[i]) / (ranges[i + 1] - ranges[i]);
        break;
      }
    }
    if (p >= 1) {
      fromIdx = cameraPositions.length - 1;
      toIdx = cameraPositions.length - 1;
      t = 1;
    }

    // Smooth easing
    const eased = t * t * (3 - 2 * t); // smoothstep

    // Interpolate camera position
    tempVec.current.lerpVectors(
      cameraPositions[fromIdx],
      cameraPositions[toIdx],
      eased
    );

    // Add mouse parallax
    tempVec.current.x += mouseRef.current.x * 0.3;
    tempVec.current.y += mouseRef.current.y * 0.15;

    // Apply with extra smoothing
    camera.position.lerp(tempVec.current, 0.06);

    // Interpolate look-at
    tempLookAt.current.lerpVectors(
      cameraLookAts[fromIdx],
      cameraLookAts[toIdx],
      eased
    );
    camera.lookAt(tempLookAt.current);
  });

  return (
    <>
      <GradientBackground />

      {/* Ambient light */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.3} color="#ffd700" />
      <pointLight position={[-5, -5, 5]} intensity={0.2} color="#4488ff" />

      {/* Scenes positioned along Y axis */}
      <group position={[0, 0, 0]}>
        <HeroScene />
      </group>
      <group position={[0, -15, 0]}>
        <AboutScene />
      </group>
      <group position={[0, -35, 0]}>
        <ProjectsScene />
      </group>
      <group position={[0, -60, 0]}>
        <SkillsScene />
      </group>
      <group position={[0, -80, 0]}>
        <ContactScene />
      </group>

      <PostProcessingEffects />
    </>
  );
}
