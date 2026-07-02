"use client";

import { useEffect, useRef, useState } from "react";

export default function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [hasVideo, setHasVideo] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");

  // Check if video file exists by loading it
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoad = () => setHasVideo(true);
    const onError = () => setHasVideo(false);
    video.addEventListener("loadeddata", onLoad);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("loadeddata", onLoad);
      video.removeEventListener("error", onError);
    };
  }, []);

  // Update current time display
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      const t = video.currentTime;
      const m = Math.floor(t / 60).toString().padStart(2, "0");
      const s = Math.floor(t % 60).toString().padStart(2, "0");
      setCurrentTime(`${m}:${s}`);
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <div className="flex flex-col bg-[#0d1825] border border-[#1e3a5f] rounded-xl overflow-hidden h-full panel-hover fade-in">
      {/* Panel header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e3a5f] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
          <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Camera Feed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[10px] text-slate-600 font-mono">1920×1080</span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">
            <div className="w-1 h-1 rounded-full bg-red-500 pulse-dot" />
            <span className="text-[9px] text-red-400 font-semibold uppercase tracking-wider">REC</span>
          </div>
        </div>
      </div>

      {/* Video area */}
      <div ref={containerRef} className="relative flex-1 bg-black overflow-hidden scanlines group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/assets/sample.mp4"
          loop
          autoPlay
          muted
          playsInline
        />

        {/* No-video placeholder */}
        {!hasVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070d14] text-slate-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12 mb-3 opacity-30">
              <rect x="2" y="7" width="20" height="15" rx="2" />
              <path d="M17 7V5a1 1 0 00-1-1H8a1 1 0 00-1 1v2M12 12v.01" />
            </svg>
            <p className="text-[11px] uppercase tracking-widest">No Video Source</p>
            <p className="text-[10px] mt-1 text-slate-700">Add sample.mp4 to /public/assets/</p>
          </div>
        )}

        {/* HUD overlays */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-green-400/70 select-none pointer-events-none z-10">
          <div>CAM: FRONT-LEFT</div>
          <div>FOV: 120°</div>
          <div>FPS: 30</div>
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400/70 select-none pointer-events-none z-10 text-right">
          <div>GPS: 37.7749° N</div>
          <div>-122.4194° W</div>
          <div>{currentTime}</div>
        </div>
        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-20">
          <div className="relative w-8 h-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-cyan-400" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-3 bg-cyan-400" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-3 bg-cyan-400" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-3 bg-cyan-400" />
            <div className="absolute inset-2 rounded-full border border-cyan-400" />
          </div>
        </div>

        {/* Controls overlay (show on hover) */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent
          translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-10">
          <button
            onClick={togglePlay}
            className="text-white/80 hover:text-white transition-colors"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
            {muted ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
              </svg>
            )}
          </button>
          <span className="text-white/50 text-[10px] font-mono flex-1">{currentTime}</span>
          <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
