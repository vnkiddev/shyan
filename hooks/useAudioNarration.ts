
import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioNarrationProps {
  url: string | null;
  autoPlay: boolean;
  onEnded: () => void;
}

export const useAudioNarration = ({ url, autoPlay, onEnded }: AudioNarrationProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!url) return;

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.muted = isMuted;
    setError(false);
    setProgress(0);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded();
    };
    const handleError = () => {
      console.warn(`Audio not found for ${url}`);
      setError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    if (autoPlay) {
      audio.play().catch(e => {
        console.warn("Autoplay blocked or failed", e);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, [url, autoPlay, onEnded]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || error) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  }, [isPlaying, error]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newVal = !prev;
      if (audioRef.current) audioRef.current.muted = newVal;
      return newVal;
    });
  }, []);

  const replay = useCallback(() => {
    if (!audioRef.current || error) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(console.error);
  }, [error]);

  return {
    isPlaying,
    progress,
    error,
    isMuted,
    togglePlay,
    toggleMute,
    replay
  };
};
