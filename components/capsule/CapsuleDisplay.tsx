'use client';

import { Capsule } from '@/lib/store';

interface CapsuleDisplayProps {
  capsule: Capsule;
}

export function CapsuleDisplay({ capsule }: CapsuleDisplayProps) {
  return (
    <div className="group relative">
      {/* Glow Background */}
      <div className="absolute -inset-2 bg-gradient-to-br from-pulse/15 via-pulse/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

      {/* Main Card */}
      <div className="relative backdrop-blur-2xl bg-gradient-to-br from-black/50 via-black/30 to-black/40 border border-pulse/30 rounded-2xl p-12 shadow-2xl group-hover:border-pulse/50 transition-all duration-300">
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-pulse/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-pulse/40 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top Line Accent */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-pulse/40 to-transparent" />

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-12">
          {/* Visual Tapestry */}
          <div className="space-y-4">
            <div>
              <h3 className="type-micro text-pulse/80 tracking-widest mb-4">VISUAL TAPESTRY</h3>
              <div className="h-px w-8 bg-gradient-to-r from-pulse/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {capsule.imagePrompts.map((prompt, idx) => (
                <div
                  key={idx}
                  className="group/image relative overflow-hidden rounded-lg aspect-square animate-float"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <img
                    src={`https://source.unsplash.com/random/400x400/?${encodeURIComponent(prompt)}`}
                    alt={prompt}
                    className="w-full h-full object-cover opacity-70 group-hover/image:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 border border-pulse/30 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Capsule Entry - Story */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <h3 className="type-micro text-pulse/80 tracking-widest mb-4">CAPSULE ENTRY</h3>
              <div className="h-px w-8 bg-gradient-to-r from-pulse/50 to-transparent mb-6" />
              <p className="type-body text-frost/90 leading-relaxed text-sm font-light">
                {capsule.story}
              </p>
            </div>

            {/* Footer Metadata */}
            <div className="pt-6 border-t border-pulse/20">
              <div className="flex items-center justify-between">
                <p className="type-micro text-pulse/60 tracking-widest">ARCHIVED</p>
                <div className="w-2 h-2 rounded-full bg-pulse/50 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
