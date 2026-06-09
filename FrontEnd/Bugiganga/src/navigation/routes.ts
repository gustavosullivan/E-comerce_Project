import type { Href } from 'expo-router';

/** Rotas do Expo Router (file-based). Equivalente ao React Navigation. */
export const routes = {
  login: '/login' as Href,
  register: '/register' as Href,
  home: '/(tabs)' as Href,
  favorites: '/(tabs)/favorites' as Href,
  cart: '/(tabs)/cart' as Href,
  profile: '/(tabs)/profile' as Href,
  account: '/account' as Href,
  productList: '/product' as Href,
  checkout: '/checkout' as Href,
  productDetails: (id: number): Href => ({
    pathname: '/product/[id]',
    params: { id: String(id) },
  }),
} as const;
