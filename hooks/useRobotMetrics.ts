"use client";

import { useEffect, useRef, useState } from "react";

export interface RobotMetrics {
  speed: number;        // m/s
  battery: number;      // %
  heading: number;      // degrees
  altitude: number;     // m
  signal: number;       // %
  temperature: number;  // °C
  uptime: string;       // HH:MM:SS
  status: "nominal" | "warning" | "critical";
}

function randomBetween(min: number, max: number, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function useRobotMetrics(intervalMs = 2000): RobotMetrics {
  // Refs so interval callbacks always read the latest value without being in deps
  const uptimeRef  = useRef(14580); // ~4 h 03 m session start
  const batteryRef = useRef(78);

  const [metrics, setMetrics] = useState<RobotMetrics>({
    speed: 1.4,
    battery: 78,
    heading: 127,
    altitude: 0.32,
    signal: 94,
    temperature: 42,
    uptime: formatUptime(14580),
    status: "nominal",
  });

  useEffect(() => {
    // Tick uptime every second — stored in ref, no re-render
    const uptimeId = setInterval(() => {
      uptimeRef.current += 1;
    }, 1000);

    // Pulse metrics every intervalMs
    const metricsId = setInterval(() => {
      batteryRef.current = parseFloat(
        Math.max(0, batteryRef.current - randomBetween(0, 0.2)).toFixed(1)
      );
      const battery = batteryRef.current;
      const status: RobotMetrics["status"] =
        battery < 20 ? "critical" : battery < 35 ? "warning" : "nominal";

      setMetrics((prev) => ({
        speed: randomBetween(0.8, 2.1),
        battery,
        heading: parseFloat(((prev.heading + randomBetween(-3, 3)) % 360).toFixed(1)),
        altitude: randomBetween(0.28, 0.38),
        signal: randomBetween(88, 99, 0),
        temperature: randomBetween(40, 48),
        uptime: formatUptime(uptimeRef.current),
        status,
      }));
    }, intervalMs);

    return () => {
      clearInterval(uptimeId);
      clearInterval(metricsId);
    };
  }, [intervalMs]); // only re-create if caller changes the interval

  return metrics;
}
