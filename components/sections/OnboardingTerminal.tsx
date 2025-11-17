'use client';

import { useState, useEffect } from 'react';

function GridOverlay() {
  return (
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />
    </div>
  );
}

function FragmentedShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Top-left diagonal line */}
      <div className="absolute -top-20 -left-20 w-96 h-96 border border-frost/20 transform -rotate-45" />
      
      {/* Center elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 border border-frost/15 transform rotate-12" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border-l border-t border-frost/10 transform rotate-45" />
      
      {/* Right side accent */}
      <div className="absolute top-0 right-0 w-80 h-96 border-b border-l border-frost/15 transform -skew-x-12" />
      
      {/* Horizontal lines */}
      <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-frost/20 to-transparent" />
      <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-frost/15 to-transparent" />
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
        x: (clientX - centerX) * 0.03,
        y: (clientY - centerY) * 0.03,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInitialize = () => {
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
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      >
        <source src="https://videos.pexels.com/video-files/3214434/3214434-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/50 to-void" />

      {/* Overlays */}
      <GridOverlay />
      <FragmentedShapes />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        {/* Main Content Box */}
        <div
          className="max-w-3xl transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          {/* Decorative frame around title */}
          <div className="relative mb-8 inline-block w-full">
            <div className="absolute inset-0 border border-frost/20 transform -rotate-1" />
            <div className="absolute inset-2 border border-frost/10 transform rotate-1" />
            <h1 className="type-display text-frost text-center py-8 px-12 relative z-10 animate-rise" style={{ letterSpacing: '-0.02em' }}>
              MEMORY IS FRAGMENTED.
            </h1>
          </div>

          {/* Description with frame */}
          <div className="relative mt-12">
            <div className="absolute -inset-8 border border-frost/15 opacity-50 animate-rise" style={{ animationDelay: '100ms' }} />
            <p className="type-headline text-frost text-center max-w-2xl mx-auto px-8 py-8 relative z-10 animate-rise" style={{ animationDelay: '200ms' }}>
              Welcome, Archivist. The Chronos Project is tasked with preserving humanity's fading memories. Your mission is to find the echoes of the past and weave them into permanent form.
            </p>
          </div>
        </div>

        {/* CTA Button with accent */}
        <div className="absolute bottom-12 right-12 group">
          <div className="absolute -inset-4 border border-frost/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <button
            onClick={handleInitialize}
            className="relative px-8 py-4 border border-frost text-frost type-body font-light hover:bg-frost/5 transition-all duration-300 animate-rise" 
            style={{ animationDelay: '300ms' }}
          >
            INITIALIZE ARCHIVING →
          </button>
        </div>
      </div>
    </section>
  );
}
