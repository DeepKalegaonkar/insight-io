"use client";

import { useEffect, useState } from "react";

export default function StatusBar() {
  const [ping, setPing] = useState(12);
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      setPing(Math.floor(Math.random() * 8) + 8);
      setDate(
        new Date().toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
    };
    update();
    const id = setInterval(update, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="flex items-center justify-between h-8 px-4 border-t border-[#1e3a5f] bg-[#080f18] shrink-0">
      <div className="flex items-center gap-4 text-[10px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          <span>rosbridge: ws://localhost:9090</span>
        </div>
        <span className="hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>Ping: {ping}ms</span>
        </div>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline">Nodes: 14 active</span>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-slate-600">
        <span className="hidden sm:inline">{date}</span>
        <span>|</span>
        <span>v0.1.0</span>
        <span>|</span>
        <div className="flex items-center gap-1 text-cyan-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>ERIC Robotics</span>
        </div>
      </div>
    </footer>
  );
}
