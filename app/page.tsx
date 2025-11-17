'use client';

import { LandingPage } from '@/components/sections/LandingPage';
import { OnboardingTerminal } from '@/components/sections/OnboardingTerminal';
import { ArchivingChamber } from '@/components/sections/ArchivingChamber';
import { MemoryGallery } from '@/components/sections/MemoryGallery';

export default function Home() {
  return (
    <main className="flex w-[400vw]">
      <LandingPage />
      <OnboardingTerminal />
      <ArchivingChamber />
      <MemoryGallery />
    </main>
  );
}
