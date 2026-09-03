"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { Track, Playlist, Artist } from "@/types/music";
import { Play, Pause } from "lucide-react";

interface LivoMediaCardProps {
  item: Track | Playlist | Artist;
  shape?: "square" | "circle";
  subtitle?: string;
  href?: string;
  queueContext?: Track[];
}

export function LivoMediaCard({
  item,
  shape = "square",
  subtitle,
  href,
  queueContext,
}: LivoMediaCardProps) {
  const { currentTrack, isPlaying, playTrack, playPlaylist, togglePlay } = usePlayer();

  const isTrack = "album" in item && "duration" in item;
  const isPlaylist = "tracks" in item;
  const isArtist = "genres" in item;

  const title = "title" in item ? item.title : item.name;
  const image =
    "artworkUrl" in item
      ? item.artworkUrl
      : "image" in item
      ? item.image
      : "https://images.unsplash.com/photo-1518709268805-4e9042af9f23";

  const description =
    subtitle ||
    ("artist" in item
      ? item.artist
      : isPlaylist
      ? (item as Playlist).description || `Curated by ${(item as Playlist).curator}`
      : "Artist");

  const isCurrentActive =
    isTrack && currentTrack?.id === (item as Track).id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCurrentActive) {
      togglePlay();
      return;
    }

    if (isTrack) {
      playTrack(item as Track, queueContext);
    } else if (isPlaylist) {
      playPlaylist(item as Playlist);
    } else if (isArtist) {
      const artist = item as Artist;
      if (artist.popularTracks && artist.popularTracks.length > 0) {
        playTrack(artist.popularTracks[0], artist.popularTracks);
      }
    }
  };

  const defaultHref = isTrack
    ? `/search?q=${encodeURIComponent((item as Track).title)}`
    : isPlaylist
    ? `/playlist/${(item as Playlist).id}`
    : `/search?q=${encodeURIComponent((item as Artist).name)}`;

  const cardLink = href || defaultHref;

  return (
    <Link
      href={cardLink}
      className="group relative flex flex-col p-3 rounded-xl bg-transparent hover:bg-[#141420] border border-transparent hover:border-purple-500/20 transition-all duration-200 cursor-pointer select-none"
    >
      {/* Artwork Container */}
      <div className="relative w-full aspect-square mb-3 shadow-lg">
        <div
          className={`relative w-full h-full overflow-hidden bg-[#181826] border border-white/[0.06] shadow-md ${
            shape === "circle" ? "rounded-full group-hover:border-purple-500/40 transition-colors" : "rounded-xl"
          }`}
        >
          <Image
            src={image}
            alt={title}
            fill
            className={`object-cover transition-transform duration-500 ${
              shape === "circle" ? "group-hover:scale-105" : "group-hover:scale-102"
            }`}
            sizes="(max-width: 768px) 160px, 200px"
          />
        </div>

        {/* Floating LIVO Glowing Play Button */}
        <button
          onClick={handlePlayClick}
          className="livo-play-btn absolute bottom-2 right-2 w-11 h-11 rounded-full bg-gradient-to-tr from-[#ec4899] via-[#a855f7] to-[#3b82f6] text-white flex items-center justify-center shadow-xl shadow-purple-900/50 transition-all duration-200 z-10 border border-white/20"
          title={isCurrentActive && isPlaying ? "Pause" : "Play on Livo"}
        >
          {isCurrentActive && isPlaying ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Text Info */}
      <div className="flex flex-col min-h-[42px]">
        <span className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-purple-300 transition-colors">
          {title}
        </span>
        <span className="text-[11px] sm:text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
          {description}
        </span>
      </div>
    </Link>
  );
}
