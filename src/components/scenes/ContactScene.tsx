"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "../experience/ScrollController";
import { siteConfig } from "@/lib/constants";

function GoldenRain({ count = 300 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 15 - 5,
      z: (Math.random() - 0.5) * 10,
      speed: 0.3 + Math.random() * 0.7,
      size: 0.01 + Math.random() * 0.02,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      let y = p.y - (t * p.speed) % 15;
      if (y < -5) y += 15;

      dummy.position.set(
        p.x + Math.sin(t * 0.2 + i) * 0.3,
        y,
        p.z
      );
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffd700" transparent opacity={0.5} />
    </instancedMesh>
  );
}

export function ContactScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollState.progress;
    const visible = p > 0.75;
    groupRef.current.visible = visible;
  });

  return (
    <group ref={groupRef}>
      <GoldenRain />

      {/* CTA Title */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={1}
        position={[0, 2, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        VAMOS CONVERSAR
      </Text>

      {/* Gold accent */}
      <mesh position={[0, 1, 0]}>
        <planeGeometry args={[4, 0.005]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.5} />
      </mesh>

      {/* Subtitle */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.18}
        maxWidth={8}
        lineHeight={1.6}
        position={[0, -0.2, 0]}
        color="#a0a0a0"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {"Tem um projeto em mente? Vamos transformar\nsua ideia em realidade."}
      </Text>

      {/* Contact links */}
      <group position={[0, -2.5, 0]}>
        {[
          { label: "GITHUB", url: siteConfig.social.github },
          { label: "LINKEDIN", url: siteConfig.social.linkedin },
          { label: "EMAIL", url: siteConfig.social.email },
        ].map((link, i) => (
          <group key={link.label} position={[(i - 1) * 3, 0, 0]}>
            <mesh>
              <planeGeometry args={[2.2, 0.5]} />
              <meshBasicMaterial
                color="#1a1a1a"
                transparent
                opacity={0.6}
              />
            </mesh>
            <Text
              font="/fonts/inter-bold.woff2"
              fontSize={0.14}
              position={[0, 0, 0.01]}
              color="#ffd700"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.2}
            >
              {link.label}
            </Text>
          </group>
        ))}
      </group>

      {/* Footer credit */}
      <Text
        font="/fonts/inter-bold.woff2"
        fontSize={0.1}
        position={[0, -5, 0]}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {`© ${new Date().getFullYear()} Eduardo Gouveia. Built with Next.js & Three.js`}
      </Text>
    </group>
  );
}
