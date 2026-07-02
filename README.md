# Insight.IO — Robotics Dashboard

A real-time robotics monitoring dashboard built with **Next.js 16**, **Three.js**, and **Tailwind CSS** as part of the ERIC Robotics FSD Assignment #1.

---

## Features

| Panel | Description |
|---|---|
| **Camera Feed** | HTML5 video player with HUD overlays, custom controls (play/pause, mute, fullscreen), scanline overlay |
| **3D Map View** | Interactive point cloud renderer (Three.js + `@react-three/fiber`) with orbit controls, auto-rotate, and Z-height color mapping |
| **Metrics Row** | Live-updating cards for Speed, Battery, Heading, Signal, Temperature, and Uptime |
| **Sidebar** | Collapsible navigation with robot online status indicator |
| **Status Bar** | ROS bridge connection URL, ping, node count, session date |

---

## Prerequisites

- **Node.js** 18 or higher (`node -v` to check)
- **npm** 9+ (comes with Node.js)

---

## Setup

### Option A — Docker (Recommended)
No Node.js installation required. Just [install Docker](https://docs.docker.com/get-docker/).

```bash
git clone https://github.com/DeepKalegaonkar/insight-io.git
cd insight-io

# Add assets first (see below), then:
docker compose up --build
```

Open **http://localhost:3000**.

> To swap the video or PCD file without rebuilding, just replace the file in `public/assets/` — the folder is mounted as a volume.

---

### Option B — Node.js (for development)

```bash
git clone https://github.com/DeepKalegaonkar/insight-io.git
cd insight-io

npm install
npm run dev   # → http://localhost:3000
```

Requires **Node.js 18+**.

---

## Adding Sample Assets

Place files in `public/assets/`:

### Camera Video (`sample.mp4`)
Download any MP4 driving/dashcam video. Free sources:
- [Pexels free videos](https://www.pexels.com/videos/) (search "driving")
- [Big Buck Bunny](https://download.blender.org/peach/bigbuckbunny_movies/) (Creative Commons)

Rename to `sample.mp4` and place at `public/assets/sample.mp4`.

### Point Cloud (`sample.pcd`)
Download a small `.pcd` file. Free sources:
- [PCL test files](https://github.com/PointCloudLibrary/pcl/tree/master/test) — grab any `*.pcd`
- [KITTI Dataset](http://www.cvlibs.net/datasets/kitti/) (convert to `.pcd`)

Rename to `sample.pcd` and place at `public/assets/sample.pcd`.

> **Without assets:** The camera panel shows a placeholder message; the 3D map shows a text prompt. The rest of the dashboard is fully functional.

---

## Project Structure

```
insight-io/
├── app/
│   ├── layout.tsx          # Root layout — fonts, dark bg, metadata
│   ├── page.tsx            # Dashboard page (Server Component)
│   └── globals.css         # Tailwind imports + custom animations
├── components/
│   ├── Sidebar.tsx         # Collapsible left nav, robot status
│   ├── TopNav.tsx          # Top bar — clock, mission label, alerts
│   ├── CameraView.tsx      # Video player with HUD overlays
│   ├── MapView3D.tsx       # Three.js PCD viewer (Client Component)
│   ├── MapView3DClient.tsx # Thin "use client" wrapper for SSR exclusion
│   ├── MetricsPanel.tsx    # Live metric cards row
│   └── StatusBar.tsx       # Footer — ROS status, ping, version
├── hooks/
│   └── useRobotMetrics.ts  # setInterval-based simulated robot data
└── public/
    └── assets/
        ├── sample.mp4      # Camera feed (add manually)
        └── sample.pcd      # Point cloud (add manually)
```

---

## Architecture Decisions

### Why Next.js?
- App Router provides a clean Server/Client Component model — the heavy Three.js canvas loads client-only while the layout shells are pre-rendered server-side.
- Single `npm run dev` command, no separate backend needed — satisfies the self-hosted requirement.

### Why `@react-three/fiber` + Three.js?
- `@react-three/fiber` gives a declarative React API over Three.js, making the scene graph easy to maintain.
- `PCDLoader` (built into Three.js extras) handles `.pcd` files natively without a separate library.
- `@react-three/drei` provides `OrbitControls`, `Grid`, and `Text` helpers out of the box.

### Why Tailwind CSS?
- Utility classes enable rapid dark-theme layout work without separate stylesheet files.
- Responsive breakpoints (`md:`, `lg:`) are applied inline, making mobile stacking trivial.

### Why simulated metrics?
- The assignment does not specify a live ROS backend. Simulated data (`useRobotMetrics`) lets the dashboard look fully live without requiring a running ROS node.
- Plugging in real `roslibjs` data is a drop-in replacement for the hook's return values.

---

## Bonus — ROS Integration (Future)

To replace simulated data with real ROS2 data via `roslibjs`:

```bash
npm install roslib
```

Then replace `useRobotMetrics.ts` with a hook that connects to `ws://localhost:9090` (rosbridge_server) and subscribes to `/cmd_vel`, `/battery_state`, etc.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve production build |

---

## Evaluation Checklist

- [x] Faithful layout recreation (Camera + 3D Map side-by-side, metrics row, sidebar)
- [x] Camera View — video player with controls and HUD overlays
- [x] 3D Map View — point cloud renderer with orbit controls
- [x] Responsive — stacks vertically on mobile/tablet (`md:flex-row`)
- [x] Self-hosted — runs on `localhost:3000` with `npm run dev`
- [x] Modular component structure (Sidebar, TopNav, CameraView, MapView3D, MetricsPanel, StatusBar)
- [x] Clean commit history

---

*Built for ERIC Robotics FSD Assignment #1*
