import React, { useEffect, useRef, useState } from 'react';

interface YouTubeAudioProps {
  videoId: string;
  volume: number; 
  isMuted: boolean;
  isPlaying: boolean;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export const YouTubeAudio: React.FC<YouTubeAudioProps> = ({ 
  videoId, 
  volume, 
  isMuted, 
  isPlaying, 
  onError,
  onSuccess 
}) => {
  const playerRef = useRef<any>(null);
  const [apiReady, setApiReady] = useState(false);
  const containerId = 'youtube-audio-player';

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
    } else if (window.YT && window.YT.Player) {
      setApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (!apiReady || !videoId) return;

    const onPlayerReady = (event: any) => {
      event.target.setVolume(isMuted ? 0 : volume * 100);
      if (isMuted) event.target.mute();
      else event.target.unMute();
      
      if (isPlaying) {
        event.target.playVideo();
      }
    };

    const onPlayerStateChange = (event: any) => {
      if (event.data === 1 && onSuccess) {
        onSuccess();
      }
      if (event.data === 0 && isPlaying) {
        event.target.playVideo();
      }
    };

    const onPlayerError = (event: any) => {
      let errorMsg = "Erro ao carregar vídeo.";
      const code = Number(event.data);
      
      if (code === 150 || code === 101 || code === 153) {
        errorMsg = "Bloqueado pelo autor. Tente uma versão 'Lyric Video' (com letra).";
        if (playerRef.current && typeof playerRef.current.stopVideo === 'function') {
            playerRef.current.stopVideo();
        }
      } else if (code === 2) {
        errorMsg = "ID do vídeo inválido.";
      } else if (code === 5) {
        errorMsg = "Erro de HTML5 no player.";
      } else if (code === 100) {
        errorMsg = "Vídeo não encontrado ou privado.";
      }
      
      console.warn(`YouTube Player Error ${code}: ${errorMsg}`);
      if (onError) onError(errorMsg);
    };

    if (!playerRef.current) {
      try {
        const originUrl = window.location.origin;
        
        playerRef.current = new window.YT.Player(containerId, {
          height: '1',
          width: '1',
          videoId: videoId,
          host: 'https://www.youtube.com',
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
            origin: originUrl,
            widget_referrer: originUrl, 
            iv_load_policy: 3 
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
          },
        });
      } catch (e) {
        console.error("Falha ao criar player do YouTube", e);
      }
    } else {
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        try {
          playerRef.current.loadVideoById({
            videoId: videoId,
            startSeconds: 0
          });
        } catch (e) {
          console.error("Erro ao carregar vídeo no player existente", e);
        }
      }
    }
  }, [apiReady, videoId]); 

  useEffect(() => {
    if (!playerRef.current || typeof playerRef.current.setVolume !== 'function') return;

    try {
      playerRef.current.setVolume(isMuted ? 0 : volume * 100);
      
      if (isMuted) playerRef.current.mute();
      else playerRef.current.unMute();

      const state = typeof playerRef.current.getPlayerState === 'function' 
        ? playerRef.current.getPlayerState() 
        : -1;

      if (isPlaying) {
        if (state !== 1 && state !== 3) { 
          playerRef.current.playVideo();
        }
      } else {
        if (state === 1) {
          playerRef.current.pauseVideo();
        }
      }
    } catch (e) {
    }
  }, [volume, isMuted, isPlaying]);

  return (
    <div 
      id={containerId} 
      className="fixed bottom-0 right-0 opacity-0 pointer-events-none z-[-1]"
      style={{ width: '1px', height: '1px' }} 
      aria-hidden="true"
    />
  );
};