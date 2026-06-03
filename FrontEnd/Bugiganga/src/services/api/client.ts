import axios, { isAxiosError, type AxiosError } from 'axios';

import { API_BASE_URL } from '@/src/config/api';
import { useAuthStore } from '@/src/stores/authStore';
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
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      message: axiosError.response?.data?.message ?? axiosError.message ?? 'Erro na requisição',
      statusCode: axiosError.response?.status,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Erro inesperado' };
}
