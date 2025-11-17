'use client';

import { useState, useRef, useEffect } from 'react';

export function AudioPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainsRef = useRef<GainNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.08);
  const masterGainRef = useRef<GainNode | null>(null);
  const currentNoteRef = useRef<number>(0);
  const noteSchedulerRef = useRef<NodeJS.Timeout | null>(null);

  // Musical scale in Hz (C minor pentatonic - creates a haunting, emotional melody)
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
    { note: 6, duration: 0.6 },   // C4
    { note: 8, duration: 0.4 },   // E4
    { note: 10, duration: 0.8 },  // A4
    { note: 8, duration: 0.4 },   // E4
    { note: 6, duration: 0.6 },   // C4
    { note: 4, duration: 0.8 },   // A3
    { note: 5, duration: 0.6 },   // B3
    { note: 6, duration: 1.0 },   // C4
    { note: 7, duration: 0.4 },   // D4
    { note: 8, duration: 0.6 },   // E4
    { note: 9, duration: 0.8 },   // G4
    { note: 10, duration: 0.8 },  // A4
    { note: 8, duration: 0.6 },   // E4
    { note: 6, duration: 1.2 },   // C4 (longer note)
  ];

  const playNote = (frequency: number, duration: number) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const envelope = audioContext.createGain();

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // ADSR envelope for more musical sound
    const attackTime = 0.05;
    const decayTime = 0.1;
    const sustainLevel = 0.6;
    const releaseTime = 0.2;

    // Attack
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.7, now + attackTime);

    // Decay to sustain
    envelope.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);

    // Sustain (held at sustainLevel)
    envelope.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);

    // Release
    envelope.gain.linearRampToValueAtTime(0, now + duration);

    oscillator.connect(envelope);
    envelope.connect(masterGainRef.current!);

    oscillator.start(now);
    oscillator.stop(now + duration);

    oscillatorsRef.current.push(oscillator);
    gainsRef.current.push(envelope);
  };

  const playMelody = () => {
    if (!isPlaying) return;

    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const melodyStep = melody[currentNoteRef.current % melody.length];
    const frequency = melodyNotes[melodyStep.note];

    playNote(frequency, melodyStep.duration);

    // Schedule next note
    const nextDelay = melodyStep.duration * 1000;
    noteSchedulerRef.current = setTimeout(() => {
      currentNoteRef.current += 1;
      playMelody();
    }, nextDelay);
  };

  const startAudio = () => {
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create master gain
      if (!masterGainRef.current) {
        masterGainRef.current = audioContext.createGain();
        masterGainRef.current.connect(audioContext.destination);
        masterGainRef.current.gain.value = volume;
      }

      setIsPlaying(true);
      currentNoteRef.current = 0;
      playMelody();
    } catch (error) {
      console.error('Audio context error:', error);
    }
  };

  const stopAudio = () => {
    try {
      if (noteSchedulerRef.current) {
        clearTimeout(noteSchedulerRef.current);
        noteSchedulerRef.current = null;
      }

      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      oscillatorsRef.current = [];
      gainsRef.current = [];
      setIsPlaying(false);
      currentNoteRef.current = 0;
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
      masterGainRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  // Auto-play on mount
  useEffect(() => {
    startAudio();
  }, []);

  useEffect(() => {
    return () => {
      if (isPlaying) {
        stopAudio();
      }
    };
  }, [isPlaying]);

  return (
    <div className="fixed bottom-8 left-8 z-40 flex items-center gap-4 backdrop-blur-xl bg-black/40 border border-cyan-500/50 rounded-full px-6 py-3 hover:border-cyan-400 transition-all">
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
            max="0.2"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-cyan-500/30 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00D4FF 0%, #00D4FF ${(volume / 0.2) * 100}%, rgba(0, 212, 255, 0.2) ${(volume / 0.2) * 100}%, rgba(0, 212, 255, 0.2) 100%)`,
            }}
          />

          {/* Volume Label */}
          <span className="text-cyan-400/80 text-xs font-light whitespace-nowrap">
            {Math.round((volume / 0.2) * 100)}%
          </span>
        </>
      )}
    </div>
  );
}
