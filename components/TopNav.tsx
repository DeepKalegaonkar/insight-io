"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

export default function TopNav() {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const headerBg  = isDark ? "bg-[#0a1520] border-[#1e3a5f]" : "bg-white border-slate-200";
  const crumbBase = isDark ? "text-slate-500"                 : "text-slate-400";
  const crumbRoot = isDark ? "text-slate-400"                 : "text-slate-600";
  const crumbAct  = isDark ? "text-cyan-400"                  : "text-cyan-600";
  const missionLbl = isDark ? "text-slate-600"                : "text-slate-400";
  const missionName = isDark ? "text-slate-300"               : "text-slate-700";
  const clockText  = isDark ? "text-slate-400"                : "text-slate-500";
  const clockIcon  = isDark ? "text-slate-600"                : "text-slate-400";
  const bellIcon   = isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600";

  return (
    <header className={`flex items-center justify-between h-14 px-4 border-b shrink-0 transition-colors duration-300 ${headerBg}`}>
      {/* Breadcrumb */}
      <div className={`flex items-center gap-2 text-xs ${crumbBase}`}>
        <span className={crumbRoot}>Insight.IO</span>
        <span>/</span>
        <span className={crumbAct}>Live Dashboard</span>
      </div>

      {/* Center — mission label */}
      <div className="hidden md:flex items-center gap-3">
        <span className={`text-[10px] uppercase tracking-widest ${missionLbl}`}>Mission</span>
        <span className={`text-xs font-semibold ${missionName}`}>AUTONOMOUS-NAV-07</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          <span className="text-[10px] text-green-400 uppercase tracking-wider">Active</span>
        </div>
      </div>

      {/* Right — clock, alerts, user */}
      <div className="flex items-center gap-4">
        <div className={`hidden sm:flex items-center gap-1.5 text-xs font-mono ${clockText}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={`w-3.5 h-3.5 ${clockIcon}`}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {time}
        </div>

        {/* Alert bell */}
        <button className={`relative transition-colors ${bellIcon}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-black font-bold">
            2
          </span>
        </button>

        {/* Network indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 text-cyan-500">
            <path d="M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M10.54 16.1a6 6 0 012.92 0M12 20h.01" />
          </svg>
          <span className="text-cyan-500">Connected</span>
        </div>

        {/* User avatar */}
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-[10px] font-bold uppercase">
          ER
        </div>
      </div>
    </header>
  );
}
