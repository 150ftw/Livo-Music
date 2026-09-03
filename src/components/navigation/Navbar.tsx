"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { VisualizerBar } from "@/components/player/VisualizerBar";
import {
  Compass,
  Disc3,
  Search,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentTrack, isPlaying, savedTrackIds, savedPlaylistIds, toggleFullScreen } =
    usePlayer();
  const [scrolled, setScrolled] = useState(false);

  const totalSaved = savedTrackIds.length + savedPlaylistIds.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: Sparkles },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Playlists", href: "/playlists", icon: Disc3 },
    { label: "Search", href: "/search", icon: Search },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-[#070709]/85 backdrop-blur-xl border-b border-white/[0.07] py-3 shadow-2xl shadow-black/50"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b067] rounded-lg px-1 py-0.5"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e5b067] via-[#f7cb8b] to-[#c79144] flex items-center justify-center shadow-lg shadow-[#e5b067]/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-[#070709] font-black text-sm tracking-tighter">C</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-[0.2em] text-lg font-bold text-white group-hover:text-[#e5b067] transition-colors">
              CADENCE
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-sans -mt-1">
              Curated Sound Archive
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101017]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.08] shadow-inner">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200",
                  isActive
                    ? "bg-[#e5b067] text-[#070709] font-semibold shadow-md shadow-[#e5b067]/25"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "stroke-[2.5]" : "opacity-70")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5">
          {/* Now Playing Pill (Desktop) */}
          {currentTrack && (
            <button
              onClick={toggleFullScreen}
              className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#161622]/90 hover:bg-[#202030] border border-white/[0.09] text-xs transition-all hover:border-[#e5b067]/40 max-w-[200px] truncate group"
              title="Expand Listening Mode"
            >
              <VisualizerBar isPlaying={isPlaying} className="w-4 h-3.5" />
              <div className="flex flex-col text-left truncate">
                <span className="text-[11px] font-medium text-white truncate group-hover:text-[#e5b067] transition-colors">
                  {currentTrack.title}
                </span>
                <span className="text-[9px] text-zinc-400 truncate -mt-0.5">
                  {currentTrack.artist}
                </span>
              </div>
            </button>
          )}

          {/* Quick Search Shortcut */}
          <button
            onClick={() => router.push("/search")}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-zinc-400 hover:text-white text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 opacity-70" />
            <span className="text-[11px]">Search</span>
            <kbd className="text-[9px] bg-black/40 border border-white/10 px-1.5 py-0.5 rounded text-zinc-400 ml-1">
              /
            </kbd>
          </button>

          {/* Saved Library Link */}
          <Link
            href="/saved"
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-200",
              pathname === "/saved"
                ? "bg-[#e5b067] text-[#070709] border-[#e5b067] font-semibold shadow-md shadow-[#e5b067]/25"
                : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-200 hover:text-white"
            )}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Library</span>
            {totalSaved > 0 && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                  pathname === "/saved"
                    ? "bg-[#070709] text-[#e5b067]"
                    : "bg-[#e5b067] text-[#070709]"
                )}
              >
                {totalSaved}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
