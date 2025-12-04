import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AudioConfig, SoundTrack } from "../types";
import { INITIAL_AUDIO_CONFIG } from "../constants";
import { audioService } from "../services/audioService";
import { ttsService } from "../services/ttsService";

interface AudioContextType {
  config: AudioConfig;
  updateConfig: (newConfig: AudioConfig) => void;
  playTrack: (track: SoundTrack) => void;
  setVolume: (type: "music" | "voice", value: number) => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<AudioConfig>(INITIAL_AUDIO_CONFIG);

  useEffect(() => {
    try {
      ttsService
        .init()
        .then(() => ttsService.resume())
        .catch(console.warn);
      audioService.warmup();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateConfig = useCallback((newConfig: AudioConfig) => {
    console.log("[AudioContext] updateConfig chamado:", newConfig);
    setConfig(newConfig);

    const musicVol = newConfig.isMuted ? 0 : newConfig.musicVolume;
    const sfxVol = newConfig.isMuted ? 0 : 0.5;
    const voiceVol = newConfig.isMuted ? 0 : newConfig.voiceVolume;

    console.log(
      `[AudioContext] Aplicando volumes - Música: ${musicVol}, SFX: ${sfxVol}, Voz: ${voiceVol}`
    );

    audioService.setMusicVolume(musicVol);
    audioService.setSfxVolume(sfxVol);
    ttsService.setVolume(voiceVol);

    const trackStrategies = {
      upload: async () => {
        console.log("[AudioContext] Estratégia upload");
        await audioService.playTrack("upload");
        const shouldPlayFile =
          newConfig.customFileBlobUrl && !newConfig.isMuted && musicVol > 0;
        if (shouldPlayFile) {
          await audioService.playFile(newConfig.customFileBlobUrl!);
        }
      },
      ambient: async () => {
        console.log("[AudioContext] Estratégia ambient");
        const shouldPlayAmbient = !newConfig.isMuted && musicVol > 0;
        if (shouldPlayAmbient) {
          await audioService.playTrack(newConfig.activeTrack);
        } else {
          audioService.stopMusic();
        }
      },
    };

    const strategyKey =
      newConfig.activeTrack === "upload" ? "upload" : "ambient";

    trackStrategies[strategyKey]();
  }, []);

  const playTrack = useCallback(
    (track: SoundTrack) => {
      updateConfig({ ...config, activeTrack: track });
    },
    [config, updateConfig]
  );

  const setVolume = useCallback(
    (type: "music" | "voice", value: number) => {
      console.log(
        `[AudioContext] setVolume chamado - tipo: ${type}, valor: ${value}`
      );
      const keyMap = {
        music: "musicVolume",
        voice: "voiceVolume",
      };
      updateConfig({ ...config, [keyMap[type]]: value, isMuted: false });
    },
    [config, updateConfig]
  );

  const toggleMute = useCallback(() => {
    updateConfig({ ...config, isMuted: !config.isMuted });
  }, [config, updateConfig]);

  return (
    <AudioContext.Provider
      value={{
        config,
        updateConfig,
        playTrack,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context)
    throw new Error("useAudio must be used within an AudioProvider");
  return context;
};
