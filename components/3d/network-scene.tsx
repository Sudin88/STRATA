"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
 * Light-theme palette. Additive blending is what makes a dark-background scene
 * glow — on paper it blends *toward white* and the whole constellation
 * disappears. Everything here uses normal blending with ink-coloured lines, so
 * the sphere reads as a drafted wireframe rather than a neon hologram.
 */
const ION = new THREE.Color("#1f34cf");
const GRAPHITE = new THREE.Color("#3a3d45");
const NODE_COUNT = 210;
const RADIUS = 1.55;
const LINK_DISTANCE = 0.47;

/** Evenly distribute points on a sphere (fibonacci lattice). */
function fibonacciSphere(count: number, radius: number): Float32Array {
  const pts = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts[i * 3] = Math.cos(theta) * r * radius;
    pts[i * 3 + 1] = y * radius;
    pts[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return pts;
}

/**
 * Seeded PRNG (linear congruential). The constellation must look identical on
 * every render and every reload — `Math.random()` would reshuffle the accent
 * nodes and particle field each time, and is impure during render besides.
 */
function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function NetworkSphere({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const nodesMat = useRef<THREE.PointsMaterial>(null);

  const { nodeGeo, lineGeo } = useMemo(() => {
    const positions = fibonacciSphere(NODE_COUNT, RADIUS);
    const rand = seededRandom(0x5e8cff);

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const colors = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      const c = rand() > 0.78 ? ION : GRAPHITE;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Link nearby nodes into a constellation mesh
    const linePts: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < LINK_DISTANCE) {
          linePts.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePts), 3));

    return { nodeGeo, lineGeo };
  }, []);

  // Explicit GPU teardown — geometries are created here, so free them here.
  useEffect(
    () => () => {
      nodeGeo.dispose();
      lineGeo.dispose();
    },
    [nodeGeo, lineGeo]
  );

  useFrame((state, delta) => {
    if (!group.current) return;

    /* Stronger pointer parallax than before: the sphere now leans noticeably
       toward the cursor, so the scene reads as something you're steering
       rather than a static backdrop. */
    if (animate) group.current.rotation.y += delta * 0.14;
    const targetX = state.pointer.y * 0.4;
    const targetZ = state.pointer.x * 0.16;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.06;

    if (!animate) return;
    const t = state.clock.elapsedTime;

    // Breathing core: counter-rotates and pulses so the centre draws the eye.
    if (core.current) {
      core.current.rotation.y -= delta * 0.32;
      core.current.rotation.x += delta * 0.16;
      core.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.09);
    }
    // Nodes shimmer with a slow size pulse.
    if (nodesMat.current) nodesMat.current.size = 0.052 + Math.sin(t * 1.3) * 0.014;
    // Orbiting rings spin in opposite directions — "systems in motion".
    if (ringA.current) ringA.current.rotation.z += delta * 0.09;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.06;
  });

  return (
    <group ref={group}>
      <points geometry={nodeGeo}>
        <pointsMaterial
          ref={nodesMat}
          size={0.052}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={ION} transparent opacity={0.2} depthWrite={false} />
      </lineSegments>
      {/* Orbiting rings — the "systems in motion" layer */}
      <mesh ref={ringA} rotation={[Math.PI / 2.1, 0, 0.35]}>
        <torusGeometry args={[2.05, 0.004, 6, 90]} />
        <meshBasicMaterial color={ION} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.6, 0.7, -0.5]}>
        <torusGeometry args={[2.35, 0.003, 6, 90]} />
        <meshBasicMaterial color={GRAPHITE} transparent opacity={0.22} />
      </mesh>
      {/* Inner intelligence core — a wireframe cage around a bright ion heart
          with a faint halo shell (normal blending, so it stays a crisp mark on
          paper rather than a neon bloom). */}
      <group ref={core}>
        <mesh>
          <icosahedronGeometry args={[0.78, 1]} />
          <meshBasicMaterial color={ION} wireframe transparent opacity={0.38} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshBasicMaterial color={ION} transparent opacity={0.1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshBasicMaterial color={ION} transparent opacity={0.85} />
        </mesh>
      </group>
    </group>
  );
}

function DriftingParticles({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const count = 90;
    const rand = seededRandom(0x2f5fe8);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (rand() - 0.5) * 9;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((_, delta) => {
    if (ref.current && animate) ref.current.rotation.y -= delta * 0.015;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.02}
        color={GRAPHITE}
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </points>
  );
}

export default function NetworkScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      aria-hidden
    >
      <NetworkSphere animate={!reducedMotion} />
      <DriftingParticles animate={!reducedMotion} />
    </Canvas>
  );
}
