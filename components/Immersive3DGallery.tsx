'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Capsule } from '@/lib/store';

interface Immersive3DGalleryProps {
  capsules: Capsule[];
  onSelectMemory: (capsule: Capsule) => void;
}

export function Immersive3DGallery({ capsules, onSelectMemory }: Immersive3DGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (capsules.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center">
        <motion.div
          className="mb-8"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/50 flex items-center justify-center">
            <svg className="w-12 h-12 text-violet-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.88 2 16.5S6.5 26.747 12 26.747s10-4.627 10-10.247S17.5 6.253 12 6.253z" />
            </svg>
          </div>
        </motion.div>
        <h3 className="text-xl font-light text-frost/70 mb-2">The Archive Awaits</h3>
        <p className="text-sm text-ash/60 font-light max-w-sm">
          Your first memory has not yet been woven. Return to the Loom and deposit a fragment to begin your permanent archive.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      {/* Archive Header */}
      <div className="relative z-10 mb-8 sticky top-0 bg-void/80 backdrop-blur-lg border-b border-violet-500/20 p-6">
        <motion.h2
          className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Memory Constellation
        </motion.h2>
        <p className="text-sm text-ash/60 font-light mt-2">{capsules.length} memories preserved in eternity</p>
      </div>

      {/* 3D Memory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-12">
        {capsules.map((capsule, idx) => (
          <motion.div
            key={capsule.id}
            className="h-80 cursor-pointer perspective"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onMouseEnter={() => setHoveredId(capsule.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectMemory(capsule)}
          >
            {/* 3D Card Container */}
            <motion.div
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
              animate={{
                rotateY: hoveredId === capsule.id ? 10 : 0,
                rotateX: hoveredId === capsule.id ? -5 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Front of card */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-void/60 to-black/80 border border-violet-500/40 rounded-xl p-6 flex flex-col justify-between overflow-hidden"
                animate={{
                  opacity: hoveredId === capsule.id ? 0 : 1,
                  zIndex: hoveredId === capsule.id ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Number badge */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/50 flex items-center justify-center">
                  <span className="text-violet-300 text-xs font-light">{idx + 1}</span>
                </div>

                {/* Story preview */}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm text-frost/80 font-light line-clamp-4 leading-relaxed">
                    {capsule.story}
                  </p>
                </div>

                {/* Date */}
                <div className="text-xs text-ash/50 font-light">
                  {new Date(capsule.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500/0 via-violet-500 to-violet-500/0" />
              </motion.div>

              {/* Back of card - Image gallery */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-violet-900/60 to-black/90 border border-violet-500/40 rounded-xl p-4 overflow-hidden"
                animate={{
                  opacity: hoveredId === capsule.id ? 1 : 0,
                  zIndex: hoveredId === capsule.id ? 10 : 0,
                  rotateY: hoveredId === capsule.id ? 180 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-xs text-violet-300/60 font-light mb-3">Visual Echoes</div>
                <div className="grid grid-cols-2 gap-2 h-full">
                  {capsule.imagePrompts.slice(0, 4).map((prompt, i) => (
                    <motion.div
                      key={i}
                      className="relative rounded-lg overflow-hidden border border-violet-500/30 bg-violet-500/5 aspect-square flex items-center justify-center group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={`https://source.unsplash.com/random/200x200/?${encodeURIComponent(prompt)}`}
                        alt={prompt}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/200/200?random=${i}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                        <span className="text-xs text-frost/80 font-light line-clamp-1">{prompt}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
