"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import { SpotifyOfficialPlayer } from "@/components/player/SpotifyOfficialPlayer";
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
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

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
      {/* Cinematic Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-20 blur-[140px] animate-ambient-glow"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(220, 200, 170, 0.15), rgba(5, 5, 5, 0.95))`,
          }}
        />
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
          <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" />
          <span>Official Spotify Playback</span>
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
          {/* Large Album Artwork with Framer Motion track transition & subtle 3D hover physics */}
          <div
            onMouseMove={handleArtworkMouseMove}
            onMouseLeave={handleArtworkMouseLeave}
            className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] border border-white/[0.08] mb-6 cursor-pointer"
            style={{
              transform: `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
              transition: "transform 0.15s ease-out",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentTrack.artworkUrl}
                  alt={currentTrack.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, 320px"
                />
              </motion.div>
            </AnimatePresence>

            {/* Subtle glass reflection sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/[0.06] pointer-events-none" />
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

        {/* Official Spotify Embed Player Component */}
        <div className="w-full max-w-lg">
          <SpotifyOfficialPlayer track={currentTrack} mode="expanded" />
          <p className="text-[10px] text-center text-[#8e8c87]/70 font-light mt-2">
            Tip: Log in to Spotify in this browser to stream full-length songs without 30s preview restrictions.
          </p>
        </div>
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

            <a
              href={currentTrack.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#8e8c87] hover:text-[#1DB954] transition-all text-[11px]"
              title="Open in Spotify"
            >
              <span>Spotify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
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
