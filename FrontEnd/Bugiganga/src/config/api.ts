export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8765';

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
    wsById: (id: number) => `/ws/products/${id}`,
    create: '/ws/products',
  },
  cart: '/api/cart',
  orders: '/ws/orders',
  ordersById: (id: number) => `/ws/orders/${id}`,
  ordersAdmin: '/ws/orders/admin',
  wallet: {
    balance: '/auth/wallet/balance',
    debit: '/auth/wallet/debit',
    credit: '/auth/wallet/credit',
  },
  users: {
    profile: '/auth/me',
    address: '/auth/me',
  },
} as const;
