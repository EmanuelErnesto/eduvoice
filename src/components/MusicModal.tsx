import React, { useState, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { SoundTrack } from "@/types";

interface MusicModalProps {
  isOpen: boolean;
}

export const MusicModal: React.FC<MusicModalProps> = ({ isOpen }) => {
  const { config, updateConfig, setVolume } = useAudio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Sync uploaded filename with config
  React.useEffect(() => {
    if (config.customFileName) {
      setUploadedFileName(config.customFileName);
    }
  }, [config.customFileName]);

  const musicOptions: Array<{ id: SoundTrack; label: string; icon: string }> = [
    { id: "voz-violao", label: "Voz e Violão", icon: "🎤" },
    { id: "violao-background", label: "Violão Background", icon: "🎸" },
    { id: "upload", label: "Upload", icon: "📁" },
  ];

  const handleOptionSelect = (track: SoundTrack) => {
    console.log("[MusicModal] Selecionando track:", track);
    if (track === "upload" && !config.customFileBlobUrl) {
      fileInputRef.current?.click();
      return;
    }
    // Force update even if same track to ensure playback
    updateConfig({ ...config, activeTrack: track });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("[MusicModal] Upload de arquivo:", file.name);
      const blobUrl = URL.createObjectURL(file);
      setUploadedFileName(file.name);
      updateConfig({
        ...config,
        activeTrack: "upload",
        customFileBlobUrl: blobUrl,
        customFileName: file.name,
      });
    }
  };

  return (
    <div
      className={`fixed top-24 sm:top-[5.5rem] right-16 sm:right-20 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 w-80 p-4 z-40 transition-all duration-300 ${
        isOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-[400px] opacity-0 pointer-events-none"
      }`}
    >
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span className="text-lg">🎵</span>
          Música de Fundo
        </h3>
        <div className="grid gap-2">
          {musicOptions.map((option) => {
            const isActive = config.activeTrack === option.id;
            const showFileName = option.id === "upload" && uploadedFileName;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`
                  relative p-3 rounded-lg border transition-all duration-200 text-left
                  ${
                    isActive
                      ? "border-indigo-500 bg-indigo-500/20 shadow-md shadow-indigo-500/10"
                      : "border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">
                      {option.label}
                    </div>
                    {showFileName && (
                      <div className="text-xs text-slate-400 mt-0.5 truncate">
                        {uploadedFileName}
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="space-y-3 pt-3 mt-3 border-t border-slate-700">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <span>🔊</span>
              Narrador
            </label>
            <span className="text-xs font-bold text-indigo-400">
              {Math.round(config.voiceVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={config.voiceVolume * 100}
            onChange={(e) => {
              const newVolume = Number(e.target.value) / 100;
              console.log(
                "[MusicModal] Ajustando volume da voz para:",
                newVolume
              );
              setVolume("voice", newVolume);
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${
                config.voiceVolume * 100
              }%, #334155 ${config.voiceVolume * 100}%, #334155 100%)`,
            }}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <span>🎵</span>
              Música
            </label>
            <span className="text-xs font-bold text-indigo-400">
              {Math.round(config.musicVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={config.musicVolume * 100}
            onChange={(e) => setVolume("music", Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${
                config.musicVolume * 100
              }%, #334155 ${config.musicVolume * 100}%, #334155 100%)`,
            }}
          />
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: #6366f1;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(99, 102, 241, 0.5);
        }

        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #6366f1;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 6px rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};
