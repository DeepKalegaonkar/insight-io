"use client";

import { useEffect, useState } from "react";

export interface RobotMetrics {
  speed: number;         // m/s
  battery: number;       // %
  heading: number;       // degrees
  altitude: number;      // m
  signal: number;        // %
  temperature: number;   // °C
  uptime: string;        // HH:MM:SS
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
  const [uptimeSeconds, setUptimeSeconds] = useState(14580); // ~4h running
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
    const uptimeId = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);

    const metricsId = setInterval(() => {
      setMetrics((prev) => {
        const battery = parseFloat(Math.max(0, prev.battery - randomBetween(0, 0.2)).toFixed(1));
        const status: RobotMetrics["status"] =
          battery < 20 ? "critical" : battery < 35 ? "warning" : "nominal";
        return {
          speed: randomBetween(0.8, 2.1),
          battery,
          heading: parseFloat(((prev.heading + randomBetween(-3, 3)) % 360).toFixed(1)),
          altitude: randomBetween(0.28, 0.38),
          signal: randomBetween(88, 99, 0),
          temperature: randomBetween(40, 48),
          uptime: formatUptime(uptimeSeconds),
          status,
        };
      });
    }, intervalMs);

    return () => {
      clearInterval(uptimeId);
      clearInterval(metricsId);
    };
  }, [intervalMs, uptimeSeconds]);

  return metrics;
}
