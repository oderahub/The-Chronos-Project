'use client';

import { OnboardingTerminal } from '@/components/sections/OnboardingTerminal';
import { ArchivingChamber } from '@/components/sections/ArchivingChamber';
import { MemoryGallery } from '@/components/sections/MemoryGallery';

export default function Home() {
  return (
    <main className="flex w-[300vw]">
      <OnboardingTerminal />
      <ArchivingChamber />
      <MemoryGallery />
    </main>
  );
}
