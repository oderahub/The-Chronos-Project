'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThreeDScene } from '@/components/ThreeDScene';
import { TimeCapsuleCreator } from '@/components/capsule/TimeCapsuleCreator';
import { useCapsuleStore } from '@/lib/store';

export function ArchivingChamber() {
  const addCapsule = useCapsuleStore((state) => state.addCapsule);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollX);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCapsuleCreated = (capsule: { story: string; imagePrompts: string[] }) => {
    addCapsule(capsule);
  };

  const parallaxOffset = typeof window !== 'undefined' ? (scrollY - window.innerWidth * 2) * 0.5 : 0;

  return (
    <section ref={sectionRef} className="archiving-section w-screen h-screen flex relative overflow-hidden bg-void">
      {/* Left Side */}
      <div className="w-1/2 relative flex flex-col items-center justify-center px-12">
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
            <source src="https://videos.pexels.com/video-files/34645629/14684082_640_360_30fps.mp4" type="video/mp4" />
          </video>
        </div>

        {/* 3D Scene Background */}
        <ThreeDScene sectionColor="#10b981" intensity={1} />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green-950/20" />

        {/* Floating accent elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className="font-extralight text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500"
            style={{
              fontSize: 'clamp(48px, 10vw, 120px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(52, 211, 153, 0.3), 0 0 30px rgba(16, 185, 129, 0.15)',
              filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.2))',
            }}
          >
            THE LOOM
          </h2>
          <p
            className="text-emerald-200/70 font-light mt-8"
            style={{
              fontSize: 'clamp(14px, 1.5vw, 18px)',
              lineHeight: '1.6',
              maxWidth: '400px',
            }}
          >
            Weave your fragmented memories into permanent digital artifacts through The Loom.
          </p>
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 relative flex items-center justify-center px-12 bg-gradient-to-br from-ink/80 via-ink/40 to-void">
        {/* Subtle accent line */}
        <div className="absolute top-0 right-0 w-px h-1/2 bg-gradient-to-b from-emerald-500/30 to-transparent" />

        {/* Floating accent elements */}
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{ duration: 11, repeat: Infinity }}
        />

        {/* Form Container with Glass Morphism */}
        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-deposit-card backdrop-blur-2xl bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-10 shadow-2xl shadow-emerald-500/10 hover:border-emerald-400/60 hover:bg-emerald-950/40 hover:shadow-emerald-500/20 transition-all duration-300 group">
            <motion.h3
              className="type-micro text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 tracking-widest mb-8 group-hover:from-green-300 group-hover:to-emerald-400 transition-all"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              DEPOSIT FRAGMENT
            </motion.h3>
            <TimeCapsuleCreator onCapsuleCreated={handleCapsuleCreated} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
