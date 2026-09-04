"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { SPOTIFY_PLAYLISTS, SPOTIFY_TRACKS, SPOTIFY_ARTISTS } from "@/lib/music/spotifyCatalog";
import { formatTime } from "@/lib/utils";
import { Play, Pause, ArrowUpRight, Compass, Sparkles, Gem } from "lucide-react";

export default function DiscoverPage() {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  // Section 1: Hero Featured Record
  const featured = SPOTIFY_PLAYLISTS[1] || SPOTIFY_PLAYLISTS[0]; // Underrated Indie songs
  const isFeaturedPlaying = isPlaying && currentTrack?.id === featured?.tracks[0]?.id;

  // Section 2: All 6 Curated Atmospheres
  const atmospheres = SPOTIFY_PLAYLISTS;

  // Section 3: Recently Added Tracks
  const recentlyAdded = [
    SPOTIFY_PLAYLISTS[0]?.tracks[0], // Punjabi HardLaunch
    SPOTIFY_PLAYLISTS[1]?.tracks[0], // Underrated Indie
    SPOTIFY_PLAYLISTS[2]?.tracks[0], // Punjabi OG's
    SPOTIFY_PLAYLISTS[3]?.tracks[0], // Hollywood Rap
    SPOTIFY_PLAYLISTS[4]?.tracks[0], // guitar covers 2024
    SPOTIFY_PLAYLISTS[5]?.tracks[0], // Favourite
  ].filter(Boolean);

  // Section 4: Hidden Gems
  const hiddenGems = [
    {
      track: SPOTIFY_PLAYLISTS[1]?.tracks[0], // Ho Jayenge Ghum by Raghav & Arjun, Taba Chake
      curatorNote: "Soulful acoustic guitar fingerstyle and bilingual indie storytelling from Arunachal Pradesh.",
    },
    {
      track: SPOTIFY_PLAYLISTS[4]?.tracks[0], // it will rain - guitar version by guitar girl
      curatorNote: "Intimate solo acoustic guitar cover with warm room acoustics and unhurried resonance.",
    },
    {
      track: SPOTIFY_PLAYLISTS[5]?.tracks[0], // John Wayne by Cigarettes After Sex
      curatorNote: "Nocturnal slowcore drenched in reverb, warm tape hiss, and whispery romantic vocals.",
    },
  ].filter((g) => Boolean(g.track));

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-24 sm:space-y-36 select-none">
      {/* Editorial Page Header */}
      <header className="space-y-3 pb-8 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5f4f0]/50" />
          <span className="text-[11px] font-mono tracking-[0.28em] uppercase text-[#8e8c87]">
            Curated Discovery
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-[#f5f4f0]">
          Exploration Archive.
        </h1>
        <p className="text-sm sm:text-base text-[#8e8c87] font-light max-w-xl">
          Deep dives, under-the-radar recordings, and atmospheric compilations
          assembled by our curatorial team.
        </p>
      </header>

      {/* 1. SECTION: FEATURED RECORD WITH CURATOR PERSPECTIVE */}
      <section className="space-y-8">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87]">
          Issue Spotlight / 01
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Large Floating Album Artwork */}
          <div className="lg:col-span-7">
            <div
              onClick={() => playTrack(featured.tracks[0], featured.tracks)}
              className="group relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#0a0a0d] border border-white/[0.08] cursor-pointer shadow-2xl transition-all duration-500 hover:border-white/[0.2]"
            >
              <Image
                src={featured.artworkUrl}
                alt={featured.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#f5f4f0]/70 block mb-1">
                    Featured Soundscape
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-light text-white">
                    {featured.title}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-full bg-[#f5f4f0] text-[#050505] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  {isFeaturedPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Curator Essay & Perspective */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#4a4844]">
                Curator Essay
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-[#f5f4f0]">
                Why this collection matters
              </h3>
            </div>

            <p className="text-sm text-[#8e8c87] font-light leading-relaxed">
              &ldquo;{featured.description}&rdquo;
            </p>

            <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#f5f4f0]">
                  {featured.curator}
                </p>
                <p className="text-[10px] font-mono text-[#4a4844] uppercase tracking-wider">
                  {featured.curatorRole}
                </p>
              </div>

              <Link
                href={`/playlist/${featured.id}`}
                className="text-xs font-mono text-[#f5f4f0] hover:underline flex items-center gap-1 tracking-wider uppercase"
              >
                <span>Full Tracklist</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: CURATED ATMOSPHERES */}
      <section className="space-y-8 sm:space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.04]">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87] block mb-1">
              Curated Collections
            </span>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#f5f4f0]">
              Atmospheres for every hour.
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {atmospheres.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className="group block space-y-4 p-5 rounded-2xl bg-[#08080a] border border-white/[0.05] hover:border-white/[0.16] transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#0c0c0e]">
                <Image
                  src={playlist.artworkUrl}
                  alt={playlist.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-normal text-[#f5f4f0] group-hover:text-white transition-colors">
                  {playlist.title}
                </h4>
                <p className="text-xs text-[#8e8c87] font-light line-clamp-2 leading-relaxed">
                  {playlist.subtitle}
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#4a4844]">
                  <span>{playlist.tracks.length} tracks</span>
                  <span>{playlist.curator}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. SECTION: RECENTLY ADDED */}
      <section className="space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.04]">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87] block mb-1">
              Fresh Additions
            </span>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#f5f4f0]">
              Recently added to the archive.
            </h3>
          </div>
        </div>

        <div className="divide-y divide-white/[0.03]">
          {recentlyAdded.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, recentlyAdded)}
                className={`group flex items-center justify-between py-4 px-3 rounded-xl transition-all cursor-pointer ${
                  isCurrent ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                  <span className="w-6 text-xs font-mono text-[#4a4844]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#0c0c0c] shrink-0 border border-white/[0.06]">
                    <Image
                      src={track.artworkUrl}
                      alt={track.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>

                  <div className="min-w-0 flex-1 truncate pr-4">
                    <h4
                      className={`text-sm sm:text-base font-normal truncate ${
                        isCurrent ? "text-white font-medium" : "text-[#f5f4f0]"
                      }`}
                    >
                      {track.title}
                    </h4>
                    <p className="text-xs text-[#8e8c87] truncate mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block w-48 text-xs text-[#8e8c87] truncate">
                  {track.album}
                </div>

                <div className="text-xs font-mono text-[#4a4844] group-hover:text-[#8e8c87] shrink-0">
                  {formatTime(track.duration)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION: HIDDEN GEMS */}
      <section className="space-y-8 sm:space-y-12">
        <div className="pb-4 border-b border-white/[0.04]">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87] block mb-1">
            Under The Radar
          </span>
          <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#f5f4f0]">
            Hidden gems &amp; rare textures.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {hiddenGems.map(({ track, curatorNote }) => (
            <div
              key={track.id}
              onClick={() => playTrack(track)}
              className="group p-6 rounded-2xl bg-[#08080a] border border-white/[0.05] hover:border-white/[0.18] transition-all cursor-pointer space-y-5"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0c0c0e]">
                <Image
                  src={track.artworkUrl}
                  alt={track.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white fill-white ml-0.5" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#8e8c87]">
                  {track.genre}
                </span>
                <h4 className="text-lg font-medium text-[#f5f4f0] group-hover:text-white transition-colors">
                  {track.title}
                </h4>
                <p className="text-xs text-[#8e8c87]">{track.artist}</p>
              </div>

              <p className="text-xs text-[#8e8c87] font-light leading-relaxed border-t border-white/[0.04] pt-3 italic">
                &ldquo;{curatorNote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
