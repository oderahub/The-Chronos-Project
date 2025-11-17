'use client';

import { TimeCapsuleCreator } from '@/components/capsule/TimeCapsuleCreator';
import { useCapsuleStore } from '@/lib/store';

export function ArchivingChamber() {
  const addCapsule = useCapsuleStore((state) => state.addCapsule);

  const handleCapsuleCreated = (capsule: { story: string; imagePrompts: string[] }) => {
    addCapsule(capsule);
  };

  return (
    <section className="w-screen h-screen flex relative overflow-hidden bg-void">
      {/* Left Side */}
      <div className="w-1/2 relative flex flex-col items-center justify-center px-12">
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
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <h2
            className="font-extralight text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500"
            style={{
              fontSize: 'clamp(48px, 10vw, 120px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              textShadow: '0 10px 40px rgba(52, 211, 153, 0.2)',
              filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.2))',
            }}
          >
            THE LOOM
          </h2>
          <p
            className="text-frost/70 font-light mt-8"
            style={{
              fontSize: 'clamp(14px, 1.5vw, 18px)',
              lineHeight: '1.6',
              maxWidth: '400px',
            }}
          >
            Weave your fragmented memories into permanent digital artifacts.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 relative flex items-center justify-center px-12 bg-gradient-to-b from-ink via-ink/50 to-void">
        {/* Subtle accent */}
        <div className="absolute top-0 right-0 w-px h-1/2 bg-gradient-to-b from-emerald-500/20 to-transparent" />

        {/* Form Container */}
        <div className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-xl bg-black/40 border border-emerald-500/30 rounded-xl p-10 hover:border-emerald-500/50 hover:bg-black/50 transition-all">
            <h3 className="type-micro text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 tracking-widest mb-8">
              DEPOSIT FRAGMENT
            </h3>
            <TimeCapsuleCreator onCapsuleCreated={handleCapsuleCreated} />
          </div>
        </div>
      </div>
    </section>
  );
}
