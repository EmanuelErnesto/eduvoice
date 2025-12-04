import { SoundTrack } from '../types';

class AudioService {
  private context: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private currentTrack: SoundTrack = 'cosmos';
  private isPlaying = false;
  
  private fileAudioElement: HTMLAudioElement | null = null;
  private fileMediaSource: MediaElementAudioSourceNode | null = null;
  private currentBlobUrl: string | null = null;

  private sfxBuffers: Record<string, AudioBuffer> = {};
  private sfxLoadPromises: Record<string, Promise<void>> = {};

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
        latencyHint: 'interactive'
      });
    }
    return this.context;
  }

  private ensureNodes() {
    const ctx = this.getContext();
    if (!this.musicGain) {
      this.musicGain = ctx.createGain();
      this.musicGain.connect(ctx.destination);
      this.musicGain.gain.value = 0.3;
    }
    if (!this.sfxGain) {
      this.sfxGain = ctx.createGain();
      this.sfxGain.connect(ctx.destination);
      this.sfxGain.gain.value = 0.5;
    }

    if (!this.fileAudioElement) {
      this.fileAudioElement = new Audio();
      this.fileAudioElement.loop = true;
      this.fileAudioElement.crossOrigin = "anonymous";
    }

    if (this.fileAudioElement && !this.fileMediaSource) {
      try {
        this.fileMediaSource = ctx.createMediaElementSource(this.fileAudioElement);
        if (this.musicGain) {
            this.fileMediaSource.connect(this.musicGain);
        }
      } catch (e) {
      }
    }
  }

  public warmup() {
    try {
        this.ensureNodes();
        this.preloadSFX();
    } catch (e) {
    }
  }

  public async initialize() {
    const ctx = this.getContext();
    this.ensureNodes();
    this.preloadSFX();

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  private preloadSFX() {
    const definitions = [
        { type: 'correct', duration: 0.8 },
        { type: 'wrong', duration: 0.6 },
        { type: 'click', duration: 0.1 }
    ];

    definitions.forEach(def => {
        this.renderSFXToBuffer(def.type as any, def.duration);
    });
  }

  private async renderSFXToBuffer(type: 'correct' | 'wrong' | 'click', duration: number): Promise<void> {
      if (this.sfxBuffers[type]) return;
      if (this.sfxLoadPromises[type]) return this.sfxLoadPromises[type];

      const task = async () => {
        try {
            const sampleRate = 24000;
            const length = sampleRate * duration;
            const offlineCtx = new OfflineAudioContext(1, length, sampleRate);
            
            const osc = offlineCtx.createOscillator();
            const gain = offlineCtx.createGain();
            
            osc.connect(gain);
            gain.connect(offlineCtx.destination);

            const now = 0;

            if (type === 'correct') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now); 
                osc.frequency.setValueAtTime(659.25, now + 0.1); 
                osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2); 
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);

            } else if (type === 'wrong') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
                
                const filter = offlineCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 400;
                
                osc.disconnect();
                osc.connect(filter);
                filter.connect(gain);

                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);

            } else if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            }

            const renderedBuffer = await offlineCtx.startRendering();
            this.sfxBuffers[type] = renderedBuffer;
        } catch (e) {
            console.error(e);
        } finally {
            delete this.sfxLoadPromises[type];
        }
      };

      this.sfxLoadPromises[type] = task();
      return this.sfxLoadPromises[type];
  }

  public setMusicVolume(vol: number) {
    this.ensureNodes();
    if (!this.musicGain) return;
    const ctx = this.getContext();
    this.musicGain.gain.setTargetAtTime(vol, ctx.currentTime, 0.1);
  }

  public setSfxVolume(vol: number) {
    this.ensureNodes();
    if (!this.sfxGain) return;
    const ctx = this.getContext();
    this.sfxGain.gain.setTargetAtTime(vol, ctx.currentTime, 0.1);
  }

  public stopMusic() {
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) { }
    });
    this.activeOscillators = [];
    
    if (this.fileAudioElement) {
      this.fileAudioElement.pause();
    }

    this.isPlaying = false;
  }

  public async playTrack(track: SoundTrack) {
    if (this.currentTrack === track) return;

    this.currentTrack = track;
    this.stopMusic();

    const trackStrategies = {
      upload: () => { this.isPlaying = true; },
      default: () => this.startAmbientMusic()
    };

    const action = trackStrategies[track as keyof typeof trackStrategies] || trackStrategies.default;
    action();
  }

  public async playFile(blobUrl: string) {
    this.ensureNodes();
    const ctx = this.getContext();
    
    if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
    }

    if (this.currentBlobUrl === blobUrl && this.fileAudioElement) {
        if (this.fileAudioElement.paused) {
            try {
                await this.fileAudioElement.play();
                this.isPlaying = true;
            } catch (e) { console.error(e); }
        }
        return; 
    }

    this.activeOscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    this.activeOscillators = [];

    this.currentBlobUrl = blobUrl;

    if (this.fileAudioElement) {
        this.fileAudioElement.src = blobUrl;
        try {
            await this.fileAudioElement.play();
            this.isPlaying = true;
        } catch (e) {
        }
    }
  }

  public startAmbientMusic() {
    const skipStrategies: Record<string, () => boolean> = {
        upload: () => true,
        default: () => false
    };

    const shouldSkip = (skipStrategies[this.currentTrack] || skipStrategies.default)();
    if (shouldSkip) return;

    this.ensureNodes();
    const ctx = this.getContext();
    
    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    if (this.activeOscillators.length > 0) {
        this.activeOscillators.forEach(o => { try { o.stop(); o.disconnect(); } catch(e){} });
        this.activeOscillators = [];
    }
    
    if (this.fileAudioElement) {
        this.fileAudioElement.pause();
    }

    const now = ctx.currentTime;
    this.isPlaying = true;

    const tracks = {
      zen: [130.81, 164.81, 196.00], 
      cosmos: [130.81, 196.00, 261.63, 392.00], 
      focus: [110.00, 146.83, 164.81] 
    };

    const freqs = tracks[this.currentTrack as keyof typeof tracks] || tracks.cosmos;
    const waveType: OscillatorType = this.currentTrack === 'focus' ? 'triangle' : 'sine';

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = waveType;
      osc.frequency.value = freq;
      
      osc.detune.value = (Math.random() * 8) - 4;

      oscGain.gain.value = 0;
      
      osc.connect(oscGain);
      if (this.musicGain) {
        oscGain.connect(this.musicGain);
      }
      
      osc.start(now);
      
      oscGain.gain.linearRampToValueAtTime(0.1 / freqs.length, now + 3 + i);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + (Math.random() * 0.05); 
      lfoGain.gain.value = 5; 
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      this.activeOscillators.push(osc, lfo);
    });
  }

  public playSFX(type: 'correct' | 'wrong' | 'click') {
    if (this.context?.state === 'running' && this.sfxBuffers[type] && this.sfxGain) {
         try {
             const source = this.context.createBufferSource();
             source.buffer = this.sfxBuffers[type];
             source.connect(this.sfxGain);
             source.start();
             return;
         } catch(e) {
         }
    }

    this.ensureNodes();
    const ctx = this.getContext();
    
    const play = () => {
        if (this.sfxBuffers[type] && this.sfxGain) {
            const source = ctx.createBufferSource();
            source.buffer = this.sfxBuffers[type];
            source.connect(this.sfxGain);
            source.start();
        }
    };

    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    this.renderSFXToBuffer(type, 0.5).then(play);
  }
}

export const audioService = new AudioService();