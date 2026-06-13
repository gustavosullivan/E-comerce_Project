/** Troque para false quando o backend Spring Boot estiver disponível */
export const USE_MOCK = true;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
    forgotPassword: '/api/auth/forgot-password',
    changePassword: '/api/auth/change-password',
  },
  products: {
    list: '/api/products',
    byId: (id: number) => `/api/products/${id}`,
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
