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
    <div className={`absolute ${positionClasses[position]} w-8 h-8 opacity-50`}>
      <div className={`w-full h-full border-l-2 border-t-2 border-frost/60 ${rotationClasses[position]} origin-top-left`} />
    </div>
  );
}

function GridOverlay() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 40);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: `0px ${offset}px`,
        transition: 'background-position 0.05s linear',
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
        <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-full px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-pulse flex items-center justify-center rounded">
              <span className="text-pulse font-light text-lg">◆</span>
            </div>
            <span className="type-micro text-frost tracking-widest hidden sm:inline">CHRONOS</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="type-body text-ash hover:text-frost transition-colors text-sm">
              Archive
            </a>
            <a href="#" className="type-body text-ash hover:text-frost transition-colors text-sm">
              Explore
            </a>
            <a href="#" className="type-body text-ash hover:text-frost transition-colors text-sm">
              About
            </a>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleNavClick}
            className="px-6 py-2 border border-frost text-frost type-body text-sm hover:bg-frost/5 transition-colors"
          >
            Let's Start
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
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="https://videos.pexels.com/video-files/7578535/7578535-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      {/* Grid Overlay */}
      <GridOverlay />

      {/* AR Corner Brackets */}
      <ARCornerBracket position="top-left" />
      <ARCornerBracket position="top-right" />
      <ARCornerBracket position="bottom-left" />
      <ARCornerBracket position="bottom-right" />

      {/* Navigation Bar */}
      <NavigationBar />

      {/* Hero Text - Center */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <h1
            className="text-frost font-light text-center animate-rise"
            style={{
              fontSize: 'clamp(60px, 12vw, 200px)',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
            }}
          >
            FRAGMENTED<br />REALITY
          </h1>
        </div>
      </div>

      {/* Footer Content */}
      <div className="absolute bottom-0 left-0 right-0 px-8 py-8 z-20">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          {/* Left - Chronicle Info */}
          <div className="animate-rise" style={{ animationDelay: '200ms' }}>
            <p className="type-micro text-ash tracking-widest mb-2">CHRONICLE</p>
            <p className="type-headline text-frost">01</p>
          </div>

          {/* Right - Glass Card */}
          <div className="animate-rise" style={{ animationDelay: '300ms' }}>
            <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-2xl px-8 py-6 flex items-center gap-8">
              <div>
                <p className="type-micro text-ash tracking-widest mb-1">SEASON</p>
                <p className="type-headline text-frost">WINTER '24</p>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-frost/30 to-transparent" />
              <button
                onClick={handleBeginArchiving}
                className="px-6 py-3 border border-frost text-frost type-body hover:bg-frost/5 transition-colors whitespace-nowrap"
              >
                BEGIN ARCHIVING →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
