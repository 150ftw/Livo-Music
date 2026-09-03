"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Playlist } from "@/types/music";
import { usePlayer } from "@/context/PlayerContext";
import { formatDuration } from "@/lib/utils";
import { Play, Pause, Heart, Share2, Check } from "lucide-react";

interface PlaylistHeaderProps {
  playlist: Playlist;
}

export function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
  const {
    playPlaylist,
    togglePlay,
    isPlaying,
    queue,
    isSavedPlaylist,
    toggleSavePlaylist,
  } = usePlayer();

  const [copied, setCopied] = useState(false);

  const isCurrentPlaylistPlaying =
    isPlaying && queue.some((t) => playlist.tracks.some((pt) => pt.id === t.id));
  const isSaved = isSavedPlaylist(playlist.id);

  const totalDurationSeconds = playlist.tracks.reduce(
    (acc, track) => acc + track.duration,
    0
  );

  const handlePlayAll = () => {
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playPlaylist(playlist, 0);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="select-none space-y-12 sm:space-y-16">
      {/* Editorial Header Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left: Large Floating Album Artwork with Subtle Ambient Shadow */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] border border-white/[0.08] shrink-0">
            <Image
              src={playlist.artworkUrl}
              alt={playlist.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 320px, 400px"
            />
            {/* Subtle Sheen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.04] pointer-events-none" />
          </div>
        </div>

        {/* Right: Metadata & Editorial Philosophy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5f4f0]/50" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87]">
                Curated Soundscape
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#f5f4f0] tracking-tight">
              {playlist.title}
            </h1>

            <div className="flex items-center gap-3 text-xs font-mono text-[#8e8c87] pt-1">
              <span>{playlist.tracks.length} TRACKS</span>
              <span className="text-[#4a4844]">·</span>
              <span>{formatDuration(totalDurationSeconds).toUpperCase()}</span>
              <span className="text-[#4a4844]">·</span>
              <span>{playlist.curator.toUpperCase()}</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#8e8c87] font-light leading-relaxed max-w-xl">
            {playlist.description}
          </p>

          {/* Understated Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handlePlayAll}
              className="px-8 py-3 rounded-full bg-[#f5f4f0] hover:bg-white text-[#050505] text-xs font-medium tracking-[0.15em] uppercase transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/40 flex items-center gap-2.5 cursor-pointer"
            >
              {isCurrentPlaylistPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Soundscape</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleSavePlaylist(playlist)}
              className={`px-6 py-3 rounded-full text-xs font-medium tracking-[0.15em] uppercase transition-all border flex items-center gap-2 cursor-pointer ${
                isSaved
                  ? "bg-white/[0.08] text-white border-white/[0.2]"
                  : "bg-white/[0.03] text-[#8e8c87] hover:text-[#f5f4f0] border-white/[0.06] hover:border-white/[0.14]"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isSaved ? "fill-white text-white" : ""}`}
              />
              <span>{isSaved ? "Saved in Library" : "Save Archive"}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-white/[0.03] hover:bg-white/[0.07] text-[#8e8c87] hover:text-[#f5f4f0] border border-white/[0.06] transition-colors cursor-pointer"
              title={copied ? "Link Copied!" : "Share Link"}
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
