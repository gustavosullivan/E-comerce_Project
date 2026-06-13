import { useCallback, useEffect, useState } from 'react';

import { USE_MOCK } from '@/src/config/api';
import { DEV_BUYER_LOGIN_FORM } from '@/src/config/devCredentials';
import { devLoginStorage } from '@/src/storage/devLoginStorage';
import type { LoginFormData } from '@/src/validation/loginSchema';

/** Preenche login com credenciais demo enquanto USE_MOCK estiver ativo. */
export function useDevLoginDefaults() {
  const [defaults, setDefaults] = useState<LoginFormData>(DEV_BUYER_LOGIN_FORM);
  const [ready, setReady] = useState(!USE_MOCK);

  useEffect(() => {
    if (!USE_MOCK) return;

    let active = true;
    void devLoginStorage.get().then((saved) => {
      if (active) setDefaults(saved);
    }).finally(() => {
      if (active) setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const save = useCallback((data: LoginFormData) => {
    if (!USE_MOCK) return;
    void devLoginStorage.save(data);
  }, []);

  return { defaults, ready, save };
};
