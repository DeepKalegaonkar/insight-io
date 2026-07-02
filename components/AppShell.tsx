"use client";

import { AppProvider, useApp } from "@/contexts/AppContext";
import Sidebar from "./Sidebar";
import DashboardMain from "./DashboardMain";

function Shell() {
  const { theme } = useApp();
  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0d1117]" : "bg-slate-100"
      }`}
    >
      <Sidebar />
      <DashboardMain />
    </div>
  );
}

export default function AppShell() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
