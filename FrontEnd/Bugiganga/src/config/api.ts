/** Mantem mocks nas areas que a API Spring ainda nao cobre. */
export const USE_MOCK = true;

const parseBooleanEnv = (value: string | undefined, fallback: boolean) => {
  if (value == null) return fallback;
  return value.toLowerCase() === 'true';
};

export const USE_REAL_AUTH = parseBooleanEnv(process.env.EXPO_PUBLIC_USE_REAL_AUTH, true);
export const USE_REAL_PRODUCT_DETAILS = parseBooleanEnv(
  process.env.EXPO_PUBLIC_USE_REAL_PRODUCT_DETAILS,
  true,
);
export const USE_REAL_PRODUCT_LIST = parseBooleanEnv(
  process.env.EXPO_PUBLIC_USE_REAL_PRODUCT_LIST,
  false,
);
export const USE_REAL_PRODUCT_MUTATIONS = parseBooleanEnv(
  process.env.EXPO_PUBLIC_USE_REAL_PRODUCT_MUTATIONS,
  false,
);

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8765';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/signin',
    register: '/auth/signup',
    me: '/auth/me',
    forgotPassword: '/api/auth/forgot-password',
    changePassword: '/api/auth/change-password',
  },
  products: {
    list: '/products',
    byId: (id: number) => `/products/${id}`,
  },
  cart: '/api/cart',
  orders: '/api/orders',
  wallet: {
    balance: '/api/wallet/balance',
    debit: '/api/wallet/debit',
  },
  users: {
    profile: '/api/users/me',
    address: '/api/users/me/address',
  },
} as const;
