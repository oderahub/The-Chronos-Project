'use client';

import { Capsule } from '@/lib/store';

interface CapsuleDisplayProps {
  capsule: Capsule;
}

export function CapsuleDisplay({ capsule }: CapsuleDisplayProps) {
  return (
    <div className="glass-dark backdrop-blur-xl rounded-2xl p-8 border border-white/10 animate-float max-w-2xl">
      <div className="grid grid-cols-2 gap-8">
        {/* Visual Tapestry */}
        <div>
          <h3 className="type-micro text-pulse mb-4">VISUAL TAPESTRY</h3>
          <div className="grid grid-cols-2 gap-3">
            {capsule.imagePrompts.map((prompt, idx) => (
              <img
                key={idx}
                src={`https://source.unsplash.com/random/400x400/?${encodeURIComponent(prompt)}`}
                alt={prompt}
                className="w-full h-32 object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* Capsule Entry */}
        <div>
          <h3 className="type-micro text-pulse mb-4">CAPSULE ENTRY</h3>
          <p className="type-body text-frost leading-relaxed">{capsule.story}</p>
        </div>
      </div>
    </div>
  );
}
