"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "../experience/ScrollController";
import { skills } from "@/lib/constants";

const categoryColors: Record<string, string> = {
  frontend: "#ffd700",
  backend: "#4488ff",
  devops: "#44ff88",
  tools: "#ff4488",
};

function SkillParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorArray = useMemo(() => {
    const colors = new Float32Array(skills.length * 3);
    skills.forEach((skill, i) => {
      const color = new THREE.Color(categoryColors[skill.category]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });
    return colors;
  }, []);

  // Position skills in a helix pattern
  const positions = useMemo(() => {
    return skills.map((_, i) => {
      const t = (i / skills.length) * Math.PI * 4;
      const radius = 3 + Math.sin(t * 0.5) * 1;
      return new THREE.Vector3(
        Math.cos(t) * radius,
        (i / skills.length) * 10 - 5,
        Math.sin(t) * radius
      );
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    positions.forEach((pos, i) => {
      const skill = skills[i];
      const baseScale = 0.1 + skill.level * 0.15;
      const pulse = 1 + Math.sin(time * 2 + i * 0.5) * 0.1;

      dummy.position.set(
        pos.x + Math.sin(time * 0.3 + i) * 0.2,
        pos.y + Math.cos(time * 0.4 + i) * 0.15,
        pos.z + Math.sin(time * 0.5 + i * 0.3) * 0.2
      );
      dummy.scale.setScalar(baseScale * pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, skills.length]}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        vertexColors
        roughness={0.3}
        metalness={0.7}
        emissiveIntensity={0.3}
      />
      <instancedBufferAttribute
        attach="geometry-attributes-color"
        args={[colorArray, 3]}
      />
    </instancedMesh>
  );
}

function SkillLabels() {
  const groupRef = useRef<THREE.Group>(null);

  const labelPositions = useMemo(() => {
    return skills.map((_, i) => {
      const t = (i / skills.length) * Math.PI * 4;
      const radius = 3 + Math.sin(t * 0.5) * 1;
      return new THREE.Vector3(
        Math.cos(t) * radius,
        (i / skills.length) * 10 - 5,
        Math.sin(t) * radius
      );
    });
  }, []);

  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    // Make labels face camera
    groupRef.current.children.forEach((child) => {
      child.lookAt(camera.position);
    });
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <Text
          key={skill.name}
          font="/fonts/inter-bold.woff2"
          fontSize={0.12}
          position={[
            labelPositions[i].x + 0.3,
            labelPositions[i].y + 0.2,
            labelPositions[i].z,
          ]}
          color={categoryColors[skill.category]}
          anchorX="left"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      ))}
    </group>
  );
}

// Helix connecting lines
function HelixLines() {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 4;
      const radius = 3 + Math.sin(t * 0.5) * 1;
      pts.push([
        Math.cos(t) * radius,
        (i / 200) * 10 - 5,
        Math.sin(t) * radius,
      ]);
    }
    return pts;
  }, []);

  return (
    <Line
      points={points}
      color="#ffd700"
      transparent
      opacity={0.15}
      lineWidth={1}
    />
  );
}

export function SkillsScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const p = scrollState.progress;
    const visible = p > 0.55 && p < 0.95;
    groupRef.current.visible = visible;

    if (visible) {
      // Slow rotation of entire helix
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Section title */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.8}
        position={[0, 7, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        SKILLS
      </Text>

      <mesh position={[0, 6.4, 0]}>
        <planeGeometry args={[1.5, 0.004]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.6} />
      </mesh>

      {/* Category legend */}
      {Object.entries(categoryColors).map(([cat, color], i) => (
        <group key={cat} position={[-4 + i * 2.5, -7, 3]}>
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <Text
            font="/fonts/inter-bold.woff2"
            fontSize={0.1}
            position={[0.2, 0, 0]}
            color="#666666"
            anchorX="left"
            anchorY="middle"
          >
            {cat.toUpperCase()}
          </Text>
        </group>
      ))}

      <HelixLines />
      <SkillParticles />
      <SkillLabels />
    </group>
  );
}
