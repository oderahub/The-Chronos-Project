'use client';

import { useState, useEffect } from 'react';

function GridOverlay() {
  return (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />
    </div>
  );
}

function ARViewfinder() {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="10" y="10" width="30" height="30" fill="none" stroke="rgba(242, 242, 247, 0.3)" strokeWidth="0.5" />
        <rect x="60" y="10" width="30" height="30" fill="none" stroke="rgba(242, 242, 247, 0.3)" strokeWidth="0.5" />
        <rect x="10" y="60" width="30" height="30" fill="none" stroke="rgba(242, 242, 247, 0.3)" strokeWidth="0.5" />
        <rect x="60" y="60" width="30" height="30" fill="none" stroke="rgba(242, 242, 247, 0.3)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(242, 242, 247, 0.2)" strokeWidth="0.5" />
      </svg>
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
        x: (clientX - centerX) * 0.05,
        y: (clientY - centerY) * 0.05,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInitialize = () => {
    window.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
  };

  return (
    <section className="w-screen h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="https://videos.pexels.com/video-files/3214434/3214434-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <GridOverlay />
      <ARViewfinder />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        <div
          className="text-center transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <h1 className="type-display text-frost mb-6 animate-rise delay-0">
            MEMORY IS FRAGMENTED.
          </h1>
          <p className="type-headline text-frost max-w-2xl mx-auto mb-12 animate-rise delay-150">
            Welcome, Archivist. The Chronos Project is tasked with preserving humanity's fading memories. Your mission is to find the echoes of the past and weave them into permanent form.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleInitialize}
          className="absolute bottom-12 right-12 px-8 py-4 border border-frost text-frost type-body hover:bg-frost/10 transition-colors duration-300 animate-rise delay-300"
        >
          INITIALIZE ARCHIVING →
        </button>
      </div>
    </section>
  );
}
