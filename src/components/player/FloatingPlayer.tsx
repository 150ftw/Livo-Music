"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";
import { X } from "lucide-react";

export function FloatingPlayer() {
  const { currentTrack, closePlayer } = usePlayer();

  if (!currentTrack || !currentTrack.spotifyId) return null;

  return (
    <AnimatePresence>
      <motion.aside
        key={currentTrack.id}
        aria-label="Official Spotify Player"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl select-none"
      >
        <div className="relative rounded-2xl bg-[#0a0a0d]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-1.5 overflow-visible">
          {/* Official Spotify Player Embed (Single, Unified Widget) */}
          <iframe
            key={currentTrack.spotifyId}
            src={`https://open.spotify.com/embed/track/${currentTrack.spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="eager"
            title={`Spotify — ${currentTrack.title}`}
            className="rounded-xl w-full block"
          />

          {/* Dismiss Button */}
          <button
            onClick={closePlayer}
            className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-white/[0.12] text-[#8e8c87] hover:text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            title="Dismiss Player"
            aria-label="Dismiss Player"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
