'use client';

import { useState, useRef, useEffect } from 'react';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && hasInteracted) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error('Audio play error:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, hasInteracted]);

  const togglePlayPause = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-40 flex items-center gap-4 backdrop-blur-xl bg-black/40 border border-pulse/30 rounded-full px-6 py-3">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        crossOrigin="anonymous"
      >
        <source src="https://assets.mixkit.co/active_storage/musics/677-ethereal-ambient-106.mp3" type="audio/mpeg" />
      </audio>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="text-pulse hover:text-pulse/80 transition-colors"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        )}
      </button>

      {/* Volume Slider */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-20 h-1 bg-pulse/30 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #007AFF 0%, #007AFF ${volume * 100}%, rgba(0, 122, 255, 0.2) ${volume * 100}%, rgba(0, 122, 255, 0.2) 100%)`,
        }}
      />

      {/* Volume Label */}
      <span className="text-pulse/60 text-xs font-light whitespace-nowrap">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}
