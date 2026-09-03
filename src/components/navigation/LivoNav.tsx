"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchOverlay } from "@/context/SearchOverlayContext";
import { useSpotifyAuth } from "@/context/SpotifyAuthContext";
import { Search, Compass, Disc3, Library, Home } from "lucide-react";

export function LivoNav() {
  const pathname = usePathname();
  const { openSearch } = useSearchOverlay();
  const { user, isAuthenticated, login, logout } = useSpotifyAuth();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Discover", href: "/discover" },
    { label: "Playlists", href: "/playlists" },
  ];

  return (
    <>
      {/* Desktop & Tablet Floating Header */}
      <header className="sticky top-0 z-40 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.04] transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group flex items-center gap-2.5 focus:outline-none"
            >
              <span className="text-xl font-bold tracking-[0.28em] text-[#f5f4f0] uppercase transition-opacity group-hover:opacity-80">
                Livo
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5f4f0]/40 group-hover:bg-[#f5f4f0] transition-colors" />
            </Link>

            {/* Main Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-[0.15em] uppercase">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 transition-colors ${
                      isActive
                        ? "text-[#f5f4f0]"
                        : "text-[#8e8c87] hover:text-[#f5f4f0]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#f5f4f0]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Cluster: Search & Library */}
          <div className="flex items-center gap-6">
            {/* Minimal Search Trigger */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2.5 text-xs font-medium tracking-[0.15em] uppercase text-[#8e8c87] hover:text-[#f5f4f0] transition-colors group cursor-pointer focus:outline-none"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono rounded bg-white/[0.04] border border-white/[0.08] text-[#8e8c87] group-hover:text-[#f5f4f0] group-hover:border-white/[0.18]">
                ⌘K
              </kbd>
            </button>

            {/* Library Link */}
            <Link
              href="/saved"
              className={`flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                pathname === "/saved"
                  ? "text-[#f5f4f0]"
                  : "text-[#8e8c87] hover:text-[#f5f4f0]"
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Library</span>
            </Link>

            {/* Spotify Auth Status / Connect Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#f5f4f0]">
                  <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_8px_#1DB954]" />
                  <span className="hidden md:inline max-w-[120px] truncate text-[11px]">
                    {user?.display_name || "Spotify"}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-[10px] uppercase font-mono tracking-wider text-[#8e8c87] hover:text-white transition-colors cursor-pointer"
                  title="Disconnect Spotify account"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1DB954]/15 hover:bg-[#1DB954]/25 border border-[#1DB954]/40 text-[#1DB954] text-[10px] font-mono tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(29,185,84,0.1)] hover:shadow-[0_0_20px_rgba(29,185,84,0.25)] cursor-pointer"
                title="Connect your Spotify account to stream full songs"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.216.353-.674.467-1.027.25-2.816-1.721-6.36-2.11-10.536-1.157-.404.093-.807-.156-.9-.56-.093-.404.156-.807.56-.9 4.571-1.045 8.492-.596 11.653 1.34.353.216.467.674.25 1.027zm1.467-3.262c-.272.443-.852.583-1.295.311-3.223-1.981-8.138-2.553-11.95-1.396-.499.151-1.027-.134-1.178-.633-.151-.499.134-1.027.633-1.178 4.358-1.322 9.776-.682 13.479 1.593.443.272.583.852.311 1.303zm.126-3.41c-3.865-2.295-10.238-2.506-13.918-1.39-.592.18-1.218-.155-1.398-.747-.18-.592.155-1.218.747-1.398 4.232-1.285 11.267-1.037 15.698 1.593.533.316.706 1.005.39 1.538-.316.533-1.005.706-1.539.404z" />
                </svg>
                <span>Connect Spotify</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#050505]/90 backdrop-blur-2xl border-t border-white/[0.05] px-6 py-2.5 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 text-[10px] tracking-wider uppercase ${
            pathname === "/" ? "text-[#f5f4f0]" : "text-[#8e8c87]"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          href="/discover"
          className={`flex flex-col items-center gap-1 text-[10px] tracking-wider uppercase ${
            pathname === "/discover" ? "text-[#f5f4f0]" : "text-[#8e8c87]"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discover</span>
        </Link>

        <Link
          href="/playlists"
          className={`flex flex-col items-center gap-1 text-[10px] tracking-wider uppercase ${
            pathname === "/playlists" ? "text-[#f5f4f0]" : "text-[#8e8c87]"
          }`}
        >
          <Disc3 className="w-4 h-4" />
          <span>Playlists</span>
        </Link>

        <button
          onClick={openSearch}
          className="flex flex-col items-center gap-1 text-[10px] tracking-wider uppercase text-[#8e8c87] hover:text-[#f5f4f0]"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>

        <Link
          href="/saved"
          className={`flex flex-col items-center gap-1 text-[10px] tracking-wider uppercase ${
            pathname === "/saved" ? "text-[#f5f4f0]" : "text-[#8e8c87]"
          }`}
        >
          <Library className="w-4 h-4" />
          <span>Library</span>
        </Link>
      </div>
    </>
  );
}
