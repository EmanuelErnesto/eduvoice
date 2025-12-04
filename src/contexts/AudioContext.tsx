
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AudioConfig, SoundTrack } from '../types';
import { INITIAL_AUDIO_CONFIG } from '../constants';
import { audioService } from '../services/audioService';
import { ttsService } from '../services/ttsService';

interface AudioContextType {
  config: AudioConfig;
  updateConfig: (newConfig: AudioConfig) => void;
  playTrack: (track: SoundTrack) => void;
  setVolume: (type: 'music' | 'voice', value: number) => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AudioConfig>(INITIAL_AUDIO_CONFIG);

  useEffect(() => {
    try {
      ttsService.init().then(() => ttsService.resume()).catch(console.warn);
      audioService.warmup();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateConfig = useCallback((newConfig: AudioConfig) => {
    setConfig(newConfig);

    const musicVol = newConfig.isMuted ? 0 : newConfig.musicVolume;
    const sfxVol = newConfig.isMuted ? 0 : 0.5;
    const voiceVol = newConfig.isMuted ? 0 : newConfig.voiceVolume;

    audioService.setMusicVolume(musicVol);
    audioService.setSfxVolume(sfxVol);
    ttsService.setVolume(voiceVol);

    const trackStrategies = {
      upload: () => {
        audioService.playTrack('upload');
        const shouldPlayFile = newConfig.customFileBlobUrl && !newConfig.isMuted && musicVol > 0;
        const fileAction = shouldPlayFile ? () => audioService.playFile(newConfig.customFileBlobUrl!) : () => {};
        fileAction();
      },
      ambient: () => {
        const shouldPlayAmbient = !newConfig.isMuted && musicVol > 0;
        const ambientAction = shouldPlayAmbient ? () => audioService.playTrack(newConfig.activeTrack) : () => {};
        ambientAction();
      }
    };

    const strategyKey = newConfig.activeTrack === 'upload' ? 'upload' : 'ambient';
    
    trackStrategies[strategyKey]();
  }, []);

  const playTrack = useCallback((track: SoundTrack) => {
    updateConfig({ ...config, activeTrack: track });
  }, [config, updateConfig]);

  const setVolume = useCallback((type: 'music' | 'voice', value: number) => {
    const keyMap = {
      music: 'musicVolume',
      voice: 'voiceVolume'
    };
    updateConfig({ ...config, [keyMap[type]]: value, isMuted: false });
  }, [config, updateConfig]);

  const toggleMute = useCallback(() => {
    updateConfig({ ...config, isMuted: !config.isMuted });
  }, [config, updateConfig]);

  return (
    <AudioContext.Provider value={{ 
      config, 
      updateConfig, 
      playTrack, 
      setVolume, 
      toggleMute
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
