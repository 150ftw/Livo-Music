"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SpotifyLogo } from "@/components/ui/SpotifyLogo";
import {
  Home,
  Search,
  ArrowDownCircle,
  X,
  Compass,
} from "lucide-react";

function SpotifySearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamQuery = searchParams?.get("q") || "";
  const [query, setQuery] = useState(searchParamQuery);
  const [prevSearchParam, setPrevSearchParam] = useState(searchParamQuery);

  if (pathname === "/search" && prevSearchParam !== searchParamQuery) {
    setPrevSearchParam(searchParamQuery);
    setQuery(searchParamQuery);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      router.push(`/search?q=${encodeURIComponent(val.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (pathname === "/search") {
      router.push("/search");
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="relative flex-1 flex items-center group"
    >
      <div className="absolute left-3.5 text-zinc-400 group-focus-within:text-white transition-colors pointer-events-none">
        <Search className="w-5 h-5" />
      </div>

      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="What do you want to play?"
        className="w-full h-11 pl-11 pr-10 rounded-full bg-[#1f1f1f] hover:bg-[#282828] focus:bg-[#1f1f1f] text-white placeholder:text-zinc-400 text-sm font-normal border border-transparent focus:border-white focus:outline-none transition-all"
      />

      {query ? (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3.5 p-0.5 rounded-full text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <Link
          href="/search"
          className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors"
          title="Browse"
        >
          <Compass className="w-5 h-5" />
        </Link>
      )}
    </form>
  );
}

export function SpotifyTopNav() {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-[#000000] px-4 md:px-6 flex items-center justify-between gap-4 select-none shrink-0 z-40">
      {/* Left: Spotify Branding */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-white hover:opacity-90 transition-opacity focus:outline-none"
          title="Spotify"
        >
          <SpotifyLogo className="w-8 h-8 text-[#ffffff]" />
          <span className="font-bold text-lg tracking-tight hidden sm:inline text-white">
            Spotify
          </span>
        </Link>
      </div>

      {/* Center: Home Button & Integrated Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-xl mx-auto">
        {/* Circular Home Pill */}
        <Link
          href="/"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-105 shrink-0 ${
            pathname === "/"
              ? "bg-[#1f1f1f] text-white"
              : "bg-[#1f1f1f] text-zinc-400 hover:text-white"
          }`}
          title="Home"
        >
          <Home className="w-5 h-5 fill-current" />
        </Link>

        {/* Search Bar Input Pill with Suspense */}
        <Suspense
          fallback={
            <div className="w-full h-11 rounded-full bg-[#1f1f1f] flex items-center px-4 text-sm text-zinc-500">
              What do you want to play?
            </div>
          }
        >
          <SpotifySearchBar />
        </Suspense>
      </div>

      {/* Right: Actions & Log In */}
      <div className="flex items-center gap-3 md:gap-5 shrink-0">
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#b3b3b3]">
          <Link href="/playlists" className="hover:text-white transition-colors">
            Explore
          </Link>
          <a
            href="https://www.spotify.com/premium/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Premium
          </a>
          <a
            href="https://support.spotify.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Support
          </a>
          <a
            href="https://www.spotify.com/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Download
          </a>
        </div>

        <div className="hidden lg:block w-[1px] h-6 bg-white/[0.2]" />

        <a
          href="https://www.spotify.com/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white hover:scale-105 transition-transform"
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>Install App</span>
        </a>

        <div className="flex items-center gap-3">
          <Link
            href="/saved"
            className="text-xs sm:text-sm font-bold text-[#b3b3b3] hover:text-white transition-colors"
          >
            Library
          </Link>

          <a
            href="https://accounts.spotify.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-transform shadow-md"
          >
            Log in
          </a>
        </div>
      </div>
    </header>
  );
}
