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
    credit: '/api/wallet/credit',
  },
  users: {
    profile: '/api/users/me',
    address: '/api/users/me/address',
  },
} as const;
