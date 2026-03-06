import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Moment } from '@/types';

interface MomentState {
  moments: Moment[];
  setMoments: (moments: Moment[]) => void;
  addMoment: (moment: Moment) => void;
  likeMoment: (momentId: string, userId: string) => void;
  deleteMoment: (momentId: string) => void;
}

export const useMomentStore = create<MomentState>()(
  persist(
    (set) => ({
      moments: [],

      setMoments: (moments) => set({ moments }),

      addMoment: (moment) =>
        set((state) => ({
          moments: [moment, ...state.moments],
        })),

      likeMoment: (momentId, userId) =>
        set((state) => ({
          moments: state.moments.map((m) => {
            if (m.id !== momentId) return m;
            const isLiked = m.likes.includes(userId);
            return {
              ...m,
              likes: isLiked
                ? m.likes.filter((id) => id !== userId)
                : [...m.likes, userId],
            };
          }),
        })),

      deleteMoment: (momentId) =>
        set((state) => ({
          moments: state.moments.filter((m) => m.id !== momentId),
        })),
    }),
    {
      name: 'moment-storage',
    }
  )
);
