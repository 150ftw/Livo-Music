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
        {/* Spotify link */}
        {track.spotifyUrl && (
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full transition-colors text-[#4a4844] opacity-0 group-hover:opacity-100 hover:text-[#1DB954]"
            title="Open on Spotify"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.216.353-.674.467-1.027.25-2.816-1.721-6.36-2.11-10.536-1.157-.404.093-.807-.156-.9-.56-.093-.404.156-.807.56-.9 4.571-1.045 8.492-.596 11.653 1.34.353.216.467.674.25 1.027zm1.467-3.262c-.272.443-.852.583-1.295.311-3.223-1.981-8.138-2.553-11.95-1.396-.499.151-1.027-.134-1.178-.633-.151-.499.134-1.027.633-1.178 4.358-1.322 9.776-.682 13.479 1.593.443.272.583.852.311 1.303zm.126-3.41c-3.865-2.295-10.238-2.506-13.918-1.39-.592.18-1.218-.155-1.398-.747-.18-.592.155-1.218.747-1.398 4.232-1.285 11.267-1.037 15.698 1.593.533.316.706 1.005.39 1.538-.316.533-1.005.706-1.539.404z" />
            </svg>
          </a>
        )}

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
