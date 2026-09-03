/**
 * Resilient Web Audio Synthesizer Fallback
 * Provides warm ambient musical chords and soundscapes if an external audio stream
 * encounters CORS, network restrictions, or offline mode.
 */

class AmbientSoundGenerator {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private gainNode: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public play(trackSeed: string, volume = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stop();
    this.isPlaying = true;

    // Master gain
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
    this.gainNode.connect(ctx.destination);

    // Derive chord frequencies from track seed
    const seedNum = Array.from(trackSeed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rootNotes = [130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 246.94]; // C3 to B3
    const baseFreq = rootNotes[seedNum % rootNotes.length];

    // Minor / Major 7th chord structure
    const ratios = [1, 1.1892, 1.4983, 1.7818, 2];

    const playChord = () => {
      if (!this.isPlaying || !this.gainNode || !this.ctx) return;
      const now = this.ctx.currentTime;

      ratios.forEach((ratio, idx) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Warm lowpass filter
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800 + Math.sin(now + idx) * 300, now);

        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(baseFreq * ratio + (Math.random() * 2 - 1), now);

        // Smooth envelope
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.15 / (idx + 1), now + 1.5);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 5.0);
      });
    };

    playChord();
    this.intervalId = setInterval(playChord, 4500);
  }

  public setVolume(volume: number): void {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);
    }
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      } catch {}
    }
  }
}

export const ambientSoundGenerator = new AmbientSoundGenerator();
