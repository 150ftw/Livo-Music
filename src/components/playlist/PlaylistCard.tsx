"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Playlist } from "@/types/music";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: Playlist;
  aspect?: "square" | "portrait";
  className?: string;
}

export function PlaylistCard({
  playlist,
  aspect = "square",
  className,
}: PlaylistCardProps) {
  const { isPlaying, playPlaylist, togglePlay, queue, isSavedPlaylist, toggleSavePlaylist } =
    usePlayer();

  const isCurrentPlaylistPlaying =
    isPlaying && queue.some((t) => playlist.tracks.some((pt) => pt.id === t.id));
  const isSaved = isSavedPlaylist(playlist.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playPlaylist(playlist, 0);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavePlaylist(playlist.id);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-[#0e0e14]/60 hover:bg-[#151520]/80 border border-white/[0.06] hover:border-white/[0.14] p-3.5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60",
        className
      )}
    >
      {/* Artwork Container */}
      <Link
        href={`/playlist/${playlist.id}`}
        className={cn(
          "relative w-full rounded-xl overflow-hidden bg-[#181824] block shadow-md group-hover:shadow-xl transition-shadow",
          aspect === "square" ? "aspect-square" : "aspect-[3/4]"
        )}
      >
        <Image
          src={playlist.artworkUrl}
          alt={playlist.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709]/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

        {/* Save Quick Action Button */}
        <button
          onClick={handleSaveClick}
          className={cn(
            "absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110",
            isSaved && "opacity-100 text-[#e5b067]"
          )}
          title={isSaved ? "Saved" : "Save Playlist"}
        >
          <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-[#e5b067]")} />
        </button>

        {/* Track Count Pill */}
        <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 tracking-wider">
          {playlist.tracks.length} TRACKS
        </div>

        {/* Floating Play Button */}
        <button
          onClick={handlePlayClick}
          className={cn(
            "absolute bottom-3 right-3 z-10 w-11 h-11 rounded-full bg-[#e5b067] hover:bg-[#f7cb8b] text-[#070709] flex items-center justify-center shadow-xl shadow-[#e5b067]/40 transition-all duration-300 transform",
            isCurrentPlaylistPlaying
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 hover:scale-110"
          )}
          title={isCurrentPlaylistPlaying ? "Pause Playlist" : "Play Playlist"}
        >
          {isCurrentPlaylistPlaying ? (
            <Pause className="w-5 h-5 fill-[#070709]" />
          ) : (
            <Play className="w-5 h-5 fill-[#070709] ml-0.5" />
          )}
        </button>
      </Link>

      {/* Playlist Meta Details */}
      <div className="mt-3.5 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/playlist/${playlist.id}`} className="block focus:outline-none">
            <h3 className="font-serif text-base font-semibold text-white tracking-tight group-hover:text-[#e5b067] transition-colors line-clamp-1">
              {playlist.title}
            </h3>
          </Link>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {playlist.subtitle}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
          <span className="truncate">Curated by <span className="text-zinc-300 font-medium">{playlist.curator}</span></span>
          <span className="shrink-0 text-zinc-400 font-mono text-[10px]">{playlist.releaseDate}</span>
        </div>
      </div>
    </div>
  );
}
