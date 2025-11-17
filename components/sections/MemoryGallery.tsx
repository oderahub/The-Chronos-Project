'use client';

import { useCapsuleStore } from '@/lib/store';
import { CapsuleDisplay } from '@/components/capsule/CapsuleDisplay';

export function MemoryGallery() {
  const capsules = useCapsuleStore((state) => state.capsules);

  return (
    <section className="w-screen h-screen flex flex-col items-center justify-center px-8 bg-gradient-to-b from-void via-ink to-graphite relative overflow-hidden">
      {/* Grain texture background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27100%27%20height=%27100%27%3E%3Cfilter%20id=%27noise%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%274%27%20seed=%275%27/%3E%3C/filter%3E%3Crect%20width=%27100%27%20height=%27100%27%20filter=%27url(%23noise)%27%20opacity=%271%27/%3E%3C/svg%3E")',
      }} />

      {/* Content */}
      <div className="relative z-10 w-full">
        <h1 className="type-headline text-frost text-center mb-12">THE ARCHIVE</h1>

        {capsules.length === 0 ? (
          <div className="text-center">
            <p className="type-body text-ash max-w-xl mx-auto">
              Your archive is empty. Deposit your first memory in The Loom.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 items-center">
            {capsules.map((capsule, idx) => (
              <CapsuleDisplay key={idx} capsule={capsule} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
