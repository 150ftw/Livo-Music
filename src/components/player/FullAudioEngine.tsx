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
  const hasTriggeredEndedRef = useRef(false);

  // Keep nextTrack ref updated to eliminate stale closure bugs inside YouTube callbacks
  const nextTrackRef = useRef(nextTrack);
  useEffect(() => {
    nextTrackRef.current = nextTrack;
  }, [nextTrack]);

  const triggerTrackEnded = () => {
    if (hasTriggeredEndedRef.current) return;
    hasTriggeredEndedRef.current = true;
    console.log("[FullAudioEngine] Track completed. Auto-playing next track.");
    if (nextTrackRef.current) {
      nextTrackRef.current();
    }
  };

  // Initialize YouTube IFrame API outside React virtual DOM tree
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create an unmanaged DOM container outside React's tree to prevent insertBefore reconciliation errors
    let container = document.getElementById("livo-yt-isolated-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "livo-yt-isolated-container";
      container.style.position = "fixed";
      container.style.bottom = "0px";
      container.style.right = "0px";
      container.style.width = "200px";
      container.style.height = "200px";
      container.style.opacity = "0.001";
      container.style.pointerEvents = "none";
      container.style.zIndex = "-9999";
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
        height: "200",
        width: "200",
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
              e.target.unMute();
              e.target.setVolume(isMuted ? 0 : volume * 100);
            } catch {}
            if (currentTrack) {
              loadAndPlay(currentTrack);
            }
          },
          onStateChange: (e: any) => {
            // YT.PlayerState.ENDED is 0
            if (e.data === 0) {
              triggerTrackEnded();
            }
          },
          onError: (e: any) => {
            console.warn("FullAudioEngine playback error code:", e.data);
            // Skip broken/blocked video after short delay so playback never hangs
            setTimeout(() => {
              triggerTrackEnded();
            }, 1200);
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
      hasTriggeredEndedRef.current = false;
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
        try {
          playerRef.current.unMute();
          playerRef.current.setVolume(isMuted ? 0 : volume * 100);
        } catch {}
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
      hasTriggeredEndedRef.current = false;
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

  // Poll elapsed time and track duration + detect completion
  useEffect(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    if (isPlaying) {
      pollIntervalRef.current = setInterval(() => {
        if (playerRef.current && isReadyRef.current) {
          try {
            const cur = playerRef.current.getCurrentTime();
            const dur = playerRef.current.getDuration();
            const state = playerRef.current.getPlayerState?.();

            if (typeof cur === "number" && !isNaN(cur)) {
              setProgress(cur);
            }
            if (typeof dur === "number" && !isNaN(dur) && dur > 0) {
              setDuration(dur);

              // Auto-advance check: either player reached ended state (0)
              // or playback time reached within 0.5s of the track end (for tracks longer than 5s)
              if (state === 0 || (dur > 5 && cur >= dur - 0.5)) {
                triggerTrackEnded();
              }
            } else if (state === 0) {
              triggerTrackEnded();
            }
          } catch {}
        }
      }, 60);
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
