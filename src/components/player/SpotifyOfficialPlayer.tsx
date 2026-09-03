"use client";

import React, { memo } from "react";
import { Track } from "@/types/music";
import { ExternalLink, Radio } from "lucide-react";

interface SpotifyOfficialPlayerProps {
  track: Track | null;
  mode?: "compact" | "expanded" | "floating";
  className?: string;
}

export const SpotifyOfficialPlayer = memo(function SpotifyOfficialPlayer({
  track,
  mode = "compact",
  className = "",
}: SpotifyOfficialPlayerProps) {
  if (!track || !track.spotifyId) {
    return null;
  }

  const height = mode === "expanded" ? "152" : "80";

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      {/* Official Spotify IFrame Embed */}
      <div className="w-full relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0a0a0c]">
        <iframe
          key={track.spotifyId}
          src={`https://open.spotify.com/embed/track/${track.spotifyId}?utm_source=generator&theme=0`}
          width="100%"
          height={height}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
          title={`Spotify Player — ${track.title}`}
          className="w-full transition-opacity duration-300"
        />
      </div>

      {/* Official Playback & Login Guidance */}
      <div className="flex flex-wrap items-center justify-between w-full pt-2 px-1 text-[10px] font-mono text-[#8e8c87]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
          <span className="uppercase tracking-wider">Official Spotify Stream</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={track.spotifyUrl || `https://open.spotify.com/track/${track.spotifyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8e8c87] hover:text-[#1DB954] transition-colors flex items-center gap-1 uppercase tracking-wider"
          >
            <span>Open in App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
});
