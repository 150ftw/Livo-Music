"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { TrackRow } from "@/components/playlist/TrackRow";
import { Play, ArrowUpRight, Disc, Heart, History, Compass } from "lucide-react";

export default function SavedLibraryPage() {
  const { savedPlaylists, savedTracks, recentlyPlayed, playTrack } = usePlayer();
  const [activeTab, setActiveTab] = useState<"playlists" | "tracks" | "history">("playlists");

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-12 sm:space-y-16 select-none">
      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5f4f0]/50" />
          <span className="text-[11px] font-mono tracking-[0.28em] uppercase text-[#8e8c87]">
            Personal Archive
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-[#f5f4f0]">
          Your Collection.
        </h1>
        <p className="text-sm sm:text-base text-[#8e8c87] font-light max-w-xl">
          Curated archives you have bookmarked, singles you love, and recent
          listening sessions saved to local storage.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.04] pb-4">
        <button
          onClick={() => setActiveTab("playlists")}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "playlists"
              ? "bg-[#f5f4f0] text-[#050505] font-medium"
              : "text-[#8e8c87] hover:text-[#f5f4f0]"
          }`}
        >
          <Disc className="w-3.5 h-3.5" />
          <span>Archives ({savedPlaylists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("tracks")}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "tracks"
              ? "bg-[#f5f4f0] text-[#050505] font-medium"
              : "text-[#8e8c87] hover:text-[#f5f4f0]"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Liked Tracks ({savedTracks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "history"
              ? "bg-[#f5f4f0] text-[#050505] font-medium"
              : "text-[#8e8c87] hover:text-[#f5f4f0]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Recent ({recentlyPlayed.length})</span>
        </button>
      </div>

      {/* Active Tab Panes */}
      {activeTab === "playlists" && (
        <div>
          {savedPlaylists.length === 0 ? (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <span className="text-xs font-mono tracking-widest uppercase text-[#4a4844]">
                Empty Archive
              </span>
              <h3 className="text-2xl font-light text-[#f5f4f0]">
                No soundscapes bookmarked yet.
              </h3>
              <p className="text-xs text-[#8e8c87] font-light leading-relaxed">
                As you wander through the LIVO archive, bookmark collections to preserve
                them in your private listening space.
              </p>
              <div className="pt-4">
                <Link
                  href="/playlists"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono tracking-wider uppercase text-[#f5f4f0] border border-white/[0.08] transition-all"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Explore Archives</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedPlaylists.map((pl) => (
                <Link
                  key={pl.id}
                  href={`/playlist/${pl.id}`}
                  className="group block space-y-4 p-5 rounded-2xl bg-[#08080a] border border-white/[0.05] hover:border-white/[0.18] transition-all"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0c0c0e]">
                    <Image
                      src={pl.artworkUrl}
                      alt={pl.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg font-normal text-[#f5f4f0] group-hover:text-white transition-colors">
                      {pl.title}
                    </h4>
                    <p className="text-xs text-[#8e8c87] line-clamp-2">
                      {pl.description}
                    </p>
                    <span className="text-[10px] font-mono text-[#4a4844] block pt-1">
                      {pl.tracks.length} tracks · {pl.curator}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "tracks" && (
        <div>
          {savedTracks.length === 0 ? (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <span className="text-xs font-mono tracking-widest uppercase text-[#4a4844]">
                Empty Library
              </span>
              <h3 className="text-2xl font-light text-[#f5f4f0]">
                No liked tracks yet.
              </h3>
              <p className="text-xs text-[#8e8c87] font-light leading-relaxed">
                Tap the subtle heart icon on any track row or in the listening environment
                to assemble your personal constellation.
              </p>
              <div className="pt-4">
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono tracking-wider uppercase text-[#f5f4f0] border border-white/[0.08] transition-all"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Discover Music</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {savedTracks.map((track, idx) => (
                <TrackRow
                  key={`${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  queueContext={savedTracks}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div>
          {recentlyPlayed.length === 0 ? (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <span className="text-xs font-mono tracking-widest uppercase text-[#4a4844]">
                Listening History
              </span>
              <h3 className="text-2xl font-light text-[#f5f4f0]">
                No recent listening sessions.
              </h3>
              <p className="text-xs text-[#8e8c87] font-light leading-relaxed">
                Audio records you play will automatically appear here so you can easily
                revisit textures you discovered.
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono tracking-wider uppercase text-[#f5f4f0] border border-white/[0.08] transition-all"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Begin Listening</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {recentlyPlayed.map((track, idx) => (
                <TrackRow
                  key={`${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  queueContext={recentlyPlayed}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
