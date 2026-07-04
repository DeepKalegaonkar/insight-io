"use client";

import React, { useState } from "react";
import { useApp, type TabKey } from "@/contexts/AppContext";

// ── Icons ──────────────────────────────────────────────────────────────────────
const Icons = {
  Grid: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7" rx="0.5" />
      <rect x="14" y="3" width="7" height="7" rx="0.5" />
      <rect x="3" y="14" width="7" height="7" rx="0.5" />
      <rect x="14" y="14" width="7" height="7" rx="0.5" />
    </svg>
  ),
  Map: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path d="M3 17l6-8 4 4 4-5 4 9H3z" />
    </svg>
  ),
  Pin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  Flag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  Wave: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Gear: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  ),
  Person: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ),
};

const navItems: { key: TabKey; label: string; Icon: () => React.ReactElement }[] = [
  { key: "dashboard",  label: "Dashboard",  Icon: Icons.Grid  },
  { key: "waypoints",  label: "Waypoints",  Icon: Icons.Map   },
  { key: "location",   label: "Location",   Icon: Icons.Pin   },
  { key: "routes",     label: "Routes",     Icon: Icons.Flag  },
  { key: "analytics",  label: "Analytics",  Icon: Icons.Wave  },
];

// ── Settings panel ─────────────────────────────────────────────────────────────
function SettingsPanel({
  onClose,
  isDark,
  onToggleTheme,
}: {
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const p  = isDark ? "bg-[#0f1a26] border-white/10 text-white/90"      : "bg-white border-slate-200 text-slate-900";
  const hd = isDark ? "border-white/5 text-white"                       : "border-slate-100 text-slate-900";
  const row = isDark ? "bg-white/5 hover:bg-white/8"                    : "bg-slate-50 hover:bg-slate-100";
  const sub = isDark ? "text-slate-500"                                  : "text-slate-400";

  return (
    <>
      {/* Click-outside backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div
        className={`fixed left-[76px] bottom-14 z-50 w-60 rounded-2xl border shadow-2xl overflow-hidden transition-colors duration-200 ${p}`}
      >
        {/* Header */}
        <div className={`px-4 py-3 border-b ${hd} flex items-center justify-between`}>
          <span className="text-[11px] font-bold uppercase tracking-widest">Settings</span>
          <button
            onClick={onClose}
            className={`text-[10px] ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"} transition-colors`}
          >
            ✕
          </button>
        </div>

        <div className="p-3 flex flex-col gap-2">
          {/* ── Appearance ── */}
          <p className={`px-1 text-[9px] uppercase tracking-widest font-semibold ${sub}`}>Appearance</p>

          <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${row} transition-colors`}>
            <div className="flex items-center gap-2.5">
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                {isDark ? <Icons.Moon /> : <Icons.Sun />}
              </span>
              <div>
                <p className="text-[11px] font-semibold leading-tight">Dark Mode</p>
                <p className={`text-[9px] ${sub}`}>
                  {isDark ? "Currently active" : "Tap to enable"}
                </p>
              </div>
            </div>
            {/* Toggle switch — ON (knob right) = dark mode active */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`relative inline-flex items-center flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
                isDark ? "bg-cyan-600" : "bg-slate-300"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span
                className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  isDark ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* ── Display ── */}
          <p className={`px-1 mt-1 text-[9px] uppercase tracking-widest font-semibold ${sub}`}>Display</p>

          {[
            { label: "Show Grid Overlay",   sub2: "3D map grid lines"     },
            { label: "Show HUD Labels",     sub2: "Camera info overlays"  },
            { label: "Compact Controls",    sub2: "Smaller D-pad & E-stop"},
          ].map(({ label, sub2 }) => (
            <ToggleRow key={label} label={label} sub={sub2} isDark={isDark} rowCls={row} subCls={sub} />
          ))}

          {/* ── Notifications ── */}
          <p className={`px-1 mt-1 text-[9px] uppercase tracking-widest font-semibold ${sub}`}>Notifications</p>

          {[
            { label: "Alert Sounds",    sub2: "Play on warnings"     },
            { label: "Mission Updates", sub2: "Waypoint progress"    },
          ].map(({ label, sub2 }) => (
            <ToggleRow key={label} label={label} sub={sub2} isDark={isDark} rowCls={row} subCls={sub} defaultOn />
          ))}
        </div>

        {/* Footer */}
        <div className={`px-4 py-2 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
          <p className={`text-[9px] ${sub} text-center`}>Insight.IO v1.0.0 · ERIC Robotics</p>
        </div>
      </div>
    </>
  );
}

function ToggleRow({
  label, sub, isDark, rowCls, subCls, defaultOn = false,
}: {
  label: string; sub: string; isDark: boolean; rowCls: string; subCls: string; defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${rowCls} transition-colors`}>
      <div>
        <p className="text-[11px] font-medium">{label}</p>
        <p className={`text-[9px] ${subCls}`}>{sub}</p>
      </div>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => setOn((o) => !o)}
        className={`relative inline-flex items-center flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 ${
          on ? (isDark ? "bg-cyan-600" : "bg-cyan-500") : (isDark ? "bg-slate-700" : "bg-slate-300")
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { theme, toggleTheme, activeTab, setActiveTab } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const dk = theme === "dark";

  const aside  = dk ? "bg-[#0b0f15] border-white/5"      : "bg-white border-slate-200";
  const divdr  = dk ? "border-white/5"                    : "border-slate-200";
  const active = dk ? "bg-white/10 text-white"            : "bg-slate-100 text-slate-900";
  const idle   = dk ? "text-slate-600 hover:text-slate-300 hover:bg-white/5"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100";

  return (
    <>
      <aside
        className={`flex flex-col w-[72px] h-full border-r shrink-0 transition-colors duration-300 ${aside}`}
      >
        {/* ── ERIC ROBOTICS logo ── */}
        <div className={`flex flex-col items-center justify-center h-[60px] border-b shrink-0 gap-0.5 ${divdr}`}>
          {/* "ERIC" — large, two-tone */}
          <span className="font-black text-[15px] tracking-tight leading-none select-none">
            <span className={dk ? "text-white" : "text-slate-900"}>ER</span>
            <span className={dk ? "text-cyan-400" : "text-cyan-600"}>IC</span>
          </span>
          {/* "ROBOTICS" — small, widely tracked */}
          <span
            className={`text-[6px] font-bold tracking-[0.38em] uppercase leading-none select-none ${
              dk ? "text-slate-500" : "text-slate-400"
            }`}
          >
            ROBOTICS
          </span>
        </div>

        {/* ── Nav icons ── */}
        <nav className="flex-1 flex flex-col items-center gap-1.5 pt-4 px-2.5">
          {navItems.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              title={label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                activeTab === key ? active : idle
              }`}
            >
              <Icon />
            </button>
          ))}
        </nav>

        {/* ── Bottom controls ── */}
        <div className={`flex flex-col items-center gap-1.5 pb-4 pt-3 border-t px-2.5 ${divdr}`}>
          <button
            onClick={() => setShowSettings((s) => !s)}
            title="Settings"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
              showSettings ? active : idle
            }`}
          >
            <Icons.Gear />
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            title="Profile"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
              activeTab === "profile" ? active : idle
            }`}
          >
            <Icons.Person />
          </button>
        </div>
      </aside>

      {/* ── Settings panel ── */}
      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          isDark={dk}
          onToggleTheme={toggleTheme}
        />
      )}
    </>
  );
}
