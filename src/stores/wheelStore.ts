import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WheelItem } from '@/types';

interface WheelState {
  wheelItems: WheelItem[];
  isSpinning: boolean;
  lastWinner: WheelItem | null;
  spinWheel: () => void;
  setWheelItems: (items: WheelItem[]) => void;
}

export const useWheelStore = create<WheelState>()(
  persist(
    (set) => ({
      wheelItems: [],
      isSpinning: false,
      lastWinner: null,

      spinWheel: () => set({ isSpinning: true }),

      setWheelItems: (items) => set({ wheelItems: items }),
    }),
    {
      name: 'wheel-storage',
      partialize: (state) => ({ wheelItems: state.wheelItems }),
    }
  )
);
