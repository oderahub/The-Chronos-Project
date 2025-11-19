'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThreeDScene } from '@/components/ThreeDScene';
import { Immersive3DGallery } from '@/components/Immersive3DGallery';
import { useCapsuleStore, Capsule } from '@/lib/store';
import { CapsuleDisplay } from '@/components/capsule/CapsuleDisplay';

export function MemoryGallery() {
  const capsules = useCapsuleStore((state) => state.capsules);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollX);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = typeof window !== 'undefined' ? (scrollY - window.innerWidth * 3) * 0.5 : 0;

  return (
    <section ref={sectionRef} className="gallery-section w-screen h-screen relative overflow-hidden bg-void flex flex-col">
      {/* Background gradient with parallax */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-ink to-graphite"
        style={{
          transform: `translateX(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out',
        }}
        suppressHydrationWarning
      />

      {/* 3D Scene Background */}
      <ThreeDScene sectionColor="#a855f7" intensity={1.3} />

      {/* Floating accent elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -60, 60, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, -60, 60, 0],
          y: [0, 60, -60, 0],
        }}
        transition={{ duration: 14, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 pt-12 px-8">
          <motion.h1
            className="font-extralight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-red-500"
            style={{
              fontSize: 'clamp(48px, 10vw, 100px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(168, 85, 247, 0.3), 0 0 30px rgba(236, 72, 153, 0.15)',
              filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.2))',
            }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            THE ARCHIVE
          </motion.h1>
        </div>

        {/* Main Gallery Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedCapsule ? (
            <div className="w-full h-full flex items-center justify-center p-8">
              <motion.div
                className="w-full max-w-3xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <CapsuleDisplay capsule={selectedCapsule} />
                <motion.button
                  onClick={() => setSelectedCapsule(null)}
                  className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/50 text-violet-300 font-light rounded-lg hover:from-violet-500/30 hover:to-purple-500/30 hover:border-violet-500 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  BACK TO ARCHIVE
                </motion.button>
              </motion.div>
            </div>
          ) : (
            <Immersive3DGallery
              capsules={capsules}
              onSelectMemory={setSelectedCapsule}
            />
          )}
        </div>
      </div>
    </section>
  );
}
