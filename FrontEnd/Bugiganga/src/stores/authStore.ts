import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authPersistStorage } from '@/src/storage/authPersistStorage';
import type { User } from '@/src/types/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  setSession: (token: string, user: User) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isHydrated: false,
      setSession: (token, user) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'bugigangas-auth',
      storage: authPersistStorage,
      skipHydration: true,
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn('[authStore] Falha ao restaurar sessão:', error);
        }
        useAuthStore.getState().setHydrated(true);
      },
    },
  ),
);
