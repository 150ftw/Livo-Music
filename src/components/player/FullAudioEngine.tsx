"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function FullAudioEngine() {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    setProgress,
    setDuration,
    nextTrack,
  } = usePlayer();

  const playerRef = useRef<any>(null);
  const isReadyRef = useRef(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTrackIdRef = useRef<string | null>(null);

  // Initialize YouTube IFrame API outside React virtual DOM tree
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create an unmanaged DOM container outside React's tree to prevent insertBefore reconciliation errors
    let container = document.getElementById("livo-yt-isolated-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "livo-yt-isolated-container";
      container.style.position = "fixed";
      container.style.top = "-9999px";
      container.style.left = "-9999px";
      container.style.width = "1px";
      container.style.height = "1px";
      container.style.opacity = "0";
      container.style.pointerEvents = "none";
      document.body.appendChild(container);

      const targetDiv = document.createElement("div");
      targetDiv.id = "livo-yt-mount-point";
      container.appendChild(targetDiv);
    }

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current) return;
      if (!document.getElementById("livo-yt-mount-point")) return;

      playerRef.current = new window.YT.Player("livo-yt-mount-point", {
        height: "1",
        width: "1",
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e: any) => {
            isReadyRef.current = true;
            try {
              e.target.setVolume(isMuted ? 0 : volume * 100);
            } catch {}
            if (currentTrack) {
              loadAndPlay(currentTrack);
            }
          },
          onStateChange: (e: any) => {
            // YT.PlayerState.ENDED is 0
            if (e.data === 0) {
              nextTrack();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const loadAndPlay = async (track: any) => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      let videoId = track.youtubeId;
      if (!videoId || typeof videoId !== "string" || videoId.length !== 11) {
        // Dynamically resolve exact 11-char videoId from our internal API
        const res = await fetch(
          `/api/music/resolve-yt?title=${encodeURIComponent(
            track.title
          )}&artist=${encodeURIComponent(track.artist)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.videoId && data.videoId.length === 11) {
            videoId = data.videoId;
          }
        }
      }

      if (videoId && videoId.length === 11) {
        playerRef.current.loadVideoById(videoId, 0);
        playerRef.current.playVideo();
      }
    } catch (e) {
      console.warn("FullAudioEngine load notice:", e);
    }
  };

  // Track change synchronization
  useEffect(() => {
    if (!currentTrack) return;
    if (currentTrack.id !== currentTrackIdRef.current) {
      currentTrackIdRef.current = currentTrack.id;
      loadAndPlay(currentTrack);
    }
  }, [currentTrack]);

  // Play / Pause synchronization
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {}
  }, [isPlaying]);

  // Volume synchronization
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      playerRef.current.setVolume(isMuted ? 0 : volume * 100);
    } catch {}
  }, [volume, isMuted]);

  // Poll elapsed time and track duration
  useEffect(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    if (isPlaying) {
      pollIntervalRef.current = setInterval(() => {
        if (playerRef.current && isReadyRef.current) {
          try {
            const cur = playerRef.current.getCurrentTime();
            const dur = playerRef.current.getDuration();
            if (typeof cur === "number" && !isNaN(cur)) {
              setProgress(cur);
            }
            if (typeof dur === "number" && !isNaN(dur) && dur > 0) {
              setDuration(dur);
            }
          } catch {}
        }
      }, 250);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isPlaying, setProgress, setDuration]);

  // Listen for timeline scrubber seek events
  useEffect(() => {
    const handleSeek = (e: any) => {
      if (playerRef.current && isReadyRef.current && e.detail?.time !== undefined) {
        try {
          playerRef.current.seekTo(e.detail.time, true);
        } catch {}
      }
    };

    window.addEventListener("livo:seek", handleSeek);
    return () => window.removeEventListener("livo:seek", handleSeek);
  }, []);

  // Return null so React's Virtual DOM never touches YouTube's replaced iframe
  return null;
}
