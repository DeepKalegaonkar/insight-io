"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";
import { useApp } from "@/contexts/AppContext";

// ─── Point cloud loader ───────────────────────────────────────────────────────
function PointCloud() {
  const groupRef = useRef<THREE.Group>(null);
  const [points, setPoints] = useState<THREE.Points | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = new PCDLoader();
    loader.load(
      "/assets/sample.pcd",
      (pcd) => {
        const positions = pcd.geometry.attributes.position;
        const count = positions.count;
        const colors = new Float32Array(count * 3);
        let zMin = Infinity, zMax = -Infinity;
        for (let i = 0; i < count; i++) {
          const z = positions.getZ(i);
          if (z < zMin) zMin = z;
          if (z > zMax) zMax = z;
        }
        const colorA = new THREE.Color("#c0d8e0");
        const colorB = new THREE.Color("#ff6060");
        for (let i = 0; i < count; i++) {
          const z = positions.getZ(i);
          const t = zMax > zMin ? (z - zMin) / (zMax - zMin) : 0;
          const c = colorA.clone().lerp(colorB, t);
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
        }
        pcd.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: 0.03,
          vertexColors: true,
          sizeAttenuation: true,
        });
        const pts = new THREE.Points(pcd.geometry, material);
        pts.rotation.x = -Math.PI / 2;
        setPoints(pts);
        setLoaded(true);
      },
      undefined,
      () => setError(true)
    );
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current && !error && loaded) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {points && <primitive object={points} />}
      {error && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.15}
          color="#475569"
          anchorX="center"
          anchorY="middle"
        >
          {"No PCD file found\nAdd sample.pcd to /public/assets/"}
        </Text>
      )}
    </group>
  );
}

// ─── Robot marker ─────────────────────────────────────────────────────────────
function RobotMarker() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.6;
  });
  return (
    <group position={[0, 0.08, 0]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.1]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.04, 0.12, 6]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Camera setup ─────────────────────────────────────────────────────────────
function SceneSetup() {
  const { camera } = useThree();
  useEffect(() => {
    // Slightly elevated top-down angle matching the reference screenshots
    camera.position.set(2, 10, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function MapView3D() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  // Light mode: near-white floor-plan look.  Dark mode: warm map grey.
  const canvasBg   = isDark ? "#c8c8be" : "#f5f5f0";
  const cellCol    = isDark ? "#aaaaaa" : "#cccccc";
  const sectionCol = isDark ? "#888888" : "#aaaaaa";
  const hudText    = isDark ? "text-slate-700" : "text-slate-400";

  return (
    <div className="relative w-full h-full transition-colors duration-300"
      style={{ background: canvasBg }}>
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: false }}
        style={{ background: canvasBg }}
      >
        <SceneSetup />
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight position={[5, 10, 5]} intensity={0.6} color="#ffffff" />

        <Suspense fallback={null}>
          <PointCloud />
          <RobotMarker />
          <Grid
            args={[30, 30]}
            cellSize={0.5}
            cellThickness={0.3}
            cellColor={cellCol}
            sectionSize={2}
            sectionThickness={0.6}
            sectionColor={sectionCol}
            fadeDistance={25}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={false}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={1}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>

      {/* Corner HUD */}
      <div className={`absolute top-3 left-3 text-[10px] font-mono pointer-events-none select-none ${hudText}`}>
        <div>Frame: world</div>
        <div>Mode: top-down</div>
      </div>
      <div className={`absolute bottom-2 right-2 text-[9px] pointer-events-none select-none text-right ${hudText}`}>
        <div>Drag to orbit · Scroll to zoom</div>
      </div>
    </div>
  );
}
