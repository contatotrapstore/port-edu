"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "../experience/ScrollController";
import { projects } from "@/lib/constants";

function ProjectCard({
  project,
  index,
  totalProjects,
}: {
  project: (typeof projects)[0];
  index: number;
  totalProjects: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const hovered = useRef(false);

  // Arrange cards in a slight arc
  const angle = ((index - (totalProjects - 1) / 2) * 0.3);
  const xPos = Math.sin(angle) * 8;
  const zPos = -Math.abs(Math.cos(angle)) * 3;
  const yPos = index * -4;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Subtle floating animation
    groupRef.current.position.y = yPos + Math.sin(t * 0.5 + index) * 0.15;
    groupRef.current.rotation.y = Math.sin(t * 0.3 + index * 0.5) * 0.05;
  });

  return (
    <group ref={groupRef} position={[xPos, yPos, zPos]}>
      {/* Card background */}
      <RoundedBox
        args={[5, 3, 0.1]}
        radius={0.15}
        smoothness={4}
        onPointerOver={() => (hovered.current = true)}
        onPointerOut={() => (hovered.current = false)}
      >
        <meshStandardMaterial
          color="#111111"
          roughness={0.5}
          metalness={0.3}
          emissive="#ffd700"
          emissiveIntensity={0.02}
        />
      </RoundedBox>

      {/* Gold accent border top */}
      <mesh position={[0, 1.45, 0.06]}>
        <planeGeometry args={[4.6, 0.015]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.6} />
      </mesh>

      {/* Project title */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.28}
        position={[0, 0.8, 0.1]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        {project.title}
      </Text>

      {/* Description */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.11}
        maxWidth={4}
        lineHeight={1.5}
        position={[0, 0, 0.1]}
        color="#a0a0a0"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {project.description}
      </Text>

      {/* Tech tags */}
      <group position={[0, -1, 0.1]}>
        {project.tech.slice(0, 4).map((tech, i) => (
          <group key={tech} position={[(i - 1.5) * 1.1, 0, 0]}>
            <RoundedBox args={[1, 0.25, 0.02]} radius={0.08} smoothness={4}>
              <meshBasicMaterial
                color="#1a1a1a"
                transparent
                opacity={0.8}
              />
            </RoundedBox>
            <Text
              font="/fonts/inter-bold.woff2"
              fontSize={0.08}
              position={[0, 0, 0.02]}
              color="#ffd700"
              anchorX="center"
              anchorY="middle"
            >
              {tech}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
}

export function ProjectsScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollState.progress;
    const visible = p > 0.3 && p < 0.75;
    groupRef.current.visible = visible;

    if (visible) {
      // Scroll through projects
      const localP = (p - 0.4) / 0.25;
      const scrollY = localP * (projects.length - 1) * 4;
      groupRef.current.position.y = scrollY;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Section title */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.8}
        position={[0, 3, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        PROJETOS
      </Text>

      <mesh position={[0, 2.4, 0]}>
        <planeGeometry args={[2, 0.004]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.6} />
      </mesh>

      {projects.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={i}
          totalProjects={projects.length}
        />
      ))}
    </group>
  );
}
