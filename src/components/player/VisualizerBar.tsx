"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface VisualizerBarProps {
  isPlaying: boolean;
  className?: string;
  colorClass?: string;
}

export function VisualizerBar({
  isPlaying,
  className,
  colorClass = "bg-[#e5b067]",
}: VisualizerBarProps) {
  return (
    <div
      className={cn("flex items-end gap-[3px] h-4 w-5 justify-center", className)}
      aria-label={isPlaying ? "Music playing indicator" : "Music paused"}
    >
      <span
        className={cn(
          "w-[2.5px] rounded-full transition-all duration-300",
          colorClass,
          isPlaying ? "animate-wave-1 h-3.5" : "h-1 opacity-40"
        )}
      />
      <span
        className={cn(
          "w-[2.5px] rounded-full transition-all duration-300",
          colorClass,
          isPlaying ? "animate-wave-2 h-4" : "h-2 opacity-50"
        )}
      />
      <span
        className={cn(
          "w-[2.5px] rounded-full transition-all duration-300",
          colorClass,
          isPlaying ? "animate-wave-3 h-2.5" : "h-1 opacity-40"
        )}
      />
      <span
        className={cn(
          "w-[2.5px] rounded-full transition-all duration-300",
          colorClass,
          isPlaying ? "animate-wave-4 h-3" : "h-1.5 opacity-40"
        )}
      />
    </div>
  );
}
