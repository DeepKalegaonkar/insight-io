"use client";

import { useRobotMetrics } from "@/hooks/useRobotMetrics";

function MetricCard({
  label,
  value,
  unit,
  icon,
  color = "cyan",
  subtext,
}: {
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color?: "cyan" | "green" | "amber" | "purple";
  subtext?: string;
}) {
  const colorMap = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="flex-1 min-w-[120px] bg-[#0d1825] border border-[#1e3a5f] rounded-xl p-3 panel-hover fade-in">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
        <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold font-mono ${colorMap[color].split(" ")[0]}`}>
          {value}
        </span>
        <span className="text-[10px] text-slate-500 font-mono">{unit}</span>
      </div>
      {subtext && <div className="mt-1 text-[10px] text-slate-600">{subtext}</div>}
    </div>
  );
}

export default function MetricsPanel() {
  const m = useRobotMetrics();

  const batteryColor =
    m.battery < 20 ? "amber" : m.battery < 35 ? "amber" : "green";

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3">
      <MetricCard
        label="Speed"
        value={m.speed.toFixed(1)}
        unit="m/s"
        color="cyan"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        }
        subtext="Linear velocity"
      />
      <MetricCard
        label="Battery"
        value={m.battery.toFixed(0)}
        unit="%"
        color={batteryColor}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <rect x="2" y="7" width="18" height="10" rx="2" />
            <path d="M20 11h2v2h-2" />
          </svg>
        }
        subtext={m.battery < 35 ? "Low — recharge soon" : "Nominal"}
      />
      <MetricCard
        label="Heading"
        value={m.heading.toFixed(0)}
        unit="°"
        color="purple"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        }
        subtext="Compass bearing"
      />
      <MetricCard
        label="Signal"
        value={m.signal}
        unit="%"
        color="green"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <path d="M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M10.54 16.1a6 6 0 012.92 0M12 20h.01" />
          </svg>
        }
        subtext="ROS bridge"
      />
      <MetricCard
        label="Temp"
        value={m.temperature.toFixed(0)}
        unit="°C"
        color={m.temperature > 45 ? "amber" : "cyan"}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
          </svg>
        }
        subtext="CPU / MCU"
      />
      <MetricCard
        label="Uptime"
        value={m.uptime}
        unit=""
        color="cyan"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        }
        subtext="Session time"
      />
    </div>
  );
}
