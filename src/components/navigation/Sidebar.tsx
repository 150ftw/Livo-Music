"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { useSearchOverlay } from "@/context/SearchOverlayContext";
import { SPOTIFY_PLAYLISTS } from "@/lib/music/spotifyCatalog";
import {
  Home,
  Search,
  Compass,
  Library,
  Plus,
  Music2,
  ChevronRight,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { openSearch } = useSearchOverlay();
  const { savedPlaylists } = usePlayer();

  const mainNav = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "#search", icon: Search, onClick: openSearch },
    { label: "Discover", href: "/discover", icon: Compass },
  ];

  // Get the first 6 playlists from catalog for sidebar display
  const sidebarPlaylists = SPOTIFY_PLAYLISTS.slice(0, 8);

  return (
    <aside className="hidden md:flex flex-col w-[var(--sidebar-width)] h-screen fixed left-0 top-0 z-30 bg-black select-none">
      {/* Logo Section */}
      <div className="px-6 pt-6 pb-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1ed760] to-[#1db954] flex items-center justify-center">
            <Music2 className="w-4 h-4 text-black" />
          </div>
          <span className="text-xl font-bold tracking-[0.15em] text-white uppercase">
            Livo
          </span>
        </Link>
      </div>

      {/* Primary Navigation */}
      <nav className="px-3 pb-2">
        <div className="bg-[#121212] rounded-xl p-3 space-y-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href !== "#search" && pathname === item.href;

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-[#b3b3b3] hover:text-white transition-colors group cursor-pointer"
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-bold">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "text-white"
                    : "text-[#b3b3b3] hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "fill-current" : ""
                  }`}
                />
                <span className="text-sm font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Library Section */}
      <div className="flex-1 px-3 pb-2 overflow-hidden flex flex-col min-h-0">
        <div className="bg-[#121212] rounded-xl flex-1 flex flex-col overflow-hidden">
          {/* Library Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/saved"
              className="flex items-center gap-3 text-[#b3b3b3] hover:text-white transition-colors group"
            >
              <Library className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold">Your Library</span>
            </Link>
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#b3b3b3] hover:text-white hover:bg-[#2a2a2a] transition-all cursor-pointer"
              aria-label="Create playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
            <Link
              href="/playlists"
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white text-xs font-medium transition-colors"
            >
              Playlists
            </Link>
            <Link
              href="/saved"
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white text-xs font-medium transition-colors"
            >
              Saved
            </Link>
          </div>

          {/* Playlist Items — Scrollable */}
          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
            {sidebarPlaylists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.07] transition-colors group ${
                  pathname === `/playlist/${playlist.id}`
                    ? "bg-white/[0.07]"
                    : ""
                }`}
              >
                {/* Playlist Thumbnail */}
                <div className="w-12 h-12 rounded-md overflow-hidden bg-[#282828] shrink-0 relative shadow-md">
                  <Image
                    src={playlist.artworkUrl}
                    alt={playlist.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                {/* Title & Metadata */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium truncate ${
                      pathname === `/playlist/${playlist.id}`
                        ? "text-[#1ed760]"
                        : "text-white"
                    }`}
                  >
                    {playlist.title}
                  </p>
                  <p className="text-xs text-[#b3b3b3] truncate mt-0.5">
                    Playlist · {playlist.tracks.length} songs
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Attribution */}
      <div className="px-6 py-4 border-t border-white/[0.06]">
        <p className="text-[10px] text-[#6a6a6a] leading-relaxed">
          LIVO Sound Architecture © 2024
        </p>
      </div>
    </aside>
  );
}
