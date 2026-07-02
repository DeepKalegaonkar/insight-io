"use client";

import { useApp } from "@/contexts/AppContext";
import { useRobotMetrics } from "@/hooks/useRobotMetrics";

// Compass rose SVG that rotates with heading
function CompassRose({ heading, isDark }: { heading: number; isDark: boolean }) {
  const ring  = isDark ? "#1e3a5f" : "#e2e8f0";
  const tick  = isDark ? "#334155" : "#cbd5e1";
  const label = isDark ? "#94a3b8" : "#64748b";
  const north = isDark ? "#00d4ff" : "#0891b2";
  const needl = isDark ? "#ef4444" : "#dc2626";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 160 160" className="w-36 h-36">
        {/* Outer ring */}
        <circle cx="80" cy="80" r="74" fill="none" stroke={ring} strokeWidth="2" />
        <circle cx="80" cy="80" r="60" fill="none" stroke={ring} strokeWidth="1" strokeDasharray="4 4" />

        {/* Cardinal ticks */}
        {[0,90,180,270].map((a) => {
          const r = (a * Math.PI) / 180;
          return (
            <line key={a}
              x1={80 + 60 * Math.sin(r)} y1={80 - 60 * Math.cos(r)}
              x2={80 + 74 * Math.sin(r)} y2={80 - 74 * Math.cos(r)}
              stroke={tick} strokeWidth="2" />
          );
        })}
        {/* Minor ticks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i * 10 * Math.PI) / 180;
          const isMajor = i % 9 === 0;
          if (isMajor) return null;
          return (
            <line key={i}
              x1={80 + 66 * Math.sin(a)} y1={80 - 66 * Math.cos(a)}
              x2={80 + 74 * Math.sin(a)} y2={80 - 74 * Math.cos(a)}
              stroke={tick} strokeWidth="1" />
          );
        })}

        {/* Cardinal labels */}
        {[["N",80,10],["E",152,84],["S",80,156],["W",8,84]].map(([l,x,y]) => (
          <text key={l as string} x={x as number} y={y as number} textAnchor="middle" dominantBaseline="middle"
            fontSize="11" fontWeight="bold" fontFamily="monospace"
            fill={l === "N" ? north : label}>{l}</text>
        ))}

        {/* Rotating needle group */}
        <g transform={`rotate(${heading}, 80, 80)`}>
          {/* North needle (red) */}
          <polygon points="80,20 83,80 80,86 77,80" fill={needl} />
          {/* South needle (dark) */}
          <polygon points="80,140 83,80 80,74 77,80" fill={isDark ? "#334155" : "#94a3b8"} />
          {/* Center dot */}
          <circle cx="80" cy="80" r="5" fill={isDark ? "#0d1117" : "#f1f5f9"} stroke={ring} strokeWidth="1.5" />
        </g>
      </svg>
      <div className={`text-center font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        <p className="text-[10px] uppercase tracking-widest">Heading</p>
        <p className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          {heading.toFixed(0).padStart(3, "0")}°
        </p>
      </div>
    </div>
  );
}

export default function LocationView() {
  const { theme } = useApp();
  const m = useRobotMetrics();
  const dk = theme === "dark";

  const hd   = dk ? "text-white/90"               : "text-slate-900";
  const sub  = dk ? "text-slate-500"              : "text-slate-400";
  const card = dk ? "bg-[#0f1a26] border-white/5" : "bg-white border-slate-200";
  const mono = dk ? "text-cyan-400 font-mono"     : "text-cyan-700 font-mono";

  const MetricCard = ({
    label, value, unit, color,
  }: { label: string; value: string; unit: string; color: string }) => (
    <div className={`flex flex-col rounded-xl border p-4 ${card}`}>
      <p className={`text-[10px] uppercase tracking-widest mb-1 ${sub}`}>{label}</p>
      <p className={`text-2xl font-bold font-mono ${color}`}>
        {value}<span className={`text-sm ml-1 font-normal ${sub}`}>{unit}</span>
      </p>
    </div>
  );

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <div className="mb-5">
        <h2 className={`text-base font-bold ${hd}`}>Robot Location</h2>
        <p className={`text-[11px] mt-0.5 ${sub}`}>Live GPS telemetry · Updates every 2 s</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* GPS coordinates */}
        <div className={`lg:col-span-2 rounded-xl border p-5 ${card}`}>
          <p className={`text-[10px] uppercase tracking-widest mb-4 ${sub}`}>GPS Position</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: "Latitude",   val: "37.7749° N" },
              { label: "Longitude",  val: "122.4194° W" },
              { label: "Altitude",   val: "5.2 m" },
              { label: "Accuracy",   val: "±0.5 m" },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className={`text-[10px] uppercase tracking-widest ${sub}`}>{label}</p>
                <p className={`text-xl font-bold mt-1 ${mono}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* Simple position grid */}
          <div className={`mt-5 rounded-lg overflow-hidden border ${dk ? "border-white/5 bg-[#0d1117]" : "border-slate-200 bg-slate-50"} p-3`}>
            <p className={`text-[10px] uppercase tracking-widest mb-2 ${sub}`}>Local Grid (10 m × 10 m)</p>
            <div className="relative w-full h-24">
              {/* Grid lines */}
              {[0,25,50,75,100].map((p) => (
                <div key={p}
                  className={`absolute inset-y-0 border-l ${dk ? "border-white/5" : "border-slate-200"}`}
                  style={{ left: `${p}%` }} />
              ))}
              {[0,33,66,100].map((p) => (
                <div key={p}
                  className={`absolute inset-x-0 border-t ${dk ? "border-white/5" : "border-slate-200"}`}
                  style={{ top: `${p}%` }} />
              ))}
              {/* Robot dot */}
              <div className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d4ff]"
                style={{ left: "52%", top: "44%", transform: "translate(-50%,-50%)" }} />
              {/* Pulse ring */}
              <div className="absolute w-6 h-6 rounded-full border border-cyan-400/40 animate-ping"
                style={{ left: "52%", top: "44%", transform: "translate(-50%,-50%)" }} />
            </div>
          </div>
        </div>

        {/* Compass */}
        <div className={`flex items-center justify-center rounded-xl border p-5 ${card}`}>
          <CompassRose heading={m.heading} isDark={dk} />
        </div>
      </div>

      {/* Live metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <MetricCard label="Speed"       value={m.speed.toFixed(1)} unit="m/s"  color={dk ? "text-cyan-400"  : "text-cyan-700"}  />
        <MetricCard label="Battery"     value={m.battery.toFixed(0)} unit="%"  color={dk ? "text-green-400" : "text-green-700"} />
        <MetricCard label="Temperature" value={m.temperature.toFixed(0)} unit="°C" color={dk ? "text-amber-400" : "text-amber-600"} />
        <MetricCard label="Signal"      value={`${m.signal}`} unit="%"          color={dk ? "text-green-400" : "text-green-700"} />
      </div>
    </div>
  );
}
