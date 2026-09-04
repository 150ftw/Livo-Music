"use client";

import React from "react";
import Image from "next/image";
import { Track } from "@/types/music";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";
import { Play, Pause, Heart } from "lucide-react";

interface TrackRowProps {
  track: Track;
  index: number;
  queueContext?: Track[];
}

export function TrackRow({ track, index, queueContext }: TrackRowProps) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleSaveTrack,
    isTrackSaved,
  } = usePlayer();

  const isCurrent = currentTrack?.id === track.id;
  const isSaved = isTrackSaved(track.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueContext);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveTrack(track);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center justify-between py-4 sm:py-5 px-3 sm:px-4 rounded-xl cursor-pointer transition-all duration-200 select-none ${
        isCurrent
          ? "bg-white/[0.04] text-white"
          : "hover:bg-white/[0.025]"
      }`}
    >
      {/* Left: Number, Artwork, Title & Artist */}
      <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
        {/* Index / Hover Play Button */}
        <div className="w-7 text-center shrink-0">
          {isCurrent ? (
            isPlaying ? (
              <span className="w-2 h-2 rounded-full bg-[#f5f4f0] inline-block animate-pulse" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-[#f5f4f0] fill-current inline-block" />
            )
          ) : (
            <>
              <span className="text-xs font-mono text-[#4a4844] group-hover:hidden">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Play className="w-3.5 h-3.5 text-[#f5f4f0] fill-[#f5f4f0] hidden group-hover:inline-block ml-0.5" />
            </>
          )}
        </div>

        {/* Artwork Thumbnail */}
        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#0c0c0e] border border-white/[0.06]">
          <Image
            src={track.artworkUrl}
            alt={track.title}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>

        {/* Titles */}
        <div className="min-w-0 flex-1 truncate pr-4">
          <h4
            className={`text-sm sm:text-base font-normal truncate ${
              isCurrent ? "text-white font-medium" : "text-[#f5f4f0] group-hover:text-white"
            }`}
          >
            {track.title}
          </h4>
          <p className="text-xs text-[#8e8c87] truncate mt-0.5">
            {track.artist}
          </p>
        </div>
      </div>

      {/* Center: Album Name (Desktop) */}
      <div className="hidden md:block w-48 text-xs text-[#8e8c87] truncate">
        {track.album}
      </div>

      {/* Right: Heart & Duration */}
      <div className="flex items-center gap-4 shrink-0">

        <button
          onClick={handleSaveClick}
          className={`p-1.5 rounded-full transition-colors ${
            isSaved
              ? "text-[#f5f4f0] opacity-100"
              : "text-[#4a4844] opacity-0 group-hover:opacity-100 hover:text-[#8e8c87]"
          }`}
          title={isSaved ? "Saved" : "Save"}
        >
          <Heart
            className={`w-3.5 h-3.5 ${isSaved ? "fill-[#f5f4f0]" : ""}`}
          />
        </button>

        <span className="font-mono text-xs text-[#4a4844] group-hover:text-[#8e8c87] w-12 text-right">
          {formatTime(track.duration)}
        </span>
      </div>
    </div>
  );
}
