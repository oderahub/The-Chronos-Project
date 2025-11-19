import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Capsule {
  id: string;
  story: string;
  imagePrompts: string[];
  createdAt: number;
}

interface CapsuleState {
  capsules: Capsule[];
  addCapsule: (capsule: Omit<Capsule, 'id' | 'createdAt'>) => void;
  removeCapsule: (id: string) => void;
}

export const useCapsuleStore = create<CapsuleState>()(
  persist(
    (set) => ({
      capsules: [],
      addCapsule: (capsule) =>
        set((state) => ({
          capsules: [
            {
              ...capsule,
              id: Math.random().toString(36).slice(2),
              createdAt: Date.now(),
            },
            ...state.capsules,
          ],
        })),
      removeCapsule: (id) =>
        set((state) => ({
          capsules: state.capsules.filter((capsule) => capsule.id !== id),
        })),
    }),
    {
      name: 'chronos-vault',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);
