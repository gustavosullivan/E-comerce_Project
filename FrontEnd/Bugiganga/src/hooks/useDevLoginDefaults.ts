import { useCallback, useState } from 'react';

import type { LoginFormData } from '@/src/validation/loginSchema';

/** Credenciais demo desativadas — login sempre via API. */
export function useDevLoginDefaults() {
  const [defaults] = useState<LoginFormData>({ email: '', password: '' });

  const save = useCallback(() => undefined, []);

  return { defaults, ready: true, save };
}
