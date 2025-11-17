'use client';

import { useState, useRef, useEffect } from 'react';

export function AudioPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const masterGainRef = useRef<GainNode | null>(null);
  const notesQueueRef = useRef<Array<{ freq: number; duration: number }>>([]);
  const isSchedulingRef = useRef(false);

  const melodyNotes = [
    { freq: 261.63, duration: 0.5 },  // C4
    { freq: 329.63, duration: 0.5 },  // E4
    { freq: 392.0, duration: 0.5 },   // G4
    { freq: 440.0, duration: 0.7 },   // A4
    { freq: 392.0, duration: 0.5 },   // G4
    { freq: 329.63, duration: 0.5 },  // E4
    { freq: 261.63, duration: 0.5 },  // C4
    { freq: 220.0, duration: 0.7 },   // A3
    { freq: 246.94, duration: 0.5 },  // B3
    { freq: 261.63, duration: 1.0 },  // C4
  ];

  const playNote = (
    frequency: number,
    duration: number,
    startTime: number,
    audioContext: AudioContext
  ) => {
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.frequency.value = frequency;
      osc.type = 'sine';

      // Connect: oscillator -> gain -> master gain -> destination
      osc.connect(gain);
      gain.connect(masterGainRef.current!);

      // Envelope (ADSR)
      const now = startTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
      gain.gain.linearRampToValueAtTime(0.2, now + 0.1);  // Decay
      gain.gain.setValueAtTime(0.2, now + duration - 0.1); // Sustain
      gain.gain.linearRampToValueAtTime(0, now + duration); // Release

      osc.start(now);
      osc.stop(now + duration);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  };

  const scheduleAllNotes = (audioContext: AudioContext) => {
    if (isSchedulingRef.current) return;
    isSchedulingRef.current = true;

    try {
      let currentTime = audioContext.currentTime;

      // Schedule melody 3 times in advance
      for (let loop = 0; loop < 3; loop++) {
        for (const note of melodyNotes) {
          playNote(note.freq, note.duration, currentTime, audioContext);
          currentTime += note.duration;
        }
      }
    } catch (error) {
      console.error('Error scheduling notes:', error);
    }

    isSchedulingRef.current = false;
  };

  const startAudio = () => {
    try {
      console.log('Starting audio...');

      let audioContext = audioContextRef.current;

      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        console.log('Created new AudioContext');
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => console.log('Audio context resumed'));
      }

      // Create master gain if needed
      if (!masterGainRef.current) {
        masterGainRef.current = audioContext.createGain();
        masterGainRef.current.connect(audioContext.destination);
        console.log('Created master gain');
      }

      masterGainRef.current.gain.value = volume;

      // Schedule notes
      scheduleAllNotes(audioContext);
      console.log('Notes scheduled');

      setIsPlaying(true);
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const stopAudio = () => {
    try {
      setIsPlaying(false);
      console.log('Audio stopped');
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      const clampedVolume = Math.max(0, Math.min(0.3, volume));
      masterGainRef.current.gain.value = clampedVolume;
      console.log('Volume set to:', clampedVolume);
    }
  }, [volume]);

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Auto-starting audio on mount');
      startAudio();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-40 flex items-center gap-4 backdrop-blur-xl bg-black/40 border border-cyan-500/50 rounded-full px-6 py-3 hover:border-cyan-400 transition-all">
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

      {isPlaying && (
        <>
          <input
            type="range"
            min="0"
            max="0.3"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-cyan-500/30 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00D4FF 0%, #00D4FF ${(volume / 0.3) * 100}%, rgba(0, 212, 255, 0.2) ${(volume / 0.3) * 100}%, rgba(0, 212, 255, 0.2) 100%)`,
            }}
          />

          <span className="text-cyan-400/80 text-xs font-light whitespace-nowrap">
            {Math.round((volume / 0.3) * 100)}%
          </span>
        </>
      )}
    </div>
  );
}
