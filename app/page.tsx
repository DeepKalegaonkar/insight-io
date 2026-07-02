import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import CameraView from "@/components/CameraView";
import MetricsPanel from "@/components/MetricsPanel";
import StatusBar from "@/components/StatusBar";
import MapView3DClient from "@/components/MapView3DClient";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#070d14]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Top navigation */}
        <TopNav />

        {/* Main panels area */}
        <main className="flex-1 flex flex-col gap-3 p-3 overflow-hidden min-h-0">
          {/* Camera + 3D Map — side by side on wide screens */}
          <div className="flex flex-col md:flex-row gap-3 flex-1 min-h-0">
            <div className="flex-1 min-h-0 min-w-0">
              <CameraView />
            </div>
            <div className="flex-1 min-h-0 min-w-0">
              <MapView3DClient />
            </div>
          </div>
        </main>

        {/* Metrics row */}
        <MetricsPanel />

        {/* Status bar */}
        <StatusBar />
      </div>
    </div>
  );
}
