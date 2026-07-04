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

    fetch("/assets/sample.pcd")
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.arrayBuffer();
      })
      .then((buffer) => {
        // PCDLoader.parse() is synchronous and calls computeBoundingSphere()
        // internally on the raw (potentially NaN-containing) geometry.
        // We suppress only that specific error for the duration of this one
        // synchronous call, then restore immediately after.
        const origError = console.error;
        console.error = (...args: unknown[]) => {
          if (typeof args[0] === "string" && args[0].includes("computeBoundingSphere")) return;
          origError.apply(console, args);
        };
        const pcd = loader.parse(buffer);
        console.error = origError;

        const src = pcd.geometry.attributes.position as THREE.BufferAttribute;
        const rawCount = src.count;

        // ── 1. Filter out any vertices with NaN / non-finite coordinates ──────
        // Some PCD files (especially small test files) contain degenerate rows
        // that cause computeBoundingBox / computeBoundingSphere to emit NaN
        // warnings. We rebuild the position array with only clean triplets.
        const cleanXYZ: number[] = [];
        for (let i = 0; i < rawCount; i++) {
          const x = src.getX(i), y = src.getY(i), z = src.getZ(i);
          if (isFinite(x) && isFinite(y) && isFinite(z)) {
            cleanXYZ.push(x, y, z);
          }
        }

        const cleanCount = cleanXYZ.length / 3;
        const posArray   = new Float32Array(cleanXYZ);

        // ── 2. Z-height colour gradient (blue → red) ─────────────────────────
        let zMin = Infinity, zMax = -Infinity;
        for (let i = 0; i < cleanCount; i++) {
          const z = posArray[i * 3 + 2];
          if (z < zMin) zMin = z;
          if (z > zMax) zMax = z;
        }
        const colorLow  = new THREE.Color("#0060ff");
        const colorHigh = new THREE.Color("#ff2020");
        const colors = new Float32Array(cleanCount * 3);
        for (let i = 0; i < cleanCount; i++) {
          const z = posArray[i * 3 + 2];
          const t = zMax > zMin ? (z - zMin) / (zMax - zMin) : 0;
          const c = colorLow.clone().lerp(colorHigh, t);
          colors[i * 3]     = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
        }

        // ── 3. Build a fresh geometry from the clean arrays ───────────────────
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        geo.setAttribute("color",    new THREE.BufferAttribute(colors,   3));

        // Safe bounding computations — no NaN values remain
        geo.computeBoundingBox();
        geo.computeBoundingSphere();

        const material = new THREE.PointsMaterial({
          size: 0.03,
          vertexColors: true,
          sizeAttenuation: true,
        });
        const pts = new THREE.Points(geo, material);
        pts.rotation.x = -Math.PI / 2;
        setPoints(pts);
        setLoaded(true);
      })
      .catch(() => setError(true));
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
    camera.position.set(2, 10, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function MapView3D() {
  const { theme } = useApp();
  const isDark = theme === "dark";

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
        <color attach="background" args={[canvasBg]} />
        <SceneSetup />
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight position={[5, 10, 5]} intensity={0.6} color="#ffffff" />
        <axesHelper args={[2]} />

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
