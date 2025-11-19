'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ThreeDScene } from '@/components/ThreeDScene';

export function OnboardingTerminal() {
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

  const handleInitialize = () => {
    window.scrollTo({ left: window.innerWidth * 2, behavior: 'smooth' });
  };

  const parallaxOffset = typeof window !== 'undefined' ? (scrollY - window.innerWidth) * 0.5 : 0;

  return (
    <section ref={sectionRef} className="onboarding-section w-screen h-screen relative overflow-hidden bg-void flex flex-col items-center justify-center">
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
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src="https://videos.pexels.com/video-files/5561385/5561385-hd_1280_720_50fps.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 3D Scene Background */}
      <ThreeDScene sectionColor="#ff5722" intensity={1.2} />

      {/* Gradient Overlays - Layered */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-950/30 via-transparent to-red-950/30" />

      {/* Floating accent elements */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-8">
        <div
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
          suppressHydrationWarning
        >
          <motion.h1
            className="font-extralight mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-pink-400 to-red-500"
            style={{
              fontSize: 'clamp(50px, 12vw, 160px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(255, 87, 34, 0.3), 0 0 30px rgba(255, 152, 0, 0.15)',
              filter: 'drop-shadow(0 0 20px rgba(255, 152, 0, 0.2))',
            }}
            animate={{
              textShadow: [
                '0 10px 40px rgba(255, 87, 34, 0.3), 0 0 30px rgba(255, 152, 0, 0.15)',
                '0 10px 40px rgba(255, 87, 34, 0.5), 0 0 40px rgba(255, 152, 0, 0.25)',
                '0 10px 40px rgba(255, 87, 34, 0.3), 0 0 30px rgba(255, 152, 0, 0.15)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            CONSCIOUSNESS<br />PRESERVED
          </motion.h1>

          <motion.p
            className="text-orange-200/70 font-light leading-relaxed"
            style={{
              fontSize: 'clamp(16px, 2vw, 24px)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Preserve your fragmented memories as permanent digital artifacts in The Archive. Each memory becomes a crystallized moment, untouched by time.
          </motion.p>
        </div>
      </div>

      {/* CTA Button */}
      <div
        className="absolute bottom-12 right-12 z-20"
      >
        <motion.button
          onClick={handleInitialize}
          className="px-8 py-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/50 text-orange-300 type-body font-light backdrop-blur-md hover:border-orange-300 hover:from-orange-500/30 hover:to-red-500/30 hover:shadow-lg hover:shadow-orange-500/30 transition-all rounded-lg"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 152, 0, 0.1)' }}
          whileTap={{ scale: 0.95 }}
        >
          INITIALIZE ARCHIVING →
        </motion.button>
      </div>
    </section>
  );
}
