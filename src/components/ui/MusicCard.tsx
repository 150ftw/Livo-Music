"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

interface MusicCardProps {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  variant?: "square" | "wide" | "circle";
  isPlaying?: boolean;
  isCurrent?: boolean;
  onPlay?: () => void;
  onClick?: () => void;
  href?: string;
  size?: "sm" | "md" | "lg";
}

export function MusicCard({
  id,
  title,
  subtitle,
  imageUrl,
  variant = "square",
  isPlaying = false,
  isCurrent = false,
  onPlay,
  onClick,
  href,
  size = "md",
}: MusicCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeMap = {
    sm: "w-[140px]",
    md: "w-[180px]",
    lg: "w-[200px]",
  };

  const imgSizeMap = {
    sm: "h-[140px]",
    md: "h-[180px]",
    lg: "h-[200px]",
  };

  const cardWidth = sizeMap[size];
  const imgHeight = variant === "wide" ? "h-[120px]" : imgSizeMap[size];

  const isCircle = variant === "circle";

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay?.();
  };

  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, onClick }
    : { onClick, role: "button" as const, tabIndex: 0 };

  return (
    <Wrapper
      {...wrapperProps}
      className={`group block ${cardWidth} cursor-pointer select-none transition-all`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div
        className={`relative ${imgHeight} ${cardWidth} ${
          isCircle ? "rounded-full" : "rounded-lg"
        } overflow-hidden bg-[#282828] shadow-lg transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-black/60`}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={`object-cover transition-all duration-500 ${
            isCircle ? "" : "group-hover:scale-[1.04]"
          }`}
          sizes={`${parseInt(cardWidth.replace("w-[", "").replace("px]", ""))}px`}
        />

        {/* Dark overlay on hover (non-circle only) */}
        {!isCircle && (
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Play Button — appears on hover */}
        {onPlay && !isCircle && (
          <button
            onClick={handlePlayClick}
            className={`absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 flex items-center justify-center shadow-xl shadow-black/50 transition-all duration-200 cursor-pointer ${
              isHovered || isCurrent
                ? "card-play-enter"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying && isCurrent ? (
              <Pause className="w-5 h-5 text-black fill-black" />
            ) : (
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
            )}
          </button>
        )}
      </div>

      {/* Text Content */}
      <div className={`mt-3 ${isCircle ? "text-center" : ""} px-0.5`}>
        <h3
          className={`text-sm font-bold text-white truncate leading-snug ${
            isCurrent ? "text-[#1ed760]" : ""
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-xs text-[#b3b3b3] mt-0.5 ${
            isCircle ? "truncate" : "line-clamp-2"
          } leading-relaxed`}
        >
          {subtitle}
        </p>
      </div>
    </Wrapper>
  );
}
