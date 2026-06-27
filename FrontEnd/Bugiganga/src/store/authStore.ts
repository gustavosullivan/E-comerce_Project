import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authPersistStorage } from '@/src/storage/authPersistStorage';
import { hasBuyerProfile, hasSellerProfile, isAdmin, type User, type UserRole } from '@/src/types/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  sessionPassword: string | null;
  avatarUri: string | null;
  isHydrated: boolean;
  setSession: (token: string, user: User, password?: string) => void;
  setUser: (user: User) => void;
  setActiveRole: (role: UserRole) => void;
  setSessionPassword: (password: string) => void;
  setAvatarUri: (uri: string | null) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
  isAdminAccount: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
      setUser: (user) => set({ user }),
      setActiveRole: (role) =>
        set((state) => {
          const user = state.user;
          if (!user) return state;
          if (role === 'BUYER' && !hasBuyerProfile(user)) return state;
          if (role === 'ADMIN' && !hasSellerProfile(user)) return state;
          return { user: { ...user, role } };
        }),
      setSessionPassword: (password) => set({ sessionPassword: password }),
      setAvatarUri: (uri) => set({ avatarUri: uri }),
      clearSession: () =>
        set({
          token: null,
          user: null,
          sessionPassword: null,
          avatarUri: null,
        }),
      setHydrated: (value) => set({ isHydrated: value }),
      isAdminAccount: () => isAdmin(get().user),
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
