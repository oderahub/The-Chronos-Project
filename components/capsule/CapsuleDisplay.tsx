'use client';

import { Capsule } from '@/lib/store';

interface CapsuleDisplayProps {
  capsule: Capsule;
}

export function CapsuleDisplay({ capsule }: CapsuleDisplayProps) {
  return (
    <div className="group relative">
      {/* Background accent */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pulse/10 via-transparent to-pulse/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
      
      {/* Main card */}
      <div className="relative glass-dark backdrop-blur-xl rounded-2xl p-8 border border-white/10 group-hover:border-white/20 transition-colors duration-300 shadow-xl">
        {/* Geometric accent lines */}
        <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-pulse/40 to-transparent" />
        <div className="absolute bottom-0 right-0 h-20 w-px bg-gradient-to-t from-pulse/40 to-transparent" />

        <div className="grid grid-cols-2 gap-8">
          {/* Visual Tapestry */}
          <div className="space-y-4">
            <div>
              <h3 className="type-micro text-pulse tracking-widest mb-3">VISUAL TAPESTRY</h3>
              <div className="h-px w-8 bg-pulse/40" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {capsule.imagePrompts.map((prompt, idx) => (
                <div key={idx} className="group/image relative overflow-hidden rounded-lg aspect-square animate-float" style={{ animationDelay: `${idx * 100}ms` }}>
                  <img
                    src={`https://source.unsplash.com/random/400x400/?${encodeURIComponent(prompt)}`}
                    alt={prompt}
                    className="w-full h-full object-cover opacity-75 group-hover/image:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 border border-frost/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Capsule Entry */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="type-micro text-pulse tracking-widest mb-3">CAPSULE ENTRY</h3>
              <div className="h-px w-8 bg-pulse/40 mb-4" />
              <p className="type-body text-frost leading-relaxed text-sm">{capsule.story}</p>
            </div>
            
            {/* Footer accent */}
            <div className="pt-6 border-t border-frost/10">
              <p className="type-micro text-ash/50 tracking-widest">ARCHIVED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
