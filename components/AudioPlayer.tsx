'use client';

import { useState, useRef, useEffect } from 'react';

interface MelodyNote {
  freq: number;
  duration: number;
}

interface SectionMelody {
  landing: MelodyNote[];
  onboarding: MelodyNote[];
  archiving: MelodyNote[];
  gallery: MelodyNote[];
}

export function AudioPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.12);
  const [currentSection, setCurrentSection] = useState<keyof SectionMelody>('landing');
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const melodyGainRef = useRef<GainNode | null>(null);
  const activeOscillatorsRef = useRef<Array<OscillatorNode>>([]);
  const schedulerRafRef = useRef<number | null>(null);
  const lastScheduledTimeRef = useRef<number>(0);
  const currentMelodyRef = useRef<keyof SectionMelody>('landing');

  // Ethereal/cinematic melodies for each section
  const sectionMelodies: SectionMelody = {
    landing: [
      // Dreamy ascending progression - C minor scale
      { freq: 130.81, duration: 1.0 },  // C3
      { freq: 155.56, duration: 0.8 },  // D#3
      { freq: 174.61, duration: 0.8 },  // F3
      { freq: 196.0, duration: 1.0 },   // G3
      { freq: 174.61, duration: 0.8 },  // F3
      { freq: 155.56, duration: 0.8 },  // D#3
      { freq: 130.81, duration: 1.2 },  // C3
      { freq: 196.0, duration: 0.6 },   // G3
      { freq: 220.0, duration: 0.6 },   // A3
      { freq: 246.94, duration: 1.4 },  // B3
    ],
    onboarding: [
      // Ascending ethereal melody - A minor
      { freq: 220.0, duration: 0.6 },   // A3
      { freq: 246.94, duration: 0.6 },  // B3
      { freq: 261.63, duration: 0.6 },  // C4
      { freq: 293.66, duration: 0.8 },  // D4
      { freq: 329.63, duration: 1.0 },  // E4
      { freq: 293.66, duration: 0.6 },  // D4
      { freq: 261.63, duration: 0.6 },  // C4
      { freq: 246.94, duration: 0.8 },  // B3
      { freq: 220.0, duration: 1.2 },   // A3
      { freq: 261.63, duration: 0.8 },  // C4
    ],
    archiving: [
      // Contemplative progression - F major
      { freq: 174.61, duration: 0.8 },  // F3
      { freq: 196.0, duration: 0.8 },   // G3
      { freq: 220.0, duration: 0.7 },   // A3
      { freq: 246.94, duration: 0.9 },  // B3
      { freq: 261.63, duration: 1.1 },  // C4
      { freq: 246.94, duration: 0.7 },  // B3
      { freq: 220.0, duration: 0.8 },   // A3
      { freq: 196.0, duration: 1.0 },   // G3
      { freq: 174.61, duration: 1.2 },  // F3
      { freq: 220.0, duration: 0.8 },   // A3
    ],
    gallery: [
      // Cascading ethereal melody - G major
      { freq: 196.0, duration: 0.5 },   // G3
      { freq: 220.0, duration: 0.5 },   // A3
      { freq: 246.94, duration: 0.5 },  // B3
      { freq: 261.63, duration: 0.6 },  // C4
      { freq: 293.66, duration: 0.6 },  // D4
      { freq: 329.63, duration: 0.8 },  // E4
      { freq: 349.23, duration: 1.0 },  // F4
      { freq: 329.63, duration: 0.6 },  // E4
      { freq: 293.66, duration: 0.6 },  // D4
      { freq: 261.63, duration: 0.8 },  // C4
    ],
  };

  // Ambient pad frequencies for ethereal background
  const ambientFrequencies = [
    { freq: 87.31, duration: 4.0 },   // F2 bass pad
    { freq: 130.81, duration: 3.5 },  // C3 pad
    { freq: 196.0, duration: 3.0 },   // G3 pad
  ];

  const getTotalMelodyDuration = (melody: MelodyNote[]) => {
    return melody.reduce((sum, note) => sum + note.duration, 0);
  };

  const playNote = (
    frequency: number,
    duration: number,
    startTime: number,
    audioContext: AudioContext,
    gainNode: GainNode,
    isAmbient: boolean = false
  ) => {
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.frequency.value = frequency;
      osc.type = isAmbient ? 'triangle' : 'sine';

      // Connect: oscillator -> gain -> target gain node
      osc.connect(gain);
      gain.connect(gainNode);

      const now = startTime;

      if (isAmbient) {
        // Ambient pad envelope (very smooth)
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.3); // Slow attack
        gain.gain.setValueAtTime(0.15, now + duration - 0.3); // Sustain
        gain.gain.linearRampToValueAtTime(0, now + duration); // Slow release
      } else {
        // Melodic note envelope (ADSR)
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.04); // Attack
        gain.gain.linearRampToValueAtTime(0.18, now + 0.08); // Decay
        gain.gain.setValueAtTime(0.18, now + duration - 0.08); // Sustain
        gain.gain.linearRampToValueAtTime(0, now + duration); // Release
      }

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

    const currentMelody = sectionMelodies[currentMelodyRef.current];
    const melodyDuration = getTotalMelodyDuration(currentMelody);
    let noteTime = startTime;

    // Schedule melody notes
    while (noteTime < currentTime + SCHEDULE_AHEAD_TIME) {
      for (const note of currentMelody) {
        if (noteTime < currentTime + SCHEDULE_AHEAD_TIME) {
          playNote(note.freq, note.duration, noteTime, audioContext, melodyGainRef.current!, false);
          noteTime += note.duration;
        } else {
          break;
        }
      }
    }

    // Schedule ambient pads (looping independently)
    let ambientTime = startTime;
    while (ambientTime < currentTime + SCHEDULE_AHEAD_TIME) {
      for (const pad of ambientFrequencies) {
        if (ambientTime < currentTime + SCHEDULE_AHEAD_TIME) {
          playNote(pad.freq, pad.duration, ambientTime, audioContext, ambientGainRef.current!, true);
          ambientTime += pad.duration;
        } else {
          break;
        }
      }
    }

    lastScheduledTimeRef.current = noteTime;
  };

  // Detect which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollLeft = window.scrollX;
      const viewportWidth = window.innerWidth;
      const sectionIndex = Math.floor(scrollLeft / viewportWidth);

      const sections: Array<keyof SectionMelody> = ['landing', 'onboarding', 'archiving', 'gallery'];
      const newSection = sections[Math.min(sectionIndex, sections.length - 1)];

      if (newSection !== currentMelodyRef.current) {
        currentMelodyRef.current = newSection;
        setCurrentSection(newSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
