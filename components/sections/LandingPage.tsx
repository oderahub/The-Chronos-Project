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
    <div className={`absolute ${positionClasses[position]} w-10 h-10 opacity-40`}>
      <div className={`w-full h-full border-2 border-pulse/50 ${rotationClasses[position]}`} />
    </div>
  );
}

function NavigationBar() {
  const handleNavClick = () => {
    window.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 py-6 px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-pulse flex items-center justify-center">
              <span className="text-pulse font-light">◆</span>
            </div>
            <span className="type-micro text-frost tracking-widest hidden sm:inline">CHRONOS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="type-body text-ash/70 hover:text-frost transition-colors text-sm font-light">
              Fragments
            </a>
            <a href="#" className="type-body text-ash/70 hover:text-frost transition-colors text-sm font-light">
              Archive
            </a>
            <a href="#" className="type-body text-ash/70 hover:text-frost transition-colors text-sm font-light">
              Loom
            </a>
          </div>

          <button
            onClick={handleNavClick}
            className="px-6 py-2 border border-pulse/50 text-frost type-body text-sm font-light hover:border-pulse transition-colors"
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
        x: (clientX - centerX) * 0.02,
        y: (clientY - centerY) * 0.02,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleBeginArchiving = () => {
    window.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
  };

  return (
    <section className="w-screen h-screen relative overflow-hidden bg-void">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="https://videos.pexels.com/video-files/7578535/7578535-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* AR Corner Brackets */}
      <ARCornerBracket position="top-left" />
      <ARCornerBracket position="top-right" />
      <ARCornerBracket position="bottom-left" />
      <ARCornerBracket position="bottom-right" />

      {/* Navigation */}
      <NavigationBar />

      {/* Hero Text - Center */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="text-center transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <h1
            className="text-frost font-extralight"
            style={{
              fontSize: 'clamp(60px, 14vw, 200px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            FRAGMENTED<br />REALITY
          </h1>
        </div>
      </div>

      {/* Bottom CTA - Minimal */}
      <div className="absolute bottom-12 right-12">
        <button
          onClick={handleBeginArchiving}
          className="px-8 py-4 border border-pulse/50 text-frost type-body font-light hover:border-pulse hover:bg-pulse/5 transition-all"
        >
          BEGIN ARCHIVING →
        </button>
      </div>
    </section>
  );
}
