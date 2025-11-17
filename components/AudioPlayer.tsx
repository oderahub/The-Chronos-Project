'use client';

import { useState, useRef, useEffect } from 'react';

export function AudioPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const masterGainRef = useRef<GainNode | null>(null);
  const schedulerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef<number>(0);

  // Musical scale in Hz (C minor pentatonic)
  const melodyNotes = [
    130.81, // C3
    146.83, // D3
    164.81, // E3
    196.0,  // G3
    220.0,  // A3
    246.94, // B3
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.0,  // G4
    440.0,  // A4
  ];

  // Melodic sequence pattern
  const melody = [
    { note: 6, duration: 0.5 },
    { note: 8, duration: 0.35 },
    { note: 10, duration: 0.7 },
    { note: 8, duration: 0.35 },
    { note: 6, duration: 0.5 },
    { note: 4, duration: 0.7 },
    { note: 5, duration: 0.5 },
    { note: 6, duration: 0.9 },
    { note: 7, duration: 0.35 },
    { note: 8, duration: 0.5 },
    { note: 9, duration: 0.7 },
    { note: 10, duration: 0.7 },
    { note: 8, duration: 0.5 },
    { note: 6, duration: 1.0 },
  ];

  const playNote = (frequency: number, duration: number, audioContext: AudioContext) => {
    const now = audioContext.currentTime;
    const envelope = audioContext.createGain();

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);

    // ADSR envelope
    const attackTime = 0.05;
    const decayTime = 0.08;
    const sustainLevel = 0.6;
    const releaseTime = 0.15;
    const totalDuration = duration;

    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.75, now + attackTime);
    envelope.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
    envelope.gain.setValueAtTime(sustainLevel, now + totalDuration - releaseTime);
    envelope.gain.linearRampToValueAtTime(0, now + totalDuration);

    oscillator.connect(envelope);
    envelope.connect(masterGainRef.current!);

    oscillator.start(now);
    oscillator.stop(now + totalDuration);
  };

  const scheduleNotes = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext || !isPlaying) return;

    const scheduleAheadTime = 0.1; // Schedule 100ms ahead
    const lookAhead = 25.0; // Look ahead 25ms

    while (nextNoteTimeRef.current < audioContext.currentTime + scheduleAheadTime) {
      const noteIndex = Math.floor(nextNoteTimeRef.current * 2) % melody.length;
      const note = melody[noteIndex];
      const frequency = melodyNotes[note.note];

      playNote(frequency, note.duration, audioContext);
      nextNoteTimeRef.current += note.duration;
    }

    schedulerRef.current = requestAnimationFrame(scheduleNotes);
  };

  const startAudio = () => {
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      if (!masterGainRef.current) {
        masterGainRef.current = audioContext.createGain();
        masterGainRef.current.connect(audioContext.destination);
        masterGainRef.current.gain.value = volume;
      }

      nextNoteTimeRef.current = audioContext.currentTime;
      setIsPlaying(true);
      scheduleNotes();
    } catch (error) {
      console.error('Audio context error:', error);
    }
  };

  const stopAudio = () => {
    try {
      if (schedulerRef.current) {
        cancelAnimationFrame(schedulerRef.current);
        schedulerRef.current = null;
      }
      setIsPlaying(false);
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
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = Math.max(0, Math.min(0.2, volume));
    }
  }, [volume]);

  // Auto-play on mount
  useEffect(() => {
    startAudio();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (schedulerRef.current) {
        cancelAnimationFrame(schedulerRef.current);
      }
    };
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
            max="0.2"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-cyan-500/30 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00D4FF 0%, #00D4FF ${(volume / 0.2) * 100}%, rgba(0, 212, 255, 0.2) ${(volume / 0.2) * 100}%, rgba(0, 212, 255, 0.2) 100%)`,
            }}
          />

          <span className="text-cyan-400/80 text-xs font-light whitespace-nowrap">
            {Math.round((volume / 0.2) * 100)}%
          </span>
        </>
      )}
    </div>
  );
}
