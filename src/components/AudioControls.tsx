
import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { SoundTrack } from '../types';

export const AudioControls: React.FC = () => {
  const { config, updateConfig, toggleMute, setVolume, playTrack } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume('music', parseFloat(e.target.value));
  };

  const handleVoiceVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume('voice', parseFloat(e.target.value));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (!file.type.startsWith('audio/')) {
            setLocalError("Apenas arquivos de áudio são permitidos.");
            return;
        }
        setLocalError(null);
        const url = URL.createObjectURL(file);
        updateConfig({ 
            ...config, 
            activeTrack: 'upload', 
            customFileBlobUrl: url,
            customFileName: file.name
        });
    }
  };

  return (
    <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50 flex flex-col items-end" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 bg-slate-800/80 backdrop-blur p-2 md:p-2.5 rounded-full border border-slate-700 shadow-xl transition-all duration-200 hover:bg-slate-700 ${isOpen ? 'ring-2 ring-indigo-500' : ''}`}
        aria-label="Configurações de Áudio"
      >
        <span className="p-0.5 md:p-1">
          {config.isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          )}
        </span>
        {!config.isMuted && (
          <div className="flex space-x-0.5 h-3 items-end px-1">
            {[1,2,3].map(i => (
               <div key={i} className="w-1 bg-indigo-500 animate-pulse rounded-sm" style={{height: `${Math.random() * 100}%`, animationDuration: '0.8s'}} />
            ))}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="mt-3 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-4 w-[calc(100vw-2rem)] max-w-[320px] md:w-80 animate-fade-in-down origin-top-right mr-0">
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Áudio Mixer</span>
            <button onClick={toggleMute} className="text-xs text-indigo-400 hover:text-white transition-colors">
              {config.isMuted ? 'Desmutar Tudo' : 'Mutar Tudo'}
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Trilha Sonora</span>
                <span>{Math.round(config.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.musicVolume}
                onChange={handleMusicVolumeChange}
                disabled={config.isMuted}
                className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Narrador (IA)</span>
                <span>{Math.round(config.voiceVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.voiceVolume}
                onChange={handleVoiceVolumeChange}
                disabled={config.isMuted}
                className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
              />
            </div>

            <div className="pt-2 border-t border-slate-700">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ambiente</span>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { id: 'cosmos', label: 'Cosmos' },
                  { id: 'zen', label: 'Zen' },
                  { id: 'focus', label: 'Foco' },
                  { id: 'upload', label: 'Arquivo' }
                ].map((track) => (
                  <button
                    key={track.id}
                    onClick={() => playTrack(track.id as SoundTrack)}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                      config.activeTrack === track.id
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>

              <div className="min-h-[40px] animate-fade-in">
                {config.activeTrack === 'upload' && (
                    <div className="flex flex-col space-y-2">
                         <input 
                            type="file" 
                            accept="audio/*" 
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                         />
                         
                         <div className="flex items-center gap-2">
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 border-dashed text-slate-300 text-xs py-3 px-3 rounded-lg transition-all hover:border-indigo-500 hover:text-white flex items-center justify-center gap-2"
                             >
                                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                 {config.customFileName ? 'Trocar Arquivo' : 'Escolher Áudio (MP3/WAV)'}
                             </button>
                         </div>

                         {config.customFileName && (
                             <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded flex items-center justify-between">
                                 <div className="truncate max-w-[180px]">
                                     ♫ {config.customFileName}
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                     <span>Pronto</span>
                                 </div>
                             </div>
                         )}
                    </div>
                )}
              </div>
               
               {localError && config.activeTrack === 'upload' && (
                     <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-md">
                        <div className="text-[10px] text-red-400 text-center font-medium animate-pulse">
                          {localError}
                        </div>
                     </div>
               )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
