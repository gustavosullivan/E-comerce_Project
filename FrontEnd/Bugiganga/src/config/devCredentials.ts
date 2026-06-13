import type { LoginFormData } from '@/src/validation/loginSchema';

/** Comprador — navega, compra e favorita */
export const DEV_BUYER_CREDENTIALS = {
  login: 'comprador',
  password: '12345678',
  email: 'comprador@bugigangas.com',
} as const;

/** Vendedor — cadastra produtos, legendas e preços */
export const DEV_SELLER_CREDENTIALS = {
  login: 'vendedor',
  password: 'admin123',
  email: 'vendedor@bugigangas.com',
} as const;

/** Credenciais antigas ainda aceitas no mock */
export const LEGACY_BUYER_CREDENTIALS = {
  login: 'demo',
  password: '12345678',
  email: 'demo@bugigangas.com',
} as const;

export const LEGACY_SELLER_CREDENTIALS = {
  login: 'admin',
  password: 'admin123',
  email: 'admin@bugigangas.com',
} as const;

export const DEV_BUYER_LOGIN_FORM: LoginFormData = {
  email: DEV_BUYER_CREDENTIALS.email,
  password: DEV_BUYER_CREDENTIALS.password,
};

export const DEV_SELLER_LOGIN_FORM: LoginFormData = {
  email: DEV_SELLER_CREDENTIALS.email,
  password: DEV_SELLER_CREDENTIALS.password,
};

export function formatDevLoginHint(): string {
  return `Comprador: ${DEV_BUYER_CREDENTIALS.email} · ${DEV_BUYER_CREDENTIALS.password} | Vendedor: ${DEV_SELLER_CREDENTIALS.email} · ${DEV_SELLER_CREDENTIALS.password}`;
}

export function normalizeDevLoginForm(parsed: Partial<LoginFormData> | null | undefined): LoginFormData {
  const email = parsed?.email?.trim().toLowerCase() ?? '';
  const password = parsed?.password ?? '';

  const isLegacyBuyer =
    email === LEGACY_BUYER_CREDENTIALS.email ||
    email === LEGACY_BUYER_CREDENTIALS.login ||
    email === DEV_BUYER_CREDENTIALS.email ||
    email === DEV_BUYER_CREDENTIALS.login;

  const isLegacySeller =
    email === LEGACY_SELLER_CREDENTIALS.email ||
    email === LEGACY_SELLER_CREDENTIALS.login ||
    email === DEV_SELLER_CREDENTIALS.email ||
    email === DEV_SELLER_CREDENTIALS.login;

  if (isLegacySeller && (password === DEV_SELLER_CREDENTIALS.password || password === LEGACY_SELLER_CREDENTIALS.password)) {
    return DEV_SELLER_LOGIN_FORM;
  }

  if (isLegacyBuyer && (password === DEV_BUYER_CREDENTIALS.password || password === LEGACY_BUYER_CREDENTIALS.password)) {
    return DEV_BUYER_LOGIN_FORM;
  }

  return {
    email: parsed?.email?.trim() || DEV_BUYER_LOGIN_FORM.email,
    password: parsed?.password || DEV_BUYER_LOGIN_FORM.password,
  };
}
