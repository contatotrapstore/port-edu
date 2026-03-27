"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "../experience/ScrollController";

function HeroParticles({ count = 500 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10
        ),
        speed: 0.2 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.04,
      });
    }
    return temp;
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    const opacity = 1 - scrollState.progress * 5; // Fade out quickly

    particles.forEach((particle, i) => {
      const { position, speed, offset, scale } = particle;
      dummy.position.set(
        position.x + Math.sin(time * speed + offset) * 0.5,
        position.y + Math.cos(time * speed * 0.7 + offset) * 0.3,
        position.z + Math.sin(time * speed * 0.5 + offset) * 0.4
      );
      dummy.scale.setScalar(scale * Math.max(0, opacity));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffd700" transparent opacity={0.8} />
    </instancedMesh>
  );
}

export function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollState.progress;
    // Fade out and scale down as we scroll away
    const opacity = Math.max(0, 1 - p * 5);
    groupRef.current.scale.setScalar(1 - p * 2);
    groupRef.current.position.z = -p * 10;
  });

  return (
    <group ref={groupRef}>
      <HeroParticles />

      {/* Main title */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text
          font="/fonts/inter-bold.woff2"
          fontSize={1.8}
          maxWidth={15}
          lineHeight={1}
          letterSpacing={0.05}
          textAlign="center"
          position={[0, 0.8, 0]}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          EDUARDO GOUVEIA
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </Text>
      </Float>

      {/* Subtitle */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.35}
        maxWidth={15}
        textAlign="center"
        position={[0, -0.8, 0]}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        ENGENHEIRO DE SISTEMAS
      </Text>

      {/* Decorative line */}
      <mesh position={[0, -1.5, 0]}>
        <planeGeometry args={[3, 0.005]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.5} />
      </mesh>

      {/* Tagline */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.18}
        maxWidth={10}
        textAlign="center"
        position={[0, -2, 0]}
        color="#a0a0a0"
        anchorX="center"
        anchorY="middle"
      >
        Full Stack Developer & Systems Architecture
      </Text>
    </group>
  );
}
