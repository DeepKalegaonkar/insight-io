"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import { useRobotMetrics } from "@/hooks/useRobotMetrics";

const MAX_HISTORY = 30;

type History = { battery: number[]; speed: number[]; signal: number[]; temp: number[] };

// Simple sparkline SVG
function Sparkline({
  data, color, height = 36,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  if (data.length < 2) return null;
  const w = 120, h = height;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min + 0.001)) * (h - 4) - 2}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// Single metric bar
function MetricBar({
  label, value, max, unit, color, bgTrack, textColor, subText, history,
}: {
  label: string; value: number; max: number; unit: string;
  color: string; bgTrack: string; textColor: string; subText?: string;
  history: number[];
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={`rounded-xl border p-4 ${bgTrack}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${textColor}`}>{label}</span>
        <span className={`text-lg font-bold font-mono ${textColor}`}>
          {typeof value === "number" ? value.toFixed(value < 10 ? 1 : 0) : value}
          <span className="text-[11px] ml-0.5 font-normal opacity-60">{unit}</span>
        </span>
      </div>

      {/* Bar */}
      <div className="h-2 rounded-full bg-black/10 mb-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>

      {/* Sparkline + subtext */}
      <div className="flex items-end justify-between gap-2">
        <div className="flex-1 opacity-60">
          <Sparkline data={history} color={color} height={28} />
        </div>
        {subText && <span className="text-[10px] opacity-50 whitespace-nowrap">{subText}</span>}
      </div>
    </div>
  );
}

export default function AnalyticsView() {
  const { theme } = useApp();
  const m = useRobotMetrics();
  const dk = theme === "dark";
  const histRef = useRef<History>({ battery: [], speed: [], signal: [], temp: [] });

  useEffect(() => {
    const h = histRef.current;
    h.battery = [...h.battery.slice(-(MAX_HISTORY - 1)), m.battery];
    h.speed   = [...h.speed.slice(-(MAX_HISTORY - 1)),   m.speed];
    h.signal  = [...h.signal.slice(-(MAX_HISTORY - 1)),  m.signal];
    h.temp    = [...h.temp.slice(-(MAX_HISTORY - 1)),    m.temperature];
  }, [m]);

  const hd    = dk ? "text-white/90"               : "text-slate-900";
  const sub   = dk ? "text-slate-500"              : "text-slate-400";
  const card  = dk ? "bg-[#0f1a26] border-white/5" : "bg-white border-slate-200";

  const bars = [
    {
      label: "Battery",
      value: m.battery,
      max: 100,
      unit: "%",
      color: m.battery < 30 ? "#f59e0b" : "#22c55e",
      bgTrack: card,
      textColor: dk ? (m.battery < 30 ? "text-amber-400" : "text-green-400") : (m.battery < 30 ? "text-amber-600" : "text-green-700"),
      subText: m.battery < 30 ? "Low — recharge soon" : "Nominal",
      history: histRef.current.battery,
    },
    {
      label: "Speed",
      value: m.speed,
      max: 3,
      unit: "m/s",
      color: "#00d4ff",
      bgTrack: card,
      textColor: dk ? "text-cyan-400" : "text-cyan-700",
      subText: "Linear velocity",
      history: histRef.current.speed,
    },
    {
      label: "Signal",
      value: m.signal,
      max: 100,
      unit: "%",
      color: "#22c55e",
      bgTrack: card,
      textColor: dk ? "text-green-400" : "text-green-700",
      subText: "ROS bridge",
      history: histRef.current.signal,
    },
    {
      label: "Temperature",
      value: m.temperature,
      max: 80,
      unit: "°C",
      color: m.temperature > 45 ? "#f59e0b" : "#00d4ff",
      bgTrack: card,
      textColor: dk ? (m.temperature > 45 ? "text-amber-400" : "text-cyan-400") : (m.temperature > 45 ? "text-amber-600" : "text-cyan-700"),
      subText: "CPU / MCU",
      history: histRef.current.temp,
    },
  ];

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h2 className={`text-base font-bold ${hd}`}>Performance Analytics</h2>
        <p className={`text-[11px] mt-0.5 ${sub}`}>Live telemetry · {m.uptime} session uptime</p>
      </div>

      {/* Stats summary row */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4`}>
        {[
          { label: "Avg Speed",    val: "1.4 m/s",  color: dk ? "text-cyan-400"  : "text-cyan-700"  },
          { label: "Peak Speed",   val: "2.1 m/s",  color: dk ? "text-cyan-400"  : "text-cyan-700"  },
          { label: "Distance",     val: "134 m",    color: dk ? "text-white/80"  : "text-slate-800" },
          { label: "Battery Used", val: "22%",      color: dk ? "text-amber-400" : "text-amber-600" },
        ].map(({ label, val, color }) => (
          <div key={label} className={`rounded-xl border p-3 ${card}`}>
            <p className={`text-[10px] uppercase tracking-widest ${sub}`}>{label}</p>
            <p className={`text-xl font-bold font-mono mt-1 ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Metric bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bars.map((b) => <MetricBar key={b.label} {...b} />)}
      </div>

      {/* Session info */}
      <div className={`mt-4 rounded-xl border p-4 ${card}`}>
        <p className={`text-[10px] uppercase tracking-widest mb-3 ${sub}`}>Session Info</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Uptime",     val: m.uptime },
            { label: "Mission ID", val: "1234"   },
            { label: "Robot ID",   val: "ERIC-01" },
            { label: "Mode",       val: "AUTO"    },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className={`text-[10px] uppercase tracking-widest ${sub}`}>{label}</p>
              <p className={`text-sm font-mono font-semibold mt-0.5 ${dk ? "text-white/80" : "text-slate-700"}`}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
