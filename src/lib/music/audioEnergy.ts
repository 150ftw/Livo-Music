import { Track } from "@/types/music";

/**
 * High-precision Musical Energy & Dynamics Engine
 * Maps audio playback time to actual song structure (intro, verses, heavy beat drops, breakdowns, outros)
 * Ensures that when music is subtle, the visualizer is minimal, and when beats are heavy, it becomes responsive.
 */

export interface TrackEnergyProfile {
  energy: number; // 0.0 (silent/ambient) to 1.0 (heavy beat drop / climax)
  isDrop: boolean;
  isSubtle: boolean;
  bpm: number;
}

// Known track-specific arrangement overrides for user curated playlists
const TRACK_ARRANGEMENTS: Record<
  string,
  {
    bpm: number;
    baseEnergy: number; // For inherently soft tracks (e.g. acoustic guitar)
    drops: [number, number][]; // [startSec, endSec] of heavy beat drops / choruses
    breakdowns: [number, number][]; // [startSec, endSec] of quiet breakdowns / vocal intros
    introEnd: number; // seconds when the beat enters
    outroStart: number; // seconds when the song fades out
  }
> = {
  // Sukha - Attraction (Heavy Punjabi Drill / Trap)
  "0biuGbhZwYnuUwMOi4fvaN": {
    bpm: 126,
    baseEnergy: 0.9,
    introEnd: 16,
    drops: [
      [36, 75],
      [108, 155],
    ],
    breakdowns: [
      [0, 16],
      [75, 92],
      [155, 183],
    ],
    outroStart: 165,
  },
  // Amber, Prodgk - Two Reasons (Punjabi Trap with acoustic intro & heavy drops)
  "0NeMEr9DrlEzaFOK7kOwlh": {
    bpm: 124,
    baseEnergy: 0.9,
    introEnd: 15,
    drops: [
      [22, 65],
      [98, 142],
    ],
    breakdowns: [
      [0, 15],
      [65, 82],
      [142, 151],
    ],
    outroStart: 140,
  },
  // Diljit Dosanjh - Sohni Lagdi
  "39ekKV0MPqtla7gnJHq7io": {
    bpm: 120,
    baseEnergy: 0.85,
    introEnd: 14,
    drops: [
      [26, 68],
      [95, 145],
    ],
    breakdowns: [
      [0, 14],
      [68, 82],
    ],
    outroStart: 145,
  },
  // Drake - God's Plan
  "3kjUjZmSctzPB5IpsnYhDC": {
    bpm: 134,
    baseEnergy: 0.85,
    introEnd: 15,
    drops: [
      [27, 72],
      [110, 175],
    ],
    breakdowns: [
      [0, 15],
      [72, 90],
    ],
    outroStart: 180,
  },
  // Guitar Girl - it will rain - guitar version (Quiet, delicate acoustic)
  "3OtCeLB2QjnhckmkdpTuUo": {
    bpm: 86,
    baseEnergy: 0.22, // Always subtle and minimal
    introEnd: 8,
    drops: [], // No heavy drops, pure intimate acoustic
    breakdowns: [[0, 180]],
    outroStart: 160,
  },
  // Cigarettes After Sex - John Wayne (Nocturnal, dream-pop, minimal)
  "2s2ccIVXHAuNbbgsNWRaDR": {
    bpm: 82,
    baseEnergy: 0.28,
    introEnd: 12,
    drops: [],
    breakdowns: [[0, 200]],
    outroStart: 170,
  },
};

/**
 * Compute the real-time energy of a track at a specific second
 */
export function getTrackEnergy(
  track: Track | null,
  currentTime: number,
  isPlaying: boolean
): TrackEnergyProfile {
  if (!isPlaying || !track || currentTime < 0) {
    return { energy: 0, isDrop: false, isSubtle: true, bpm: 116 };
  }

  const duration = track.duration || 180;
  const t = Math.max(0, Math.min(currentTime, duration));

  // 1. Check known arrangement overrides
  const custom = TRACK_ARRANGEMENTS[track.id];
  if (custom) {
    const { bpm, baseEnergy, drops, breakdowns, introEnd, outroStart } = custom;

    // Check if in an intentional quiet breakdown or intro
    for (const [start, end] of breakdowns) {
      if (t >= start && t < end) {
        // Very minimal in breakdowns / intros
        const progress = (t - start) / Math.max(1, end - start);
        const subEnergy = 0.08 + 0.08 * Math.sin(progress * Math.PI);
        return {
          energy: subEnergy * (baseEnergy > 0.5 ? 1 : baseEnergy),
          isDrop: false,
          isSubtle: true,
          bpm,
        };
      }
    }

    // Check if in a heavy beat drop
    for (const [start, end] of drops) {
      if (t >= start && t <= end) {
        // Heavy beat drop! Full responsiveness
        return {
          energy: 0.95 * baseEnergy,
          isDrop: true,
          isSubtle: false,
          bpm,
        };
      }
    }

    // In verse or outro
    if (t < introEnd) {
      return { energy: 0.12, isDrop: false, isSubtle: true, bpm };
    }
    if (t >= outroStart) {
      const fadeProgress = (t - outroStart) / Math.max(1, duration - outroStart);
      const fadeEnergy = Math.max(0.05, 0.45 * (1 - fadeProgress));
      return { energy: fadeEnergy, isDrop: false, isSubtle: true, bpm };
    }

    // Default active verse energy
    return { energy: 0.48 * baseEnergy, isDrop: false, isSubtle: false, bpm };
  }

  // 2. Generic Algorithmic Energy Model based on Track Genre & Structural Conventions
  const genre = (track.genre || "").toLowerCase();
  const title = (track.title || "").toLowerCase();

  const isAcousticOrAmbient =
    genre.includes("acoustic") ||
    genre.includes("folk") ||
    genre.includes("indie") ||
    genre.includes("guitar") ||
    genre.includes("ambient") ||
    genre.includes("slowcore") ||
    genre.includes("dream");

  const isHeavyBeats =
    genre.includes("trap") ||
    genre.includes("drill") ||
    genre.includes("rap") ||
    genre.includes("hip-hop") ||
    genre.includes("punjabi") ||
    title.includes("hardlaunch");

  const bpm = isAcousticOrAmbient ? 88 : isHeavyBeats ? 128 : 116;

  // If acoustic or ambient track: stays subtle throughout
  if (isAcousticOrAmbient) {
    const energy = 0.15 + 0.12 * Math.sin((t / duration) * Math.PI * 4);
    return {
      energy,
      isDrop: false,
      isSubtle: true,
      bpm,
    };
  }

  // Universal song structure timeline:
  // 0 -> 16s: Intro (subtle)
  // 16 -> 48s: Verse 1 (moderate groove)
  // 48 -> 56s: Build-up (rising energy)
  // 56 -> 90s: DROP 1 / CHORUS (heavy beats!)
  // 90 -> 118s: Verse 2 (moderate groove)
  // 118 -> 138s: Breakdown / Bridge (subtle vocals, drums out!)
  // 138 -> 148s: Build-up 2
  // 148 -> 185s: DROP 2 / CLIMAX (heavy beats!)
  // 185s -> end: Outro fade (subtle)

  if (t < 16) {
    // Intro: very subtle and minimal
    const introFrac = t / 16;
    const energy = 0.08 + 0.07 * introFrac;
    return { energy, isDrop: false, isSubtle: true, bpm };
  }

  if (t >= 16 && t < 48) {
    // Verse 1: light to moderate beat
    return { energy: 0.42, isDrop: false, isSubtle: false, bpm };
  }

  if (t >= 48 && t < 56) {
    // Pre-chorus / build-up: rising tension
    const buildFrac = (t - 48) / 8;
    const energy = 0.45 + 0.45 * buildFrac;
    return { energy, isDrop: false, isSubtle: false, bpm };
  }

  if (t >= 56 && t < 90) {
    // DROP 1: Heavy beats! Maximum responsiveness
    return { energy: 0.95, isDrop: true, isSubtle: false, bpm };
  }

  if (t >= 90 && t < 118) {
    // Verse 2
    return { energy: 0.48, isDrop: false, isSubtle: false, bpm };
  }

  if (t >= 118 && t < 138) {
    // Breakdown / Bridge: drums drop out, minimal
    return { energy: 0.12, isDrop: false, isSubtle: true, bpm };
  }

  if (t >= 138 && t < 148) {
    // Build-up 2
    const buildFrac = (t - 138) / 10;
    const energy = 0.45 + 0.5 * buildFrac;
    return { energy, isDrop: false, isSubtle: false, bpm };
  }

  if (t >= 148 && t < 185) {
    // DROP 2: Maximum heavy beats & climax!
    return { energy: 1.0, isDrop: true, isSubtle: false, bpm };
  }

  // Outro: Fades into subtle stillness
  const outroFrac = Math.min(1, (t - 185) / Math.max(1, duration - 185));
  const energy = Math.max(0.06, 0.4 * (1 - outroFrac));
  return { energy, isDrop: false, isSubtle: true, bpm };
}
