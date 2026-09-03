"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showAllHref?: string;
  showAllLabel?: string;
  className?: string;
}

export function HorizontalScroll({
  children,
  title,
  subtitle,
  showAllHref,
  showAllLabel = "Show all",
  className = "",
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(":scope > *")?.clientWidth || 200;
    const scrollAmount = cardWidth * 3 + 48; // 3 cards + gaps
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div className="flex items-end justify-between px-2">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#b3b3b3] mt-1 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showAllHref && (
            <a
              href={showAllHref}
              className="text-sm font-bold text-[#b3b3b3] hover:text-white transition-colors mr-2 hover:underline"
            >
              {showAllLabel}
            </a>
          )}

          {/* Scroll Arrows — desktop only */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] hover:scale-105"
                  : "bg-[#2a2a2a]/40 text-[#6a6a6a] cursor-default"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] hover:scale-105"
                  : "bg-[#2a2a2a]/40 text-[#6a6a6a] cursor-default"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Row */}
      <div ref={scrollRef} className="scroll-row scroll-fade-right px-2">
        {children}
      </div>
    </section>
  );
}
