"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "../experience/ScrollController";
import { siteConfig } from "@/lib/constants";

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.z = t * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[-3, 0, -1]}>
      <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
      <MeshDistortMaterial
        color="#1a1a1a"
        emissive="#ffd700"
        emissiveIntensity={0.15}
        roughness={0.3}
        metalness={0.8}
        distort={0.2}
        speed={2}
      />
    </mesh>
  );
}

function SmallParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      ),
      speed: 0.1 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.pos.x + Math.sin(t * p.speed + p.offset) * 0.3,
        p.pos.y + Math.cos(t * p.speed * 0.8 + p.offset) * 0.2,
        p.pos.z
      );
      dummy.scale.setScalar(0.015);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#4488ff" transparent opacity={0.4} />
    </instancedMesh>
  );
}

export function AboutScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Calculate local visibility (chapter 1: 0.2 - 0.4)
    const p = scrollState.progress;
    const localP = (p - 0.2) / 0.2;
    const visible = p > 0.1 && p < 0.5;
    groupRef.current.visible = visible;

    if (visible) {
      const fadeIn = Math.min(1, (localP) * 3);
      const fadeOut = Math.max(0, 1 - (localP - 0.7) * 3);
      const opacity = Math.min(fadeIn, fadeOut);
      groupRef.current.scale.setScalar(0.8 + opacity * 0.2);
    }
  });

  return (
    <group ref={groupRef}>
      <FloatingGeometry />
      <SmallParticles />

      {/* Section title */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.8}
        position={[2, 3, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        SOBRE MIM
      </Text>

      {/* Gold underline */}
      <mesh position={[2, 2.4, 0]}>
        <planeGeometry args={[2, 0.004]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.6} />
      </mesh>

      {/* Bio text - split into lines for 3D */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.16}
        maxWidth={6}
        lineHeight={1.6}
        position={[2, 0.5, 0]}
        color="#a0a0a0"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {siteConfig.bio}
      </Text>

      {/* Stats */}
      <group position={[2, -2, 0]}>
        {[
          { value: "5+", label: "Anos Exp." },
          { value: "20+", label: "Projetos" },
          { value: "10+", label: "Tecnologias" },
        ].map((stat, i) => (
          <group key={stat.label} position={[(i - 1) * 2.5, 0, 0]}>
            <Text
              font="/fonts/inter-bold.woff2"
              fontSize={0.5}
              color="#ffd700"
              anchorX="center"
              anchorY="middle"
            >
              {stat.value}
            </Text>
            <Text
              font="/fonts/inter-bold.woff2"
              fontSize={0.12}
              position={[0, -0.5, 0]}
              color="#666666"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.15}
            >
              {stat.label.toUpperCase()}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
}
