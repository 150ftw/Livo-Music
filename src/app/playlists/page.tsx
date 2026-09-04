"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { SPOTIFY_PLAYLISTS } from "@/lib/music/spotifyCatalog";
import { Search, Play, ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  { label: "All Archives", value: "all" },
  { label: "Modern Punjabi", value: "trending" },
  { label: "Indie & Acoustic", value: "discover" },
  { label: "Heritage Classics", value: "classics" },
  { label: "Hollywood Rap", value: "workout" },
  { label: "Guitar Covers", value: "focus" },
  { label: "Late Night Dream Pop", value: "late-night" },
];

export default function PlaylistsPage() {
  const { playTrack } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlaylists = useMemo(() => {
    return SPOTIFY_PLAYLISTS.filter((playlist) => {
      const matchesCategory =
        selectedCategory === "all" || playlist.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        playlist.title.toLowerCase().includes(q) ||
        playlist.subtitle.toLowerCase().includes(q) ||
        playlist.description.toLowerCase().includes(q) ||
        playlist.curator.toLowerCase().includes(q) ||
        playlist.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-12 sm:space-y-16 select-none">
      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5f4f0]/50" />
          <span className="text-[11px] font-mono tracking-[0.28em] uppercase text-[#8e8c87]">
            Sound Architecture
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-[#f5f4f0]">
              The Sound Archives.
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#8e8c87] font-light max-w-xl">
              6 personal sound archives curated across modern Punjabi, Indian indie, heritage classics, Hollywood rap, acoustic covers, and dream pop.
            </p>
          </div>

          {/* Minimal Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#4a4844] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#0a0a0d] text-xs text-[#f5f4f0] placeholder:text-[#4a4844] border border-white/[0.06] focus:border-white/[0.2] focus:outline-none transition-all"
            />
          </div>
        </div>
      </header>

      {/* Minimal Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#f5f4f0] text-[#050505] font-medium"
                  : "bg-white/[0.03] hover:bg-white/[0.07] text-[#8e8c87] hover:text-[#f5f4f0]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Playlists Editorial Grid */}
      {filteredPlaylists.length === 0 ? (
        <div className="py-24 text-center text-[#8e8c87] text-sm font-light">
          No archives found matching &ldquo;{searchQuery}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="group block space-y-4 p-5 rounded-2xl bg-[#08080a] border border-white/[0.05] hover:border-white/[0.18] transition-all duration-300"
            >
              {/* Artwork Box with Quick Play on Hover */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0c0c0e]">
                <Image
                  src={playlist.artworkUrl}
                  alt={playlist.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                />

                {/* Corner Tag */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08] text-[9px] font-mono tracking-widest uppercase text-[#f5f4f0]/90">
                  {playlist.tags[0]}
                </span>

                {/* Hover Play Action */}
                <div
                  onClick={() => playTrack(playlist.tracks[0], playlist.tracks)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Play Soundscape"
                >
                  <div className="w-12 h-12 rounded-full bg-[#f5f4f0] text-[#050505] flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/playlist/${playlist.id}`}
                    className="group-hover:text-white"
                  >
                    <h3 className="text-xl font-normal text-[#f5f4f0] transition-colors">
                      {playlist.title}
                    </h3>
                  </Link>

                  <Link
                    href={`/playlist/${playlist.id}`}
                    className="p-1 text-[#4a4844] hover:text-white transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <p className="text-xs text-[#8e8c87] font-light line-clamp-2 leading-relaxed">
                  {playlist.description}
                </p>

                <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-[#4a4844]">
                  <span>{playlist.tracks.length} Tracks</span>
                  <span className="truncate max-w-[150px]">{playlist.curator}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
