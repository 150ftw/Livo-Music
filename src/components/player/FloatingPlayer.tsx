"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Heart,
  X,
} from "lucide-react";
import { GlassSurface } from "@/components/ui/GlassSurface";

export function FloatingPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    togglePlay,
    previousTrack,
    nextTrack,
    seekTo,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    setFullScreen,
    toggleSaveTrack,
    isTrackSaved,
    closePlayer,
  } = usePlayer();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!currentTrack) return null;

  const isSaved = isTrackSaved(currentTrack.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(ratio * duration);
  };

  return (
    <aside
      aria-label="LIVO Music Player"
      className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-xl select-none animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={20}
          borderWidth={0.06}
          brightness={55}
          backgroundOpacity={0.32}
          saturation={1.35}
          distortionScale={-140}
          displace={0.5}
          blur={12}
          contentClassName="!p-0"
          className="w-full border border-white/[0.14] shadow-[0_25px_60px_rgba(0,0,0,0.9)] transition-all"
        >
          <div className="w-full p-2.5 sm:p-3">
            {/* Real Hairline Interactive Timeline Scrubber */}
            <div
              onClick={handleScrubberClick}
              className="group relative h-1.5 w-full bg-white/[0.08] hover:bg-white/[0.15] rounded-full overflow-hidden cursor-pointer mb-2.5 transition-colors"
              title="Scrub timeline"
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-white transition-all duration-100 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Player Controls & Track Info */}
            <div className="flex items-center justify-between gap-3">
              {/* Left: Artwork + Title + Artist */}
              <div
                onClick={() => setFullScreen(true)}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
                title="Open expanded listening room"
              >
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-md">
                  <Image
                    src={
                      currentTrack.artworkUrl ||
                      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={currentTrack.title}
                    fill
                    sizes="48px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                    {currentTrack.title}
                  </h4>
                  <p className="text-[11px] text-[#8e8c87] truncate mt-0.5">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Center: Real Transport Controls */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  onClick={previousTrack}
                  className="p-1.5 sm:p-2 rounded-full text-[#8e8c87] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Previous Track"
                  aria-label="Previous Track"
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center transition-transform shadow-lg cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-1.5 sm:p-2 rounded-full text-[#8e8c87] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Next Track"
                  aria-label="Next Track"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Right: Time, Volume, Save, Expand */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Timestamp */}
                <span className="hidden sm:inline-block font-mono text-[10px] text-[#8e8c87]">
                  {formatTime(progress)} / {formatTime(duration)}
                </span>

                {/* Save / Heart */}
                <button
                  onClick={() => toggleSaveTrack(currentTrack)}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    isSaved
                      ? "text-red-400"
                      : "text-[#8e8c87] hover:text-white"
                  }`}
                  title={isSaved ? "Saved" : "Save Track"}
                >
                  <Heart
                    className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                  />
                </button>

                {/* Volume */}
                <div
                  className="hidden sm:flex items-center gap-1.5"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-full text-[#8e8c87] hover:text-white transition-colors cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  {showVolumeSlider && (
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-14 sm:w-16 h-1 bg-white/20 rounded-full accent-emerald-400 cursor-pointer animate-in fade-in duration-150"
                      title="Volume"
                    />
                  )}
                </div>

                {/* Expand button */}
                <button
                  onClick={() => setFullScreen(true)}
                  className="p-1.5 rounded-full text-[#8e8c87] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Expand Full-Screen Player"
                  aria-label="Expand Full-Screen Player"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Footer Status Bar */}
            <div className="flex items-center justify-between px-1 pt-2 mt-1 border-t border-white/[0.04] text-[10px] font-mono text-[#8e8c87]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#8e8c87]/90">LIVO High-Fidelity Audio</span>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Master Stream</span>
            </div>
          </div>
        </GlassSurface>

        {/* Dismiss Button */}
        <button
          onClick={closePlayer}
          className="absolute -top-2.5 -right-2.5 z-30 w-6 h-6 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-white/[0.15] text-[#8e8c87] hover:text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
          title="Close Player"
          aria-label="Close Player"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}
