import React from "react";
import Image from "next/image";

interface LivoLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  useImage?: boolean;
}

export function LivoLogo({
  className = "",
  size = "md",
  showText = true,
  useImage = false,
}: LivoLogoProps) {

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  if (useImage) {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black border border-purple-500/30 shadow-lg shadow-purple-500/20 shrink-0">
          <Image
            src="/livo-logo.png"
            alt="Livo Logo"
            fill
            className="object-cover scale-150"
            priority
          />
        </div>
        {showText && (
          <span className={`font-black tracking-tight text-white ${textSizes[size]}`}>
            Livo
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      {/* LIVO Vector Brand Mark */}
      <svg
        viewBox="0 0 160 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${size === "sm" ? "h-7 w-auto" : size === "md" ? "h-9 w-auto" : "h-11 w-auto"} transition-transform group-hover:scale-[1.02]`}
      >
        <defs>
          <linearGradient id="livoOOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="35%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="livoOGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
          <filter id="livoDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#9333ea" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 'L' - Rounded Modern Character */}
        <path
          d="M10 6C10 3.79086 11.7909 2 14 2C16.2091 2 18 3.79086 18 6V36C18 39.3137 20.6863 42 24 42H32C34.2091 42 36 43.7909 36 46C36 48.2091 34.2091 50 32 50H22C15.3726 50 10 44.6274 10 38V6Z"
          fill="#FFFFFF"
        />

        {/* 'i' - Dot and Stem */}
        <circle cx="50" cy="8" r="4.5" fill="#FFFFFF" />
        <rect x="45.5" y="18" width="9" height="32" rx="4.5" fill="#FFFFFF" />

        {/* 'v' - Rounded Diagonal */}
        <path
          d="M68 18C70.2091 18 72 19.7909 72 22L80 41.5L88 22C88 19.7909 89.7909 18 92 18C94.2091 18 96 19.7909 96 22L84.5 47.5C83.2 50.4 76.8 50.4 75.5 47.5L64 22C64 19.7909 65.7909 18 68 18Z"
          fill="#FFFFFF"
        />

        {/* 'o' - Iconic Gradient Play Button Ring */}
        <g filter="url(#livoDropShadow)">
          {/* Outer Ring with Livo Signature Violet-to-Blue Gradient */}
          <circle
            cx="130"
            cy="33"
            r="17"
            fill="url(#livoOOuterGrad)"
          />
          {/* Inner Disc */}
          <circle
            cx="130"
            cy="33"
            r="10.5"
            fill="#09090e"
          />
          {/* Centered Play Triangle */}
          <path
            d="M127 27.5C127 26.3 128.3 25.5 129.3 26.2L136.5 31.2C137.4 31.8 137.4 33.2 136.5 33.8L129.3 38.8C128.3 39.5 127 38.7 127 37.5V27.5Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
}

export function LivoIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="livoIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="30%" stopColor="#a855f7" />
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="livoIconGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#9333ea" floodOpacity="0.6" />
        </filter>
      </defs>

      <g filter="url(#livoIconGlow)">
        <circle cx="20" cy="20" r="18" fill="url(#livoIconGrad)" />
        <circle cx="20" cy="20" r="11" fill="#09090e" />
        <path
          d="M17 14C17 12.8 18.3 12 19.3 12.7L26.5 18.2C27.4 18.8 27.4 20.2 26.5 20.8L19.3 26.3C18.3 27 17 26.2 17 25V14Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}
