import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

const memory = new Map<string, string>();

function createUniversalStorage(): StateStorage {
  return {
    getItem: (name) => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            return window.localStorage.getItem(name);
          } catch {
            return memory.get(name) ?? null;
          }
        }
        return memory.get(name) ?? null;
      }
      return AsyncStorage.getItem(name);
    },
    setItem: (name, value) => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.setItem(name, value);
            return;
          } catch {
            /* fallthrough */
          }
        }
        memory.set(name, value);
        return;
      }
      void AsyncStorage.setItem(name, value);
    },
    removeItem: (name) => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.removeItem(name);
            return;
          } catch {
            /* fallthrough */
          }
        }
        memory.delete(name);
        return;
      }
      void AsyncStorage.removeItem(name);
    },
  };
}

export const authPersistStorage = createJSONStorage(() => createUniversalStorage());
