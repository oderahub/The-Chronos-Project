'use client';

import { TimeCapsuleCreator } from '@/components/capsule/TimeCapsuleCreator';
import { useCapsuleStore } from '@/lib/store';

export function ArchivingChamber() {
  const addCapsule = useCapsuleStore((state) => state.addCapsule);

  const handleCapsuleCreated = (capsule: { story: string; imagePrompts: string[] }) => {
    addCapsule(capsule);
  };

  return (
    <section className="w-screen h-screen flex relative overflow-hidden bg-gradient-to-r from-void via-ink to-graphite">
      {/* Left Side - Cinematic Content */}
      <div className="w-1/2 relative flex items-center justify-start overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="https://videos.pexels.com/video-files/8553930/8553930-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

        {/* Dynamic Lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 w-96 h-96 bg-pulse/10 rounded-full blur-3xl opacity-25" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-12 max-w-md animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.2s forwards' }}>
          <div className="mb-8">
            <p className="type-micro text-pulse/80 tracking-widest mb-4">DEPOSIT YOUR FRAGMENT</p>
            <div className="h-px w-12 bg-gradient-to-r from-pulse/60 to-transparent" />
          </div>

          <h2 className="type-display text-frost/90 font-extralight mb-6" style={{ letterSpacing: '-0.02em' }}>
            THE LOOM
          </h2>

          <p className="type-headline text-frost/80 font-light leading-relaxed mb-6">
            Weave your fractured memories into permanence. The Loom analyzes emotional resonance and visual essence, creating immortal artifacts from mortal fragments.
          </p>

          <p className="type-body text-ash/70 text-sm leading-relaxed">
            Each memory becomes art. Each echo, eternal.
          </p>
        </div>
      </div>

      {/* Right Side - Glass Portal */}
      <div className="w-1/2 flex items-center justify-center relative px-12">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-pulse/5 via-transparent to-black/40" />
          <div className="absolute -bottom-1/2 -right-1/4 w-full h-full border-l border-t border-pulse/20 transform -rotate-45" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pulse/5 rounded-full blur-3xl" />
        </div>

        {/* Portal Frame */}
        <div className="relative z-10 w-full max-w-md animate-rise opacity-0" style={{ animation: 'rise 0.8s ease-out 0.4s forwards' }}>
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-pulse/20 via-pulse/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

            {/* Main Card */}
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-black/50 to-black/30 border border-pulse/30 rounded-2xl p-12 shadow-2xl group-hover:border-pulse/50 transition-all">
              {/* Decorative Lines */}
              <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-pulse/40 to-transparent" />
              <div className="absolute bottom-0 right-0 h-20 w-px bg-gradient-to-t from-pulse/40 to-transparent" />

              {/* Title */}
              <div className="mb-8">
                <h3 className="type-micro text-pulse/80 tracking-widest mb-3">WEAVE YOUR STORY</h3>
                <div className="h-px w-8 bg-gradient-to-r from-pulse/50 to-transparent" />
              </div>

              {/* Creator Component */}
              <TimeCapsuleCreator onCapsuleCreated={handleCapsuleCreated} />
            </div>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-pulse/10 to-transparent" />
    </section>
  );
}
