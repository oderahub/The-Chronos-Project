'use client';

import { useCapsuleStore } from '@/lib/store';
import { CapsuleDisplay } from '@/components/capsule/CapsuleDisplay';

export function MemoryGallery() {
  const capsules = useCapsuleStore((state) => state.capsules);

  return (
    <section className="w-screen h-screen flex flex-col items-center justify-center px-8 bg-gradient-to-b from-void via-ink to-graphite relative overflow-y-auto overflow-x-hidden">
      {/* Background geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-1 h-1/2 bg-gradient-to-b from-pulse/20 to-transparent" />
        <div className="absolute bottom-1/4 right-1/4 border border-frost/10 w-96 h-96 transform rotate-45" />
        <div className="absolute top-0 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-frost/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-16 animate-rise">
          <div className="inline-block mb-6">
            <h1 className="type-display text-frost text-center text-4xl" style={{ letterSpacing: '-0.02em' }}>
              THE ARCHIVE
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-pulse to-transparent mx-auto mt-6" />
          </div>
        </div>

        {capsules.length === 0 ? (
          <div className="text-center py-20 animate-rise" style={{ animationDelay: '200ms' }}>
            <div className="inline-block p-12 border border-frost/20 rounded-xl">
              <p className="type-headline text-ash max-w-md mb-4">
                Your archive is empty.
              </p>
              <p className="type-body text-ash/70">
                Deposit your first memory in The Loom.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {capsules.map((capsule, idx) => (
              <div key={idx} className="animate-rise" style={{ animationDelay: `${idx * 100}ms` }}>
                <CapsuleDisplay capsule={capsule} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
