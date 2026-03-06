import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  sidebarOpen: boolean;
  modalOpen: string | null;
  theme: Theme;
  setSidebarOpen: (open: boolean) => void;
  setModalOpen: (modal: string | null) => void;
  setTheme: (theme: Theme) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      modalOpen: null,
      theme: 'system',

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setModalOpen: (modal) => set({ modalOpen: modal }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
