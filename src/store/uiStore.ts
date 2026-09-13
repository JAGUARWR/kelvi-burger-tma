import { create } from 'zustand';

interface UIStore {
  isLoading: boolean;
}

export const useUIStore = create<UIStore>(() => ({
  isLoading: false,
}));
