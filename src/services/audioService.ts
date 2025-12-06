import { SoundTrack } from "../types";

class AudioService {
  private context: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private currentTrack: SoundTrack = "voz-violao";
  private isPlaying = false;

  private fileAudioElement: HTMLAudioElement | null = null;
  private fileMediaSource: MediaElementAudioSourceNode | null = null;
  private currentBlobUrl: string | null = null;

  private sfxBuffers: Record<string, AudioBuffer> = {};
  private sfxLoadPromises: Record<string, Promise<void>> = {};

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext ||
        (window as any).webkitAudioContext)({
        sampleRate: 24000,
        latencyHint: "interactive",
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
        this.fileMediaSource = ctx.createMediaElementSource(
          this.fileAudioElement
        );
        if (this.musicGain) {
          this.fileMediaSource.connect(this.musicGain);
        }
      } catch (e) {}
    }
  }

  public warmup() {
    try {
      this.ensureNodes();
      this.preloadSFX();
    } catch (e) {}
  }

  public async initialize() {
    const ctx = this.getContext();
    this.ensureNodes();
    this.preloadSFX();

    if (ctx.state === "suspended") {
      await ctx.resume();
    }
  }

  private preloadSFX() {
    const definitions = [
      { type: "correct", duration: 0.8 },
      { type: "wrong", duration: 0.6 },
      { type: "click", duration: 0.1 },
    ];

    definitions.forEach((def) => {
      this.renderSFXToBuffer(def.type as any, def.duration);
    });
  }

  private async renderSFXToBuffer(
    type: "correct" | "wrong" | "click",
    duration: number
  ): Promise<void> {
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

        if (type === "correct") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.1);
          osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.2);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
        } else if (type === "wrong") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);

          const filter = offlineCtx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 400;

          osc.disconnect();
          osc.connect(filter);
          filter.connect(gain);

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
        } else if (type === "click") {
          osc.type = "sine";
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
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];

    if (this.fileAudioElement) {
      this.fileAudioElement.pause();
    }

    this.isPlaying = false;
  }

  public async playTrack(track: SoundTrack) {
    console.log(
      "[AudioService] playTrack chamado:",
      track,
      "atual:",
      this.currentTrack
    );

    // Always stop current music before switching
    this.stopMusic();
    this.currentTrack = track;

    const trackStrategies = {
      upload: async () => {
        console.log("[AudioService] Modo upload selecionado");
        this.isPlaying = true;
      },
      "voz-violao": async () => {
        console.log("[AudioService] Tocando voz-violao");
        await this.playAudioFile("/assets/voz-violao.mp3");
      },
      "violao-background": async () => {
        console.log("[AudioService] Tocando violao-background");
        await this.playAudioFile("/assets/violao-background.mp3");
      },
      "piano": async () => {
        console.log("[AudioService] Tocando piano");
        await this.playAudioFile("/assets/audiomidi.MIDI");
      },
      default: async () => this.startAmbientMusic(),
    };

    const action =
      trackStrategies[track as keyof typeof trackStrategies] ||
      trackStrategies.default;
    await action();
  }

  private async playAudioFile(assetPath: string) {
    console.log("[AudioService] playAudioFile chamado:", assetPath);
    this.ensureNodes();
    const ctx = this.getContext();

    if (ctx.state === "suspended") {
      console.log("[AudioService] Contexto suspenso, tentando resumir...");
      await ctx.resume().catch(() => {});
    }

    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];

    if (this.fileAudioElement) {
      // Pause and reset current audio
      this.fileAudioElement.pause();
      this.fileAudioElement.currentTime = 0;

      const baseUrl = import.meta.env.BASE_URL || "/";
      const fullPath =
        baseUrl +
        (assetPath.startsWith("/") ? assetPath.substring(1) : assetPath);
      console.log("[AudioService] Caminho completo do arquivo:", fullPath);
      this.fileAudioElement.src = fullPath;
      this.currentBlobUrl = fullPath;

      try {
        console.log("[AudioService] Tentando tocar áudio...");
        await this.fileAudioElement.play();
        this.isPlaying = true;
        console.log("[AudioService] Áudio tocando com sucesso!");
      } catch (e) {
        console.error("[AudioService] Erro ao reproduzir áudio:", e);
      }
    } else {
      console.error("[AudioService] fileAudioElement não existe!");
    }
  }

  public async playFile(blobUrl: string) {
    console.log("[AudioService] playFile chamado:", blobUrl);
    this.ensureNodes();
    const ctx = this.getContext();

    if (ctx.state === "suspended") {
      console.log(
        "[AudioService] Resumindo contexto para arquivo personalizado"
      );
      await ctx.resume().catch(() => {});
    }

    if (this.currentBlobUrl === blobUrl && this.fileAudioElement) {
      if (this.fileAudioElement.paused) {
        try {
          console.log("[AudioService] Retomando arquivo pausado");
          await this.fileAudioElement.play();
          this.isPlaying = true;
        } catch (e) {
          console.error("[AudioService] Erro ao retomar:", e);
        }
      }
      return;
    }

    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];

    this.currentBlobUrl = blobUrl;

    if (this.fileAudioElement) {
      // Reset and set new source
      this.fileAudioElement.pause();
      this.fileAudioElement.currentTime = 0;
      this.fileAudioElement.src = blobUrl;

      try {
        console.log("[AudioService] Tocando arquivo personalizado");
        await this.fileAudioElement.play();
        this.isPlaying = true;
        console.log("[AudioService] Arquivo personalizado tocando");
      } catch (e) {
        console.error("[AudioService] Erro ao tocar arquivo:", e);
      }
    }
  }

  public startAmbientMusic() {
    const skipStrategies: Record<string, () => boolean> = {
      upload: () => true,
      "voz-violao": () => true,
      "violao-background": () => true,
      "piano": () => true,
      default: () => false,
    };

    const shouldSkip = (
      skipStrategies[this.currentTrack] || skipStrategies.default
    )();
    if (shouldSkip) return;

    this.ensureNodes();
    const ctx = this.getContext();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    if (this.activeOscillators.length > 0) {
      this.activeOscillators.forEach((o) => {
        try {
          o.stop();
          o.disconnect();
        } catch (e) {}
      });
      this.activeOscillators = [];
    }

    if (this.fileAudioElement) {
      this.fileAudioElement.pause();
    }

    this.isPlaying = false;
  }

  public playSFX(type: "correct" | "wrong" | "click") {
    if (
      this.context?.state === "running" &&
      this.sfxBuffers[type] &&
      this.sfxGain
    ) {
      try {
        const source = this.context.createBufferSource();
        source.buffer = this.sfxBuffers[type];
        source.connect(this.sfxGain);
        source.start();
        return;
      } catch (e) {}
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

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    this.renderSFXToBuffer(type, 0.5).then(play);
  }
}

export const audioService = new AudioService();
