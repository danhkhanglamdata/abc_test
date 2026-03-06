import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnergyLevel } from '@/types';

interface EnergyState {
  energyLevels: EnergyLevel[];
  userVotes: Record<string, EnergyLevel>; // momentId -> energyLevel
  voteEnergy: (momentId: string, level: EnergyLevel) => void;
  setEnergyLevels: (levels: EnergyLevel[]) => void;
}

export const useEnergyStore = create<EnergyState>()(
  persist(
    (set) => ({
      energyLevels: ['low', 'medium', 'high', 'peak'],
      userVotes: {},

      voteEnergy: (momentId, level) =>
        set((state) => ({
          userVotes: { ...state.userVotes, [momentId]: level },
        })),

      setEnergyLevels: (levels) => set({ energyLevels: levels }),
    }),
    {
      name: 'energy-storage',
    }
  )
);
