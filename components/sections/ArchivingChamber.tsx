'use client';

import { TimeCapsuleCreator } from '@/components/capsule/TimeCapsuleCreator';
import { useCapsuleStore } from '@/lib/store';

export function ArchivingChamber() {
  const addCapsule = useCapsuleStore((state) => state.addCapsule);

  const handleCapsuleCreated = (capsule: { story: string; imagePrompts: string[] }) => {
    addCapsule(capsule);
  };

  return (
    <section className="w-screen h-screen flex relative bg-gradient-to-r from-void via-ink to-graphite overflow-hidden">
      {/* Left Side - Video & Content */}
      <div className="w-1/2 relative flex items-center justify-start">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="https://videos.pexels.com/video-files/8553930/8553930-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-void to-transparent" />

        {/* Geometric Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-12 w-1 h-64 bg-gradient-to-b from-pulse to-transparent opacity-50" />
          <div className="absolute bottom-1/4 left-1/4 border-l border-t border-frost/20 w-48 h-48 transform -rotate-45" />
          <div className="absolute top-1/2 right-0 w-96 h-px bg-gradient-to-l from-pulse/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-12 max-w-md">
          <div className="mb-8">
            <span className="type-micro text-pulse tracking-widest">THE LOOM</span>
            <div className="h-px w-12 bg-pulse/50 mt-4 mb-6" />
          </div>
          
          <h2 className="type-headline text-frost mb-8 leading-tight">
            Deposit a memory fragment. The Loom will analyze its emotional and visual data, weaving it into a permanent capsule.
          </h2>

          <p className="type-body text-ash text-sm leading-relaxed">
            Each memory becomes art. Each echo, eternal.
          </p>
        </div>
      </div>

      {/* Right Side - Creator Form */}
      <div className="w-1/2 flex items-center justify-center relative px-12">
        {/* Background geometric accent */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full border border-frost/10 rounded-full transform -rotate-45" />
          <div className="absolute top-1/4 right-0 w-1 h-1/2 bg-gradient-to-b from-pulse/30 to-transparent" />
        </div>

        {/* Glass Modal */}
        <div className="relative z-10 w-full max-w-md">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-pulse/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative backdrop-blur-2xl bg-black/30 border border-white/10 rounded-2xl p-12 shadow-2xl">
              <div className="mb-6">
                <h3 className="type-micro text-pulse tracking-widest mb-2">WEAVE YOUR STORY</h3>
                <div className="h-px w-8 bg-pulse/40" />
              </div>
              
              <TimeCapsuleCreator onCapsuleCreated={handleCapsuleCreated} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
