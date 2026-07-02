"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useApp } from "@/contexts/AppContext";
import WaypointsView from "@/components/tabs/WaypointsView";
import LocationView  from "@/components/tabs/LocationView";
import RoutesView    from "@/components/tabs/RoutesView";
import AnalyticsView from "@/components/tabs/AnalyticsView";

const MapView3D = dynamic(() => import("@/components/MapView3D"), {
  ssr: false,
  loading: () => (
    // bg matches the map canvas colour so there's no flash
    <div className="w-full h-full flex items-center justify-center"
      style={{ background: "var(--map-bg, #c8c8be)" }}>
      <div className="w-8 h-8 rounded-full border-2 border-slate-400/40 border-t-slate-600 animate-spin" />
    </div>
  ),
});

// ─── Camera feed ──────────────────────────────────────────────────────────────
function CameraFeed({ compact = false }: { compact?: boolean }) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const [hasVideo, setHasVideo] = useState(false);

  const fallbackBg  = isDark ? "bg-[#161c24]"  : "bg-slate-100";
  const iconColor   = isDark ? "text-slate-600" : "text-slate-400";
  const hintColor   = isDark ? "text-slate-600" : "text-slate-400";

  return (
    <div className="relative w-full h-full overflow-hidden">
      <video
        className="w-full h-full object-cover"
        src="/assets/sample.mp4"
        autoPlay loop muted playsInline
        onLoadedData={() => setHasVideo(true)}
        onError={() => setHasVideo(false)}
      />
      {!hasVideo && (
        <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${fallbackBg}`}>
          <div className="text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}
              className={`w-10 h-10 mx-auto mb-2 ${iconColor}`}>
              <rect x="2" y="7" width="20" height="15" rx="2" />
              <path d="M17 7V5a1 1 0 00-1-1H8a1 1 0 00-1 1v2" />
            </svg>
            {!compact && (
              <p className={`text-[10px] tracking-wider ${hintColor}`}>
                Add sample.mp4 → /public/assets/
              </p>
            )}
          </div>
        </div>
      )}
      {!compact && <div className="absolute inset-0 pointer-events-none scanlines" />}
    </div>
  );
}

// ─── Mini floor-plan (PiP when in camera mode) ───────────────────────────────
function MapFloorPlan() {
  return (
    <div className="w-full h-full bg-[#d4d4cc]">
      <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <rect x="18" y="12" width="164" height="136" fill="white" stroke="#aaa" strokeWidth="1" />
        <rect x="18" y="12" width="68"  height="58" fill="#f5f5ef" stroke="#bbb" strokeWidth="0.5" />
        <rect x="86" y="12" width="96"  height="58" fill="#ffe8e8" stroke="#bbb" strokeWidth="0.5" />
        <rect x="18" y="70" width="48"  height="78" fill="#ffe4e4" stroke="#bbb" strokeWidth="0.5" />
        <rect x="66" y="70" width="116" height="78" fill="#f5f5ef" stroke="#bbb" strokeWidth="0.5" />
        <line x1="86" y1="12" x2="86"  y2="70" stroke="#aaa" strokeWidth="1" />
        <line x1="66" y1="70" x2="66"  y2="148" stroke="#aaa" strokeWidth="1" />
        <line x1="18" y1="70" x2="182" y2="70"  stroke="#aaa" strokeWidth="1" />
        <path d="M 28 142 L 50 142 L 50 105 L 72 105 L 72 68 L 90 68 L 90 40 L 120 40 L 120 22"
          fill="none" stroke="#cc2222" strokeWidth="1.5" />
        {[[30,45],[55,28],[100,35],[148,28],[168,55],[95,88],[130,108],[72,128],[158,138],[42,88]].map(
          ([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="1.8" fill="#555" opacity="0.4" />
        )}
        <circle cx="90" cy="68" r="6" fill="none" stroke="#cc2222" strokeWidth="1.5" />
        <circle cx="90" cy="68" r="2.5" fill="#cc2222" />
        <line x1="90" y1="62" x2="90" y2="58" stroke="#cc2222" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// ─── Emergency Stop ───────────────────────────────────────────────────────────
function EmergencyStop() {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className={`relative w-[76px] h-[76px] rounded-full select-none transition-transform duration-75 drop-shadow-xl ${
        pressed ? "scale-90" : "scale-100 hover:scale-105"
      }`}
      title="Emergency Stop"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <path id="e-top" d="M 14,50 A 36,36 0 0,1 86,50" />
          <path id="e-bot" d="M 86,50 A 36,36 0 0,1 14,50" />
        </defs>
        <circle cx="50" cy="50" r="48" fill="#111800" stroke="#facc15" strokeWidth="4.5" />
        <circle cx="50" cy="50" r="35" fill={pressed ? "#7f1d1d" : "#991b1b"} />
        <circle cx="50" cy="50" r="29" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.4" />
        <circle cx="50" cy="50" r="11" fill="none" stroke="white" strokeWidth="2.5" />
        <line x1="50" y1="38" x2="50" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <text fill="#facc15" fontSize="7" fontWeight="bold" letterSpacing="1.8" fontFamily="monospace">
          <textPath href="#e-top" startOffset="50%" textAnchor="middle">EMERGENCY</textPath>
        </text>
        <text fill="#facc15" fontSize="7" fontWeight="bold" letterSpacing="3" fontFamily="monospace">
          <textPath href="#e-bot" startOffset="50%" textAnchor="middle">STOP</textPath>
        </text>
      </svg>
    </button>
  );
}

// ─── D-Pad ────────────────────────────────────────────────────────────────────
function DPad() {
  const Btn = ({ cls, rotate, title }: { cls: string; rotate: string; title: string }) => (
    <button title={title}
      className={`${cls} w-7 h-7 rounded-full bg-[#1c2b3a] hover:bg-[#263d52] active:bg-[#162232] border border-[#2a3d54] flex items-center justify-center text-slate-300 hover:text-white transition-all`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className={`w-3 h-3 ${rotate}`}>
        <path d="M12 5l8 10H4z" />
      </svg>
    </button>
  );
  return (
    <div className="relative w-[88px] h-[88px]">
      <div className="absolute inset-0 rounded-full bg-[#0f1a24] border border-[#1c2b3a]" />
      <Btn cls="absolute top-1 left-1/2 -translate-x-1/2"   rotate=""            title="Forward"  />
      <Btn cls="absolute bottom-1 left-1/2 -translate-x-1/2" rotate="rotate-180" title="Backward" />
      <Btn cls="absolute left-1 top-1/2 -translate-y-1/2"   rotate="-rotate-90"  title="Left"     />
      <Btn cls="absolute right-1 top-1/2 -translate-y-1/2"  rotate="rotate-90"   title="Right"    />
      <div className="absolute inset-[36%] rounded-full bg-[#0b1520] border border-[#1c2b3a]" />
    </div>
  );
}

// ─── Vertical slider ─────────────────────────────────────────────────────────
function VerticalSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="relative w-4 h-36 flex items-center justify-center">
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/15 rounded-full" />
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="absolute left-1/2 bg-white/20"
          style={{ top: `${(i / 6) * 100}%`, width: i % 3 === 0 ? "8px" : "5px", height: "1px",
                   marginLeft: i % 3 === 0 ? "-4px" : "-2.5px" }} />
      ))}
      <div className="absolute left-1/2 w-3 h-1.5 bg-white rounded-sm border border-white/50 shadow"
        style={{ top: `${100 - value}%`, transform: "translate(-50%, -50%)" }} />
      <input type="range" min="0" max="100" value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="vertical-slider absolute inset-0 opacity-0 cursor-pointer" />
    </div>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────
function TopBar({
  view, toggleView, mode, setMode, isDark,
}: {
  view: "camera" | "map";
  toggleView: () => void;
  mode: "auto" | "manual";
  setMode: (m: "auto" | "manual") => void;
  isDark: boolean;
}) {
  const bar    = isDark ? "bg-[#0b0f15] border-white/5"    : "bg-white border-slate-200";
  const txt    = isDark ? "text-white/90"                  : "text-slate-900";
  const sub    = isDark ? "text-slate-500"                 : "text-slate-400";
  const ring   = isDark ? "border-white/10 hover:border-white/25 text-slate-400 hover:text-white"
                        : "border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-700";
  const modeBase = isDark ? "border-white/10"             : "border-slate-200";
  const modeOn   = isDark ? "bg-white/15 text-white"       : "bg-slate-100 text-slate-900";
  const modeOff  = isDark ? "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-50";
  const initiate = isDark ? "bg-white/8 hover:bg-white/12 border-white/10 hover:border-white/20 text-slate-200 hover:text-white"
                          : "bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900";

  return (
    <header className={`flex items-center h-12 border-b px-3 gap-3 shrink-0 transition-colors duration-300 ${bar}`}>
      {/* Status / Mission */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] uppercase tracking-wider hidden sm:inline ${sub}`}>Status:</span>
        <span className={`text-xs font-medium whitespace-nowrap ${txt}`}>On Mission 1234</span>
        <button title="Pause mission"
          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ml-0.5 ${ring}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
            <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
          </svg>
        </button>
      </div>

      {/* System indicators */}
      <div className="hidden md:flex items-center gap-2 text-[10px] shrink-0">
        <div className="flex items-center gap-1 text-green-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <rect x="2" y="7" width="18" height="10" rx="2" /><path d="M20 11h2v2h-2" />
          </svg>
          <span>100%</span>
        </div>
        <span className={isDark ? "text-white/10" : "text-slate-200"}>|</span>
        <div className="flex items-center gap-1 text-green-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <path d="M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M10.54 16.1a6 6 0 012.92 0M12 20h.01" />
          </svg>
          <span>Strong</span>
        </div>
        <span className={isDark ? "text-white/10" : "text-slate-200"}>|</span>
        <span className={sub}>Failsafe: <span className="text-green-400">Okay</span></span>
        <span className={isDark ? "text-white/10" : "text-slate-200"}>|</span>
        <span className={sub}>System: <span className="text-green-400">Okay</span></span>
      </div>

      {/* Centre — view label (only meaningful on dashboard tab) */}
      <div className="flex-1 flex justify-center">
        <button onClick={toggleView}
          className={`text-[11px] px-3 py-1 rounded transition-colors font-medium ${
            isDark ? "text-white/60 hover:text-white hover:bg-white/5"
                   : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}>
          {view === "camera" ? "Camera View" : "Map View"}
        </button>
      </div>

      {/* Right — MODE + INITIATE */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] uppercase tracking-wider hidden sm:inline ${sub}`}>MODE</span>
        <div className={`flex rounded overflow-hidden border text-[10px] font-medium ${modeBase}`}>
          {(["auto", "manual"] as const).map((m, i) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-2.5 py-1 transition-colors ${i === 1 ? `border-l ${modeBase}` : ""} ${
                mode === m ? modeOn : modeOff
              }`}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>
        <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-[11px] font-medium transition-all ${initiate}`}>
          INITIATE
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </header>
  );
}

// ─── PiP overlay with hover tooltip ──────────────────────────────────────────
function PiPOverlay({
  view, onToggle,
}: {
  view: "camera" | "map";
  onToggle: () => void;
}) {
  const label = view === "camera" ? "Switch to Map View" : "Switch to Camera View";

  return (
    <div className="absolute bottom-4 left-14 z-10 flex items-end gap-2">
      {/* Vertical slider */}
      <VerticalSlider value={68} onChange={() => {}} />

      {/* PiP box */}
      <div className="relative w-[175px] h-[128px] border border-white/15 rounded overflow-hidden shadow-lg bg-black group cursor-pointer"
        onClick={onToggle}>
        {/* Hover overlay with tooltip */}
        <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center pointer-events-none">
          <span className="text-white text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center px-2 leading-tight drop-shadow">
            {label}
          </span>
        </div>

        {/* Expand arrow (top-left) */}
        <div className="absolute top-1 left-1 z-30 w-5 h-5 bg-black/60 rounded flex items-center justify-center text-white/60 group-hover:text-white transition-colors pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-2.5 h-2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>

        {/* Content */}
        {view === "camera" ? <MapFloorPlan /> : <CameraFeed compact />}
      </div>
    </div>
  );
}

// ─── Dashboard tab (full-bleed camera / map with all overlays) ────────────────
function DashboardView({ isDark }: { isDark: boolean }) {
  const [view, setView]   = useState<"camera" | "map">("camera");
  const [mode, setMode]   = useState<"auto" | "manual">("auto");
  const toggleView = useCallback(() => setView((v) => (v === "camera" ? "map" : "camera")), []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-w-0">
      <TopBar view={view} toggleView={toggleView} mode={mode} setMode={setMode} isDark={isDark} />

      <div className="flex-1 relative overflow-hidden">
        {/* Main view */}
        <div className="absolute inset-0">
          {view === "camera" ? <CameraFeed /> : <MapView3D />}
        </div>

        {/* Quick Goal */}
        <div className="absolute top-3 left-3 z-10">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded text-[11px] text-white/80 hover:text-white transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
              <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
            QUICK GOAL
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* PiP + slider */}
        <PiPOverlay view={view} onToggle={toggleView} />

        {/* Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center gap-3">
          <EmergencyStop />
          <DPad />
        </div>
      </div>
    </div>
  );
}

// ─── Content tab wrapper (non-dashboard tabs) ─────────────────────────────────
function ContentView({
  isDark, children,
}: {
  isDark: boolean;
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const noop = () => {};

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-w-0">
      <TopBar view="camera" toggleView={noop} mode={mode} setMode={setMode} isDark={isDark} />
      <div className={`flex-1 overflow-y-auto transition-colors duration-300 ${
        isDark ? "bg-[#0d1117]" : "bg-slate-100"
      }`}>
        {children}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function DashboardMain() {
  const { theme, activeTab } = useApp();
  const isDark = theme === "dark";

  if (activeTab === "dashboard") {
    return <DashboardView isDark={isDark} />;
  }

  return (
    <ContentView isDark={isDark}>
      {activeTab === "waypoints" && <WaypointsView />}
      {activeTab === "location"  && <LocationView  />}
      {activeTab === "routes"    && <RoutesView     />}
      {activeTab === "analytics" && <AnalyticsView  />}
    </ContentView>
  );
}
