'use client';

import { useCapsuleStore } from '@/lib/store';
import { CapsuleDisplay } from '@/components/capsule/CapsuleDisplay';

export function MemoryGallery() {
  const capsules = useCapsuleStore((state) => state.capsules);

  return (
    <section className="w-screen h-screen relative overflow-y-auto overflow-x-hidden bg-void flex flex-col items-center justify-center px-8">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-void to-graphite opacity-60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h1
            className="text-frost font-extralight"
            style={{
              fontSize: 'clamp(48px, 10vw, 100px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            THE ARCHIVE
          </h1>
        </div>

        {/* Gallery */}
        {capsules.length === 0 ? (
          <div className="text-center py-20">
            <p
              className="text-frost/70 font-light"
              style={{
                fontSize: 'clamp(16px, 2vw, 24px)',
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              Your archive is empty. Deposit your first memory in The Loom.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {capsules.map((capsule, idx) => (
              <CapsuleDisplay key={idx} capsule={capsule} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
