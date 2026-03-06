import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Event } from '@/types';

interface EventState {
  currentEvent: Event | null;
  events: Event[];
  setCurrentEvent: (event: Event | null) => void;
  addEvent: (event: Event) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      currentEvent: null,
      events: [],

      setCurrentEvent: (event) => set({ currentEvent: event }),

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),
    }),
    {
      name: 'event-storage',
    }
  )
);
