"use client";

import { useEffect, useState } from "react";

export default function TopNav() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-[#1e3a5f] bg-[#0a1520] shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="text-slate-400">Insight.IO</span>
        <span>/</span>
        <span className="text-cyan-400">Live Dashboard</span>
      </div>

      {/* Center — mission label */}
      <div className="hidden md:flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-600">Mission</span>
        <span className="text-xs text-slate-300 font-semibold">AUTONOMOUS-NAV-07</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          <span className="text-[10px] text-green-400 uppercase tracking-wider">Active</span>
        </div>
      </div>

      {/* Right — clock, alerts, user */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 text-slate-600">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {time}
        </div>

        {/* Alert bell */}
        <button className="relative text-slate-500 hover:text-slate-300 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-black font-bold">
            2
          </span>
        </button>

        {/* Network indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider">
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
