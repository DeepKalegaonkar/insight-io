"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme  = "dark" | "light";
export type TabKey = "dashboard" | "waypoints" | "location" | "routes" | "analytics";

interface AppCtx {
  theme: Theme;
  toggleTheme: () => void;
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme,     setTheme]     = useState<Theme>("dark");
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  // Restore persisted theme on first mount
  useEffect(() => {
    const s = localStorage.getItem("ericTheme") as Theme | null;
    if (s === "dark" || s === "light") setTheme(s);
  }, []);

  const toggleTheme = () =>
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      localStorage.setItem("ericTheme", next);
      return next;
    });

  return (
    <Ctx.Provider value={{ theme, toggleTheme, activeTab, setActiveTab }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside <AppProvider>");
  return c;
}
