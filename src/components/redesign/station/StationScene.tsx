"use client";

import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { STATION_CHAT, STATION_POINTS, STATION_SCREEN, STATION_TICKET, STATION_TICKETS, pointOnScreen } from "./station";

/**
 * Bancada Passagens Europa, em tempo real.
 *
 * Uma bancada de engenharia num estúdio escuro, fotografada como produto:
 * luz principal macia, contorno frio por trás, uma luminária de trabalho e
 * nenhum brilho de efeito. A marca entra como desenho de móvel (pés marfim,
 * braços voltados para o ponto âmbar sob o tampo). Três objetos contam o
 * projeto: o monitor com o CRM, o celular com a conversa que gerou o lead e
 * o bilhete impresso. Ao abrir a estação, os bilhetes colados no monitor
 * entram na tela e viram pontos exploráveis.
 */

export type StationMode = "overview" | "focus";

/** Posição na tela (px do canvas) de cada ponto e se ele já está disponível. */
export type StationMarkSpot = { n: number; x: number; y: number; on: boolean };

/** A cena avisa a página: onde desenhar o rótulo e os pontos, e o hover. */
export type StationSignals = {
  onTag?: (x: number, y: number) => void;
  onMarks?: (marks: StationMarkSpot[]) => void;
  onHover?: (hover: boolean) => void;
};

const INK = "#0e1716";
const IVORY = "#e9e6df";
const AMBER = "#f2b33d";

const BENCH = { width: 1.6, depth: 0.72, top: 0.75, thick: 0.04 };
const POST = 0.045;
const POST_X = BENCH.width / 2 - 0.07;
const POST_Z = 0.28;
const POST_H = BENCH.top + 0.06;
/** Altura do ponto âmbar e dos braços dos pés, sob o tampo. */
const CORE_Y = 0.52;
const SCREEN_H = STATION_SCREEN.width / STATION_SCREEN.aspect;
const MONITOR: [number, number, number] = [-0.06, 1.1, -0.13];
const PHONE: [number, number, number] = [0.4, BENCH.top, -0.04];

const INTRO_HOLD = 0.9;
const INTRO_SECONDS = 3;
const INTRO_BACK = new THREE.Vector3(0, 0.2, 1.2);
const FOCUS_SECONDS = 1.5;
const BACK_SECONDS = 1.2;
const POINT_SECONDS = 0.9;
/** Bilhetes: saem quando a câmera está chegando, um depois do outro. */
const TICKET_DELAY = 1.15;
const TICKET_STAGGER = 0.11;
const TICKET_FLIGHT = 0.9;
/** O ponto do assistente aparece por último: é o que não existia antes. */
const LAST_POINT_AT = TICKET_DELAY + STATION_TICKETS.length * TICKET_STAGGER + TICKET_FLIGHT + 0.35;

type Pose = { pos: THREE.Vector3; target: THREE.Vector3; fov: number };

/**
 * Desktop: o texto mora no alto à esquerda, sobre a parede; a bancada desce
 * em diagonal à direita, perto, com o monitor ao lado do texto. Em foco,
 * monitor e celular à direita, painel do case à esquerda. Retrato: de frente,
 * a bancada na metade de cima.
 */
export function posesFor(aspect: number): { overview: Pose; focus: Pose } {
  if (aspect <= 1) {
    return {
      overview: { pos: new THREE.Vector3(0.05, 1.62, 5.3), target: new THREE.Vector3(0.06, 0.28, 0), fov: 40 },
      focus: { pos: new THREE.Vector3(0.1, 1.2, 2.2), target: new THREE.Vector3(0.1, 0.92, -0.13), fov: 40 },
    };
  }
  const narrow = Math.max(0, 1.6 - aspect);
  return {
    overview: { pos: new THREE.Vector3(-1.4, 1.36, 2.1), target: new THREE.Vector3(-0.58, 0.85, 0), fov: 30.5 },
    focus: { pos: new THREE.Vector3(-0.55, 1.18, 1.7 + narrow * 2.2), target: new THREE.Vector3(-0.3 - narrow * 0.3, 1.02, -0.13), fov: 30 },
  };
}

/**
 * Pose para um ponto selecionado: mais perto, o ponto à direita do centro e,
 * na vertical, a meio caminho do centro da tela (o monitor continua no quadro).
 */
function pointPose(n: number, focus: Pose): Pose {
  const [x, y] = pointOnScreen(n);
  const aim = new THREE.Vector3(MONITOR[0] + x - 0.12, MONITOR[1] + y * 0.5, MONITOR[2] + 0.012);
  const back = focus.pos.clone().sub(focus.target).multiplyScalar(0.72);
  return { pos: aim.clone().add(back), target: aim, fov: focus.fov };
}

const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

/**
 * Segundos de um relógio que não para. O relógio do R3F volta a zero quando o
 * frameloop muda (a cena pausa fora da tela), e os movimentos em curso
 * guardam o instante em que começaram: com ele, a câmera saltava ao voltar.
 */
const clockSeconds = () => performance.now() / 1000;

/* ------------------------------------------------------------------ */
/* Texturas.                                                          */
/* ------------------------------------------------------------------ */

/**
 * Texturas de material pré-geradas com o mesmo desenho que antes era feito em
 * canvas a cada visita (cerca de 3 s de CPU numa máquina lenta). Piso, parede
 * e feltro ficam sem perdas: o ruído deles varia cerca de 1 nível de cor.
 */
const TEX = {
  floor: "/images/redesign/station/tex-floor.webp",
  wall: "/images/redesign/station/tex-wall.webp",
  felt: "/images/redesign/station/tex-felt.webp",
  oak: "/images/redesign/station/tex-oak.webp",
  noteAmber: "/images/redesign/station/tex-note-amber.webp",
  noteIvory: "/images/redesign/station/tex-note-ivory.webp",
};

/**
 * createImageBitmap decodifica fora da thread principal. Para virar textura,
 * a imagem já sai invertida em Y (o WebGL ignora o flipY em ImageBitmap).
 */
class TextureBitmapLoader extends THREE.ImageBitmapLoader {
  constructor(manager?: THREE.LoadingManager) {
    super(manager);
    this.setOptions({ imageOrientation: "flipY", premultiplyAlpha: "none" });
  }
}

/** Para desenhar num canvas 2D (o papel dos bilhetes): sem inverter. */
class CanvasBitmapLoader extends THREE.ImageBitmapLoader {
  constructor(manager?: THREE.LoadingManager) {
    super(manager);
    this.setOptions({ imageOrientation: "from-image", premultiplyAlpha: "none" });
  }
}

function bitmapTexture(bitmap: ImageBitmap, anisotropy: number, repeatX: number, repeatY: number) {
  const texture = new THREE.Texture(bitmap);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  if (repeatX > 0) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
  }
  texture.needsUpdate = true;
  return texture;
}

/** Textura de um arquivo: carrega sem bloquear e é descartada ao sair. */
function useBitmapTexture(src: string, anisotropy: number, repeatX = 0, repeatY = 0) {
  const bitmap = useLoader(TextureBitmapLoader, src);
  const texture = useMemo(() => bitmapTexture(bitmap, anisotropy, repeatX, repeatY), [bitmap, anisotropy, repeatX, repeatY]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Teclado: teclas grafite sobre alumínio (desenho curto, fica em canvas). */
function keyboardTexture() {
  return canvasTexture(768, 256, (ctx) => {
    ctx.fillStyle = "#8f9496";
    ctx.fillRect(0, 0, 768, 256);
    const keyW = 700 / 14;
    [14, 14, 13, 12, 11].forEach((count, r) => {
      const offset = 34 + (14 - count) * keyW * 0.5;
      for (let c = 0; c < count; c++) {
        ctx.fillStyle = "#24282a";
        ctx.beginPath();
        ctx.roundRect(offset + c * keyW + 3, 22 + r * 44 + 3, keyW - 6, 38, 6);
        ctx.fill();
      }
    });
    ctx.beginPath();
    ctx.roundRect(240, 22 + 5 * 44 - 2, 290, 30, 6);
    ctx.fill();
  });
}

/** Bilhete adesivo: o papel pré-gerado e o nome de uma parte da operação. */
function noteTexture(paper: ImageBitmap, label: string, family: string) {
  return canvasTexture(256, 256, (ctx) => {
    ctx.drawImage(paper, 0, 0, 256, 256);
    ctx.fillStyle = "#17201d";
    ctx.font = `500 ${label.length > 9 ? 34 : 42}px ${family}`;
    ctx.fillText(label, 22, 148);
    ctx.fillStyle = "rgba(23,32,29,0.55)";
    ctx.fillRect(22, 168, Math.min(200, 18 + label.length * 13), 3);
  });
}

/* ------------------------------------------------------------------ */
/* Ambiente de reflexo: softboxes num estúdio escuro.                  */
/* ------------------------------------------------------------------ */

function studioEnvironment(gl: THREE.WebGLRenderer) {
  const room = new THREE.Scene();
  room.background = new THREE.Color("#050807");
  const panel = (w: number, h: number, pos: [number, number, number], rot: [number, number, number], color: string, power: number) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide }),
    );
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    room.add(mesh);
  };
  // Mesmo desenho de luz da cena: softbox à esquerda, faixa fria atrás.
  panel(2.4, 1.6, [-3, 2.6, 2.4], [-0.5, -0.9, 0], "#fff3e6", 2.2);
  panel(3, 0.35, [0.3, 2.4, -2.4], [0.4, 0, 0], "#d9e7e1", 1.4);
  panel(1.8, 1.4, [3, 1.6, 2.6], [0, 0.9, 0], "#e8eef2", 0.45);
  const pmrem = new THREE.PMREMGenerator(gl);
  const result = pmrem.fromScene(room, 0.02);
  pmrem.dispose();
  room.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return result;
}

/* ------------------------------------------------------------------ */
/* Estúdio: piso de concreto e parede de reboco, sem ornamento.         */
/* ------------------------------------------------------------------ */

function Room() {
  const floor = useBitmapTexture(TEX.floor, 8, 10, 10);
  const wall = useBitmapTexture(TEX.wall, 8, 4, 2);
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial map={floor} roughness={0.66} metalness={0} />
      </mesh>
      <mesh position={[0, 2, -1.05]} receiveShadow>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial map={wall} roughness={0.94} />
      </mesh>
    </>
  );
}

/** Luz de destaque com alvo próprio (o alvo precisa estar na cena). */
function Spot({
  lightRef,
  position,
  target,
  color,
  intensity,
  distance,
  angle,
  penumbra,
  shadow,
}: {
  lightRef?: RefObject<THREE.SpotLight | null>;
  position: [number, number, number];
  target: [number, number, number];
  color: string;
  intensity: number;
  distance: number;
  angle: number;
  penumbra: number;
  shadow?: { size: number; radius: number; bias: number; near: number; far: number };
}) {
  const aim = useMemo(() => new THREE.Object3D(), []);
  return (
    <>
      <primitive object={aim} position={target} />
      <spotLight
        ref={lightRef}
        position={position}
        target={aim}
        color={color}
        intensity={intensity}
        distance={distance}
        angle={angle}
        penumbra={penumbra}
        decay={2}
        castShadow={Boolean(shadow)}
        shadow-mapSize={shadow ? [shadow.size, shadow.size] : undefined}
        shadow-radius={shadow?.radius}
        shadow-bias={shadow?.bias}
        shadow-normalBias={shadow ? 0.012 : undefined}
        shadow-camera-near={shadow?.near}
        shadow-camera-far={shadow?.far}
      />
    </>
  );
}

/** Painel de luz retangular apontado para um alvo. */
function Softbox({
  lightRef,
  position,
  target,
  size,
  color,
  intensity,
}: {
  lightRef?: RefObject<THREE.RectAreaLight | null>;
  position: [number, number, number];
  target: [number, number, number];
  size: [number, number];
  color: string;
  intensity: number;
}) {
  const [px, py, pz] = position;
  const [tx, ty, tz] = target;
  const rotation = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(px, py, pz);
    o.lookAt(tx, ty, tz);
    return [o.rotation.x, o.rotation.y, o.rotation.z] as [number, number, number];
  }, [px, py, pz, tx, ty, tz]);
  return <rectAreaLight ref={lightRef} args={[color, intensity, size[0], size[1]]} position={position} rotation={rotation} />;
}

/**
 * Luz de estúdio controlada: principal macia da esquerda com sombra suave,
 * contorno frio por trás, preenchimento baixo e uma mancha na parede que
 * separa a bancada do fundo.
 */
function StudioLights({ dimRef }: { dimRef: RefObject<number> }) {
  const key = useRef<THREE.RectAreaLight>(null);
  const keyShadow = useRef<THREE.SpotLight>(null);
  const wash = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    const k = dimRef.current ?? 0;
    if (key.current) key.current.intensity = 7 * (1 - 0.3 * k);
    if (keyShadow.current) keyShadow.current.intensity = 9 * (1 - 0.3 * k);
    if (wash.current) wash.current.intensity = 40 * (1 - 0.45 * k);
  });

  return (
    <>
      <Softbox lightRef={key} position={[-1.4, 2.1, 1.5]} target={[0.05, 0.8, 0]} size={[1.1, 0.75]} color="#fff2e4" intensity={7} />
      <Spot
        lightRef={keyShadow}
        position={[-1.4, 2.1, 1.5]}
        target={[0.05, 0.75, 0]}
        color="#fff2e4"
        intensity={9}
        distance={7}
        angle={0.5}
        penumbra={1}
        shadow={{ size: 2048, radius: 8, bias: -0.0002, near: 0.5, far: 6 }}
      />
      <Softbox position={[1.7, 1.25, 1.9]} target={[0.1, 0.9, 0]} size={[0.9, 0.7]} color="#e6edf2" intensity={1.1} />
      <Softbox position={[0.15, 1.95, -0.8]} target={[0.05, 1.0, 0.45]} size={[1.7, 0.12]} color="#cfe1da" intensity={9} />
      <Spot lightRef={wash} position={[0.9, 3.0, -0.2]} target={[0.95, 1.0, -1.05]} color="#f3e8da" intensity={40} distance={6} angle={0.62} penumbra={1} />
      <hemisphereLight args={["#4c5a55", "#050908", 0.1]} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Bancada.                                                           */
/* ------------------------------------------------------------------ */

function useMaterials() {
  const oakMap = useBitmapTexture(TEX.oak, 8);
  const feltMap = useBitmapTexture(TEX.felt, 8);
  const m = useMemo(() => {
    const ivory = new THREE.MeshPhysicalMaterial({ color: IVORY, roughness: 0.52, clearcoat: 0.2, clearcoatRoughness: 0.45 });
    const oak = new THREE.MeshStandardMaterial({ map: oakMap, roughness: 0.5 });
    const felt = new THREE.MeshPhysicalMaterial({
      map: feltMap,
      roughness: 1,
      sheen: 1,
      sheenColor: new THREE.Color("#7d8f86"),
      sheenRoughness: 0.6,
    });
    const darkFelt = new THREE.MeshPhysicalMaterial({ color: "#18211e", roughness: 1, sheen: 1, sheenColor: new THREE.Color("#3a4843"), sheenRoughness: 0.7 });
    const glass = new THREE.MeshStandardMaterial({ color: "#07090a", roughness: 0.12, metalness: 0 });
    const brushed = new THREE.MeshPhysicalMaterial({ color: "#a3a8ab", metalness: 1, roughness: 0.34, anisotropy: 0.75 });
    const graphite = new THREE.MeshPhysicalMaterial({ color: "#2b2f31", metalness: 1, roughness: 0.38, anisotropy: 0.5 });
    const rubber = new THREE.MeshStandardMaterial({ color: "#0b0c0c", roughness: 0.66 });
    const keys = new THREE.MeshStandardMaterial({ map: keyboardTexture(), roughness: 0.45, metalness: 0.55 });
    return { ivory, oak, felt, darkFelt, glass, brushed, graphite, rubber, keys };
  }, [oakMap, feltMap]);
  useEffect(
    () => () => {
      // Carvalho e feltro são descartados pelo próprio hook da textura.
      m.keys.map?.dispose();
      for (const material of Object.values(m)) material.dispose();
    },
    [m],
  );
  return m;
}

type Materials = ReturnType<typeof useMaterials>;

/**
 * Caixas arredondadas da cena, uma geometria por medida. Peças finas usam 3
 * segmentos por canto e as demais 4 (antes 5 em todas: a montagem gastava
 * quase 1 s numa máquina lenta). O cache é esvaziado quando a cena sai.
 */
const roundedCache = new Map<string, RoundedBoxGeometry>();

function roundedGeometry(w: number, h: number, d: number, radius: number) {
  const segments = Math.min(w, h, d) < 0.03 ? 3 : 4;
  const key = `${w}|${h}|${d}|${radius}|${segments}`;
  let geometry = roundedCache.get(key);
  if (!geometry) {
    geometry = new RoundedBoxGeometry(w, h, d, segments, radius);
    roundedCache.set(key, geometry);
  }
  return geometry;
}

function disposeRounded() {
  for (const geometry of roundedCache.values()) geometry.dispose();
  roundedCache.clear();
}

/** Caixa com cantos arredondados. */
function Rounded({
  size,
  radius,
  material,
  position,
  rotation,
  shadow = true,
}: {
  size: [number, number, number];
  radius: number;
  material: THREE.Material;
  position?: [number, number, number];
  rotation?: [number, number, number];
  shadow?: boolean;
}) {
  const [w, h, d] = size;
  const geometry = useMemo(() => roundedGeometry(w, h, d, radius), [w, h, d, radius]);
  return <mesh geometry={geometry} material={material} position={position} rotation={rotation} castShadow={shadow} receiveShadow />;
}

function Bench({ m, coreRef }: { m: Materials; coreRef: RefObject<THREE.MeshStandardMaterial | null> }) {
  return (
    <group>
      {/* Tampo de carvalho maciço, 4 cm. */}
      <Rounded size={[BENCH.width, BENCH.thick, BENCH.depth]} radius={0.008} material={m.oak} position={[0, BENCH.top - BENCH.thick / 2, 0]} />

      {/* Pés: hastes marfim que passam do tampo; braços voltados para o ponto. */}
      {[-1, 1].map((side) => (
        <group key={side} position-x={side * POST_X}>
          {[POST_Z, -POST_Z].map((z) => (
            <Rounded key={z} size={[POST, POST_H, POST]} radius={POST / 2 - 0.001} material={m.ivory} position={[0, POST_H / 2, z]} />
          ))}
          <Rounded size={[POST * 0.72, POST * 0.72, POST_Z * 2]} radius={POST * 0.36 - 0.001} material={m.ivory} position={[0, 0.07, 0]} />
          <Rounded size={[0.05, 0.028, 0.028]} radius={0.011} material={m.ivory} position={[-side * (POST / 2 + 0.023), CORE_Y, -POST_Z]} />
        </group>
      ))}

      {/* Painel de feltro sob o tampo e o ponto âmbar, sem brilho de efeito. */}
      <mesh position={[0, 0.55, -POST_Z]} material={m.darkFelt} receiveShadow>
        <boxGeometry args={[2 * POST_X - POST, 0.3, 0.012]} />
      </mesh>
      <mesh position={[0, CORE_Y, -POST_Z + 0.008]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.024, 0.024, 0.005, 40]} />
        <meshStandardMaterial ref={coreRef} color={AMBER} emissive={AMBER} emissiveIntensity={0.55} roughness={0.45} />
      </mesh>

      {/* Base de feltro musgo sob o teclado. */}
      <Rounded size={[0.84, 0.004, 0.36]} radius={0.0018} material={m.felt} position={[-0.02, BENCH.top + 0.002, 0.15]} shadow={false} />
    </group>
  );
}

function Monitor({
  m,
  screenRef,
  screenLightRef,
  monitorRef,
}: {
  m: Materials;
  screenRef: RefObject<THREE.MeshBasicMaterial | null>;
  screenLightRef: RefObject<THREE.RectAreaLight | null>;
  monitorRef: RefObject<THREE.Group | null>;
}) {
  const texture = useBitmapTexture(STATION_SCREEN.tex, 16);
  const [mx, my, mz] = MONITOR;
  const cable = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(mx + 0.04, my - 0.12, mz - 0.05),
      new THREE.Vector3(mx + 0.07, BENCH.top + 0.1, -0.3),
      new THREE.Vector3(mx + 0.1, BENCH.top + 0.012, -0.33),
      new THREE.Vector3(mx + 0.12, BENCH.top - 0.02, -0.37),
      new THREE.Vector3(mx + 0.16, 0.3, -0.4),
      new THREE.Vector3(mx + 0.22, 0.01, -0.46),
      new THREE.Vector3(mx + 0.55, 0.01, -0.58),
    ]);
    return new THREE.TubeGeometry(curve, 96, 0.0035, 8, false);
  }, [mx, my, mz]);
  useEffect(() => () => cable.dispose(), [cable]);

  return (
    <group>
      {/* Coluna marfim com braço (a haste e o braço da marca, no suporte). */}
      <Rounded size={[0.17, 0.012, 0.12]} radius={0.005} material={m.ivory} position={[mx, BENCH.top + 0.006, -0.29]} />
      <Rounded size={[0.05, 0.5, 0.05]} radius={0.024} material={m.ivory} position={[mx, BENCH.top + 0.25, -0.29]} />
      <Rounded size={[0.046, 0.04, 0.14]} radius={0.017} material={m.ivory} position={[mx, my, -0.22]} />

      <group ref={monitorRef} position={MONITOR}>
        <Rounded size={[STATION_SCREEN.width + 0.016, SCREEN_H + 0.016, 0.02]} radius={0.005} material={m.glass} />
        <Rounded size={[STATION_SCREEN.width - 0.02, SCREEN_H - 0.02, 0.028]} radius={0.012} material={m.brushed} position={[0, 0, -0.022]} />
        <mesh position-z={0.0105}>
          <planeGeometry args={[STATION_SCREEN.width, SCREEN_H]} />
          <meshBasicMaterial ref={screenRef} map={texture} toneMapped={false} />
        </mesh>
        {/* Vidro: só o reflexo do estúdio, somado sobre a interface. */}
        <mesh position-z={0.0112}>
          <planeGeometry args={[STATION_SCREEN.width, SCREEN_H]} />
          <meshStandardMaterial
            color="#000000"
            metalness={1}
            roughness={0.1}
            envMapIntensity={0.55}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <rectAreaLight ref={screenLightRef} args={["#e9eef7", 1, STATION_SCREEN.width, SCREEN_H]} position-z={0.02} rotation-y={Math.PI} />
      </group>

      <mesh geometry={cable} material={m.rubber} castShadow />
    </group>
  );
}

/** Teclado e trackpad sobre o feltro. */
function Keyboard({ m }: { m: Materials }) {
  return (
    <group>
      <group position={[-0.06, BENCH.top + 0.01, 0.15]} rotation-x={0.035}>
        <Rounded size={[0.37, 0.011, 0.125]} radius={0.004} material={m.brushed} />
        <mesh position-y={0.0058} rotation-x={-Math.PI / 2} material={m.keys}>
          <planeGeometry args={[0.36, 0.118]} />
        </mesh>
      </group>
      <Rounded size={[0.135, 0.005, 0.11]} radius={0.002} material={m.brushed} position={[0.21, BENCH.top + 0.0065, 0.15]} />
    </group>
  );
}

/** Celular num suporte: a conversa em que o pedido chegou. */
function Phone({ m }: { m: Materials }) {
  const texture = useBitmapTexture(STATION_CHAT.tex, 8);
  const w = 0.072;
  const h = w / STATION_CHAT.aspect;
  return (
    <group position={PHONE} rotation-y={-0.32}>
      {/* Suporte marfim: base, encosto e batente, na linguagem dos pés. */}
      <Rounded size={[0.085, 0.012, 0.075]} radius={0.005} material={m.ivory} position={[0, 0.006, 0]} />
      <Rounded size={[0.06, 0.1, 0.012]} radius={0.005} material={m.ivory} position={[0, 0.055, -0.02]} rotation={[-0.3, 0, 0]} />
      <Rounded size={[0.085, 0.014, 0.014]} radius={0.006} material={m.ivory} position={[0, 0.019, 0.026]} />
      <group position={[0, 0.088, -0.006]} rotation-x={-0.3}>
        <Rounded size={[w + 0.006, h + 0.006, 0.008]} radius={0.006} material={m.graphite} />
        <mesh position-z={0.0042}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={texture} toneMapped={false} color="#d9dcdb" />
        </mesh>
      </group>
    </group>
  );
}

/** Bilhete impresso: o que o sistema gera no fim do atendimento. */
function BoardingPass() {
  const texture = useBitmapTexture(STATION_TICKET.tex, 8);
  const geometry = useMemo(() => {
    // Papel pousado: a ponta do canhoto levanta um pouco.
    const w = 0.19;
    const g = new THREE.PlaneGeometry(w, w / STATION_TICKET.aspect, 24, 4);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const lift = Math.pow(Math.max(0, (p.getX(i) - 0.035) / 0.06), 2) * 0.006;
      p.setZ(i, lift);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} position={[0.22, BENCH.top + 0.0055, 0.275]} rotation={[-Math.PI / 2, 0, 0.18]} castShadow receiveShadow>
      <meshStandardMaterial map={texture} roughness={0.88} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Luminária de trabalho: haste marfim, braço e luz quente, sem brilho de efeito. */
function TaskLamp({ m, dimRef }: { m: Materials; dimRef: RefObject<number> }) {
  const spot = useRef<THREE.SpotLight>(null);
  useFrame(() => {
    const k = dimRef.current ?? 0;
    if (spot.current) spot.current.intensity = 1.5 * (1 - 0.35 * k);
  });
  // Base no canto de trás, braço para a frente: a cabeça fica à direita do
  // monitor, abaixo do rótulo, e acende o feltro, o bilhete e o celular.
  const y = BENCH.top;
  return (
    <group>
      <mesh position={[0.7, y + 0.007, -0.26]} material={m.graphite} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.063, 0.014, 48]} />
      </mesh>
      <Rounded size={[0.026, 0.4, 0.026]} radius={0.0125} material={m.ivory} position={[0.7, y + 0.214, -0.26]} />
      <Rounded size={[0.02, 0.02, 0.3]} radius={0.0095} material={m.ivory} position={[0.7, y + 0.405, -0.12]} />
      <group position={[0.7, y + 0.39, 0.03]} rotation={[-0.3, 0, -0.4]}>
        <mesh material={m.graphite} castShadow>
          <cylinderGeometry args={[0.036, 0.044, 0.05, 40, 1, true]} />
        </mesh>
        <mesh position-y={0.025} material={m.graphite}>
          <cylinderGeometry args={[0.036, 0.036, 0.004, 40]} />
        </mesh>
        <mesh position-y={-0.021} rotation-x={Math.PI / 2}>
          <circleGeometry args={[0.04, 40]} />
          <meshStandardMaterial color="#f7e7cf" emissive="#ffd9a6" emissiveIntensity={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <Spot
        lightRef={spot}
        position={[0.7, y + 0.37, 0.04]}
        target={[0.32, y, 0.2]}
        color="#ffcf95"
        intensity={1.5}
        distance={2}
        angle={0.78}
        penumbra={0.95}
        shadow={{ size: 1024, radius: 5, bias: -0.0004, near: 0.05, far: 1.4 }}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Bilhetes adesivos: cada parte da operação, depois o lugar no sistema. */
/* ------------------------------------------------------------------ */

function bentNoteGeometry() {
  // Papel colado só pela faixa de cima: a parte de baixo descola um pouco.
  const g = new THREE.PlaneGeometry(0.074, 0.074, 6, 6);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const lift = Math.pow(Math.max(0, (0.012 - p.getY(i)) / 0.049), 2) * 0.007;
    p.setZ(i, lift);
  }
  g.computeVertexNormals();
  return g;
}

function useNoteMaps(labels: string[]) {
  const [family, setFamily] = useState("sans-serif");

  // Redesenha com a fonte da página quando ela terminar de carregar.
  useEffect(() => {
    let alive = true;
    const el = document.querySelector(".edh");
    const pageFamily = el ? getComputedStyle(el).getPropertyValue("--font-plex-sans").trim() : "";
    if (!pageFamily) return;
    document.fonts.load(`500 42px ${pageFamily}`).then(() => {
      if (alive) setFamily(pageFamily);
    });
    return () => {
      alive = false;
    };
  }, []);

  const [amber, ivory] = useLoader(CanvasBitmapLoader, [TEX.noteAmber, TEX.noteIvory]);
  const maps = useMemo(
    () => STATION_TICKETS.map((t) => noteTexture(t.tone === "amber" ? amber : ivory, labels[t.module] ?? "", family)),
    [labels, family, amber, ivory],
  );
  useEffect(() => () => maps.forEach((map) => map.dispose()), [maps]);
  return maps;
}

function Notes({
  labels,
  mode,
  monitorRef,
  modeAtRef,
  onMarks,
}: {
  labels: string[];
  mode: StationMode;
  monitorRef: RefObject<THREE.Group | null>;
  modeAtRef: RefObject<number | null>;
  onMarks?: StationSignals["onMarks"];
}) {
  const geometry = useMemo(() => bentNoteGeometry(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const maps = useNoteMaps(labels);

  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const materials = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const progress = useRef<number[]>(STATION_TICKETS.map(() => 0));
  const run = useRef<{ mode: StationMode; t0: number; from: number[] } | null>(null);
  const tmp = useRef({ a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), world: new THREE.Vector3() });

  useFrame((state) => {
    const now = clockSeconds();
    if (!run.current || run.current.mode !== mode) run.current = { mode, t0: now, from: progress.current.slice() };
    const { t0, from } = run.current;
    const { a, b, c, world } = tmp.current;
    const toFocus = mode === "focus";
    let busy = false;
    let moving = false;

    STATION_TICKETS.forEach((ticket, i) => {
      const delay = toFocus ? TICKET_DELAY + i * TICKET_STAGGER : (STATION_TICKETS.length - 1 - i) * 0.04;
      const duration = toFocus ? TICKET_FLIGHT : 0.45;
      const k = THREE.MathUtils.clamp((now - t0 - delay) / duration, 0, 1);
      if (k < 1) busy = true;
      const p = from[i] + ((toFocus ? 1 : 0) - from[i]) * easeInOut(k);
      if (p !== progress.current[i]) moving = true;
      progress.current[i] = p;

      const mesh = meshes.current[i];
      const material = materials.current[i];
      if (!mesh || !material) return;
      const [mx, my] = pointOnScreen(ticket.point);
      a.set(ticket.at[0], ticket.at[1], 0.013);
      c.set(mx, my, 0.013);
      // Arco: sai em direção à câmera e entra na tela.
      b.set((ticket.at[0] + mx) / 2, (ticket.at[1] + my) / 2 + 0.06, 0.22);
      mesh.position
        .copy(a)
        .multiplyScalar((1 - p) * (1 - p))
        .addScaledVector(b, 2 * (1 - p) * p)
        .addScaledVector(c, p * p);
      mesh.rotation.z = THREE.MathUtils.degToRad(ticket.tilt) * (1 - p);
      mesh.rotation.x = Math.sin(p * Math.PI) * -0.5;
      mesh.scale.setScalar(THREE.MathUtils.lerp(1, 0.12, p * p));
      material.opacity = p < 0.82 ? 1 : 1 - (p - 0.82) / 0.18;
      mesh.visible = material.opacity > 0.01;
    });

    // Pontos da tela: acendem quando os bilhetes daquela parte chegam.
    const group = monitorRef.current;
    const focusAge = toFocus && modeAtRef.current !== null ? now - modeAtRef.current : -1;
    if (group && onMarks) {
      const spots = STATION_POINTS.map(({ n }, order) => {
        const ids = STATION_TICKETS.flatMap((t, i) => (t.point === n ? [i] : []));
        const arrived = ids.length ? ids.every((i) => progress.current[i] > 0.98) : focusAge > LAST_POINT_AT + order * 0.05;
        const on = toFocus && arrived;
        if (!on && toFocus) busy = true;
        const [x, y] = pointOnScreen(n);
        world.set(x, y, 0.013);
        group.localToWorld(world);
        state.camera.updateMatrixWorld();
        world.project(state.camera);
        return { n, x: ((world.x + 1) / 2) * state.size.width, y: ((1 - world.y) / 2) * state.size.height, on };
      });
      onMarks(spots);
    }
    // A cena é parada: as sombras só mudam quando um bilhete se mexe.
    if (moving) state.gl.shadowMap.needsUpdate = true;
    if (busy) state.invalidate();
  });

  return (
    <group position={MONITOR}>
      {STATION_TICKETS.map((ticket, i) => (
        <mesh
          key={i}
          ref={(mesh) => {
            meshes.current[i] = mesh;
          }}
          geometry={geometry}
          position={[ticket.at[0], ticket.at[1], 0.013]}
          rotation-z={THREE.MathUtils.degToRad(ticket.tilt)}
          castShadow
        >
          <meshStandardMaterial
            ref={(material) => {
              materials.current[i] = material;
            }}
            map={maps[i]}
            roughness={0.92}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Câmera, rótulo e primeiro quadro.                                   */
/* ------------------------------------------------------------------ */

function CameraRig({
  mode,
  selected,
  animate,
  introPose,
  paused,
  modeAtRef,
  dimRef,
}: {
  mode: StationMode;
  selected: number | null;
  animate: boolean;
  introPose: boolean;
  paused: boolean;
  modeAtRef: RefObject<number | null>;
  dimRef: RefObject<number>;
}) {
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const poses = useMemo(() => posesFor(size.width / size.height), [size.width, size.height]);
  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const look = useRef(new THREE.Vector3());
  const goal = useRef({ pos: new THREE.Vector3(), target: new THREE.Vector3() });
  const run = useRef<{ key: string; kind: "intro" | "move" | "point"; t0: number; pos: THREE.Vector3; target: THREE.Vector3; fov: number } | null>(
    null,
  );

  // Ao voltar à vista (ou mudar de estado), desenha de novo.
  useEffect(() => {
    if (!paused) invalidate();
  }, [poses, mode, selected, paused, invalidate]);

  useEffect(() => {
    if (!animate) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animate, invalidate]);

  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const now = clockSeconds();
    const pick = mode === "focus" ? selected : null;
    const pose = mode === "focus" ? (pick ? pointPose(pick, poses.focus) : poses.focus) : poses.overview;
    const key = `${mode}:${pick ?? "-"}`;

    if (!animate) {
      camera.position.copy(pose.pos);
      if (introPose) camera.position.add(INTRO_BACK);
      camera.fov = pose.fov;
      camera.updateProjectionMatrix();
      camera.lookAt(pose.target);
      dimRef.current = mode === "focus" ? 1 : 0;
      return;
    }

    if (!run.current) {
      // Abertura: parte recuada, segura o quadro do pôster e se aproxima.
      run.current = { key, kind: "intro", t0: now + INTRO_HOLD, pos: pose.pos.clone().add(INTRO_BACK), target: pose.target.clone(), fov: pose.fov };
      look.current.copy(pose.target);
    } else if (run.current.key !== key) {
      // Troca de ponto dentro do foco é um ajuste curto; abrir e voltar, um movimento.
      const samePlace = run.current.key.split(":")[0] === mode && mode === "focus";
      const kind = samePlace ? "point" : "move";
      run.current = { key, kind, t0: now, pos: camera.position.clone(), target: look.current.clone(), fov: camera.fov };
      if (kind === "move") modeAtRef.current = mode === "focus" ? now : null;
    }

    const r = run.current;
    const seconds = r.kind === "intro" ? INTRO_SECONDS : r.kind === "point" ? POINT_SECONDS : mode === "focus" ? FOCUS_SECONDS : BACK_SECONDS;
    const k = THREE.MathUtils.clamp((now - r.t0) / seconds, 0, 1);
    const e = r.kind === "intro" ? 1 - Math.pow(1 - k, 3) : easeInOut(k);

    // Paralaxe do ponteiro, menor em foco para a interface ficar estável.
    const amp = (mode === "focus" ? 0.03 : 0.14) * (r.kind === "intro" ? e : 1);
    smooth.current.x += (pointer.current.x - smooth.current.x) * 0.08;
    smooth.current.y += (pointer.current.y - smooth.current.y) * 0.08;
    const { pos, target } = goal.current;
    pos.copy(r.pos).lerp(pose.pos, e);
    pos.x += smooth.current.x * amp;
    pos.y -= smooth.current.y * amp * 0.45;
    target.copy(r.target).lerp(pose.target, e);

    camera.position.copy(pos);
    look.current.copy(target);
    camera.lookAt(look.current);
    camera.fov = THREE.MathUtils.lerp(r.fov, pose.fov, e);
    camera.updateProjectionMatrix();

    // Em foco, o estúdio baixa e a tela manda.
    const dimGoal = mode === "focus" ? 1 : 0;
    dimRef.current += (dimGoal - dimRef.current) * 0.06;

    const settling =
      Math.abs(pointer.current.x - smooth.current.x) > 1e-3 ||
      Math.abs(pointer.current.y - smooth.current.y) > 1e-3 ||
      Math.abs(dimGoal - dimRef.current) > 1e-3;
    if (k < 1 || settling) state.invalidate();
  });

  return null;
}

/** Rótulo HTML da estação: canto superior direito do monitor no desktop, centro dele no retrato. */
function TagAnchor({ onTag }: { onTag?: StationSignals["onTag"] }) {
  const point = useRef(new THREE.Vector3());
  useFrame((state) => {
    if (!onTag) return;
    const p = point.current;
    const portrait = state.size.width <= state.size.height;
    if (portrait) p.set(MONITOR[0], MONITOR[1] + SCREEN_H / 2 + 0.1, MONITOR[2]);
    else p.set(MONITOR[0] + STATION_SCREEN.width / 2 + 0.03, MONITOR[1] + SCREEN_H / 2, MONITOR[2]);
    state.camera.updateMatrixWorld();
    p.project(state.camera);
    onTag(((p.x + 1) / 2) * state.size.width, ((1 - p.y) / 2) * state.size.height);
  });
  return null;
}

/** Avisa quando o primeiro quadro já foi desenhado (a cena pode cobrir o pôster). */
function FirstFrame({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0);
  useFrame((state) => {
    frames.current += 1;
    if (frames.current === 1) state.invalidate();
    if (frames.current === 2) requestAnimationFrame(() => onReady?.());
  });
  return null;
}

/** Uma etapa por tarefa: entre elas o navegador atende cliques e teclado. */
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * Prepara a cena antes do primeiro quadro, em tarefas curtas: ambiente de
 * reflexo, envio de cada textura à GPU e compilação dos shaders em paralelo
 * (KHR_parallel_shader_compile, sem esperar a compilação na thread principal). Antes, tudo isso acontecia dentro do primeiro
 * quadro e bloqueava a página por mais de 1 s numa máquina lenta.
 */
function Warmup({ onWarm }: { onWarm: () => void }) {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const { gl, scene, camera } = get();
    let alive = true;
    let env: THREE.WebGLRenderTarget | null = null;
    const run = async () => {
      await nextTask();
      if (!alive) return;
      RectAreaLightUniformsLib.init();
      await nextTask();
      if (!alive) return;
      env = studioEnvironment(gl);
      scene.environment = env.texture;
      const textures = new Set<THREE.Texture>();
      scene.traverse((object) => {
        const material = (object as THREE.Mesh).material;
        for (const item of Array.isArray(material) ? material : material ? [material] : []) {
          for (const value of Object.values(item)) if (value instanceof THREE.Texture) textures.add(value);
        }
      });
      for (const texture of textures) {
        await nextTask();
        if (!alive) return;
        gl.initTexture(texture);
      }
      await nextTask();
      if (!alive) return;
      // Compilação em paralelo (KHR_parallel_shader_compile) com espera própria:
      // o compileAsync do three continua sondando materiais já descartados se
      // a página muda antes do fim, e lança erro fora da cena.
      const pending = new Set(gl.compile(scene, camera));
      await new Promise<void>((resolve) => {
        const check = () => {
          if (!alive) return resolve();
          for (const material of pending) {
            const props = gl.properties.get(material) as { currentProgram?: { isReady(): boolean } } | undefined;
            const program = props?.currentProgram;
            if (!program || program.isReady()) pending.delete(material);
          }
          if (pending.size === 0) resolve();
          else setTimeout(check, 10);
        };
        check();
      });
      if (!alive) return;
      gl.shadowMap.needsUpdate = true;
      onWarm();
    };
    run();
    return () => {
      alive = false;
      if (env) {
        if (scene.environment === env.texture) scene.environment = null;
        env.dispose();
      }
    };
  }, [get, onWarm]);
  return null;
}

/** Com frameloop "never" o pedido de quadro é ignorado: pede de novo ao liberar. */
function Kick({ live }: { live: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (live) invalidate();
  }, [live, invalidate]);
  return null;
}

/* ------------------------------------------------------------------ */
/* Montagem.                                                          */
/* ------------------------------------------------------------------ */

type SceneProps = {
  mode: StationMode;
  labels: string[];
  modeAtRef: RefObject<number | null>;
  dimRef: RefObject<number>;
  onSelect?: () => void;
} & StationSignals;

function Station({ mode, labels, modeAtRef, dimRef, onSelect, onMarks, onHover }: SceneProps) {
  const m = useMaterials();
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const screenLight = useRef<THREE.RectAreaLight>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const monitor = useRef<THREE.Group>(null);
  const hover = useRef(false);

  useFrame((state) => {
    const k = dimRef.current ?? 0;
    // Em foco a tela vai ao brilho cheio; na visão da bancada fica um pouco abaixo.
    screen.current?.color.setScalar(0.8 + 0.12 * k + (hover.current ? 0.04 : 0));
    if (screenLight.current) screenLight.current.intensity = 1 + 0.6 * k;
    if (core.current) {
      core.current.emissiveIntensity = hover.current ? 0.55 + 0.35 * (0.5 + 0.5 * Math.sin(clockSeconds() * 4)) : 0.55;
      if (hover.current) state.invalidate();
    }
  });

  const out = () => {
    hover.current = false;
    document.body.style.cursor = "";
    onHover?.(false);
  };

  return (
    <group
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        if (mode !== "overview" || !onSelect) return;
        event.stopPropagation();
        hover.current = true;
        document.body.style.cursor = "pointer";
        onHover?.(true);
      }}
      onPointerOut={out}
      onClick={(event) => {
        if (mode !== "overview" || !onSelect) return;
        event.stopPropagation();
        out();
        onSelect();
      }}
    >
      <Bench m={m} coreRef={core} />
      <Monitor m={m} screenRef={screen} screenLightRef={screenLight} monitorRef={monitor} />
      <Keyboard m={m} />
      <Phone m={m} />
      <BoardingPass />
      <TaskLamp m={m} dimRef={dimRef} />
      <Notes labels={labels} mode={mode} monitorRef={monitor} modeAtRef={modeAtRef} onMarks={onMarks} />
    </group>
  );
}

function Studio(props: SceneProps) {
  return (
    <>
      <color attach="background" args={[INK]} />
      <fogExp2 attach="fog" args={[INK, 0.07]} />
      <StudioLights dimRef={props.dimRef} />
      <Room />
      <Station {...props} />
    </>
  );
}

export default function StationScene({
  mode,
  selected = null,
  animate,
  introPose = false,
  paused = false,
  labels,
  onReady,
  onSelect,
  onFail,
  onTag,
  onMarks,
  onHover,
}: {
  mode: StationMode;
  /** Ponto da tela selecionado no case (a câmera chega mais perto dele). */
  selected?: number | null;
  animate: boolean;
  /** Só com animate=false: para no quadro de abertura (gera o pôster dele). */
  introPose?: boolean;
  /** Abertura fora da tela: nenhum quadro é desenhado. */
  paused?: boolean;
  /** Rótulos dos bilhetes (módulos da operação, na língua da página). */
  labels: string[];
  onReady?: () => void;
  onSelect?: () => void;
  /** Contexto WebGL perdido: a página volta ao pôster. */
  onFail?: () => void;
} & StationSignals) {
  const modeAtRef = useRef<number | null>(null);
  const dimRef = useRef(0);
  // Nenhum quadro antes de a cena estar preparada (ver Warmup).
  const [warm, setWarm] = useState(false);
  const warmUp = useCallback(() => setWarm(true), []);
  const live = warm && !paused;

  useEffect(() => () => disposeRounded(), []);

  return (
    <Canvas
      className="edh-hall-canvas"
      // PCF com raio: sombras suaves (o PCFSoft foi descontinuado no three r183).
      shadows="percentage"
      frameloop={live ? "demand" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 31, near: 0.05, far: 40, position: [-1.2, 1.66, 3.75] }}
      scene={{ environmentIntensity: 0.35 }}
      onCreated={({ gl }) => {
        // Ler o log de cada shader força a espera pela compilação; em produção, não.
        gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
        // Sombras desenhadas sob demanda (a câmera se move, a bancada não).
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = true;
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1;
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onFail?.();
          },
          { once: true },
        );
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        {/* A câmera vem antes: quem projeta pontos já usa a pose deste quadro. */}
        <CameraRig
          mode={mode}
          selected={selected}
          animate={animate}
          introPose={introPose}
          paused={paused}
          modeAtRef={modeAtRef}
          dimRef={dimRef}
        />
        <Studio mode={mode} labels={labels} modeAtRef={modeAtRef} dimRef={dimRef} onSelect={onSelect} onMarks={onMarks} onHover={onHover} />
        <TagAnchor onTag={onTag} />
        <FirstFrame onReady={onReady} />
        <Warmup onWarm={warmUp} />
        <Kick live={live} />
      </Suspense>
    </Canvas>
  );
}
