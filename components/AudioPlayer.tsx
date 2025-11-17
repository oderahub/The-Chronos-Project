'use client';

import { useState, useRef, useEffect } from 'react';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [error, setError] = useState('');

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.load();
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setError('');
            })
            .catch((err) => {
              console.error('Audio play error:', err);
              setError('Audio unavailable');
              setIsPlaying(false);
            });
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Audio error');
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-40 flex items-center gap-4 backdrop-blur-xl bg-black/40 border border-cyan-500/50 rounded-full px-6 py-3 hover:border-cyan-400 transition-all">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        crossOrigin="anonymous"
        preload="auto"
        onCanPlay={() => setError('')}
        onError={() => setError('Audio unavailable')}
      >
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        <source src="https://assets.mixkit.co/active_storage/musics/677-ethereal-ambient-106.mp3" type="audio/mpeg" />
      </audio>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className={`transition-all ${
          isPlaying
            ? 'text-cyan-400 drop-shadow-lg drop-shadow-cyan-500/50'
            : 'text-cyan-500/60 hover:text-cyan-400'
        }`}
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
      {isPlaying && (
        <>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-cyan-500/30 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00D4FF 0%, #00D4FF ${volume * 100}%, rgba(0, 212, 255, 0.2) ${volume * 100}%, rgba(0, 212, 255, 0.2) 100%)`,
            }}
          />

          {/* Volume Label */}
          <span className="text-cyan-400/80 text-xs font-light whitespace-nowrap">
            {Math.round(volume * 100)}%
          </span>
        </>
      )}
    </div>
  );
}
