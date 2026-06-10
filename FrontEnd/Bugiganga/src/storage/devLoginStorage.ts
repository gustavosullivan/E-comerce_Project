import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { DEV_MOCK_LOGIN_FORM } from '@/src/config/devCredentials';
import type { LoginFormData } from '@/src/validation/loginSchema';

const STORAGE_KEY = 'bugigangas-dev-login';

const memory = new Map<string, string>();

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return memory.get(key) ?? null;
      }
    }
    return memory.get(key) ?? null;
  }
  return AsyncStorage.getItem(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        /* fallthrough */
      }
    }
    memory.set(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
}

export const devLoginStorage = {
  async get(): Promise<LoginFormData> {
    try {
      const raw = await getItem(STORAGE_KEY);
      if (!raw) return DEV_MOCK_LOGIN_FORM;

      const parsed = JSON.parse(raw) as Partial<LoginFormData>;
      return {
        email: parsed.email ?? DEV_MOCK_LOGIN_FORM.email,
        password: parsed.password ?? DEV_MOCK_LOGIN_FORM.password,
      };
    } catch {
      return DEV_MOCK_LOGIN_FORM;
    }
  },

  async save(data: LoginFormData): Promise<void> {
    await setItem(STORAGE_KEY, JSON.stringify(data));
  },
};
