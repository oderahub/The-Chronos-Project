'use client';

import { useState, useRef, useEffect } from 'react';

export function AudioPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeOscillatorsRef = useRef<Array<OscillatorNode>>([]);
  const schedulerRafRef = useRef<number | null>(null);
  const lastScheduledTimeRef = useRef<number>(0);

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

  const getTotalMelodyDuration = () => {
    return melodyNotes.reduce((sum, note) => sum + note.duration, 0);
  };

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

      activeOscillatorsRef.current.push(osc);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  };

  const scheduleNotesAhead = (audioContext: AudioContext) => {
    const SCHEDULE_AHEAD_TIME = 0.5; // Schedule 500ms ahead
    const currentTime = audioContext.currentTime;
    let startTime = lastScheduledTimeRef.current;

    if (startTime < currentTime) {
      startTime = currentTime + 0.01; // Start slightly in the future
    }

    const melodyDuration = getTotalMelodyDuration();
    let noteTime = startTime;

    // Schedule notes while we're within the lookahead window
    while (noteTime < currentTime + SCHEDULE_AHEAD_TIME) {
      for (const note of melodyNotes) {
        if (noteTime < currentTime + SCHEDULE_AHEAD_TIME) {
          playNote(note.freq, note.duration, noteTime, audioContext);
          noteTime += note.duration;
        } else {
          break;
        }
      }
    }

    lastScheduledTimeRef.current = noteTime;
  };

  const startAudio = () => {
    try {
      let audioContext = audioContextRef.current;

      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create master gain if needed
      if (!masterGainRef.current) {
        masterGainRef.current = audioContext.createGain();
        masterGainRef.current.connect(audioContext.destination);
      }

      masterGainRef.current.gain.value = volume;

      // Reset scheduling
      lastScheduledTimeRef.current = audioContext.currentTime;
      activeOscillatorsRef.current = [];

      // Start the scheduler
      const scheduler = () => {
        if (audioContextRef.current) {
          scheduleNotesAhead(audioContextRef.current);
          schedulerRafRef.current = requestAnimationFrame(scheduler);
        }
      };

      schedulerRafRef.current = requestAnimationFrame(scheduler);
      setIsPlaying(true);
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const stopAudio = () => {
    try {
      // Cancel the scheduler
      if (schedulerRafRef.current) {
        cancelAnimationFrame(schedulerRafRef.current);
        schedulerRafRef.current = null;
      }

      // Stop all active oscillators
      activeOscillatorsRef.current.forEach(osc => {
        try {
          osc.stop(0);
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      activeOscillatorsRef.current = [];

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
    if (masterGainRef.current && audioContextRef.current) {
      const clampedVolume = Math.max(0, Math.min(0.3, volume));
      masterGainRef.current.gain.value = clampedVolume;
    }
  }, [volume]);

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startAudio();
    }, 500);

    return () => {
      clearTimeout(timer);
      stopAudio();
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
