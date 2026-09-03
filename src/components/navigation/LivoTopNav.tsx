"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LivoLogo } from "@/components/ui/LivoLogo";
import {
  Home,
  Search,
  X,
  Compass,
  Sparkles,
  User,
} from "lucide-react";

function LivoSearchBar() {
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
      <div className="absolute left-3.5 text-zinc-400 group-focus-within:text-purple-400 transition-colors pointer-events-none">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search songs, artists, playlists on Livo..."
        className="w-full h-10 pl-10 pr-10 rounded-full bg-[#12121e] hover:bg-[#181826] focus:bg-[#141422] text-white placeholder:text-zinc-400 text-xs sm:text-sm font-normal border border-white/[0.08] focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 focus:outline-none transition-all shadow-inner"
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
          className="absolute right-3.5 text-zinc-400 hover:text-purple-400 transition-colors"
          title="Browse all genres"
        >
          <Compass className="w-4 h-4" />
        </Link>
      )}
    </form>
  );
}

export function LivoTopNav() {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-[#08080c] border-b border-white/[0.06] px-4 md:px-6 flex items-center justify-between gap-4 select-none shrink-0 z-40">
      {/* Left: LIVO Brand Identity */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <Link href="/" title="Livo — Home" className="flex items-center gap-1">
          <LivoLogo size="md" />
        </Link>
      </div>

      {/* Center: Home Button & Integrated Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-xl mx-auto">
        {/* Circular Home Pill */}
        <Link
          href="/"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 shrink-0 border border-white/[0.08] ${
            pathname === "/"
              ? "bg-gradient-to-tr from-purple-600/30 to-blue-600/30 text-white border-purple-500/40 shadow-sm shadow-purple-500/20"
              : "bg-[#12121e] text-zinc-400 hover:text-white hover:border-white/[0.2]"
          }`}
          title="Home"
        >
          <Home className="w-4 h-4 fill-current" />
        </Link>

        {/* Search Bar Input Pill with Suspense */}
        <Suspense
          fallback={
            <div className="w-full h-10 rounded-full bg-[#12121e] flex items-center px-4 text-xs text-zinc-500 border border-white/[0.08]">
              Search songs, artists, playlists...
            </div>
          }
        >
          <LivoSearchBar />
        </Suspense>
      </div>

      {/* Right: Actions, Livo Pro & User Account */}
      <div className="flex items-center gap-3 md:gap-5 shrink-0">
        <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-zinc-300">
          <Link
            href="/playlists"
            className="hover:text-white transition-colors"
          >
            Playlists
          </Link>
          <Link
            href="/discover"
            className="hover:text-white transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/saved"
            className="hover:text-white transition-colors"
          >
            Library
          </Link>
        </div>

        <div className="hidden lg:block w-[1px] h-5 bg-white/[0.12]" />

        {/* Livo Pro Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-blue-500/15 border border-purple-500/30 text-xs font-bold text-purple-300 shadow-sm shadow-purple-500/10">
          <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
          <span>LIVO PRO</span>
        </div>

        {/* Profile / Account Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 p-[1.5px] hover:scale-105 transition-transform shadow-md shadow-purple-600/30"
            title="Livo Account"
          >
            <div className="w-full h-full rounded-full bg-[#0e0e18] flex items-center justify-center text-white">
              <User className="w-4 h-4 text-purple-300" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
