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
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastInteractionRef = useRef<number>(Date.now());
  const isActiveRef = useRef<boolean>(false);

  useEffect(() => {
    const INACTIVITY_TIME = 2 * 60 * 1000; // 2 minutes in milliseconds
    const AUTO_SCROLL_INTERVAL = 7000; // 7 seconds

    const handleUserInteraction = () => {
      lastInteractionRef.current = Date.now();
      isActiveRef.current = true;

      // Clear existing inactivity timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Set new inactivity timer
      inactivityTimerRef.current = setTimeout(() => {
        isActiveRef.current = false;
      }, INACTIVITY_TIME);

      // Stop auto-scroll while user is active
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };

    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);

      autoScrollIntervalRef.current = setInterval(() => {
        if (!isActiveRef.current) {
          const currentScroll = window.scrollX;
          const maxScroll = window.innerWidth * 3;

          if (currentScroll < maxScroll) {
            window.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
          }
        }
      }, AUTO_SCROLL_INTERVAL);
    };

    // Start auto-scroll initially
    startAutoScroll();

    // Add interaction listeners
    const interactionEvents = ['mousemove', 'keydown', 'click', 'touchstart', 'touchmove', 'wheel'];

    interactionEvents.forEach((event) => {
      window.addEventListener(event, handleUserInteraction);
    });

    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

      interactionEvents.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
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
