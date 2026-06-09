import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authPersistStorage } from '@/src/storage/authPersistStorage';
import type { User } from '@/src/types/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  sessionPassword: string | null;
  avatarUri: string | null;
  isHydrated: boolean;
  setSession: (token: string, user: User, password?: string) => void;
  setSessionPassword: (password: string) => void;
  setAvatarUri: (uri: string | null) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      sessionPassword: null,
      avatarUri: null,
      isHydrated: false,
      setSession: (token, user, password) =>
        set({
          token,
          user,
          sessionPassword: password ?? null,
        }),
      setSessionPassword: (password) => set({ sessionPassword: password }),
      setAvatarUri: (uri) => set({ avatarUri: uri }),
      clearSession: () => set({ token: null, user: null, sessionPassword: null, avatarUri: null }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'bugigangas-auth',
      storage: authPersistStorage,
      skipHydration: true,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        sessionPassword: state.sessionPassword,
        avatarUri: state.avatarUri,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn('[authStore] Falha ao restaurar sessão:', error);
        }
        useAuthStore.getState().setHydrated(true);
      },
    },
  ),
);
