import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, throwServiceError } from '@/src/services/api/client';
import { authMock } from '@/src/services/mocks/authMock';
import { useAuthStore } from '@/src/store/authStore';
import type { User } from '@/src/types/auth';
import type { UpdateProfileRequest, UserProfile } from '@/src/types/user';

function usernameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'user';
  return local.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 30) || 'user';
}

function toUserProfile(user: User, avatarUrl?: string | null): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    avatarUrl: avatarUrl?.trim() || undefined,
  };
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      if (USE_MOCK) {
        const { user, avatarUri } = useAuthStore.getState();
        if (!user) {
          const fallback = await authMock.getMe();
          return toUserProfile(fallback, avatarUri);
        }
        return toUserProfile(user, avatarUri);
      }
      const response = await apiClient.get<UserProfile>(API_ENDPOINTS.users.profile);
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      if (USE_MOCK) {
        const { user, avatarUri } = useAuthStore.getState();
        if (!user) {
          throw new Error('Usuário não autenticado');
        }

        const nextAvatar =
          data.avatarUrl !== undefined ? data.avatarUrl.trim() || null : avatarUri;
        const nextName = data.name?.trim() ?? user.name;
        const nextEmail = data.email?.trim().toLowerCase() ?? user.email;
        const updatedUser: User = {
          ...user,
          name: nextName,
          email: nextEmail,
          username: data.email !== undefined ? usernameFromEmail(nextEmail) : user.username,
        };

        if (data.avatarUrl !== undefined) {
          useAuthStore.getState().setAvatarUri(nextAvatar);
        }
        if (data.name !== undefined || data.email !== undefined) {
          useAuthStore.getState().setUser(updatedUser);
        }

        return toUserProfile(updatedUser, nextAvatar);
      }
      const response = await apiClient.put<UserProfile>(API_ENDPOINTS.users.profile, data);
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },
};
