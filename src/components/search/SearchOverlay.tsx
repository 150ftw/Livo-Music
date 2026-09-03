"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchOverlay } from "@/context/SearchOverlayContext";
import { usePlayer } from "@/context/PlayerContext";
import { musicProvider } from "@/lib/music/provider";
import { SearchResults, Track, Playlist, Artist } from "@/types/music";
import { formatTime } from "@/lib/utils";
import { Search, X, Play, ArrowRight } from "lucide-react";

export function SearchOverlay() {
  const { isOpen, closeSearch } = useSearchOverlay();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    playlists: [],
    tracks: [],
    artists: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      const res = await musicProvider.search(query);
      setResults(res);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelectTrack = (track: Track) => {
    playTrack(track, results.tracks.length > 0 ? results.tracks : undefined);
    closeSearch();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-2xl flex flex-col justify-start px-6 sm:px-12 md:px-24 pt-16 sm:pt-24 pb-12 overflow-y-auto"
        >
          {/* Top Bar with Minimal Close */}
          <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-8 border-b border-white/[0.06]">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8e8c87] font-medium">
              Search Archive
            </span>

            <button
              onClick={closeSearch}
              className="flex items-center gap-2 text-xs text-[#8e8c87] hover:text-[#f5f4f0] transition-colors group"
            >
              <span className="text-[10px] tracking-widest uppercase font-mono group-hover:underline">
                Close [ESC]
              </span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Large Editorial Search Input */}
          <div className="w-full max-w-4xl mx-auto mt-8">
            <div className="relative flex items-center">
              <Search className="w-6 h-6 text-[#4a4844] mr-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search music, artists, albums..."
                className="w-full bg-transparent text-2xl sm:text-4xl lg:text-5xl font-light text-[#f5f4f0] placeholder:text-[#333230] focus:outline-none tracking-tight border-none"
              />
            </div>
          </div>

          {/* Results Container */}
          <div className="w-full max-w-4xl mx-auto mt-12 space-y-12">
            {/* Tracks Category */}
            {results.tracks.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.04]">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8e8c87]">
                    Tracks ({results.tracks.length})
                  </span>
                </div>

                <div className="divide-y divide-white/[0.03]">
                  {results.tracks.slice(0, 6).map((track, idx) => {
                    const isCurrent = currentTrack?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handleSelectTrack(track)}
                        className="group flex items-center justify-between py-3 px-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="w-6 text-[11px] font-mono text-[#4a4844] group-hover:text-[#8e8c87]">
                            {String(idx + 1).padStart(2, "0")}
                          </span>

                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[#0c0c0c] shrink-0 border border-white/[0.04]">
                            <Image
                              src={track.artworkUrl}
                              alt={track.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                            </div>
                          </div>

                          <div className="min-w-0 truncate">
                            <h4 className={`text-sm font-medium truncate ${isCurrent ? "text-white" : "text-[#f5f4f0] group-hover:text-white"}`}>
                              {track.title}
                            </h4>
                            <p className="text-xs text-[#8e8c87] truncate">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-[#4a4844] group-hover:text-[#8e8c87] shrink-0">
                          <span>{track.album}</span>
                          <span>{formatTime(track.duration)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Playlists Category */}
            {results.playlists.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.04]">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8e8c87]">
                    Playlists ({results.playlists.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.playlists.slice(0, 6).map((playlist) => (
                    <Link
                      key={playlist.id}
                      href={`/playlist/${playlist.id}`}
                      onClick={closeSearch}
                      className="group p-3 rounded-xl bg-[#080808] border border-white/[0.05] hover:border-white/[0.14] transition-all flex items-center gap-4"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#0c0c0c] shrink-0">
                        <Image
                          src={playlist.artworkUrl}
                          alt={playlist.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="64px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-[#f5f4f0] group-hover:text-white truncate">
                          {playlist.title}
                        </h4>
                        <p className="text-xs text-[#8e8c87] truncate mt-0.5">
                          {playlist.curator}
                        </p>
                        <span className="text-[10px] font-mono text-[#4a4844] mt-1 block">
                          {playlist.tracks.length} tracks
                        </span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-[#4a4844] group-hover:text-white transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Artists Category */}
            {results.artists.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.04]">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8e8c87]">
                    Artists ({results.artists.length})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {results.artists.slice(0, 4).map((artist) => (
                    <div
                      key={artist.id}
                      className="p-4 rounded-xl bg-[#080808] border border-white/[0.04] text-center flex flex-col items-center"
                    >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 border border-white/[0.08]">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <h5 className="text-sm font-medium text-[#f5f4f0] truncate w-full">
                        {artist.name}
                      </h5>
                      <span className="text-[10px] text-[#8e8c87] truncate w-full mt-0.5">
                        {artist.genres[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {query.trim() !== "" &&
              results.tracks.length === 0 &&
              results.playlists.length === 0 &&
              results.artists.length === 0 && (
                <div className="py-16 text-center text-[#8e8c87] text-sm font-light">
                  No sounds found matching &ldquo;{query}&rdquo;.
                </div>
              )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
