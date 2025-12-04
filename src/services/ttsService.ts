import Speech from 'speak-tts';
import { EventEmitter } from '../utils/EventEmitter';

class TTSService extends EventEmitter {
  private speech: any;
  private initialized = false;
  private currentVolume = 1.0;
  private initPromise: Promise<void> | null = null;

  constructor() {
    super();
    try {
      this.speech = new Speech();
    } catch (error) {
      this.speech = null;
    }
  }

  public init(): Promise<void> {
    if (this.initialized) return Promise.resolve();
    
    if (this.initPromise) return this.initPromise;

    if (!this.speech) {
        this.initPromise = Promise.resolve();
        return this.initPromise;
    }

    this.initPromise = this.speech.init({
      volume: this.currentVolume,
      lang: 'pt-BR',
      rate: 1.1,
      pitch: 1,
      splitSentences: false
    }).then((data: any) => {
      this.initialized = true;
    }).catch((error: any) => {
      this.initialized = false;
    });

    return this.initPromise!;
  }

  public resume(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.resume();
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = volume;
    if (this.speech && this.initialized) {
      this.speech.setVolume(volume);
    }
  }

  public async speak(text: string): Promise<void> {
    if (!this.speech) return;

    if (!this.initialized) {
        await this.init();
        if (!this.initialized) return;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    this.speech.setVolume(this.currentVolume);

    return new Promise((resolve) => {
      let resolved = false;
      const timeoutDuration = (text.length * 100) + 5000;
      
      const handleEnd = () => {
        if (resolved) return;
        resolved = true;
        this.emit('TTS_ENDED');
        resolve();
      };

      const safetyTimeout = setTimeout(handleEnd, timeoutDuration);

      const safeHandleEnd = () => {
        clearTimeout(safetyTimeout);
        handleEnd();
      };

      try {
        if (!this.speech.hasBrowserSupport()) {
          safeHandleEnd();
          return;
        }

        this.speech.speak({
          text,
          queue: false,
          listeners: {
            onend: safeHandleEnd,
            onerror: safeHandleEnd
          }
        }).catch(safeHandleEnd);
      } catch (error) {
        safeHandleEnd();
      }
    });
  }

  public cancel(): void {
    if (!this.speech) return;
    try {
      this.speech.cancel();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
      }
    } catch (error) {
    }
  }
}

export const ttsService = new TTSService();