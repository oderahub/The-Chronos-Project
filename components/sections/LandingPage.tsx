'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
    <motion.div
      className={`absolute ${positionClasses[position]} w-10 h-10 opacity-30`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <div className={`w-full h-full border-2 border-cyan-400/50 ${rotationClasses[position]} hover:border-cyan-300 transition-colors`} />
    </motion.div>
  );
}

function NavigationBar() {
  const handleNavClick = () => {
    window.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 py-6 px-8">
      <style>{`
        @keyframes morph-logo {
          0%, 100% {
            clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
          }
          50% {
            clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
          }
        }
      `}</style>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs"
              style={{
                animation: 'morph-logo 3s ease-in-out infinite',
              }}
            >
              ◆
            </div>
            <span className="type-micro text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 tracking-widest hidden sm:inline">
              CHRONOS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="type-body text-ash/70 hover:text-cyan-400 transition-colors text-sm font-light">
              Fragments
            </a>
            <a href="#" className="type-body text-ash/70 hover:text-blue-400 transition-colors text-sm font-light">
              Archive
            </a>
            <a href="#" className="type-body text-ash/70 hover:text-purple-400 transition-colors text-sm font-light">
              Loom
            </a>
          </div>

          <button
            onClick={handleNavClick}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 type-body text-sm font-light hover:border-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
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
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const handleScroll = () => {
      setScrollY(window.scrollX);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleBeginArchiving = () => {
    window.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
  };

  const parallaxOffset = typeof window !== 'undefined' ? scrollY * 0.5 : 0;

  return (
    <section ref={sectionRef} className="landing-section w-screen h-screen relative overflow-hidden bg-void">
      {/* Video Background with Parallax */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateX(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out',
        }}
        suppressHydrationWarning
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        >
          <source src="https://videos.pexels.com/video-files/2297636/2297636-hd_1280_720_30fps.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlays - Layered for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-transparent to-blue-950/30" />

      {/* AR Corner Brackets */}
      <ARCornerBracket position="top-left" />
      <ARCornerBracket position="top-right" />
      <ARCornerBracket position="bottom-left" />
      <ARCornerBracket position="bottom-right" />

      {/* Navigation */}
      <NavigationBar />

      {/* Hero Text - Center with animations */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="text-center"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="font-extralight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500"
            style={{
              fontSize: 'clamp(60px, 14vw, 200px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(0, 122, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.15)',
              filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.2))',
            }}
            animate={{
              textShadow: [
                '0 10px 40px rgba(0, 122, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.15)',
                '0 10px 40px rgba(0, 122, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.25)',
                '0 10px 40px rgba(0, 122, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.15)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            FRAGMENTED<br />REALITY
          </motion.h1>

          <motion.p
            className="mt-8 text-cyan-200/60 type-body font-light max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Where fragmented moments crystallize into permanent digital artifacts
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom CTA - Enhanced glass morphism */}
      <motion.div
        className="absolute bottom-12 right-12 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.button
          onClick={handleBeginArchiving}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 type-body font-light backdrop-blur-md hover:border-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:shadow-lg hover:shadow-cyan-500/30 transition-all rounded-lg"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
        >
          BEGIN ARCHIVING →
        </motion.button>
      </motion.div>

      {/* Floating accent elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </section>
  );
}
