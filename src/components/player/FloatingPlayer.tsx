"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";
import { X, ExternalLink } from "lucide-react";

export function FloatingPlayer() {
  const { currentTrack, closePlayer } = usePlayer();

  if (!currentTrack || !currentTrack.spotifyId) return null;

  const spotifyLink =
    currentTrack.spotifyUrl ||
    `https://open.spotify.com/track/${currentTrack.spotifyId}`;

  return (
    <AnimatePresence>
      <motion.aside
        key={currentTrack.id}
        aria-label="Official Spotify Player"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl select-none"
      >
        <div className="relative rounded-2xl bg-[#0a0a0d]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-2 overflow-visible">
          {/* Official Spotify Player Embed (Single, Unified Widget for Discovery & Previews) */}
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

          {/* Prominent Play Full Song in Spotify Action */}
          <div className="flex items-center justify-between px-2 pt-2 text-[11px] font-mono text-[#8e8c87]">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#8e8c87]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
              <span>In-App Preview</span>
            </div>

            <a
              href={spotifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1DB954]/15 hover:bg-[#1DB954]/25 text-[#1DB954] border border-[#1DB954]/30 hover:border-[#1DB954]/50 transition-all font-medium text-[11px] tracking-wide cursor-pointer"
              title="Open and stream the full uninterrupted song in Spotify"
            >
              <span>Play Full Song in Spotify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

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
