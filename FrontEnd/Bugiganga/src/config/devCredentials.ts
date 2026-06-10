import type { LoginFormData } from '@/src/validation/loginSchema';

/** Credenciais mock de desenvolvimento — ver AGENTS.md */
export const DEV_MOCK_CREDENTIALS = {
  login: 'demo',
  password: '12345678',
  email: 'demo@bugigangas.com',
} as const;

export const DEV_MOCK_LOGIN_FORM: LoginFormData = {
  email: DEV_MOCK_CREDENTIALS.email,
  password: DEV_MOCK_CREDENTIALS.password,
};

export function formatDevLoginHint(): string {
  return `Demo: ${DEV_MOCK_CREDENTIALS.email} · ${DEV_MOCK_CREDENTIALS.password}`;
}
