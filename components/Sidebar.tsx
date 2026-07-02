"use client";

import { useState } from "react";

const navItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    label: "Dashboard",
    active: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      </svg>
    ),
    label: "Camera",
    active: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M3 17l6-8 4 4 3-5 5 9H3z" />
      </svg>
    ),
    label: "3D Map",
    active: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M9 17H7A5 5 0 017 7h2" />
        <path d="M15 7h2a5 5 0 010 10h-2" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    label: "ROS Bridge",
    active: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
      </svg>
    ),
    label: "Sensors",
    active: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    label: "Logs",
    active: false,
  },
];

const bottomItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    label: "Profile",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
    label: "Settings",
  },
];

export default function Sidebar() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <aside className="flex flex-col w-[60px] md:w-[220px] h-full bg-[#0a1520] border-r border-[#1e3a5f] shrink-0 transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-[#1e3a5f] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth={2} className="w-4 h-4">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="8.5" x2="22" y2="8.5" />
            <line x1="2" y1="15.5" x2="22" y2="15.5" />
          </svg>
        </div>
        <span className="hidden md:block text-cyan-400 font-bold tracking-widest text-sm uppercase">
          Insight<span className="text-slate-500">.IO</span>
        </span>
      </div>

      {/* Robot status */}
      <div className="hidden md:flex items-center gap-2 px-4 py-3 border-b border-[#1e3a5f]">
        <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Robot</div>
          <div className="text-xs text-green-400 font-semibold truncate">ERIC-01 Online</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActiveIdx(i)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group
              ${activeIdx === i
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"
              }`}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="hidden md:block text-xs font-medium truncate">{item.label}</span>
            {activeIdx === i && (
              <span className="hidden md:block ml-auto w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom items */}
      <div className="border-t border-[#1e3a5f] p-2 flex flex-col gap-1">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-150"
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="hidden md:block text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
