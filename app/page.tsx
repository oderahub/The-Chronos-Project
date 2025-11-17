'use client';

import { useEffect, useRef } from 'react';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { AudioPlayer } from '@/components/AudioPlayer';
import { LandingPage } from '@/components/sections/LandingPage';
import { OnboardingTerminal } from '@/components/sections/OnboardingTerminal';
import { ArchivingChamber } from '@/components/sections/ArchivingChamber';
import { MemoryGallery } from '@/components/sections/MemoryGallery';

export default function Home() {
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);

      autoScrollIntervalRef.current = setInterval(() => {
        // Check if textarea is focused
        const textareaFocused = document.activeElement?.tagName === 'TEXTAREA';

        if (!textareaFocused) {
          const currentScroll = window.scrollX;
          const maxScroll = window.innerWidth * 3;

          if (currentScroll < maxScroll) {
            window.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
          }
        }
      }, 7000);
    };

    startAutoScroll();

    // Periodically check and restart auto-scroll if needed
    checkInterval = setInterval(() => {
      if (!autoScrollIntervalRef.current) {
        startAutoScroll();
      }
    }, 1000);

    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
      if (checkInterval) clearInterval(checkInterval);
    };
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
