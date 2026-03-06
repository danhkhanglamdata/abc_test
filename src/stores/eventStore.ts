import { create } from 'zustand';
import { PlatformEvent } from '@/types';
import { createEvent as dbCreateEvent, getEvent, getAllEvents, updateEvent as dbUpdateEvent, deleteEvent as dbDeleteEvent } from '@/lib/db';
import { nanoid } from 'nanoid';

interface EventState {
  events: PlatformEvent[];
  currentEvent: PlatformEvent | null;
  loading: boolean;
  loadEvents: () => Promise<void>;
  loadEvent: (id: string) => Promise<void>;
  createEvent: (data: Omit<PlatformEvent, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateEvent: (id: string, data: Partial<PlatformEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  setCurrentEvent: (event: PlatformEvent | null) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  currentEvent: null,
  loading: false,

  loadEvents: async () => {
    set({ loading: true });
    const events = await getAllEvents();
    set({ events: events.reverse(), loading: false });
  },

  loadEvent: async (id: string) => {
    set({ loading: true });
    const event = await getEvent(id);
    set({ currentEvent: event || null, loading: false });
  },

  createEvent: async (data) => {
    const id = nanoid(10);
    const now = new Date().toISOString();
    const event: PlatformEvent = {
      ...data,
      id,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    await dbCreateEvent(event);
    set((state) => ({ events: [event, ...state.events] }));
    return id;
  },

  updateEvent: async (id: string, data: Partial<PlatformEvent>) => {
    const { currentEvent, events } = get();
    if (currentEvent?.id === id) {
      const updated = { ...currentEvent, ...data, updatedAt: new Date().toISOString() };
      await dbUpdateEvent(updated);
      set({
        currentEvent: updated,
        events: events.map((e) => (e.id === id ? updated : e)),
      });
    }
  },

  deleteEvent: async (id: string) => {
    await dbDeleteEvent(id);
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
      currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
    }));
  },

  setCurrentEvent: (event) => set({ currentEvent: event }),
}));
