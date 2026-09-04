"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Track, Playlist, RepeatMode } from "@/types/music";
import { SPOTIFY_TRACKS } from "@/lib/music/spotifyCatalog";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  queueIndex: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isFullScreen: boolean;
  savedTracks: Track[];
  savedPlaylists: Playlist[];
  savedTrackIds: string[];
  savedPlaylistIds: string[];
  recentlyPlayed: Track[];
  playTrack: (track: Track, newQueue?: Track[]) => void;
  playPlaylist: (playlist: Playlist, startIndex?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFullScreen: () => void;
  setFullScreen: (open: boolean) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleSaveTrack: (trackOrId: Track | string) => void;
  toggleSavePlaylist: (playlistOrId: Playlist | string) => void;
  isSavedTrack: (trackId: string) => boolean;
  isSavedPlaylist: (playlistId: string) => boolean;
  // Aliases for cinematic player components
  currentTime: number;
  previousTrack: () => void;
  seek: (time: number) => void;
  isExpanded: boolean;
  setIsExpanded: (open: boolean) => void;
  isRepeat: boolean;
  isTrackSaved: (trackId: string) => boolean;
  closePlayer: () => void;
  setProgress: (time: number) => void;
  setDuration: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  // Pristine clean initial state - zero sample tracks auto-loaded
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    if (typeof window === "undefined") return 0.75;
    try {
      const vol = localStorage.getItem("cadence_volume");
      return vol ? parseFloat(vol) : 0.75;
    } catch {
      return 0.75;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
  const [isFullScreen, setIsFullScreen] = useState(false);

  // State refs to eliminate any stale closure issues during track transition
  const queueRef = useRef<Track[]>(queue);
  const queueIndexRef = useRef<number>(queueIndex);
  const isShuffleRef = useRef<boolean>(isShuffle);
  const repeatModeRef = useRef<RepeatMode>(repeatMode);
  const currentTrackRef = useRef<Track | null>(currentTrack);
  const progressRef = useRef<number>(progress);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    queueIndexRef.current = queueIndex;
  }, [queueIndex]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Persistence with lazy state initializers
  const [savedTracks, setSavedTracks] = useState<Track[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("cadence_saved_tracks_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("cadence_saved_playlists_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("cadence_recently_played");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element with persistent listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();
    audioRef.current = audio;
    audio.preload = "auto";
    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      window.dispatchEvent(new CustomEvent("player:ended"));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);


  // Update volume on existing audio element without re-creating it
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Volume synchronization
  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clamped;
    }
    try {
      localStorage.setItem("cadence_volume", clamped.toString());
    } catch {}
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem("cadence_saved_tracks_v2", JSON.stringify(savedTracks));
      localStorage.setItem(
        "cadence_saved_tracks",
        JSON.stringify(savedTracks.map((t) => t.id))
      );
    } catch {}
  }, [savedTracks]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "cadence_saved_playlists_v2",
        JSON.stringify(savedPlaylists)
      );
      localStorage.setItem(
        "cadence_saved_playlists",
        JSON.stringify(savedPlaylists.map((p) => p.id))
      );
    } catch {}
  }, [savedPlaylists]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "cadence_recently_played",
        JSON.stringify(recentlyPlayed)
      );
    } catch {}
  }, [recentlyPlayed]);

  // Direct track play implementation (provider-agnostic)
  const playTrackDirect = useCallback(
    (track: Track) => {
      currentTrackRef.current = track;
      setCurrentTrack(track);
      setProgress(0);
      progressRef.current = 0;
      setDuration(track.duration || 180);
      setIsPlaying(true);

      // Add to recently played (deduplicated, max 20)
      setRecentlyPlayed((prev) => {
        const filtered = prev.filter((t) => t.id !== track.id);
        return [track, ...filtered].slice(0, 20);
      });

      // If direct audioUrl is provided by another licensed provider, stream via HTML5 audio
      const audio = audioRef.current;
      if (audio && track.audioUrl) {
        audio.src = track.audioUrl;
        audio.currentTime = 0;
        audio.load();
        audio.play().catch((err) => {
          console.warn("Direct stream autoplay notice:", err);
        });
      }
    },
    []
  );

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying(true);
    if (audioRef.current && currentTrack.audioUrl) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const seekTo = useCallback(
    (time: number) => {
      const clamped = Math.max(0, Math.min(duration, time));
      setProgress(clamped);
      progressRef.current = clamped;

      if (audioRef.current && currentTrack?.audioUrl) {
        audioRef.current.currentTime = clamped;
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("livo:seek", { detail: { time: clamped } })
        );
      }
    },
    [duration, currentTrack]
  );

  // Next track implementation - auto advances cleanly with zero stale closures
  const nextTrack = useCallback(() => {
    const curQueue = queueRef.current;
    const curIdx = queueIndexRef.current;
    const curRepeat = repeatModeRef.current;
    const curShuffle = isShuffleRef.current;
    const curTrack = currentTrackRef.current;

    // Handle repeat mode "one"
    if (curRepeat === "one" && curTrack) {
      seekTo(0);
      resume();
      return;
    }

    // Determine working active queue (current queue or catalog fallback)
    const activeQueue = curQueue.length > 0 ? curQueue : SPOTIFY_TRACKS;
    if (activeQueue.length === 0) return;

    let nextIdx: number;
    if (curShuffle) {
      nextIdx = Math.floor(Math.random() * activeQueue.length);
    } else {
      // Accurately locate current track index
      const currentTrackIndex =
        curIdx >= 0 && curIdx < activeQueue.length && activeQueue[curIdx]?.id === curTrack?.id
          ? curIdx
          : activeQueue.findIndex((t) => t.id === curTrack?.id);

      const baseIdx = currentTrackIndex !== -1 ? currentTrackIndex : curIdx;
      nextIdx = baseIdx + 1;

      if (nextIdx >= activeQueue.length) {
        if (curRepeat === "all") {
          nextIdx = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    const target = activeQueue[nextIdx];
    if (target) {
      if (curQueue.length === 0) {
        setQueue(activeQueue);
        queueRef.current = activeQueue;
      }
      setQueueIndex(nextIdx);
      queueIndexRef.current = nextIdx;
      playTrackDirect(target);
    }
  }, [seekTo, resume, playTrackDirect]);

  // Previous track implementation
  const prevTrack = useCallback(() => {
    const curQueue = queueRef.current;
    const curIdx = queueIndexRef.current;
    const curProgress = progressRef.current;
    const curTrack = currentTrackRef.current;

    const activeQueue = curQueue.length > 0 ? curQueue : SPOTIFY_TRACKS;
    if (activeQueue.length === 0) return;

    if (curProgress > 3) {
      seekTo(0);
      return;
    }

    const currentTrackIndex =
      curIdx >= 0 && curIdx < activeQueue.length && activeQueue[curIdx]?.id === curTrack?.id
        ? curIdx
        : activeQueue.findIndex((t) => t.id === curTrack?.id);

    const baseIdx = currentTrackIndex !== -1 ? currentTrackIndex : curIdx;
    let prevIdx = baseIdx - 1;
    if (prevIdx < 0) {
      prevIdx = activeQueue.length - 1;
    }

    const target = activeQueue[prevIdx];
    if (target) {
      if (curQueue.length === 0) {
        setQueue(activeQueue);
        queueRef.current = activeQueue;
      }
      setQueueIndex(prevIdx);
      queueIndexRef.current = prevIdx;
      playTrackDirect(target);
    }
  }, [seekTo, playTrackDirect]);

  // Listen for audio track completion to advance queue
  useEffect(() => {
    const onTrackEnded = () => {
      nextTrack();
    };
    window.addEventListener("player:ended", onTrackEnded);
    return () => window.removeEventListener("player:ended", onTrackEnded);
  }, [nextTrack]);

  // External playTrack API
  const playTrack = useCallback(
    (track: Track, newQueue?: Track[]) => {
      if (newQueue && newQueue.length > 0) {
        setQueue(newQueue);
        queueRef.current = newQueue;
        const idx = newQueue.findIndex((t) => t.id === track.id);
        const targetIdx = idx !== -1 ? idx : 0;
        setQueueIndex(targetIdx);
        queueIndexRef.current = targetIdx;
      } else {
        setQueue((prev) => {
          const idx = prev.findIndex((t) => t.id === track.id);
          if (idx !== -1) {
            setQueueIndex(idx);
            queueIndexRef.current = idx;
            return prev;
          }
          const updated = [...prev, track];
          const newIdx = updated.length - 1;
          setQueueIndex(newIdx);
          queueIndexRef.current = newIdx;
          queueRef.current = updated;
          return updated;
        });
      }
      playTrackDirect(track);
    },
    [playTrackDirect]
  );

  // Play entire playlist
  const playPlaylist = useCallback(
    (playlist: Playlist, startIndex = 0) => {
      if (!playlist.tracks || playlist.tracks.length === 0) return;
      const safeIdx = Math.min(Math.max(0, startIndex), playlist.tracks.length - 1);
      setQueue(playlist.tracks);
      queueRef.current = playlist.tracks;
      setQueueIndex(safeIdx);
      queueIndexRef.current = safeIdx;
      playTrackDirect(playlist.tracks[safeIdx]);
    },
    [playTrackDirect]
  );

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  const setFullScreen = useCallback((open: boolean) => {
    setIsFullScreen(open);
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Save Track Toggle
  const toggleSaveTrack = useCallback(
    (trackOrId: Track | string) => {
      setSavedTracks((prev) => {
        const id = typeof trackOrId === "string" ? trackOrId : trackOrId.id;
        const exists = prev.some((t) => t.id === id || t.spotifyId === id);
        if (exists) {
          return prev.filter((t) => t.id !== id && t.spotifyId !== id);
        }
        if (typeof trackOrId !== "string") {
          return [...prev, trackOrId];
        }
        if (currentTrack && (currentTrack.id === id || currentTrack.spotifyId === id)) {
          return [...prev, currentTrack];
        }
        const foundInQueue = queue.find((t) => t.id === id || t.spotifyId === id);
        if (foundInQueue) {
          return [...prev, foundInQueue];
        }
        return prev;
      });
    },
    [currentTrack, queue]
  );

  // Save Playlist Toggle
  const toggleSavePlaylist = useCallback((playlistOrId: Playlist | string) => {
    setSavedPlaylists((prev) => {
      const id = typeof playlistOrId === "string" ? playlistOrId : playlistOrId.id;
      const exists = prev.some((p) => p.id === id || p.spotifyId === id);
      if (exists) {
        return prev.filter((p) => p.id !== id && p.spotifyId !== id);
      }
      if (typeof playlistOrId !== "string") {
        return [...prev, playlistOrId];
      }
      return prev;
    });
  }, []);

  const isSavedTrack = useCallback(
    (trackId: string) =>
      savedTracks.some((t) => t.id === trackId || t.spotifyId === trackId),
    [savedTracks]
  );

  const isSavedPlaylist = useCallback(
    (playlistId: string) =>
      savedPlaylists.some((p) => p.id === playlistId || p.spotifyId === playlistId),
    [savedPlaylists]
  );



  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        seekTo(progress + 5);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        seekTo(progress - 5);
      } else if (e.code === "Escape") {
        setFullScreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, seekTo, progress, setFullScreen]);

  const savedTrackIds = savedTracks.map((t) => t.id);
  const savedPlaylistIds = savedPlaylists.map((p) => p.id);

  const closePlayer = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        isMuted,
        queue,
        queueIndex,
        isShuffle,
        repeatMode,
        isFullScreen,
        savedTracks,
        savedPlaylists,
        savedTrackIds,
        savedPlaylistIds,
        recentlyPlayed,
        playTrack,
        playPlaylist,
        togglePlay,
        pause,
        resume,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleFullScreen,
        setFullScreen,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleSaveTrack,
        toggleSavePlaylist,
        isSavedTrack,
        isSavedPlaylist,
        currentTime: progress,
        previousTrack: prevTrack,
        seek: seekTo,
        isExpanded: isFullScreen,
        setIsExpanded: setFullScreen,
        isRepeat: repeatMode !== "off",
        isTrackSaved: isSavedTrack,
        closePlayer,
        setProgress,
        setDuration,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
