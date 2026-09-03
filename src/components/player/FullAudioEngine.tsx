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

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player("livo-full-audio-engine", {
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

  const loadAndPlay = (track: any) => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      if (track.youtubeId) {
        playerRef.current.loadVideoById(track.youtubeId, 0);
      } else {
        playerRef.current.loadPlaylist({
          listType: "search",
          list: `${track.artist} ${track.title} Official Audio`,
        });
      }
      playerRef.current.playVideo();
    } catch (e) {
      console.warn("FullAudioEngine load error:", e);
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

  return (
    <div
      id="livo-full-audio-engine"
      style={{
        position: "fixed",
        top: -9999,
        left: -9999,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
