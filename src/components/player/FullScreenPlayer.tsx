"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import { VisualizerBar } from "./VisualizerBar";
import { Ferrofluid } from "@/components/ui/Ferrofluid";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Minimize2,
  Heart,
  Music,
  Disc3,
  Calendar,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FullScreenPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    queue,
    queueIndex,
    isShuffle,
    repeatMode,
    isFullScreen,
    setFullScreen,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    playTrack,
    toggleSaveTrack,
    isSavedTrack,
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement | null>(null);

  if (!isFullScreen || !currentTrack) return null;

  const isSaved = isSavedTrack(currentTrack.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration <= 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(percent * duration);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Expanded Music Player"
      className="fixed inset-0 z-50 bg-[#070709] text-white flex flex-col justify-between overflow-hidden animate-in fade-in duration-300 select-none"
    >
      {/* Ambient Ferrofluid & Blurred Artwork Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
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
          syncToBeats={true}
          isPlaying={isPlaying}
          track={currentTrack}
          currentTime={progress}
          mixBlendMode="screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-[#070709]/60" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 px-6 sm:px-12 pt-6 pb-4 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#e5b067] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-300">
            Cadence Listening Room
          </span>
        </div>

        <button
          onClick={() => setFullScreen(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs transition-colors"
          title="Minimize (Esc)"
        >
          <Minimize2 className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px]">Minimize</span>
          <kbd className="hidden sm:inline text-[9px] bg-black/40 px-1 py-0.5 rounded text-zinc-400">
            ESC
          </kbd>
        </button>
      </header>

      {/* Main Content: Split Artwork & Queue */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center overflow-y-auto">
        {/* Left Column: Vinyl Artwork & Meta Details */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          {/* Vinyl Artwork with Depth & Spinning Disc Illusion */}
          <div className="relative group max-w-md w-full aspect-square">
            {/* Vinyl Disc Behind Artwork */}
            <div
              className={cn(
                "absolute top-0 right-0 bottom-0 w-full rounded-full vinyl-disc border border-white/[0.1] transition-transform duration-700 ease-out hidden sm:flex items-center justify-center",
                isPlaying ? "translate-x-14 rotate-45" : "translate-x-4"
              )}
            >
              <div className="w-20 h-20 rounded-full border-4 border-black/80 bg-[#e5b067]/20 flex items-center justify-center">
                <Disc3 className="w-8 h-8 text-[#e5b067]" />
              </div>
            </div>

            {/* Main Album Artwork Sleeve */}
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden vinyl-shadow border border-white/[0.12] bg-[#12121a]">
              <Image
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 90vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
            </div>
          </div>

          {/* Track Details */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs uppercase tracking-widest text-[#e5b067] font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {currentTrack.genre || "Curated Sound"}
              </span>
              {currentTrack.year && (
                <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {currentTrack.year}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {currentTrack.title}
            </h1>

            <p className="text-lg sm:text-xl text-zinc-300 font-medium">
              {currentTrack.artist}
            </p>

            <p className="text-xs sm:text-sm text-zinc-400">
              Album: <span className="text-zinc-200">{currentTrack.album}</span>
            </p>

            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/90 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVO High-Fidelity Audio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Up Next Queue & Curator Notes */}
        <div className="lg:col-span-5 w-full bg-[#12121a]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 flex flex-col h-[420px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#e5b067]" />
              <h2 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
                Up Next in Queue
              </h2>
            </div>
            <VisualizerBar isPlaying={isPlaying} />
          </div>

          <div className="overflow-y-auto divide-y divide-white/[0.04] mt-3 flex-1 pr-1">
            {queue.map((track, idx) => {
              const isCurrent = idx === queueIndex;
              return (
                <button
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, queue)}
                  className={cn(
                    "w-full flex items-center justify-between py-3 px-3 rounded-xl text-left transition-all duration-200 group",
                    isCurrent
                      ? "bg-[#e5b067]/15 text-[#e5b067]"
                      : "hover:bg-white/[0.05] text-zinc-300"
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-mono text-xs text-zinc-500 w-5">
                      {isCurrent ? <VisualizerBar isPlaying={isPlaying} /> : idx + 1}
                    </span>
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <Image
                        src={track.artworkUrl}
                        alt={track.title}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <div className="truncate">
                      <div className={cn("text-xs font-medium truncate", isCurrent && "text-[#e5b067]")}>
                        {track.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">{track.artist}</div>
                    </div>
                  </div>

                  <span className="font-mono text-[11px] text-zinc-500 ml-2 shrink-0">
                    {formatTime(track.duration)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Controls Deck */}
      <footer className="relative z-10 px-6 sm:px-12 py-6 bg-[#0a0a0f]/95 border-t border-white/[0.08] backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Large Timeline Bar */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-zinc-400 w-10 text-right">
              {formatTime(progress)}
            </span>

            <div
              ref={progressRef}
              onClick={handleSeek}
              className="relative flex-1 h-2 bg-white/[0.12] hover:h-3 rounded-full cursor-pointer group transition-all"
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#e5b067] via-[#f7cb8b] to-[#e5b067] rounded-full group-hover:brightness-125"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -ml-2 pointer-events-none"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            <span className="font-mono text-xs text-zinc-400 w-10 text-left">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls Cluster */}
          <div className="flex items-center justify-between">
            {/* Heart / Save */}
            <button
              onClick={() => toggleSaveTrack(currentTrack.id)}
              className={cn(
                "p-2.5 rounded-full transition-all",
                isSaved ? "text-[#e5b067] scale-110" : "text-zinc-500 hover:text-white"
              )}
              title={isSaved ? "Saved to Library" : "Save Track"}
            >
              <Heart className={cn("w-5 h-5", isSaved && "fill-[#e5b067]")} />
            </button>

            {/* Center Controls */}
            <div className="flex items-center gap-6 sm:gap-8">
              <button
                onClick={toggleShuffle}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isShuffle ? "text-[#e5b067]" : "text-zinc-500 hover:text-zinc-300"
                )}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={prevTrack}
                className="p-2 text-zinc-300 hover:text-white transition-colors"
                title="Previous"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-[#e5b067] hover:bg-[#f7cb8b] text-[#070709] flex items-center justify-center shadow-2xl shadow-[#e5b067]/40 hover:scale-105 active:scale-95 transition-all duration-200"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-[#070709]" />
                ) : (
                  <Play className="w-6 h-6 fill-[#070709] ml-1" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 text-zinc-300 hover:text-white transition-colors"
                title="Next"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={toggleRepeat}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  repeatMode !== "off" ? "text-[#e5b067]" : "text-zinc-500 hover:text-zinc-300"
                )}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === "one" ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleMute}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 sm:w-28 h-1.5 bg-white/[0.15] rounded-full appearance-none accent-[#e5b067] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
