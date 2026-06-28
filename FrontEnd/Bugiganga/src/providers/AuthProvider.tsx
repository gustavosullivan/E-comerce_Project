import { type PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { userService } from '@/src/services/userService';
import { useProductCatalogStore } from '@/src/store/productCatalogStore';
import { colors } from '@/src/theme';
import { useAuthStore } from '@/src/store/authStore';

/** Aguarda hidratação do Zustand (AsyncStorage) antes de renderizar rotas */
export function AuthProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const finish = () => {
      void useProductCatalogStore.persist.rehydrate();
      useAuthStore.getState().setHydrated(true);
      setReady(true);
    };

    if (useAuthStore.persist.hasHydrated()) {
      finish();
      return;
    }

    const unsub = useAuthStore.persist.onFinishHydration(finish);
    void useAuthStore.persist.rehydrate();

    const fallback = setTimeout(finish, 500);

    return () => {
      unsub();
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    void userService.getProfile().catch(() => {
      // Mantém avatar local se a API estiver indisponível.
    });
  }, [ready]);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return children;
}
