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
        <div className="absolute top-16 text-center">
          <h1
            className="font-extralight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-red-500"
            style={{
              fontSize: 'clamp(48px, 10vw, 100px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(168, 85, 247, 0.2)',
              filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.2))',
            }}
          >
            THE ARCHIVE
          </h1>
        </div>

        {/* Carousel */}
        <div className="w-full max-w-3xl">
          {/* Main Image Display */}
          <div className="relative mb-12 aspect-square rounded-xl overflow-hidden group cursor-pointer">
            {typeof currentItem === 'string' ? (
              // Capsule image display
              <img
                src={`https://source.unsplash.com/random/600x600/?${encodeURIComponent(currentItem)}`}
                alt="Memory"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              // Hardcoded image display
              <>
                <img
                  src={currentItem.src}
                  alt={currentItem.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onClick={() => setSelectedImage(currentItem)}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${currentItem.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                />
              </>
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
              <div className="w-16 h-16 border-2 border-pulse rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-pulse fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Info */}
          {typeof currentItem === 'object' && 'title' in currentItem && (
            <div className="text-center mb-8">
              <h2 className="type-headline text-frost mb-3">{currentItem.title}</h2>
              <p className="type-body text-ash/70 font-light">{currentItem.alt}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-center gap-8">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-violet-500/50 text-violet-400 flex items-center justify-center hover:bg-violet-500/10 hover:border-violet-400 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {allItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-gradient-to-r from-violet-500 to-pink-500 w-8'
                      : 'bg-violet-500/30 w-2 hover:bg-violet-500/50'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-violet-500/50 text-violet-400 flex items-center justify-center hover:bg-violet-500/10 hover:border-violet-400 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Counter */}
          <div className="text-center mt-8">
            <p className="type-micro text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 tracking-widest font-semibold">
              {currentIndex + 1} / {allItems.length}
            </p>
          </div>
        </div>

        {/* Empty state message for user capsules */}
        {capsules.length === 0 && (
          <p className="absolute bottom-8 text-frost/70 type-body font-light max-w-md text-center">
            These are example memories. Deposit your own to populate the archive.
          </p>
        )}
      </div>
    </section>
  );
}
