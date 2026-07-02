"use client";

import dynamic from "next/dynamic";

const MapView3D = dynamic(() => import("@/components/MapView3D"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col bg-[#0d1825] border border-[#1e3a5f] rounded-xl overflow-hidden h-full items-center justify-center gap-2">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
      <span className="text-[10px] text-slate-600 uppercase tracking-widest">Loading 3D map…</span>
    </div>
  ),
});

export default function MapView3DClient() {
  return <MapView3D />;
}
