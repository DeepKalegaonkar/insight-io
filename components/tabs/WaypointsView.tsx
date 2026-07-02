"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

const WAYPOINTS = [
  { id: "WP01", name: "Loading Bay A",    lat: 37.7749, lon: -122.4194, dist: "0 m",    status: "done"   },
  { id: "WP02", name: "Inspection Pt 1",  lat: 37.7752, lon: -122.4201, dist: "42 m",   status: "done"   },
  { id: "WP03", name: "Storage Zone B",   lat: 37.7758, lon: -122.4210, dist: "89 m",   status: "active" },
  { id: "WP04", name: "Sensor Array C",   lat: 37.7761, lon: -122.4218, dist: "134 m",  status: "queued" },
  { id: "WP05", name: "Checkpoint Gate",  lat: 37.7765, lon: -122.4225, dist: "178 m",  status: "queued" },
  { id: "WP06", name: "Dock Station 3",   lat: 37.7770, lon: -122.4231, dist: "221 m",  status: "queued" },
];

const STATUS_META = {
  done:   { label: "Completed", dot: "bg-green-400",  badge: "text-green-400 border-green-500/20 bg-green-500/10"  },
  active: { label: "Active",    dot: "bg-yellow-400 pulse-dot", badge: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10" },
  queued: { label: "Queued",    dot: "bg-slate-500",  badge: "text-slate-400 border-slate-600/30 bg-slate-700/20"  },
};

export default function WaypointsView() {
  const { theme } = useApp();
  const dk = theme === "dark";

  const hd   = dk ? "text-white/90"            : "text-slate-900";
  const sub  = dk ? "text-slate-500"           : "text-slate-400";
  const card = dk ? "bg-[#0f1a26] border-white/5" : "bg-white border-slate-200";
  const th   = dk ? "text-slate-500 border-white/5"  : "text-slate-400 border-slate-200";
  const row  = dk ? "border-white/5 hover:bg-white/4" : "border-slate-100 hover:bg-slate-50";
  const mono = dk ? "text-slate-400 font-mono text-[10px]" : "text-slate-500 font-mono text-[10px]";

  const [selected, setSelected] = useState<string | null>("WP03");

  return (
    <div className="p-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className={`text-base font-bold ${hd}`}>Mission Waypoints</h2>
          <p className={`text-[11px] mt-0.5 ${sub}`}>On Mission 1234 · 6 waypoints · 221 m total</p>
        </div>
        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
          dk ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
             : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Waypoint
        </button>
      </div>

      {/* Progress bar */}
      <div className={`mb-5 p-4 rounded-xl border ${card}`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[11px] font-semibold ${hd}`}>Mission Progress</span>
          <span className={`text-[11px] font-mono ${sub}`}>2 / 6 complete</span>
        </div>
        <div className={`h-1.5 rounded-full ${dk ? "bg-white/5" : "bg-slate-200"}`}>
          <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: "33%" }} />
        </div>
        <div className="flex justify-between mt-2">
          {["WP01","WP02","WP03","WP04","WP05","WP06"].map((id, i) => (
            <div key={id} className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                i < 2 ? "bg-green-400" : i === 2 ? "bg-yellow-400" : dk ? "bg-slate-600" : "bg-slate-300"
              }`} />
              <span className={`text-[8px] ${sub}`}>{id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <table className="w-full text-left">
          <thead>
            <tr className={`border-b ${th}`}>
              {["#", "Name", "Coordinates", "Dist", "Status", ""].map((h) => (
                <th key={h} className={`px-4 py-2.5 text-[10px] uppercase tracking-widest font-semibold border-b ${th}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WAYPOINTS.map((wp) => {
              const m = STATUS_META[wp.status as keyof typeof STATUS_META];
              const isSelected = selected === wp.id;
              return (
                <tr key={wp.id}
                  onClick={() => setSelected(wp.id)}
                  className={`border-b cursor-pointer transition-colors ${row} ${
                    isSelected
                      ? dk ? "bg-cyan-500/5 border-cyan-500/20" : "bg-cyan-50 border-cyan-100"
                      : ""
                  }`}>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-mono font-semibold ${
                      isSelected ? (dk ? "text-cyan-400" : "text-cyan-600") : sub
                    }`}>{wp.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[12px] font-medium ${hd}`}>{wp.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={mono}>
                      {wp.lat.toFixed(4)}° N, {Math.abs(wp.lon).toFixed(4)}° W
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-mono ${sub}`}>{wp.dist}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${m.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                      {m.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                      dk ? "border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20"
                         : "border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
                    }`}>
                      {wp.status === "done" ? "Re-visit" : wp.status === "active" ? "Skip" : "Go to"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
