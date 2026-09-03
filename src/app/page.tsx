"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { SPOTIFY_PLAYLISTS, SPOTIFY_TRACKS } from "@/lib/music/spotifyCatalog";
import { formatTime } from "@/lib/utils";
import { Play, Pause, ArrowUpRight, Sparkles, Disc } from "lucide-react";

export default function HomePage() {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  // Primary Featured Record for Hero Exhibition
  const heroPlaylist = SPOTIFY_PLAYLISTS[0]; // Late Night Frequencies
  const heroTrack = heroPlaylist.tracks[0];
  const isHeroPlaying = isPlaying && currentTrack?.id === heroTrack.id;

  // Curated Atmospheres (4 key mood records)
  const atmospheres = [
    SPOTIFY_PLAYLISTS[1], // Golden Hour
    SPOTIFY_PLAYLISTS[2], // After Hours
    SPOTIFY_PLAYLISTS[3], // Deep Focus
    SPOTIFY_PLAYLISTS[5], // Night Drive
  ];

  // Tonight's Curated Selections (8 diverse masterworks)
  const tonightsSelections = [
    SPOTIFY_TRACKS[0],
    SPOTIFY_TRACKS[5],
    SPOTIFY_TRACKS[17] || SPOTIFY_TRACKS[1],
    SPOTIFY_TRACKS[9] || SPOTIFY_TRACKS[2],
    SPOTIFY_TRACKS[2],
    SPOTIFY_TRACKS[13] || SPOTIFY_TRACKS[3],
    SPOTIFY_TRACKS[24] || SPOTIFY_TRACKS[4],
    SPOTIFY_TRACKS[28] || SPOTIFY_TRACKS[5],
  ].filter(Boolean);

  const handleHeroPlay = () => {
    if (isHeroPlaying) {
      togglePlay();
    } else {
      playTrack(heroTrack, heroPlaylist.tracks);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-24 sm:space-y-36 select-none">
      {/* Subtle Slow-Moving Reflected Light Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden pointer-events-none opacity-40">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#f5f4f0]/25 to-transparent blur-[1px] animate-light-line" />
      </div>

      {/* 1. HERO EXHIBITION / FEATURED RECORD */}
      <section className="relative">
        {/* Soft, Diffuse Ambient Glow Behind Artwork */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/[0.04] rounded-full blur-[120px] pointer-events-none" />

        {/* Small Uppercase Metadata Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5f4f0]/50" />
          <span className="text-[11px] font-medium tracking-[0.28em] uppercase text-[#8e8c87]">
            Archive Issue 01 / Curated Atmosphere
          </span>
        </div>

        {/* Large Editorial Title */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#f5f4f0] leading-[1.08]">
            Music worth discovering.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#8e8c87] font-light max-w-xl leading-relaxed">
            An independent sanctuary for acoustic warmth, nocturnal frequencies,
            and unhurried listening.
          </p>
        </div>

        {/* Centerpiece Showcase Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left: Floating Album Artwork with Subtle Depth & Hover Physics */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div
              onClick={handleHeroPlay}
              className="group relative w-72 h-72 sm:w-96 sm:h-96 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.95)] border border-white/[0.08] cursor-pointer transition-all duration-500 hover:border-white/[0.2] hover:scale-[1.01]"
            >
              <Image
                src={heroPlaylist.artworkUrl}
                alt={heroPlaylist.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 384px, 450px"
              />

              {/* Gentle Glass Sheen */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

              {/* Play Badge on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-[#f5f4f0] text-[#050505] flex items-center justify-center shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                  {isHeroPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono tracking-widest text-[#f5f4f0]/80 uppercase">
                <span>{heroPlaylist.tracks.length} Tracks</span>
                <span>Vol. I</span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Commentary & Understated Controls */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87]">
                Featured Record
              </span>
              <h2 className="text-3xl sm:text-5xl font-light text-[#f5f4f0] tracking-tight">
                {heroPlaylist.title}
              </h2>
              <p className="text-xs sm:text-sm font-mono tracking-wider text-[#8e8c87] uppercase">
                Curated by {heroPlaylist.curator}
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#8e8c87] font-light leading-relaxed max-w-lg">
              {heroPlaylist.description}
            </p>

            {/* Key Artists in this Record */}
            <div className="pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#4a4844] block mb-2">
                Included Sounds
              </span>
              <p className="text-xs font-mono text-[#8e8c87] tracking-wider uppercase">
                Tycho · Bonobo · Bicep · ODESZA · Jon Hopkins
              </p>
            </div>

            {/* Understated Action Controls */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleHeroPlay}
                className="px-7 py-3 rounded-full bg-[#f5f4f0] hover:bg-white text-[#050505] text-xs font-medium tracking-[0.15em] uppercase transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/40 flex items-center gap-2 cursor-pointer"
              >
                {isHeroPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Archive</span>
                  </>
                )}
              </button>

              <Link
                href={`/playlist/${heroPlaylist.id}`}
                className="px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f4f0] text-xs font-medium tracking-[0.15em] uppercase transition-all border border-white/[0.06] hover:border-white/[0.14] flex items-center gap-2"
              >
                <span>View Details</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8e8c87]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED ATMOSPHERES (Asymmetric 4-Mood Exhibition) */}
      <section className="space-y-8 sm:space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.04]">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87] block mb-1">
              Curated Atmospheres
            </span>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#f5f4f0]">
              Soundscapes for mindsets &amp; hours.
            </h3>
          </div>

          <Link
            href="/playlists"
            className="text-xs font-mono tracking-widest text-[#8e8c87] hover:text-[#f5f4f0] uppercase transition-colors flex items-center gap-1.5"
          >
            <span>All 12 Records</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {atmospheres.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className="group block space-y-4"
            >
              {/* Card Artwork */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0a0a0d] border border-white/[0.06] group-hover:border-white/[0.2] transition-all duration-500 shadow-xl">
                <Image
                  src={playlist.artworkUrl}
                  alt={playlist.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Corner Label */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08] text-[9px] font-mono tracking-widest uppercase text-[#f5f4f0]/90">
                  {playlist.tags[0]}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <h4 className="text-base font-medium text-[#f5f4f0] group-hover:text-white transition-colors">
                  {playlist.title}
                </h4>
                <p className="text-xs text-[#8e8c87] font-light line-clamp-2 leading-relaxed">
                  {playlist.description}
                </p>
                <span className="text-[10px] font-mono text-[#4a4844] block pt-1">
                  {playlist.tracks.length} tracks · {playlist.curator}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TONIGHT'S SELECTIONS (Minimalist Numbered Tracklist) */}
      <section className="space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.04]">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87] block mb-1">
              Tonight&apos;s Selections
            </span>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#f5f4f0]">
              Essential tracks from the archive.
            </h3>
          </div>

          <span className="text-[11px] font-mono text-[#4a4844] tracking-widest uppercase">
            Updated Every Dusk
          </span>
        </div>

        {/* Minimal Numbered Track Rows */}
        <div className="divide-y divide-white/[0.03]">
          {tonightsSelections.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, tonightsSelections)}
                className={`group flex items-center justify-between py-4 sm:py-5 px-3 rounded-xl transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-white/[0.04]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Left: Number, Artwork, Title & Artist */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                  {/* Number / Play Indicator */}
                  <div className="w-7 text-center shrink-0">
                    <span className="text-xs font-mono text-[#4a4844] group-hover:hidden">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Play className="w-3.5 h-3.5 text-[#f5f4f0] fill-[#f5f4f0] hidden group-hover:inline-block ml-1" />
                  </div>

                  {/* Artwork Thumbnail */}
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#0c0c0c] shrink-0 border border-white/[0.06]">
                    <Image
                      src={track.artworkUrl}
                      alt={track.title}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>

                  {/* Title & Artist */}
                  <div className="min-w-0 flex-1 truncate pr-4">
                    <h4
                      className={`text-sm sm:text-base font-normal truncate ${
                        isCurrent
                          ? "text-white font-medium"
                          : "text-[#f5f4f0] group-hover:text-white"
                      }`}
                    >
                      {track.title}
                    </h4>
                    <p className="text-xs text-[#8e8c87] truncate mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Middle: Album Name (Desktop) */}
                <div className="hidden md:block w-48 text-xs text-[#8e8c87] truncate">
                  {track.album}
                </div>

                {/* Right: Duration */}
                <div className="flex items-center gap-4 text-xs font-mono text-[#4a4844] group-hover:text-[#8e8c87] shrink-0">
                  <span>{formatTime(track.duration)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. EDITORIAL MANIFESTO FOOTER NOTE */}
      <section className="pt-12 sm:pt-20 border-t border-white/[0.04] text-center max-w-xl mx-auto space-y-4">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#4a4844]">
          LIVO Design Philosophy
        </span>
        <p className="text-xs text-[#8e8c87] font-light leading-relaxed">
          Music as an environment, not a dashboard. Designed with massive negative
          space, editorial typography, and quiet restraint.
        </p>
      </section>
    </div>
  );
}
