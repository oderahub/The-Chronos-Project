'use client';

import { Capsule } from '@/lib/store';

interface CapsuleDisplayProps {
  capsule: Capsule;
}

export function CapsuleDisplay({ capsule }: CapsuleDisplayProps) {
  return (
    <div className="relative group">
      {/* Card */}
      <div className="relative backdrop-blur-xl bg-black/40 border border-pulse/20 rounded-lg p-10">
        <div className="grid grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <h3 className="type-micro text-pulse/60 tracking-widest mb-6">VISUAL</h3>
            <div className="grid grid-cols-2 gap-4">
              {capsule.imagePrompts.map((prompt, idx) => (
                <img
                  key={idx}
                  src={`https://source.unsplash.com/random/400x400/?${encodeURIComponent(prompt)}`}
                  alt={prompt}
                  className="w-full h-40 object-cover rounded-lg opacity-70 group-hover:opacity-90 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-start">
            <h3 className="type-micro text-pulse/60 tracking-widest mb-6">ENTRY</h3>
            <p className="text-frost/80 font-light leading-relaxed text-sm">
              {capsule.story}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
