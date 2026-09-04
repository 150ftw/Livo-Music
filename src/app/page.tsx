"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import {
  SPOTIFY_PLAYLISTS,
  SPOTIFY_TRACKS,
  SPOTIFY_ARTISTS,
} from "@/lib/music/spotifyCatalog";
import { formatTime } from "@/lib/utils";
import { Play, Pause } from "lucide-react";
import { HorizontalScroll } from "@/components/ui/HorizontalScroll";
import { MusicCard } from "@/components/ui/MusicCard";
import { Ferrofluid } from "@/components/ui/Ferrofluid";

export default function HomePage() {
  const { playTrack, currentTrack, isPlaying, togglePlay, progress } = usePlayer();

  // Hero: first playlist
  const heroPlaylist = SPOTIFY_PLAYLISTS[0];
  const heroTrack = heroPlaylist.tracks[0];
  const isHeroPlaying = isPlaying && currentTrack?.id === heroTrack.id;

  // Quick-pick grid: all 6 user playlists as compact cards
  const quickPicks = SPOTIFY_PLAYLISTS.slice(0, 6);

  // Trending songs: diverse selection across all 6 user playlists
  const trending = [
    SPOTIFY_PLAYLISTS[0]?.tracks[0], // Punjabi HardLaunch
    SPOTIFY_PLAYLISTS[1]?.tracks[0], // Underrated Indie
    SPOTIFY_PLAYLISTS[2]?.tracks[0], // Punjabi OG's
    SPOTIFY_PLAYLISTS[3]?.tracks[0], // Hollywood Rap
    SPOTIFY_PLAYLISTS[4]?.tracks[0], // guitar covers 2024
    SPOTIFY_PLAYLISTS[5]?.tracks[0], // Favourite
    SPOTIFY_PLAYLISTS[0]?.tracks[2],
    SPOTIFY_PLAYLISTS[1]?.tracks[1],
    SPOTIFY_PLAYLISTS[3]?.tracks[1],
    SPOTIFY_PLAYLISTS[5]?.tracks[1],
  ].filter(Boolean);

  // Curated atmospheres (all 6 user playlists)
  const atmospheres = SPOTIFY_PLAYLISTS;

  // Artists from the playlists
  const artists = SPOTIFY_ARTISTS || [];

  // Popular album cards
  const popularAlbums = [
    SPOTIFY_PLAYLISTS[0]?.tracks[1],
    SPOTIFY_PLAYLISTS[1]?.tracks[2],
    SPOTIFY_PLAYLISTS[2]?.tracks[1],
    SPOTIFY_PLAYLISTS[3]?.tracks[2],
    SPOTIFY_PLAYLISTS[4]?.tracks[1],
    SPOTIFY_PLAYLISTS[5]?.tracks[2],
    SPOTIFY_PLAYLISTS[0]?.tracks[3],
    SPOTIFY_PLAYLISTS[1]?.tracks[3],
  ].filter(Boolean);

  // Tonight's nocturnal selections
  const tonightsSelections = [
    SPOTIFY_PLAYLISTS[5]?.tracks[0], // Favourite
    SPOTIFY_PLAYLISTS[1]?.tracks[0], // Underrated Indie
    SPOTIFY_PLAYLISTS[4]?.tracks[0], // Guitar covers
    SPOTIFY_PLAYLISTS[0]?.tracks[0], // Punjabi HardLaunch
    SPOTIFY_PLAYLISTS[3]?.tracks[0], // Hollywood Rap
    SPOTIFY_PLAYLISTS[2]?.tracks[0], // Punjabi OG's
    SPOTIFY_PLAYLISTS[1]?.tracks[4],
    SPOTIFY_PLAYLISTS[5]?.tracks[3],
  ].filter(Boolean);

  const handleHeroPlay = () => {
    if (isHeroPlaying) {
      togglePlay();
    } else {
      playTrack(heroTrack, heroPlaylist.tracks);
    }
  };

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10 pb-8 select-none">
      {/* 1. GREETING + HERO BANNER */}
      <section className="relative">
        {/* Living Ferrofluid Soundscape Hero Background */}
        <div className="absolute inset-0 h-[360px] pointer-events-none overflow-hidden rounded-t-xl z-0">
          <Ferrofluid
            colors={
              currentTrack?.accentColor
                ? [currentTrack.accentColor, "#15803d", "#737373"]
                : ["#15803d", "#22c55e", "#737373"]
            }
            speed={0.16}
            scale={1.85}
            turbulence={0.45}
            fluidity={0.16}
            rimWidth={0.18}
            sharpness={2.0}
            shimmer={0.3}
            glow={1.15}
            flowDirection="down"
            opacity={0.22}
            mouseInteraction={true}
            mouseStrength={0.6}
            syncToBeats={true}
            isPlaying={isPlaying}
            track={currentTrack}
            currentTime={progress}
            mixBlendMode="screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a2a]/20 via-[#121212]/75 to-[#121212]" />
        </div>

        <div className="relative px-6 lg:px-8 pt-6 pb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
            {getGreeting()}
          </h1>

          {/* Quick-Pick Grid — 2x3 compact rectangular cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {quickPicks.map((playlist) => {
              const firstTrack = playlist.tracks[0];
              const isCurrentPlaylist =
                isPlaying && currentTrack?.id === firstTrack?.id;

              return (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  className="group flex items-center bg-white/[0.07] hover:bg-white/[0.14] rounded-md overflow-hidden transition-all duration-200"
                >
                  {/* Compact Artwork */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                    <Image
                      src={playlist.artworkUrl}
                      alt={playlist.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Title + Play Button */}
                  <div className="flex items-center justify-between flex-1 px-4 min-w-0">
                    <span className="text-sm font-bold text-white truncate">
                      {playlist.title}
                    </span>

                    {/* Play button on hover */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isCurrentPlaylist) {
                          togglePlay();
                        } else if (firstTrack) {
                          playTrack(firstTrack, playlist.tracks);
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 flex items-center justify-center shadow-lg shadow-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shrink-0 ml-2"
                      aria-label="Play"
                    >
                      {isCurrentPlaylist ? (
                        <Pause className="w-4 h-4 text-black fill-black" />
                      ) : (
                        <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                      )}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. TRENDING NOW — Horizontal scroll of track cards */}
      <div className="px-4 lg:px-6">
        <HorizontalScroll
          title="Trending Now"
          subtitle="Popular tracks from the archive"
          showAllHref="/discover"
          showAllLabel="Show all"
        >
          {trending.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <MusicCard
                key={track.id}
                id={track.id}
                title={track.title}
                subtitle={track.artist}
                imageUrl={track.artworkUrl}
                variant="square"
                size="md"
                isPlaying={isCurrentPlaying}
                isCurrent={isCurrent}
                onPlay={() => {
                  if (isCurrentPlaying) {
                    togglePlay();
                  } else {
                    playTrack(track, trending);
                  }
                }}
              />
            );
          })}
        </HorizontalScroll>
      </div>

      {/* 3. CURATED ATMOSPHERES — Playlist cards */}
      <div className="px-4 lg:px-6">
        <HorizontalScroll
          title="Curated Atmospheres"
          subtitle="Soundscapes for every mood"
          showAllHref="/playlists"
          showAllLabel="Show all"
        >
          {atmospheres.map((playlist) => {
            const firstTrack = playlist.tracks[0];
            const isCurrent = currentTrack?.id === firstTrack?.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <MusicCard
                key={playlist.id}
                id={playlist.id}
                title={playlist.title}
                subtitle={`${playlist.tracks.length} tracks · ${playlist.curator}`}
                imageUrl={playlist.artworkUrl}
                variant="square"
                size="md"
                isPlaying={isCurrentPlaying}
                isCurrent={isCurrent}
                onPlay={() => {
                  if (isCurrentPlaying) {
                    togglePlay();
                  } else if (firstTrack) {
                    playTrack(firstTrack, playlist.tracks);
                  }
                }}
                href={`/playlist/${playlist.id}`}
              />
            );
          })}
        </HorizontalScroll>
      </div>

      {/* 4. FEATURED ARTISTS — Circular avatars */}
      {artists.length > 0 && (
        <div className="px-4 lg:px-6">
          <HorizontalScroll
            title="Featured Artists"
            subtitle="Producers, composers, and visionaries"
            showAllHref="/discover"
          >
            {artists.map((artist) => {
              const firstTrack = artist.popularTracks?.[0];
              return (
                <MusicCard
                  key={artist.id}
                  id={artist.id}
                  title={artist.name}
                  subtitle={artist.role || artist.genres?.[0] || "Artist"}
                  imageUrl={artist.image}
                  variant="circle"
                  size="md"
                  onPlay={
                    firstTrack
                      ? () => playTrack(firstTrack, artist.popularTracks)
                      : undefined
                  }
                />
              );
            })}
          </HorizontalScroll>
        </div>
      )}

      {/* 5. POPULAR ALBUMS & SINGLES — Another horizontal row */}
      <div className="px-4 lg:px-6">
        <HorizontalScroll
          title="Popular Albums & Singles"
          subtitle="Deep cuts and essential records"
          showAllHref="/discover"
        >
          {popularAlbums.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <MusicCard
                key={`album-${track.id}`}
                id={track.id}
                title={track.album}
                subtitle={track.artist}
                imageUrl={track.artworkUrl}
                variant="square"
                size="md"
                isPlaying={isCurrentPlaying}
                isCurrent={isCurrent}
                onPlay={() => {
                  if (isCurrentPlaying) {
                    togglePlay();
                  } else {
                    playTrack(track, popularAlbums);
                  }
                }}
              />
            );
          })}
        </HorizontalScroll>
      </div>

      {/* 6. TONIGHT'S SELECTIONS — Compact Track List */}
      <section className="px-6 lg:px-8 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Tonight&apos;s Selections
          </h2>
          <p className="text-sm text-[#b3b3b3] mt-1">
            Essential tracks from the archive
          </p>
        </div>

        <div className="space-y-0.5">
          {tonightsSelections.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, tonightsSelections)}
                className={`group flex items-center gap-4 px-4 py-2.5 rounded-md transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-white/[0.08]"
                    : "hover:bg-white/[0.06]"
                }`}
              >
                {/* Track Number / Play Icon */}
                <div className="w-6 text-center shrink-0">
                  {isCurrent && isCurrentPlaying ? (
                    <div className="flex items-center justify-center gap-[2px]">
                      <span className="w-[3px] h-3 bg-[#1ed760] rounded-full animate-pulse" />
                      <span className="w-[3px] h-4 bg-[#1ed760] rounded-full animate-pulse" style={{ animationDelay: "0.15s" }} />
                      <span className="w-[3px] h-2.5 bg-[#1ed760] rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                    </div>
                  ) : (
                    <>
                      <span className="text-sm text-[#b3b3b3] group-hover:hidden tabular-nums">
                        {idx + 1}
                      </span>
                      <Play className="w-4 h-4 text-white fill-white hidden group-hover:block mx-auto" />
                    </>
                  )}
                </div>

                {/* Artwork */}
                <div className="relative w-10 h-10 rounded overflow-hidden bg-[#282828] shrink-0">
                  <Image
                    src={track.artworkUrl}
                    alt={track.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>

                {/* Title & Artist */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium truncate ${
                      isCurrent ? "text-[#1ed760]" : "text-white"
                    }`}
                  >
                    {track.title}
                  </p>
                  <p className="text-xs text-[#b3b3b3] truncate">
                    {track.artist}
                  </p>
                </div>

                {/* Album (Desktop) */}
                <div className="hidden lg:block w-44 text-sm text-[#b3b3b3] truncate">
                  {track.album}
                </div>

                {/* Duration */}
                <div className="text-sm text-[#b3b3b3] tabular-nums shrink-0">
                  {formatTime(track.duration)}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
