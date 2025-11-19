'use client';

import { Capsule } from '@/lib/store';
import { getImageUrlForPrompt } from '@/lib/utils/image-search';

interface CapsuleDisplayProps {
  capsule: Capsule;
}

export function CapsuleDisplay({ capsule }: CapsuleDisplayProps) {
  return (
    <div className="relative group">
      {/* Card */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-black/40 to-black/20 border border-violet-500/30 rounded-lg p-10 hover:border-violet-500/60 hover:bg-gradient-to-br hover:from-black/50 hover:to-black/30 transition-all">
        <div className="grid grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <h3 className="type-micro text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 tracking-widest mb-6 font-semibold">
              VISUAL
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {capsule.imagePrompts.map((prompt, idx) => (
                <img
                  key={idx}
                  src={`https://source.unsplash.com/random/400x400/?${encodeURIComponent(prompt)}`}
                  alt={prompt}
                  className="w-full h-40 object-cover rounded-lg opacity-70 group-hover:opacity-90 transition-opacity ring-1 ring-violet-500/30"
                />
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-start">
            <h3 className="type-micro text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 tracking-widest mb-6 font-semibold">
              ENTRY
            </h3>
            <p className="text-frost/80 font-light leading-relaxed text-sm">
              {capsule.story}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
