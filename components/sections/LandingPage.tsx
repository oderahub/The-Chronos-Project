'use client';

import { useState, useEffect } from 'react';

function ARCornerBracket({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positionClasses = {
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'bottom-right': 'bottom-8 right-8',
  };

  const rotationClasses = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': 'rotate-270',
  };

  return (
    <div className={`absolute ${positionClasses[position]} w-10 h-10 opacity-60 group-hover:opacity-100 transition-opacity`}>
      <div className={`w-full h-full border-2 border-pulse ${rotationClasses[position]} origin-top-left`} />
    </div>
  );
}

function GridOverlay() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 2) % 40);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 opacity-5 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 122, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 122, 255, 0.08) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: `0px ${offset}px`,
      }}
    />
  );
}

function NavigationBar() {
  const handleNavClick = () => {
    window.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 py-6 px-8 animate-rise">
      <div className="mx-auto max-w-7xl">
        <div className="backdrop-blur-xl bg-black/20 border border-pulse/30 rounded-full px-8 py-4 flex items-center justify-between shadow-2xl hover:border-pulse/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-pulse flex items-center justify-center">
              <span className="text-pulse font-light text-lg">◆</span>
            </div>
            <span className="type-micro text-frost tracking-widest hidden sm:inline">CHRONOS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="type-body text-ash/80 hover:text-pulse transition-colors text-sm font-light">
              Fragments
            </a>
            <a href="#" className="type-body text-ash/80 hover:text-pulse transition-colors text-sm font-light">
              Archive
            </a>
            <a href="#" className="type-body text-ash/80 hover:text-pulse transition-colors text-sm font-light">
              Loom
            </a>
          </div>

          <button
            onClick={handleNavClick}
            className="px-6 py-2 border border-pulse text-pulse type-body text-sm font-light hover:bg-pulse/10 transition-all hover:shadow-lg shadow-pulse/20"
          >
            Enter
          </button>
        </div>
      </div>
    </nav>
  );
}

export function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMousePosition({
        x: (clientX - centerX) * 0.025,
        y: (clientY - centerY) * 0.025,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleBeginArchiving = () => {
    window.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
  };

  return (
    <section className="w-screen h-screen relative overflow-hidden bg-void group">
      {/* Cinematic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-void via-ink/50 to-graphite" />

      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-35"
      >
        <source src="https://videos.pexels.com/video-files/7578535/7578535-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Dramatic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-pulse/5 via-transparent to-void/30 pointer-events-none" />

      {/* Grid Overlay */}
      <GridOverlay />

      {/* Dynamic Light Rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pulse/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pulse/5 rounded-full blur-3xl opacity-15" />
      </div>

      {/* AR Corner Brackets */}
      <ARCornerBracket position="top-left" />
      <ARCornerBracket position="top-right" />
      <ARCornerBracket position="bottom-left" />
      <ARCornerBracket position="bottom-right" />

      {/* Navigation Bar */}
      <NavigationBar />

      {/* Hero Section */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Narrative Callout - Top */}
        <div className="absolute top-1/4 text-center animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.2s forwards' }}>
          <p className="type-micro text-pulse/80 tracking-widest mb-4">ENTER THE GLITCH</p>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-pulse/50 to-transparent mx-auto" />
        </div>

        {/* Main Hero Text */}
        <div
          className="transition-transform duration-150 ease-out text-center animate-rise opacity-0"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            animation: 'rise 1s ease-out 0.4s forwards',
          }}
        >
          <h1
            className="text-frost font-extralight leading-tight"
            style={{
              fontSize: 'clamp(80px, 14vw, 220px)',
              letterSpacing: '-0.03em',
              textShadow: '0 20px 40px rgba(0, 122, 255, 0.15), 0 0 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            FRAGMENTED<br />REALITY
          </h1>
        </div>

        {/* Narrative Description */}
        <div className="absolute bottom-1/3 max-w-lg text-center animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.6s forwards' }}>
          <p className="type-headline text-frost/90 leading-relaxed font-light">
            Reality is fragmenting. Time is breaking. You are tasked to preserve what remains—echoes of consciousness trapped in the glitch.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 px-8 py-12 z-20">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          {/* Left - Narrative Block */}
          <div className="animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.7s forwards' }}>
            <p className="type-micro text-pulse/60 tracking-widest mb-3">CHRONICLE 01</p>
            <h2 className="type-display text-frost/80 font-light text-3xl" style={{ letterSpacing: '-0.02em' }}>THE ARCHIVE</h2>
            <p className="type-body text-ash/70 mt-2 max-w-xs text-sm">Where broken moments become eternal.</p>
          </div>

          {/* Right - Glass Card CTA */}
          <div className="animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.8s forwards' }}>
            <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 to-black/20 border border-pulse/40 rounded-2xl px-8 py-6 flex flex-col gap-4 shadow-2xl hover:border-pulse/60 hover:shadow-pulse/20 transition-all">
              <div>
                <p className="type-micro text-pulse/60 tracking-widest mb-2">SEASON</p>
                <p className="type-headline text-frost/90 font-light">WINTER '24</p>
              </div>
              <button
                onClick={handleBeginArchiving}
                className="px-6 py-3 border border-pulse text-pulse type-body font-light hover:bg-pulse/20 transition-all hover:shadow-lg shadow-pulse/30 text-sm group relative overflow-hidden"
              >
                <span className="relative flex items-center justify-center gap-2">
                  BEGIN ARCHIVING →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse z-20">
        <div className="flex flex-col items-center gap-2">
          <p className="type-micro text-ash/50 tracking-widest">SCROLL</p>
          <svg className="w-4 h-6 text-pulse/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
