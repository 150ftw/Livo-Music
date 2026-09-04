"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchOverlay } from "@/context/SearchOverlayContext";
import {
  Search,
  Compass,
  Home,
  Library,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";

export function LivoNav() {
  const pathname = usePathname();
  const { openSearch } = useSearchOverlay();

  return (
    <>
      {/* Desktop / Tablet Top Bar — sits above main content, to the right of sidebar */}
      <header className="sticky top-0 z-40 w-full bg-[#121212]/90 backdrop-blur-xl transition-all">
        <div className="px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Nav Arrows + Route Breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="hidden md:flex w-8 h-8 rounded-full bg-black/70 items-center justify-center text-white hover:bg-black transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.history.forward()}
              className="hidden md:flex w-8 h-8 rounded-full bg-black/70 items-center justify-center text-white hover:bg-black transition-colors cursor-pointer"
              aria-label="Go forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-lg mx-auto">
            <button
              onClick={openSearch}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-transparent hover:border-white/[0.08] text-[#b3b3b3] text-sm transition-all cursor-pointer group"
            >
              <Search className="w-4 h-4 shrink-0 group-hover:text-white" />
              <span className="flex-1 text-left">
                What do you want to listen to?
              </span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/[0.06] border border-white/[0.08] text-[#6a6a6a]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: User / Profile */}
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#2a2a2a] flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <div
              className="w-8 h-8 rounded-full bg-[#242424] border border-white/10 flex items-center justify-center text-white text-xs font-semibold cursor-default"
              title="LIVO Listener"
            >
              L
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#121212]/95 backdrop-blur-2xl border-t border-white/[0.06] px-4 py-2 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
            pathname === "/" ? "text-white" : "text-[#b3b3b3]"
          }`}
        >
          <Home className={`w-5 h-5 ${pathname === "/" ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <button
          onClick={openSearch}
          className="flex flex-col items-center gap-0.5 py-1 px-3 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Search</span>
        </button>

        <Link
          href="/discover"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
            pathname === "/discover" ? "text-white" : "text-[#b3b3b3]"
          }`}
        >
          <Compass
            className={`w-5 h-5 ${
              pathname === "/discover" ? "fill-current" : ""
            }`}
          />
          <span className="text-[10px] font-medium">Discover</span>
        </Link>

        <Link
          href="/saved"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
            pathname === "/saved" ? "text-white" : "text-[#b3b3b3]"
          }`}
        >
          <Library
            className={`w-5 h-5 ${
              pathname === "/saved" ? "fill-current" : ""
            }`}
          />
          <span className="text-[10px] font-medium">Library</span>
        </Link>
      </div>
    </>
  );
}
