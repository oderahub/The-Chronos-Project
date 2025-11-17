import { create } from 'zustand';

export interface Capsule {
  story: string;
  imagePrompts: string[];
}

interface CapsuleState {
  capsules: Capsule[];
  addCapsule: (capsule: Capsule) => void;
}

export const useCapsuleStore = create<CapsuleState>((set) => ({
  capsules: [],
  addCapsule: (capsule) => set((state) => ({ capsules: [capsule, ...state.capsules] })),
}));
