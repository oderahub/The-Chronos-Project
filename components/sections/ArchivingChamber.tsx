'use client';

import { TimeCapsuleCreator } from '@/components/capsule/TimeCapsuleCreator';
import { useCapsuleStore } from '@/lib/store';

export function ArchivingChamber() {
  const addCapsule = useCapsuleStore((state) => state.addCapsule);

  const handleCapsuleCreated = (capsule: { story: string; imagePrompts: string[] }) => {
    addCapsule(capsule);
  };

  return (
    <section className="w-screen h-screen flex">
      {/* Left Side - Video Background */}
      <div className="w-1/2 relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="https://videos.pexels.com/video-files/8553930/8553930-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-start justify-center px-12">
          <h2 className="type-micro text-pulse mb-6">THE LOOM.</h2>
          <p className="type-headline text-frost max-w-sm">
            Deposit a memory fragment. The Loom will analyze its emotional and visual data, weaving it into a permanent capsule.
          </p>
        </div>
      </div>

      {/* Right Side - Glass Modal with Creator */}
      <div className="w-1/2 flex items-center justify-center px-8 bg-gradient-to-b from-ink to-void">
        <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-12 w-full max-w-md">
          <TimeCapsuleCreator onCapsuleCreated={handleCapsuleCreated} />
        </div>
      </div>
    </section>
  );
}
