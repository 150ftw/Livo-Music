"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Compass, Disc3, Search, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/context/PlayerContext";

export function MobileNav() {
  const pathname = usePathname();
  const { currentTrack } = usePlayer();

  const navItems = [
    { label: "Home", href: "/", icon: Sparkles },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Playlists", href: "/playlists", icon: Disc3 },
    { label: "Search", href: "/search", icon: Search },
    { label: "Library", href: "/saved", icon: Bookmark },
  ];

  return (
    <nav
      className={cn(
        "md:hidden fixed left-0 right-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-2xl border-t border-white/[0.08] px-3 py-2 flex items-center justify-around transition-all",
        currentTrack ? "bottom-[68px]" : "bottom-0"
      )}
    >
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
              "flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-200 text-[10px]",
              isActive
                ? "text-[#e5b067] font-semibold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "opacity-80")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
