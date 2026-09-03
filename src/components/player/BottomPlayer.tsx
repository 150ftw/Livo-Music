"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { LivoIcon } from "@/components/ui/LivoLogo";
import { formatTime } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Maximize2,
  Heart,
  ListMusic,
  X,
  ExternalLink,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomPlayer() {
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
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFullScreen,
    removeFromQueue,
    playTrack,
    toggleSaveTrack,
    isSavedTrack,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [showEngineEmbed, setShowEngineEmbed] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  if (!currentTrack) return null;

  const isSaved = isSavedTrack(currentTrack.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(newPercent * duration);
  };

  return (
    <>
      {/* Official Spotify Native Player Embed Popover */}
      {showEngineEmbed && (
        <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 bg-[#12121e] border border-purple-500/30 rounded-2xl shadow-2xl p-4 flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
            <div className="flex items-center gap-2 text-purple-400">
              <LivoIcon className="w-5 h-5" />
              <span className="text-xs font-bold tracking-wide text-white">
                LIVO Audio Engine
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={currentTrack.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-purple-400 transition-colors mr-1"
                title="Open Source Stream"
              >
                <span>Full track</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setShowEngineEmbed(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <iframe
            src={`https://open.spotify.com/embed/track/${currentTrack.spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
            title={`Livo Audio: ${currentTrack.title}`}
          />
        </div>
      )}

      {/* Up Next Queue Drawer */}
      {showQueue && (
        <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 max-h-[420px] bg-[#12121e] border border-purple-500/30 rounded-2xl shadow-2xl p-4 flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold tracking-wide text-white">
                Up Next Queue ({queue.length})
              </h3>
            </div>
            <button
              onClick={() => setShowQueue(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto divide-y divide-white/[0.04] mt-2 flex-1 pr-1">
            {queue.map((track, idx) => {
              const isCurrent = idx === queueIndex;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  className={cn(
                    "flex items-center justify-between py-2 px-2 rounded-lg text-xs group transition-colors",
                    isCurrent ? "bg-purple-600/20 text-purple-300" : "hover:bg-white/[0.05] text-zinc-300"
                  )}
                >
                  <button
                    onClick={() => playTrack(track, queue)}
                    className="flex items-center gap-3 text-left flex-1 truncate mr-2"
                  >
                    <span className="w-4 text-center font-mono text-[10px] text-zinc-400">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className={cn("font-medium truncate", isCurrent && "text-purple-300")}>
                        {track.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">{track.artist}</div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] text-zinc-400">
                      {formatTime(track.duration)}
                    </span>
                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-opacity"
                      title="Remove from queue"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main LIVO 3-Column Playback Dock */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#08080c]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 py-3 select-none">
        <div className="flex items-center justify-between gap-4 h-14">
          {/* Column 1: Current Track Info & Heart (Left) */}
          <div className="flex items-center gap-3 min-w-0 w-1/4 sm:w-1/3">
            <button
              onClick={toggleFullScreen}
              className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#161622] border border-white/[0.08] shrink-0 group focus:outline-none shadow-md"
              title="Expand Album View"
            >
              <Image
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                fill
                className="object-cover"
                sizes="48px"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </button>

            <div className="flex flex-col truncate">
              <button
                onClick={toggleFullScreen}
                className="text-xs sm:text-sm font-semibold text-white truncate text-left hover:text-purple-300 transition-colors focus:outline-none"
              >
                {currentTrack.title}
              </button>
              <span className="text-[11px] sm:text-xs text-zinc-400 truncate text-left">
                {currentTrack.artist}
              </span>
            </div>

            <button
              onClick={() => toggleSaveTrack(currentTrack)}
              className={cn(
                "p-2 rounded-full transition-transform shrink-0 hover:scale-110 ml-1",
                isSaved ? "text-fuchsia-400" : "text-zinc-400 hover:text-white"
              )}
              title={isSaved ? "Saved to your Livo Library" : "Save to Livo Library"}
            >
              <Heart className={cn("w-4 h-4", isSaved && "fill-fuchsia-400")} />
            </button>
          </div>

          {/* Column 2: Player Controls & LIVO Gradient Timeline Slider (Center) */}
          <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  isShuffle ? "text-purple-400" : "text-zinc-400 hover:text-white"
                )}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Prev */}
              <button
                onClick={prevTrack}
                className="p-1.5 text-zinc-300 hover:text-white transition-colors"
                title="Previous"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              {/* Play / Pause LIVO Glowing Button */}
              <button
                onClick={togglePlay}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#ec4899] via-[#a855f7] to-[#3b82f6] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 border border-white/20 transition-transform"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={nextTrack}
                className="p-1.5 text-zinc-300 hover:text-white transition-colors"
                title="Next"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              {/* Repeat */}
              <button
                onClick={toggleRepeat}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  repeatMode !== "off" ? "text-purple-400" : "text-zinc-400 hover:text-white"
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

            {/* Timeline Slider with Livo Gradient */}
            <div className="w-full flex items-center gap-2 px-2">
              <span className="text-[11px] font-mono text-zinc-400 w-9 text-right shrink-0">
                {formatTime(progress)}
              </span>

              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="relative flex-1 h-1 bg-white/[0.15] hover:h-1.5 rounded-full cursor-pointer group transition-all"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 rounded-full transition-colors"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity -ml-1.5 pointer-events-none"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>

              <span className="text-[11px] font-mono text-zinc-400 w-9 text-left shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Column 3: Queue, Audio Engine, Volume & Fullscreen (Right) */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0 w-1/4 sm:w-1/3">
            {/* Livo Audio Engine Embed Toggle */}
            <button
              onClick={() => setShowEngineEmbed(!showEngineEmbed)}
              className={cn(
                "hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all shrink-0",
                showEngineEmbed
                  ? "bg-purple-600/30 border-purple-400 text-purple-300"
                  : "bg-white/[0.04] hover:bg-purple-600/20 border-white/[0.08] text-zinc-400 hover:text-purple-300"
              )}
              title="Toggle Audio Engine Embed"
            >
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>Audio</span>
            </button>

            {/* Queue Toggle */}
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={cn(
                "p-2 rounded-full transition-colors",
                showQueue
                  ? "text-purple-400"
                  : "text-zinc-400 hover:text-white"
              )}
              title="Queue"
            >
              <ListMusic className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
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
                className="w-16 lg:w-20 h-1 bg-white/[0.2] hover:bg-white/[0.3] rounded-full appearance-none accent-purple-400 cursor-pointer"
                title="Volume"
              />
            </div>

            {/* Fullscreen Expand */}
            <button
              onClick={toggleFullScreen}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              title="Full screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
