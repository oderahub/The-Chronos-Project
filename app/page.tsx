'use client';

import { useEffect, useRef, useState } from 'react';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { AudioPlayer } from '@/components/AudioPlayer';
import { LandingPage } from '@/components/sections/LandingPage';
import { OnboardingTerminal } from '@/components/sections/OnboardingTerminal';
import { ArchivingChamber } from '@/components/sections/ArchivingChamber';
import { MemoryGallery } from '@/components/sections/MemoryGallery';

export default function Home() {
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  useEffect(() => {
    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);

      autoScrollIntervalRef.current = setInterval(() => {
        if (!isUserInteracting) {
          const currentScroll = window.scrollX;
          const maxScroll = window.innerWidth * 3;

          if (currentScroll < maxScroll) {
            window.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
          }
        }
      }, 7000);
    };

    const handleUserInteraction = () => {
      setIsUserInteracting(true);
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };

    const handleUserInactive = () => {
      setIsUserInteracting(false);
      startAutoScroll();
    };

    // Listen for user interaction
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.addEventListener('focus', handleUserInteraction);
      textarea.addEventListener('blur', handleUserInactive);
    }

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
      if (textarea) {
        textarea.removeEventListener('focus', handleUserInteraction);
        textarea.removeEventListener('blur', handleUserInactive);
      }
    };
  }, [isUserInteracting]);

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
