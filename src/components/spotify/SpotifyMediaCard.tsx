"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { Track, Playlist, Artist } from "@/types/music";
import { Play, Pause } from "lucide-react";

interface SpotifyMediaCardProps {
  item: Track | Playlist | Artist;
  shape?: "square" | "circle";
  subtitle?: string;
  href?: string;
  queueContext?: Track[];
}

export function SpotifyMediaCard({
  item,
  shape = "square",
  subtitle,
  href,
  queueContext,
}: SpotifyMediaCardProps) {
  const { currentTrack, isPlaying, playTrack, playPlaylist, togglePlay } = usePlayer();

  // Determine item type
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
      ? (item as Playlist).description || `By ${(item as Playlist).curator}`
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
      className="group relative flex flex-col p-3 rounded-lg bg-transparent hover:bg-[#181818] transition-colors duration-200 cursor-pointer select-none"
    >
      {/* Artwork Container */}
      <div className="relative w-full aspect-square mb-3 shadow-lg">
        <div
          className={`relative w-full h-full overflow-hidden bg-[#242424] shadow-md ${
            shape === "circle" ? "rounded-full" : "rounded-md"
          }`}
        >
          <Image
            src={image}
            alt={title}
            fill
            className={`object-cover transition-transform duration-300 ${
              shape === "circle" ? "group-hover:scale-105" : ""
            }`}
            sizes="(max-width: 768px) 160px, 200px"
          />
        </div>

        {/* Floating Spotify Green Play Button */}
        <button
          onClick={handlePlayClick}
          className="spotify-play-btn absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black flex items-center justify-center shadow-xl transition-all duration-200 z-10"
          title={isCurrentActive && isPlaying ? "Pause" : "Play"}
        >
          {isCurrentActive && isPlaying ? (
            <Pause className="w-5 h-5 fill-black" />
          ) : (
            <Play className="w-5 h-5 fill-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Text Info */}
      <div className="flex flex-col min-h-[44px]">
        <span className="font-bold text-sm text-white truncate group-hover:underline">
          {title}
        </span>
        <span className="text-xs text-[#b3b3b3] line-clamp-2 mt-1 leading-snug">
          {description}
        </span>
      </div>
    </Link>
  );
}
