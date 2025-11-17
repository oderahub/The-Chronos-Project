'use client';

import { useEffect } from 'react';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { AudioPlayer } from '@/components/AudioPlayer';
import { LandingPage } from '@/components/sections/LandingPage';
import { OnboardingTerminal } from '@/components/sections/OnboardingTerminal';
import { ArchivingChamber } from '@/components/sections/ArchivingChamber';
import { MemoryGallery } from '@/components/sections/MemoryGallery';

export default function Home() {
  useEffect(() => {
    const autoScrollInterval = setInterval(() => {
      const currentScroll = window.scrollX;
      const maxScroll = window.innerWidth * 3;

      if (currentScroll < maxScroll) {
        window.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
      }
    }, 7000);

    return () => clearInterval(autoScrollInterval);
  }, []);

  return (
    <>
      <LoadingAnimation />
      <AudioPlayer />
      <main className="flex w-[400vw]">
        <LandingPage />
        <OnboardingTerminal />
        <ArchivingChamber />
        <MemoryGallery />
      </main>
    </>
  );
}
