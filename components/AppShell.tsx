"use client";

import { AppProvider, useApp } from "@/contexts/AppContext";
import Sidebar, { MobileBottomNav } from "./Sidebar";
import TopNav from "./TopNav";
import DashboardMain from "./DashboardMain";
import StatusBar from "./StatusBar";

function Shell() {
  const { theme } = useApp();
  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0d1117]" : "bg-slate-100"
      }`}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0 pb-14 md:pb-0">
        <TopNav />
        <DashboardMain />
        <StatusBar />
      </div>
      <MobileBottomNav />
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
