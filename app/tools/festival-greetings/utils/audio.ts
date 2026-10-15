"use client";
/**
 * Web Audio API synthesizer for cartoon sound effects and birthday melody
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentMelodyTimer: number | null = null;
  private isPlayingMelody: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isPlayingMelody) {
      this.stopMelody();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /** Cute cartoon bubble/button pop */
  public playPop(pitch: number = 440) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 2.2, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  /** Cartoon boing / bounce sound */
  public playBoing() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  /** Confetti explosion whoosh + sparkle */
  public playConfettiWhoosh() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.25);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();

      [784, 988, 1175, 1568].forEach((freq, index) => {
        setTimeout(() => {
          this.playChime(freq, 0.4);
        }, index * 40);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  /** Chime note */
  public playChime(freq: number = 880, duration: number = 0.5) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  /** Grand Tada / Fanfare */
  public playTada() {
    if (this.isMuted) return;
    const notes = [
      { f: 523.25, d: 0.15, wait: 0 },
      { f: 659.25, d: 0.15, wait: 120 },
      { f: 783.99, d: 0.2, wait: 240 },
      { f: 1046.5, d: 0.8, wait: 420 },
    ];

    notes.forEach(({ f, d, wait }) => {
      setTimeout(() => {
        this.playChime(f, d);
      }, wait);
    });
  }

  /** Blow candle whoosh sound */
  public playBlowCandle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.Q.setValueAtTime(2, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  /** Play celebratory synthesized "Happy Birthday" melody */
  public playBirthdaySong(theme: 'musicbox' | 'cheerful' | 'party' | 'lofi' = 'musicbox') {
    if (this.isMuted) return;
    this.stopMelody();
    this.isPlayingMelody = true;

    const melody = [
      { f: 261.63, d: 0.3, pause: 0.1 },
      { f: 261.63, d: 0.2, pause: 0.05 },
      { f: 293.66, d: 0.5, pause: 0.1 },
      { f: 261.63, d: 0.5, pause: 0.1 },
      { f: 349.23, d: 0.5, pause: 0.1 },
      { f: 329.63, d: 0.9, pause: 0.2 },

      { f: 261.63, d: 0.3, pause: 0.1 },
      { f: 261.63, d: 0.2, pause: 0.05 },
      { f: 293.66, d: 0.5, pause: 0.1 },
      { f: 261.63, d: 0.5, pause: 0.1 },
      { f: 392.00, d: 0.5, pause: 0.1 },
      { f: 349.23, d: 0.9, pause: 0.2 },

      { f: 261.63, d: 0.3, pause: 0.1 },
      { f: 261.63, d: 0.2, pause: 0.05 },
      { f: 523.25, d: 0.5, pause: 0.1 },
      { f: 440.00, d: 0.5, pause: 0.1 },
      { f: 349.23, d: 0.5, pause: 0.1 },
      { f: 329.63, d: 0.5, pause: 0.1 },
      { f: 293.66, d: 0.8, pause: 0.2 },

      { f: 466.16, d: 0.3, pause: 0.1 },
      { f: 466.16, d: 0.2, pause: 0.05 },
      { f: 440.00, d: 0.5, pause: 0.1 },
      { f: 349.23, d: 0.5, pause: 0.1 },
      { f: 392.00, d: 0.5, pause: 0.1 },
      { f: 349.23, d: 1.1, pause: 0.5 },
    ];

    let currentStep = 0;
    const playNext = () => {
      if (!this.isPlayingMelody || this.isMuted) return;

      const note = melody[currentStep];
      const ctx = this.getContext();
      if (ctx) {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = theme === 'party' ? 'sawtooth' : theme === 'cheerful' ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(note.f * 1.5, ctx.currentTime); // one octave up for music box sweetness

          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.d);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + note.d);
        } catch (e) {
        }
      }

      currentStep++;
      if (currentStep < melody.length) {
        const nextDelay = (note.d + note.pause) * 850;
        this.currentMelodyTimer = window.setTimeout(playNext, nextDelay);
      } else {
        this.currentMelodyTimer = window.setTimeout(() => {
          currentStep = 0;
          playNext();
        }, 1200);
      }
    };

    playNext();
  }

  public stopMelody() {
    this.isPlayingMelody = false;
    if (this.currentMelodyTimer) {
      clearTimeout(this.currentMelodyTimer);
      this.currentMelodyTimer = null;
    }
  }

  public isMelodyPlaying(): boolean {
    return this.isPlayingMelody;
  }
}

export const sound = new SoundEngine();
