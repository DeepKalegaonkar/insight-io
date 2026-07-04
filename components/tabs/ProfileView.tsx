"use client";

import { useApp } from "@/contexts/AppContext";
import { useRobotMetrics } from "@/hooks/useRobotMetrics";
import { useRosbridge } from "@/hooks/useRosbridge";

// ─── Reusable card shell ───────────────────────────────────────────────────────
function Card({
  title, children, isDark,
}: {
  title: string; children: React.ReactNode; isDark: boolean;
}) {
  const bg  = isDark ? "bg-[#0f1a26] border-white/8"  : "bg-white border-slate-200";
  const hd  = isDark ? "border-white/5 text-white"    : "border-slate-100 text-slate-900";
  const sub = isDark ? "text-slate-500"                : "text-slate-400";
  return (
    <div className={`rounded-2xl border overflow-hidden ${bg}`}>
      <div className={`px-5 py-3 border-b ${hd}`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${sub}`}>{title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ─── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({
  label, value, valueClass = "", isDark,
}: {
  label: string; value: string; valueClass?: string; isDark: boolean;
}) {
  const lbl = isDark ? "text-slate-500" : "text-slate-400";
  const val = isDark ? "text-slate-200" : "text-slate-700";
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`text-[11px] ${lbl}`}>{label}</span>
      <span className={`text-[11px] font-medium ${valueClass || val}`}>{value}</span>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ProfileView() {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const m = useRobotMetrics();
  const { connected } = useRosbridge();

  const page   = isDark ? "bg-[#0d1117]"            : "bg-slate-100";
  const nameC  = isDark ? "text-white"               : "text-slate-900";
  const roleC  = isDark ? "text-cyan-400"            : "text-cyan-600";
  const sub    = isDark ? "text-slate-500"           : "text-slate-400";
  const divdr  = isDark ? "border-white/5"           : "border-slate-200";

  const batteryColor = m.battery < 20 ? "text-red-400" : m.battery < 35 ? "text-amber-400" : "text-green-400";
  const signalColor  = m.signal >= 90 ? "text-green-400" : m.signal >= 70 ? "text-amber-400" : "text-red-400";
  const tempColor    = m.temperature > 65 ? "text-red-400" : m.temperature > 50 ? "text-amber-400" : "text-green-400";

  return (
    <div className={`min-h-full p-6 transition-colors duration-300 ${page}`}>
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* ── Hero / Avatar ──────────────────────────────────────────────── */}
        <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#0f1a26] border-white/8" : "bg-white border-slate-200"}`}>
          {/* Banner */}
          <div className="h-20 bg-gradient-to-r from-cyan-900/60 via-blue-900/40 to-slate-900/60 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(255,255,255,.04) 20px,rgba(255,255,255,.04) 21px)" }} />
          </div>

          {/* Avatar + name */}
          <div className="px-6 pb-5">
            <div className="flex items-end gap-4 -mt-8 mb-4">
              {/* Avatar circle */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700
                flex items-center justify-center text-white text-xl font-black border-4
                shadow-lg select-none shrink-0
                border-[#0f1a26]">
                ER
              </div>
              <div className="pb-1">
                <h2 className={`text-base font-bold leading-tight ${nameC}`}>ERIC Operator</h2>
                <p className={`text-[11px] font-medium ${roleC}`}>Autonomous Navigation · Field Lead</p>
              </div>
              {/* Status badge */}
              <div className="ml-auto pb-1 flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-400" : "bg-slate-500"}`} />
                <span className={`text-[10px] font-medium ${connected ? "text-green-400" : sub}`}>
                  {connected ? "Robot Online" : "No Robot"}
                </span>
              </div>
            </div>

            {/* Tag row */}
            <div className="flex flex-wrap gap-2">
              {["ROS2 Humble", "Nav2", "SLAM", "Teleoperation"].map((tag) => (
                <span key={tag}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                    isDark
                      ? "bg-white/5 border-white/10 text-slate-400"
                      : "bg-slate-100 border-slate-200 text-slate-500"
                  }`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Two-column grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Operator Info */}
          <Card title="Operator Info" isDark={isDark}>
            <div className={`divide-y ${divdr}`}>
              <StatRow label="Operator ID"   value="OPR-0042"           isDark={isDark} />
              <StatRow label="Team"          value="Alpha Squad"        isDark={isDark} />
              <StatRow label="Base"          value="ERIC HQ, Bay Area"  isDark={isDark} />
              <StatRow label="Clearance"     value="Level 3"            isDark={isDark} />
              <StatRow label="Session"       value={m.uptime}           isDark={isDark} valueClass={isDark ? "text-cyan-400 font-mono" : "text-cyan-600 font-mono"} />
            </div>
          </Card>

          {/* Robot Assignment */}
          <Card title="Robot Assignment" isDark={isDark}>
            <div className={`divide-y ${divdr}`}>
              <StatRow label="Unit"          value="ERIC-R7"            isDark={isDark} />
              <StatRow label="Serial"        value="ER-2024-0712"       isDark={isDark} />
              <StatRow label="Firmware"      value="v3.2.1-stable"      isDark={isDark} />
              <StatRow label="Last Sync"     value="Just now"           isDark={isDark} />
              <StatRow label="rosbridge"     value="ws://localhost:9090" isDark={isDark}
                valueClass={connected ? "text-green-400 font-mono text-[10px]" : `${sub} font-mono text-[10px]`} />
            </div>
          </Card>

          {/* Live Robot Metrics */}
          <Card title="Live Metrics" isDark={isDark}>
            <div className={`divide-y ${divdr}`}>
              <StatRow label="Battery"     value={`${m.battery.toFixed(1)}%`}  isDark={isDark} valueClass={batteryColor} />
              <StatRow label="Signal"      value={`${m.signal}%`}              isDark={isDark} valueClass={signalColor}  />
              <StatRow label="Temperature" value={`${m.temperature.toFixed(1)}°C`} isDark={isDark} valueClass={tempColor} />
              <StatRow label="Speed"       value={`${m.speed.toFixed(2)} m/s`} isDark={isDark} />
              <StatRow label="Status"      value={m.status.toUpperCase()}       isDark={isDark}
                valueClass={m.status === "critical" ? "text-red-400" : m.status === "warning" ? "text-amber-400" : "text-green-400"} />
            </div>
          </Card>

          {/* Mission Stats */}
          <Card title="Mission Stats" isDark={isDark}>
            <div className={`divide-y ${divdr}`}>
              <StatRow label="Active Mission"    value="AUTONOMOUS-NAV-07"  isDark={isDark} />
              <StatRow label="Waypoints Total"   value="6"                  isDark={isDark} />
              <StatRow label="Waypoints Done"    value="2 / 6"              isDark={isDark} valueClass="text-amber-400" />
              <StatRow label="Est. Remaining"    value="~18 min"            isDark={isDark} />
              <StatRow label="Distance Covered"  value="142 m"              isDark={isDark} />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
