"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { CreatePlaylistModal } from "./CreatePlaylistModal";
import {
  Library,
  Plus,
  Heart,
  Globe,
  Music,
} from "lucide-react";

export function SpotifySidebar() {
  const pathname = usePathname();
  const { savedPlaylists, savedTracks } = usePlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside className="w-72 lg:w-80 flex flex-col gap-2 shrink-0 select-none pb-24 md:pb-2">
        {/* Main "Your Library" Box */}
        <div className="flex-1 bg-[#121212] rounded-xl flex flex-col p-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 text-[#b3b3b3]">
            <Link
              href="/saved"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Library className="w-6 h-6" />
              <span className="font-bold text-sm sm:text-base text-white">
                Your Library
              </span>
            </Link>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 p-1.5 rounded-full hover:bg-white/[0.08] hover:text-white transition-colors text-xs font-semibold"
              title="Create playlist or folder"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Library Content Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {/* Liked Songs Quick Item */}
            {savedTracks.length > 0 && (
              <Link
                href="/saved"
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-[#1f1f1f] transition-colors group ${
                  pathname === "/saved" ? "bg-[#1f1f1f]" : ""
                }`}
              >
                <div className="w-12 h-12 rounded bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow-md">
                  <Heart className="w-5 h-5 fill-white text-white" />
                </div>
                <div className="truncate">
                  <div className="font-medium text-sm text-white truncate">
                    Liked Songs
                  </div>
                  <div className="text-xs text-[#b3b3b3] truncate">
                    Playlist • {savedTracks.length} song{savedTracks.length === 1 ? "" : "s"}
                  </div>
                </div>
              </Link>
            )}

            {/* Saved Playlists Items */}
            {savedPlaylists.map((pl) => (
              <Link
                key={pl.id}
                href={`/playlist/${pl.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1f1f1f] transition-colors group"
              >
                <div className="relative w-12 h-12 rounded overflow-hidden bg-[#242424] shrink-0">
                  {pl.artworkUrl ? (
                    <Image
                      src={pl.artworkUrl}
                      alt={pl.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-5 h-5 text-zinc-500" />
                    </div>
                  )}
                </div>
                <div className="truncate">
                  <div className="font-medium text-sm text-white truncate">
                    {pl.title}
                  </div>
                  <div className="text-xs text-[#b3b3b3] truncate">
                    Playlist • {pl.curator}
                  </div>
                </div>
              </Link>
            ))}

            {/* If Library is Empty: Show Spotify's signature action prompts from screenshot */}
            {savedPlaylists.length === 0 && savedTracks.length === 0 && (
              <div className="space-y-4 pt-1">
                {/* Prompt 1: Create your first playlist */}
                <div className="bg-[#1f1f1f] rounded-xl p-4 space-y-3">
                  <div className="font-bold text-sm text-white">
                    Create your first playlist
                  </div>
                  <div className="text-xs font-medium text-zinc-300">
                    It&apos;s easy, we&apos;ll help you
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition-transform hover:scale-105"
                  >
                    Create playlist
                  </button>
                </div>

                {/* Prompt 2: Let's find some songs / podcasts */}
                <div className="bg-[#1f1f1f] rounded-xl p-4 space-y-3">
                  <div className="font-bold text-sm text-white">
                    Discover music on Spotify
                  </div>
                  <div className="text-xs font-medium text-zinc-300">
                    We&apos;ll keep you updated on new releases
                  </div>
                  <Link
                    href="/search"
                    className="inline-block px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition-transform hover:scale-105"
                  >
                    Browse tracks
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="pt-6 border-t border-white/[0.04] mt-auto text-[11px] text-[#b3b3b3] space-y-4">
            <div className="flex flex-wrap gap-x-3 gap-y-1 leading-relaxed">
              <a href="https://www.spotify.com/legal/" target="_blank" rel="noopener noreferrer" className="hover:underline">Legal</a>
              <a href="https://www.spotify.com/safetyandprivacy/" target="_blank" rel="noopener noreferrer" className="hover:underline">Safety & Privacy</a>
              <a href="https://www.spotify.com/privacy/" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Policy</a>
              <a href="https://www.spotify.com/cookies/" target="_blank" rel="noopener noreferrer" className="hover:underline">Cookies</a>
              <a href="https://www.spotify.com/legal/privacy-policy/#s3" target="_blank" rel="noopener noreferrer" className="hover:underline">About Ads</a>
              <a href="https://www.spotify.com/accessibility/" target="_blank" rel="noopener noreferrer" className="hover:underline">Accessibility</a>
            </div>

            <div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.3] text-xs font-semibold text-white hover:border-white hover:scale-105 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>English</span>
              </button>
            </div>
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
