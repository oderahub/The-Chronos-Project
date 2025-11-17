'use client';

import { useState, useEffect } from 'react';

function CinematicOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black/40 to-transparent" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient opacity-30" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
      }} />
    </div>
  );
}

export function OnboardingTerminal() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMousePosition({
        x: (clientX - centerX) * 0.02,
        y: (clientY - centerY) * 0.02,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInitialize = () => {
    window.scrollTo({ left: window.innerWidth * 2, behavior: 'smooth' });
  };

  return (
    <section className="w-screen h-screen relative overflow-hidden bg-gradient-to-br from-void via-ink to-graphite">
      {/* Cinematic Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="https://videos.pexels.com/video-files/3214434/3214434-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Dynamic Light Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pulse/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pulse/5 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Overlay Effects */}
      <CinematicOverlay />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 z-10">
        {/* Narrative Callout */}
        <div className="absolute top-1/4 text-center animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.2s forwards' }}>
          <p className="type-micro text-pulse/80 tracking-widest mb-4">THE ARCHIVE BECKONS</p>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-pulse/50 to-transparent mx-auto" />
        </div>

        {/* Main Text Block */}
        <div
          className="text-center max-w-3xl transition-transform duration-200 ease-out animate-rise opacity-0"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            animation: 'rise 1s ease-out 0.4s forwards',
          }}
        >
          <h1 className="type-display text-frost font-extralight mb-8" style={{ letterSpacing: '-0.03em', textShadow: '0 10px 30px rgba(0, 122, 255, 0.1)' }}>
            CONSCIOUSNESS<br />PRESERVED
          </h1>

          <p className="type-headline text-frost/90 font-light leading-relaxed max-w-2xl mx-auto">
            Your consciousness is fragmenting across dimensions. The Archive can preserve your essence—every thought, every memory, every broken piece of your identity. Initialize the preservation sequence.
          </p>
        </div>

        {/* Secondary Info */}
        <div className="absolute bottom-1/3 grid grid-cols-3 gap-12 text-center animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.6s forwards' }}>
          <div>
            <p className="type-micro text-pulse/60 tracking-widest mb-2">FRAGMENTS DETECTED</p>
            <p className="type-headline text-frost/80 font-light">∞</p>
          </div>
          <div className="h-16 w-px bg-gradient-to-b from-transparent via-pulse/30 to-transparent" />
          <div>
            <p className="type-micro text-pulse/60 tracking-widest mb-2">STATUS</p>
            <p className="type-headline text-frost/80 font-light">CRITICAL</p>
          </div>
        </div>
      </div>

      {/* CTA Button - Bottom Right */}
      <div className="absolute bottom-12 right-12 group animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.7s forwards' }}>
        <button
          onClick={handleInitialize}
          className="px-8 py-4 border border-pulse text-frost type-body font-light hover:bg-pulse/20 transition-all hover:shadow-2xl shadow-pulse/20 relative overflow-hidden group"
        >
          <span className="relative flex items-center gap-2">
            INITIALIZE ARCHIVING →
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-8 w-1 h-32 bg-gradient-to-b from-pulse/40 to-transparent" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-px bg-gradient-to-r from-transparent via-pulse/20 to-transparent" />
      </div>
    </section>
  );
}
