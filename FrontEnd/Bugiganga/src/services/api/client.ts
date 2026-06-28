import axios, { isAxiosError, type AxiosError } from 'axios';

import { API_BASE_URL } from '@/src/config/api';
import { useAuthStore } from '@/src/store/authStore';
import type { ApiError } from '@/src/types/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function mapAxiosError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as any;
    let message = error.message ?? 'Erro na requisição';
    
    if (typeof responseData === 'string') {
      message = responseData;
    } else if (responseData?.message) {
      message = responseData.message;
    }

    return {
      message,
      statusCode: error.response?.status,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return { message };
    }
  }
  return { message: 'Erro inesperado' };
}

export function getErrorMessage(error: unknown, fallback = 'Erro inesperado'): string {
  return mapAxiosError(error).message || fallback;
}

export function throwServiceError(error: unknown): never {
  throw new Error(getErrorMessage(error));
}
