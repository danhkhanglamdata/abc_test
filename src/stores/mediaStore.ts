import { create } from 'zustand';
import { PlatformMedia } from '@/types';
import { addMedia as dbAddMedia, getMediaByEvent, deleteMedia as dbDeleteMedia } from '@/lib/db';
import { nanoid } from 'nanoid';

interface MediaState {
  media: PlatformMedia[];
  loading: boolean;
  loadMedia: (eventId: string) => Promise<void>;
  addMedia: (data: Omit<PlatformMedia, 'id' | 'uploadedAt'>) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
}

export const useMediaStore = create<MediaState>((set) => ({
  media: [],
  loading: false,

  loadMedia: async (eventId: string) => {
    set({ loading: true });
    const media = await getMediaByEvent(eventId);
    set({ media: media.reverse(), loading: false });
  },

  addMedia: async (data) => {
    const id = nanoid(10);
    const media: PlatformMedia = {
      ...data,
      id,
      uploadedAt: new Date().toISOString(),
    };
    await dbAddMedia(media);
    set((state) => ({ media: [media, ...state.media] }));
  },

  deleteMedia: async (id: string) => {
    await dbDeleteMedia(id);
    set((state) => ({ media: state.media.filter((m) => m.id !== id) }));
  },
}));
