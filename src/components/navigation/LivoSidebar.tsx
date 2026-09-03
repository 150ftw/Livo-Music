"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { CreatePlaylistModal } from "@/components/spotify/CreatePlaylistModal";
import {
  Library,
  Plus,
  Heart,
  Music,
  Compass,
  Radio,
} from "lucide-react";

export function LivoSidebar() {
  const pathname = usePathname();
  const { savedPlaylists, savedTracks } = usePlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside className="w-64 lg:w-72 flex flex-col gap-2 shrink-0 select-none pb-24 md:pb-2">
        {/* Main "Your Library" Box */}
        <div className="flex-1 bg-[#0e0e16] border border-white/[0.06] rounded-2xl flex flex-col p-4 overflow-hidden shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] text-zinc-300">
            <Link
              href="/saved"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Library className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-sm tracking-tight text-white">
                Your Library
              </span>
            </Link>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 p-1.5 rounded-full hover:bg-white/[0.08] hover:text-white text-zinc-400 hover:border-white/[0.2] transition-all text-xs font-semibold"
              title="Create new playlist"
            >
              <Plus className="w-4 h-4 text-purple-400" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="py-3 border-b border-white/[0.06] space-y-1">
            <Link
              href="/discover"
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === "/discover"
                  ? "bg-purple-600/20 text-purple-300 font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Discover Archive</span>
            </Link>

            <Link
              href="/playlists"
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === "/playlists"
                  ? "bg-purple-600/20 text-purple-300 font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Radio className="w-4 h-4 text-pink-400" />
              <span>Curated Channels</span>
            </Link>
          </div>

          {/* Library Content Area */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mt-3">
            {/* Liked Songs Quick Item */}
            {savedTracks.length > 0 && (
              <Link
                href="/saved"
                className={`flex items-center gap-3 p-2 rounded-xl hover:bg-[#161624] transition-all group border border-transparent hover:border-white/[0.06] ${
                  pathname === "/saved" ? "bg-[#161624] border-purple-500/20" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
                  <Heart className="w-4 h-4 fill-white text-white" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-xs text-white truncate">
                    Liked Songs
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {savedTracks.length} track{savedTracks.length === 1 ? "" : "s"}
                  </div>
                </div>
              </Link>
            )}

            {/* Saved Playlists Items */}
            {savedPlaylists.map((pl) => (
              <Link
                key={pl.id}
                href={`/playlist/${pl.id}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#161624] transition-all group border border-transparent hover:border-white/[0.06]"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a28] shrink-0 border border-white/[0.08]">
                  {pl.artworkUrl ? (
                    <Image
                      src={pl.artworkUrl}
                      alt={pl.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-xs text-white truncate group-hover:text-purple-300 transition-colors">
                    {pl.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {pl.curator}
                  </div>
                </div>
              </Link>
            ))}

            {/* Empty State Banner */}
            {savedPlaylists.length === 0 && savedTracks.length === 0 && (
              <div className="space-y-3 pt-1">
                <div className="bg-[#141420] border border-white/[0.06] rounded-xl p-3.5 space-y-2.5">
                  <div className="font-bold text-xs text-white">
                    Create your first playlist
                  </div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed">
                    Build your personal sound archive on LIVO.
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-transform hover:scale-105"
                  >
                    Create playlist
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="pt-4 border-t border-white/[0.06] mt-auto text-[11px] text-zinc-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold tracking-wider uppercase text-[10px] text-purple-400">
                LIVO SOUND SYSTEM
              </span>
              <span className="text-[10px] text-zinc-400">v2.4</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-normal">
              High-fidelity music discovery &amp; sound architecture.
            </p>
          </div>
        </div>
      </aside>

      {/* Playlist Creation Modal */}
      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
