'use client';

import { useState, useEffect } from 'react';

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
    <section className="w-screen h-screen relative overflow-hidden bg-void flex flex-col items-center justify-center">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="https://videos.pexels.com/video-files/3214434/3214434-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-8">
        <div
          className="transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <h1
            className="font-extralight mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-pink-400 to-red-500"
            style={{
              fontSize: 'clamp(50px, 12vw, 160px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(255, 87, 34, 0.2)',
              filter: 'drop-shadow(0 0 20px rgba(255, 152, 0, 0.2))',
            }}
          >
            CONSCIOUSNESS<br />PRESERVED
          </h1>

          <p
            className="text-frost/80 font-light leading-relaxed"
            style={{
              fontSize: 'clamp(16px, 2vw, 24px)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Preserve your fragmented memories as permanent digital artifacts in The Archive.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleInitialize}
        className="absolute bottom-12 right-12 px-8 py-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/50 text-orange-300 type-body font-light hover:border-orange-400 hover:from-orange-500/30 hover:to-red-500/30 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
      >
        INITIALIZE ARCHIVING →
      </button>
    </section>
  );
}
