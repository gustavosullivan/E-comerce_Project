import type { Href } from 'expo-router';

/** Rotas do Expo Router (file-based). Equivalente ao React Navigation. */
export const routes = {
  login: '/login' as Href,
  register: '/register' as Href,
  home: '/(tabs)' as Href,
  favorites: '/(tabs)/favorites' as Href,
  cart: '/(tabs)/cart' as Href,
  profile: '/(tabs)/profile' as Href,
  settings: '/settings' as Href,
  admin: '/admin' as Href,
  adminProducts: '/admin/products' as Href,
  adminProductNew: '/(tabs)/novo' as Href,
  adminProductEdit: (id: number): Href => ({
    pathname: '/admin/products/[id]',
    params: { id: String(id) },
  }),
  productList: '/product' as Href,
  checkout: '/checkout' as Href,
  orderHistory: '/orders' as Href,
  orderReceipt: (id: number, isNew = false): Href => ({
    pathname: '/orders/[id]',
    params: { id: String(id), ...(isNew ? { fresh: '1' } : {}) },
  }),
  productDetails: (id: number): Href => ({
    pathname: '/product/[id]',
    params: { id: String(id) },
  }),
} as const;
