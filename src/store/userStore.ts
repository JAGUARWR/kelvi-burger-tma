import { create } from 'zustand';
import { fetchMe, type ApiUserProfile } from '../services/api';

interface UserStore {
  profile: ApiUserProfile | null;
  loading: boolean;
  loadProfile: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  loading: false,

  loadProfile: async () => {
    set({ loading: true });
    try {
      const profile = await fetchMe();
      set({ profile, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
