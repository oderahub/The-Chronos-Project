'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCapsuleStore } from '@/lib/store';
import { CapsuleDisplay } from '@/components/capsule/CapsuleDisplay';

const hardcodedImages = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    alt: 'Mountain landscape at sunset',
    title: 'Echoes of Dawn',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop',
    alt: 'Northern lights',
    title: 'Aurora Fragments',
    color: 'from-green-500 to-emerald-400',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    alt: 'Ocean waves',
    title: 'Tidal Memories',
    color: 'from-blue-600 to-blue-400',
  },
  {
    src: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=600&fit=crop',
    alt: 'Desert dunes',
    title: 'Sand Whispers',
    color: 'from-orange-500 to-yellow-400',
  },
  {
    src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop',
    alt: 'Forest canopy',
    title: 'Verdant Dreams',
    color: 'from-green-600 to-teal-500',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    alt: 'Starry night sky',
    title: 'Cosmic Echoes',
    color: 'from-purple-600 to-pink-500',
  },
];

export function MemoryGallery() {
  const capsules = useCapsuleStore((state) => state.capsules);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<(typeof hardcodedImages)[0] | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollX);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allItems = capsules.length > 0 ? capsules : hardcodedImages;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentItem = allItems[currentIndex];
  const parallaxOffset = (scrollY - window.innerWidth * 3) * 0.5;

  return (
    <section ref={sectionRef} className="gallery-section w-screen h-screen relative overflow-hidden bg-void flex flex-col items-center justify-center">
      {/* Background gradient with parallax */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-ink to-graphite"
        style={{
          transform: `translateX(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      />

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

      {/* Selected Image Lightbox */}
      {selectedImage && !capsules.length && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer group"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[80vh] flex flex-col items-center gap-6">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
              style={{
                maxHeight: 'calc(80vh - 80px)',
                animation: 'slideInScale 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            />
            <p className="text-frost/80 text-sm font-light">Click to close</p>
          </div>

          <style>{`
            @keyframes slideInScale {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
        {/* Title */}
        <motion.div
          className="absolute top-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1
            className="font-extralight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-red-500"
            style={{
              fontSize: 'clamp(48px, 10vw, 100px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(168, 85, 247, 0.3), 0 0 30px rgba(236, 72, 153, 0.15)',
              filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.2))',
            }}
          >
            THE ARCHIVE
          </h1>
        </motion.div>

        {/* Carousel */}
        <div className="w-full max-w-3xl">
          {/* Main Image Display */}
          <motion.div
            className="relative mb-12 aspect-square rounded-2xl overflow-hidden group cursor-pointer"
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            {typeof currentItem === 'string' ? (
              // Capsule image display
              <img
                src={`https://source.unsplash.com/random/600x600/?${encodeURIComponent(currentItem)}`}
                alt="Memory"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              // Hardcoded image display
              <>
                <img
                  src={currentItem.src}
                  alt={currentItem.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onClick={() => setSelectedImage(currentItem)}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${currentItem.color} opacity-15 group-hover:opacity-30 transition-opacity duration-300`}
                />
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-2xl shadow-violet-500/40 rounded-2xl" />
              </>
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm">
              <motion.div
                className="w-16 h-16 border-2 border-violet-400 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-8 h-8 text-violet-400 fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Info */}
          {typeof currentItem === 'object' && 'title' in currentItem && (
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="type-headline text-violet-100 mb-3 group-hover:text-violet-200 transition-colors">{currentItem.title}</h2>
              <p className="type-body text-violet-200/60 font-light">{currentItem.alt}</p>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-center gap-8">
            {/* Prev Button */}
            <motion.button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-violet-500/50 text-violet-400 flex items-center justify-center backdrop-blur-md hover:bg-violet-500/10 hover:border-violet-300 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Dots */}
            <div className="flex gap-3">
              {allItems.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-gradient-to-r from-violet-500 to-pink-500 w-8'
                      : 'bg-violet-500/30 w-2 hover:bg-violet-500/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-violet-500/50 text-violet-400 flex items-center justify-center backdrop-blur-md hover:bg-violet-500/10 hover:border-violet-300 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Counter */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="type-micro text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 tracking-widest font-semibold">
              {currentIndex + 1} / {allItems.length}
            </p>
          </motion.div>
        </div>

        {/* Empty state message for user capsules */}
        {capsules.length === 0 && (
          <motion.p
            className="absolute bottom-8 text-violet-200/60 type-body font-light max-w-md text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            These are example memories. Deposit your own to populate the archive.
          </motion.p>
        )}
      </div>
    </section>
  );
}
