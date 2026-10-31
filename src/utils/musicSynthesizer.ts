import { MusicTrackId } from '../types/letter';

export interface MusicTrackMeta {
  id: MusicTrackId;
  title: string;
  subtitle: string;
  tempoBpm: number;
  notes: Array<{ freq: number; duration: number; harmony?: number }>;
}

export const MUSIC_TRACKS: Record<MusicTrackId, MusicTrackMeta> = {
  november_waltz: {
    id: 'november_waltz',
    title: 'Valse de Novembre (Birthday Music Box)',
    subtitle: 'Antique Celesta & Warm Harp in D Minor · 3/4 Waltz',
    tempoBpm: 92,
    notes: [
      { freq: 587.33, duration: 1.5, harmony: 293.66 }, // D5 + D4
      { freq: 659.25, duration: 0.75 }, // E5
      { freq: 698.46, duration: 0.75 }, // F5
      { freq: 880.0, duration: 1.5, harmony: 440.0 }, // A5 + A4
      { freq: 783.99, duration: 1.5, harmony: 349.23 }, // G5 + F4
      { freq: 698.46, duration: 1.0 }, // F5
      { freq: 659.25, duration: 1.0 }, // E5
      { freq: 587.33, duration: 1.0 }, // D5
      { freq: 523.25, duration: 1.5, harmony: 329.63 }, // C5 + E4
      { freq: 698.46, duration: 1.5, harmony: 349.23 }, // F5 + F4
      { freq: 659.25, duration: 1.5, harmony: 329.63 }, // E5 + E4
      { freq: 587.33, duration: 2.25, harmony: 293.66 }, // D5 + D4
    ],
  },
  clair_nocturne: {
    id: 'clair_nocturne',
    title: 'Nocturne in Wine & Gold',
    subtitle: 'Impressionist Grand Piano & Velvet Pad',
    tempoBpm: 76,
    notes: [
      { freq: 659.25, duration: 1.6, harmony: 261.63 }, // E5 + C4
      { freq: 587.33, duration: 0.8 }, // D5
      { freq: 523.25, duration: 1.6, harmony: 329.63 }, // C5 + E4
      { freq: 493.88, duration: 0.8 }, // B4
      { freq: 440.0, duration: 1.6, harmony: 220.0 }, // A4 + A3
      { freq: 392.0, duration: 1.2, harmony: 246.94 }, // G4 + B3
      { freq: 523.25, duration: 1.6, harmony: 261.63 }, // C5 + C4
      { freq: 587.33, duration: 1.2 }, // D5
      { freq: 659.25, duration: 2.4, harmony: 329.63 }, // E5 + E4
    ],
  },
  forever_serenade: {
    id: 'forever_serenade',
    title: 'Sérénade d’Amour Éternel',
    subtitle: 'Romantic Music Box & Warm String Harmonics',
    tempoBpm: 84,
    notes: [
      { freq: 523.25, duration: 1.0, harmony: 261.63 }, // C5
      { freq: 659.25, duration: 1.0 }, // E5
      { freq: 783.99, duration: 1.5, harmony: 392.0 }, // G5
      { freq: 880.0, duration: 1.0, harmony: 349.23 }, // A5
      { freq: 783.99, duration: 1.0 }, // G5
      { freq: 698.46, duration: 1.5, harmony: 293.66 }, // F5
      { freq: 659.25, duration: 1.5, harmony: 329.63 }, // E5
      { freq: 587.33, duration: 1.2, harmony: 293.66 }, // D5
      { freq: 523.25, duration: 2.0, harmony: 261.63 }, // C5
    ],
  },
  candlelight_minuet: {
    id: 'candlelight_minuet',
    title: 'Candlelight Carillon in G',
    subtitle: 'Delicate Antique Chimes & Lute Arpeggios',
    tempoBpm: 96,
    notes: [
      { freq: 783.99, duration: 1.2, harmony: 392.0 }, // G5
      { freq: 587.33, duration: 0.8 }, // D5
      { freq: 659.25, duration: 0.8 }, // E5
      { freq: 740.0, duration: 1.2, harmony: 369.99 }, // F#5
      { freq: 783.99, duration: 1.6, harmony: 392.0 }, // G5
      { freq: 880.0, duration: 1.2, harmony: 440.0 }, // A5
      { freq: 740.0, duration: 1.2 }, // F#5
      { freq: 587.33, duration: 2.0, harmony: 293.66 }, // D5
    ],
  },
};

class VintageMusicBoxEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private currentTrack: MusicTrackId = 'november_waltz';
  private volume = 0.45;
  private noteIndex = 0;
  private audioElement: HTMLAudioElement | null = null;
  private customUrl: string | undefined;

  public start(trackId: MusicTrackId, customAudioUrl?: string): void {
    this.stop();
    this.currentTrack = trackId;
    this.customUrl = customAudioUrl?.trim() || undefined;
    this.isPlaying = true;

    if (this.customUrl) {
      try {
        this.audioElement = new Audio(this.customUrl);
        this.audioElement.loop = true;
        this.audioElement.volume = this.volume;
        this.audioElement.play().catch(() => {
          // Fallback to synthesized music box if custom URL fails to play
          this.startSynthesizer();
        });
        return;
      } catch {
        this.startSynthesizer();
        return;
      }
    }

    this.startSynthesizer();
  }

  private startSynthesizer(): void {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.noteIndex = 0;
    this.scheduleNextNote();
  }

  private scheduleNextNote(): void {
    if (!this.isPlaying || !this.ctx) return;

    const track = MUSIC_TRACKS[this.currentTrack] || MUSIC_TRACKS.november_waltz;
    const step = track.notes[this.noteIndex % track.notes.length];
    this.noteIndex = (this.noteIndex + 1) % track.notes.length;

    const beatSec = 60 / track.tempoBpm;
    const durSec = step.duration * beatSec;

    this.triggerChime(step.freq, durSec * 1.4, this.volume * 0.25);
    if (step.harmony) {
      this.triggerChime(step.harmony, durSec * 1.9, this.volume * 0.14);
    }

    this.timerId = window.setTimeout(() => {
      this.scheduleNextNote();
    }, durSec * 1000);
  }

  private triggerChime(freq: number, durationSec: number, peakGain: number): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(peakGain * 0.18, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 0.5);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(Math.max(0.002, peakGain), now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + durationSec + 0.05);
    overtone.stop(now + durationSec + 0.05);
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }

  /**
   * Plays a delicate crystalline wax-crack + harp glissando flourish when the envelope opens.
   */
  public playWaxSealUnfoldChime(): void {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    try {
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const glissando = [587.33, 740.0, 880.0, 1174.66, 1479.98]; // D major golden arpeggio
      glissando.forEach((freq, idx) => {
        window.setTimeout(() => {
          this.triggerChime(freq, 0.85, this.volume * 0.18);
        }, idx * 95);
      });
    } catch {
      // Ignore audio context restrictions
    }
  }

  /**
   * Plays a soft, tactile cotton-parchment page turn sound effect when navigating between photo album slides.
   */
  public playPageTurnSound(direction: 'next' | 'prev' = 'next'): void {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    try {
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const ctx = this.ctx;
      const now = ctx.currentTime;
      const duration = 0.28;
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.floor(sampleRate * duration);
      const buffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate warm pink-ish noise (filtered white noise) for natural paper fiber texture
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.950 * b2 + white * 0.048;
        data[i] = (b0 + b1 + b2 + white * 0.18) * 0.7;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter sweeping across frequencies to mimic a heavy album page lifting and settling
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.Q.setValueAtTime(1.8, now);

      if (direction === 'next') {
        bandpass.frequency.setValueAtTime(620, now);
        bandpass.frequency.exponentialRampToValueAtTime(1380, now + 0.11);
        bandpass.frequency.exponentialRampToValueAtTime(760, now + duration);
      } else {
        bandpass.frequency.setValueAtTime(780, now);
        bandpass.frequency.exponentialRampToValueAtTime(1480, now + 0.1);
        bandpass.frequency.exponentialRampToValueAtTime(590, now + duration);
      }

      // High-shelf softening so the rustle stays warm and intimate
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(2600, now);

      const rustleGain = ctx.createGain();
      const baseGain = Math.max(0.12, this.volume * 0.36);
      rustleGain.gain.setValueAtTime(0.0005, now);
      rustleGain.gain.linearRampToValueAtTime(baseGain * 0.65, now + 0.045);
      rustleGain.gain.linearRampToValueAtTime(baseGain, now + 0.115);
      rustleGain.gain.exponentialRampToValueAtTime(0.0004, now + duration);

      noiseSource.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(rustleGain);
      rustleGain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration + 0.02);

      // Subtle low-frequency cardstock settle whisper as the page lands
      const settleOsc = ctx.createOscillator();
      const settleGain = ctx.createGain();
      settleOsc.type = 'sine';
      settleOsc.frequency.setValueAtTime(118, now + 0.15);
      settleOsc.frequency.exponentialRampToValueAtTime(58, now + 0.25);

      settleGain.gain.setValueAtTime(0.0001, now);
      settleGain.gain.setValueAtTime(0.0005, now + 0.15);
      settleGain.gain.linearRampToValueAtTime(baseGain * 0.09, now + 0.175);
      settleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

      settleOsc.connect(settleGain);
      settleGain.connect(ctx.destination);

      settleOsc.start(now + 0.15);
      settleOsc.stop(now + 0.27);
    } catch {
      // Ignore audio context restrictions
    }
  }
}

export const musicBox = new VintageMusicBoxEngine();

