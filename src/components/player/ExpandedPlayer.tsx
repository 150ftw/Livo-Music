"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Ferrofluid } from "@/components/ui/Ferrofluid";
import { GlassSurface } from "@/components/ui/GlassSurface";

const Lanyard = dynamic(
  () => import("@/components/ui/Lanyard").then((mod) => mod.Lanyard),
  {
    ssr: false,
    loading: () => (
      <div className="w-72 h-[440px] rounded-2xl bg-white/[0.03] border border-white/[0.08] animate-pulse flex items-center justify-center">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Loading 3D Soundpass...
        </span>
      </div>
    ),
  }
);
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  ListMusic,
  ShieldCheck,
} from "lucide-react";

function getTrackBpm(track?: any): number {
  if (!track) return 116;
  const g = (track.genre || "").toLowerCase();
  const t = (track.title || "").toLowerCase();
  if (
    g.includes("rap") ||
    g.includes("drill") ||
    g.includes("trap") ||
    t.includes("hardlaunch")
  )
    return 130;
  if (g.includes("punjabi")) return 124;
  if (
    g.includes("indie") ||
    g.includes("folk") ||
    g.includes("acoustic") ||
    g.includes("guitar")
  )
    return 92;
  if (g.includes("dream") || g.includes("ambient") || g.includes("slowcore"))
    return 80;
  return 116;
}

export function ExpandedPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    isExpanded,
    queue,
    queueIndex,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setIsExpanded,
    toggleSaveTrack,
    isTrackSaved,
    playTrack,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation when expanded
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "Escape") {
        e.preventDefault();
        setIsExpanded(false);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        seek(Math.min(duration, currentTime + 5));
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, togglePlay, setIsExpanded, seek, duration, currentTime, toggleMute]);

  // Subtle 3D tilt tracking on artwork
  const handleArtworkMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({
      x: (x / (rect.width / 2)) * 6,
      y: -(y / (rect.height / 2)) * 6,
    });
  };

  const handleArtworkMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration === 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    seek(clickPos * duration);
  };

  if (!isExpanded || !currentTrack) return null;

  const isSaved = isTrackSaved(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between overflow-y-auto select-none"
    >
      {/* Cinematic Ambient Ferrofluid Background with Calm Beat Sync */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <Ferrofluid
          colors={
            currentTrack?.accentColor
              ? [currentTrack.accentColor, "#8e8c87", "#4a4844"]
              : ["#a3a3a3", "#737373", "#404040"]
          }
          speed={0.16}
          scale={1.85}
          turbulence={0.45}
          fluidity={0.16}
          rimWidth={0.18}
          sharpness={2.0}
          shimmer={0.3}
          glow={1.15}
          flowDirection="down"
          opacity={0.25}
          mouseInteraction={true}
          mouseStrength={0.6}
          mouseRadius={0.35}
          syncToBeats={true}
          isPlaying={isPlaying}
          bpm={getTrackBpm(currentTrack)}
          track={currentTrack}
          currentTime={currentTime}
          mixBlendMode="screen"
        />
        {/* Soft nocturnal vignette so center artwork and controls remain razor sharp */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(5,5,5,0.7)_60%,_rgba(5,5,5,0.98)_100%)] pointer-events-none" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 pt-6 sm:pt-8">
        <button
          onClick={() => setIsExpanded(false)}
          className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-[#8e8c87] hover:text-[#f5f4f0] transition-colors group cursor-pointer"
        >
          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          <span>Minimize [ESC]</span>
        </button>

        <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#8e8c87] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>LIVO High-Fidelity Audio</span>
        </div>

        {/* Queue Toggle */}
        <button
          onClick={() => setShowQueue((prev) => !prev)}
          className={`flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase transition-colors cursor-pointer ${
            showQueue
              ? "text-[#f5f4f0]"
              : "text-[#8e8c87] hover:text-[#f5f4f0]"
          }`}
        >
          <ListMusic className="w-4 h-4" />
          <span className="hidden sm:inline">Queue ({queue.length})</span>
        </button>
      </header>

      {/* Centerpiece: Floating Artwork & Editorial Typography */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4 max-w-4xl mx-auto w-full space-y-6">
        <div className="flex flex-col items-center text-center w-full">
          {/* 3D Physics Lanyard Card with Interactive Embedded Controls */}
          <div className="relative w-full h-[520px] sm:h-[560px] flex items-center justify-center -mt-4 -mb-2 overflow-visible">
            <Lanyard
              position={[0, -0.48, 10.4]}
              gravity={[0, -32, 0]}
              fov={22}
              cardScale={2.9}
              lanyardWidth={1.35}
              frontImage={currentTrack.artworkUrl}
              track={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              isShuffle={isShuffle}
              isRepeat={isRepeat}
              isSaved={isSaved}
              onTogglePlay={togglePlay}
              onNextTrack={nextTrack}
              onPrevTrack={previousTrack}
              onToggleShuffle={toggleShuffle}
              onToggleRepeat={toggleRepeat}
              onSeek={seek}
              onToggleSave={() => toggleSaveTrack(currentTrack)}
            />
          </div>

          {/* Track Title and Artist in Editorial Typography */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-1.5 max-w-xl"
            >
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-[#f5f4f0]">
                {currentTrack.title}
              </h2>
              <p className="text-sm sm:text-base text-[#8e8c87] font-normal tracking-wide">
                {currentTrack.artist}
                {currentTrack.album && (
                  <span className="text-[#4a4844]"> — {currentTrack.album}</span>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actual Music Player Controls */}
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={24}
          borderWidth={0.06}
          brightness={50}
          backgroundOpacity={0.2}
          saturation={1.35}
          distortionScale={-150}
          displace={1}
          blur={12}
          contentClassName="!p-0"
          className="w-full max-w-xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          <div className="w-full p-5 sm:p-6 space-y-5">
            {/* Interactive Timeline Scrubber */}
            <div className="space-y-2">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  seek(ratio * duration);
                }}
                className="group relative h-2 w-full bg-white/[0.08] hover:bg-white/[0.16] rounded-full overflow-hidden cursor-pointer transition-colors"
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-white transition-all duration-100 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#8e8c87]">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Central Transport Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={toggleShuffle}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  isShuffle ? "text-emerald-400" : "text-[#8e8c87] hover:text-white"
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={previousTrack}
                className="p-3 rounded-full text-[#8e8c87] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-3 rounded-full text-[#8e8c87] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  isRepeat ? "text-emerald-400" : "text-[#8e8c87] hover:text-white"
                }`}
                title="Repeat"
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Slider & Spotify Attribution */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
              {/* Volume */}
              <div className="flex items-center gap-2 w-40">
                <button
                  onClick={toggleMute}
                  className="text-[#8e8c87] hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full accent-white cursor-pointer"
                />
              </div>

              {/* Audio Engine Status */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#8e8c87]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVO High-Fidelity Audio • Master Quality</span>
              </div>
            </div>
          </div>
        </GlassSurface>
      </main>

      {/* Bottom Secondary Controls Bar */}
      <footer className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-6 space-y-4">
        <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 text-xs font-mono text-[#8e8c87]">
          {/* Left Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSaveTrack(currentTrack)}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? "text-[#f5f4f0]" : "text-[#4a4844] hover:text-[#8e8c87]"
              }`}
              title={isSaved ? "Saved" : "Save"}
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? "fill-[#f5f4f0]" : ""}`}
              />
            </button>
          </div>

          {/* Sequential Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={previousTrack}
              className="p-2 text-[#8e8c87] hover:text-[#f5f4f0] transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <span className="text-[11px] text-[#4a4844]">
              {queueIndex + 1} / {queue.length || 1}
            </span>

            <button
              onClick={nextTrack}
              className="p-2 text-[#8e8c87] hover:text-[#f5f4f0] transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Up Next Queue Drawer */}
      <AnimatePresence>
        {showQueue && (
          <motion.aside
            aria-label="Playback queue"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-40 w-full sm:w-96 bg-[#08080a] border-l border-white/[0.06] p-6 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8e8c87]">
                Up Next ({queue.length})
              </h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-xs text-[#8e8c87] hover:text-[#f5f4f0] font-mono cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {queue.map((track, idx) => {
                const isCurrent = idx === queueIndex;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track, queue)}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                      isCurrent
                        ? "bg-white/[0.08] text-white"
                        : "hover:bg-white/[0.03] text-[#8e8c87]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-4 text-[10px] font-mono text-[#4a4844]">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 truncate">
                        <p
                          className={`text-xs font-medium truncate ${
                            isCurrent ? "text-white" : "text-[#f5f4f0]"
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-[11px] text-[#8e8c87] truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-[#4a4844] ml-2 shrink-0">
                      {formatTime(track.duration)}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
