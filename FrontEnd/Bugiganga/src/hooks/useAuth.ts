import { router } from 'expo-router';
import { useCallback, useState } from 'react';

import { authService } from '@/src/services/authService';
import { useAuthStore } from '@/src/stores/authStore';
import type { ApiError } from '@/src/types/api';
import type { LoginFormData } from '@/src/validation/loginSchema';
import type { RegisterFormData } from '@/src/validation/registerSchema';

function toErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as ApiError).message);
  }
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro. Tente novamente.';
}

function usernameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'user';
  return local.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 30) || 'user';
}

export function useAuth() {
  const { token, user, isHydrated, setSession, clearSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.login(data);
        setSession(response.token, response.user);
        router.replace('/(tabs)');
      } catch (err) {
        setError(toErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [setSession],
  );

  const register = useCallback(
    async (data: RegisterFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        const { confirmPassword: _, ...rest } = data;
        const response = await authService.register({
          name: rest.name,
          email: rest.email,
          password: rest.password,
          username: usernameFromEmail(rest.email),
        });
        setSession(response.token, response.user);
        router.replace('/(tabs)');
      } catch (err) {
        setError(toErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [setSession],
  );

  const logout = useCallback(() => {
    clearSession();
    router.replace('/login');
  }, [clearSession]);

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    isHydrated,
    isLoading,
    error,
    clearError,
    login,
    register,
    logout,
  };
}
