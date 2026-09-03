"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { musicProvider } from "@/lib/music/provider";
import { TrackRow } from "@/components/playlist/TrackRow";
import { SearchResults, Track } from "@/types/music";
import { usePlayer } from "@/context/PlayerContext";
import { Search, ArrowUpRight } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const searchParamQuery = searchParams?.get("q") || "";
  const [query, setQuery] = useState(searchParamQuery);
  const [prevParam, setPrevParam] = useState(searchParamQuery);

  if (prevParam !== searchParamQuery) {
    setPrevParam(searchParamQuery);
    setQuery(searchParamQuery);
  }

  const [results, setResults] = useState<SearchResults>({
    playlists: [],
    tracks: [],
    artists: [],
  });

  const { playTrack } = usePlayer();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await musicProvider.search(query);
        setResults(res);
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-12 sm:space-y-16 select-none">
      {/* Editorial Header */}
      <header className="space-y-4 pb-8 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5f4f0]/50" />
          <span className="text-[11px] font-mono tracking-[0.28em] uppercase text-[#8e8c87]">
            Archive Index
          </span>
        </div>

        <div className="relative max-w-3xl">
          <Search className="w-6 h-6 text-[#4a4844] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search music, artists, albums..."
            className="w-full pl-10 pr-4 py-2 bg-transparent text-2xl sm:text-4xl font-light text-[#f5f4f0] placeholder:text-[#333230] focus:outline-none tracking-tight border-none"
            autoFocus
          />
        </div>
      </header>

      {/* Results Container */}
      <div className="space-y-16">
        {/* Matching Tracks */}
        {results.tracks.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87]">
                Tracks ({results.tracks.length})
              </span>
            </div>

            <div className="divide-y divide-white/[0.03]">
              {results.tracks.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  queueContext={results.tracks}
                />
              ))}
            </div>
          </section>
        )}

        {/* Matching Playlists */}
        {results.playlists.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87]">
                Playlists ({results.playlists.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  className="group block p-4 rounded-xl bg-[#08080a] border border-white/[0.05] hover:border-white/[0.16] transition-all"
                >
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#0c0c0e] mb-3">
                    <Image
                      src={playlist.artworkUrl}
                      alt={playlist.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-medium text-[#f5f4f0] group-hover:text-white transition-colors">
                        {playlist.title}
                      </h4>
                      <p className="text-xs text-[#8e8c87] mt-0.5 line-clamp-1">
                        {playlist.curator} · {playlist.tracks.length} tracks
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#4a4844] group-hover:text-white transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Matching Artists */}
        {results.artists.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87]">
                Artists ({results.artists.length})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {results.artists.map((artist) => (
                <div
                  key={artist.id}
                  className="p-5 rounded-xl bg-[#08080a] border border-white/[0.04] text-center flex flex-col items-center"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 border border-white/[0.08]">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <h5 className="text-sm font-medium text-[#f5f4f0] truncate w-full">
                    {artist.name}
                  </h5>
                  <span className="text-[11px] text-[#8e8c87] truncate w-full mt-0.5">
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
            <div className="py-24 text-center text-[#8e8c87] text-sm font-light">
              No sounds found matching &ldquo;{query}&rdquo;.
            </div>
          )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-[#8e8c87] font-mono text-xs">Loading index...</div>}>
      <SearchContent />
    </Suspense>
  );
}
