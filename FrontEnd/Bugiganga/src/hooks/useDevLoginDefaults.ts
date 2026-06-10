import { useCallback } from 'react';

import { USE_MOCK } from '@/src/config/api';
import { DEV_MOCK_LOGIN_FORM } from '@/src/config/devCredentials';
import { devLoginStorage } from '@/src/storage/devLoginStorage';
import type { LoginFormData } from '@/src/validation/loginSchema';

/** Preenche login com credenciais demo enquanto USE_MOCK estiver ativo. */
export function useDevLoginDefaults() {
  const defaults = DEV_MOCK_LOGIN_FORM;

  const save = useCallback((data: LoginFormData) => {
    if (!USE_MOCK) return;
    void devLoginStorage.save(data);
  }, []);

  return { defaults, ready: true, save };
};
