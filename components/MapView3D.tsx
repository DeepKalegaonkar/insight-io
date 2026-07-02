"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";

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
        // Color by Z height
        const positions = pcd.geometry.attributes.position;
        const count = positions.count;
        const colors = new Float32Array(count * 3);
        let zMin = Infinity, zMax = -Infinity;
        for (let i = 0; i < count; i++) {
          const z = positions.getZ(i);
          if (z < zMin) zMin = z;
          if (z > zMax) zMax = z;
        }
        const colorA = new THREE.Color("#00d4ff"); // low = cyan
        const colorB = new THREE.Color("#ff4444"); // high = red
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
        pts.rotation.x = -Math.PI / 2; // PCD is often Z-up; rotate to Y-up
        setPoints(pts);
        setLoaded(true);
      },
      undefined,
      () => setError(true)
    );
  }, []);

  // Slow auto-rotate until user interacts
  useFrame((_, delta) => {
    if (groupRef.current && !error && loaded) {
      groupRef.current.rotation.y += delta * 0.05;
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

// ─── Robot stand-in marker ────────────────────────────────────────────────────
function RobotMarker() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.8;
  });
  return (
    <group position={[0, 0.06, 0]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.08]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} />
      </mesh>
      {/* Direction cone */}
      <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.03, 0.1, 6]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Camera reset button helper ───────────────────────────────────────────────
function SceneSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MapView3D() {
  const [showGrid, setShowGrid] = useState(true);

  return (
    <div className="flex flex-col bg-[#0d1825] border border-[#1e3a5f] rounded-xl overflow-hidden h-full panel-hover fade-in">
      {/* Panel header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e3a5f] shrink-0">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth={1.5} className="w-4 h-4">
            <path d="M3 17l6-8 4 4 3-5 5 9H3z" />
          </svg>
          <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">3D Map View</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid((g) => !g)}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors
              ${showGrid
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                : "border-[#1e3a5f] text-slate-600 hover:text-slate-400"
              }`}
          >
            Grid
          </button>
          <span className="text-[10px] text-slate-600 font-mono hidden sm:inline">PCD • Three.js</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas
          className="w-full h-full"
          gl={{ antialias: true, alpha: false }}
          style={{ background: "#070d14" }}
        >
          <SceneSetup />
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#00d4ff" />
          <pointLight position={[-5, 3, -5]} intensity={0.4} color="#8b5cf6" />

          <Suspense fallback={null}>
            <PointCloud />
            <RobotMarker />
            {showGrid && (
              <Grid
                args={[20, 20]}
                cellSize={0.5}
                cellThickness={0.5}
                cellColor="#1e3a5f"
                sectionSize={2}
                sectionThickness={1}
                sectionColor="#0e2040"
                fadeDistance={18}
                fadeStrength={1}
                followCamera={false}
                infiniteGrid={false}
              />
            )}
          </Suspense>

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            minDistance={1}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2 + 0.2}
          />
        </Canvas>

        {/* Corner HUD */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400/60 pointer-events-none select-none">
          <div>Frame: world</div>
          <div>Pts: Loading…</div>
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] text-slate-700 pointer-events-none select-none text-right">
          <div>Drag to orbit</div>
          <div>Scroll to zoom</div>
        </div>
      </div>
    </div>
  );
}
