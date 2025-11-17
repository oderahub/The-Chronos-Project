'use client';

import { useCapsuleStore } from '@/lib/store';
import { CapsuleDisplay } from '@/components/capsule/CapsuleDisplay';

export function MemoryGallery() {
  const capsules = useCapsuleStore((state) => state.capsules);

  return (
    <section className="w-screen h-screen flex flex-col items-center justify-center px-8 bg-gradient-to-b from-void via-ink to-graphite relative overflow-y-auto overflow-x-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Light Ray */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-pulse/10 rounded-full blur-3xl opacity-20" />
        
        {/* Bottom Light Ray */}
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pulse/5 rounded-full blur-3xl opacity-15" />

        {/* Geometric Elements */}
        <div className="absolute top-1/4 left-0 w-1 h-1/2 bg-gradient-to-b from-pulse/20 to-transparent" />
        <div className="absolute bottom-0 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-pulse/20 to-transparent" />
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.3) 100%)'
      }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Title Section */}
        <div className="text-center mb-16 animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.2s forwards' }}>
          <p className="type-micro text-pulse/80 tracking-widest mb-6">PERMANENCE ACHIEVED</p>
          <h1
            className="type-display text-frost font-extralight text-center mb-4"
            style={{
              fontSize: 'clamp(48px, 10vw, 100px)',
              letterSpacing: '-0.03em',
              textShadow: '0 10px 30px rgba(0, 122, 255, 0.15)'
            }}
          >
            THE ARCHIVE
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-pulse/50 to-transparent mx-auto mb-6" />
          <p className="type-body text-ash/70 max-w-2xl mx-auto font-light">
            Your memories transcend the glitch. Each fragment immortalized. Each echo preserved in the eternal archive.
          </p>
        </div>

        {capsules.length === 0 ? (
          <div className="text-center py-24 animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.4s forwards' }}>
            <div className="inline-block p-16 border border-pulse/30 rounded-2xl backdrop-blur-md bg-black/20 max-w-xl">
              <p className="type-display text-frost/80 font-light mb-6" style={{ letterSpacing: '-0.02em' }}>
                Empty Canvas
              </p>
              <p className="type-headline text-ash/70 font-light">
                Your archive awaits. Return to The Loom and deposit your first fragment.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 mb-12">
            {capsules.map((capsule, idx) => (
              <div
                key={idx}
                className="animate-rise opacity-0"
                style={{ animation: `rise 0.8s ease-out ${0.4 + idx * 0.1}s forwards` }}
              >
                <CapsuleDisplay capsule={capsule} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
