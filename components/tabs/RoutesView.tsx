"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

const ROUTES = [
  {
    id: "RT001",
    name: "Perimeter Scan",
    desc: "Full outer boundary inspection",
    waypoints: 8,
    distance: "245 m",
    duration: "~12 min",
    tags: ["inspection", "auto"],
    lastRun: "2 hrs ago",
    active: false,
  },
  {
    id: "RT002",
    name: "Dock → Zone A",
    desc: "Direct route from dock to storage zone A",
    waypoints: 4,
    distance: "120 m",
    duration: "~6 min",
    tags: ["transport"],
    lastRun: "Today, 09:14",
    active: true,
  },
  {
    id: "RT003",
    name: "Full Survey",
    desc: "Comprehensive facility coverage route",
    waypoints: 12,
    distance: "490 m",
    duration: "~22 min",
    tags: ["survey", "long"],
    lastRun: "Yesterday",
    active: false,
  },
  {
    id: "RT004",
    name: "Emergency Evac",
    desc: "Fastest path to safe parking zone",
    waypoints: 3,
    distance: "68 m",
    duration: "~2 min",
    tags: ["safety"],
    lastRun: "Never",
    active: false,
  },
];

const TAG_COLORS: Record<string, string> = {
  inspection: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  auto:       "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  transport:  "text-purple-400 bg-purple-500/10 border-purple-500/20",
  survey:     "text-amber-400 bg-amber-500/10 border-amber-500/20",
  long:       "text-slate-400 bg-slate-500/10 border-slate-500/20",
  safety:     "text-red-400 bg-red-500/10 border-red-500/20",
};
const TAG_COLORS_LIGHT: Record<string, string> = {
  inspection: "text-blue-700 bg-blue-50 border-blue-200",
  auto:       "text-cyan-700 bg-cyan-50 border-cyan-200",
  transport:  "text-purple-700 bg-purple-50 border-purple-200",
  survey:     "text-amber-700 bg-amber-50 border-amber-200",
  long:       "text-slate-600 bg-slate-100 border-slate-200",
  safety:     "text-red-700 bg-red-50 border-red-200",
};

export default function RoutesView() {
  const { theme } = useApp();
  const dk = theme === "dark";
  const [activeId, setActiveId] = useState("RT002");

  const hd   = dk ? "text-white/90"               : "text-slate-900";
  const sub  = dk ? "text-slate-500"              : "text-slate-400";
  const card = dk ? "bg-[#0f1a26] border-white/5" : "bg-white border-slate-200";
  const tags = dk ? TAG_COLORS : TAG_COLORS_LIGHT;

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className={`text-base font-bold ${hd}`}>Saved Routes</h2>
          <p className={`text-[11px] mt-0.5 ${sub}`}>{ROUTES.length} routes available · 1 active</p>
        </div>
        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
          dk ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
             : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Route
        </button>
      </div>

      {/* Route cards */}
      <div className="flex flex-col gap-3">
        {ROUTES.map((route) => {
          const isActive = activeId === route.id;
          return (
            <div key={route.id}
              className={`rounded-xl border p-4 transition-all duration-200 ${card} ${
                isActive
                  ? dk ? "border-cyan-500/30 shadow-[0_0_20px_rgba(0,212,255,0.05)]"
                       : "border-cyan-300 shadow-sm"
                  : ""
              }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Name + active badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${hd}`}>{route.name}</span>
                    {route.active && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                        dk ? "text-green-400 bg-green-500/10 border-green-500/20"
                           : "text-green-700 bg-green-50 border-green-200"
                      }`}>
                        <span className="pulse-dot inline-block w-1 h-1 rounded-full bg-green-400 mr-1 mb-px" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] mb-2 ${sub}`}>{route.desc}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {route.tags.map((t) => (
                      <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold uppercase tracking-wide ${tags[t] ?? ""}`}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4">
                    {[
                      { icon: "📍", val: `${route.waypoints} waypoints` },
                      { icon: "📏", val: route.distance },
                      { icon: "⏱", val: route.duration },
                      { icon: "🕒", val: route.lastRun },
                    ].map(({ icon, val }) => (
                      <span key={val} className={`text-[10px] ${sub}`}>
                        {icon} {val}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => setActiveId(route.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                      isActive
                        ? dk ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                             : "bg-cyan-100 border-cyan-300 text-cyan-700"
                        : dk ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                             : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {isActive ? "✓ Loaded" : "Load Route"}
                  </button>
                  <button className={`px-3 py-1.5 rounded-lg text-[11px] transition-all border ${
                    dk ? "border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/15"
                       : "border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
                  }`}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
