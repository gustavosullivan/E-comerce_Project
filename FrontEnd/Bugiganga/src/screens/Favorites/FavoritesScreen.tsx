import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FavoriteGlassCard } from '@/src/components/cards/FavoriteGlassCard';
import { ProductPreviewSheet } from '@/src/components/cards/ProductPreviewSheet';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { WarmAppShell } from '@/src/components/layout/WarmAppShell';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { useFavorites } from '@/src/hooks/useFavorites';
import { layout } from '@/src/theme';
import type { Product } from '@/src/types/product';

export default function FavoritesScreen() {
  const { contentBottomInset } = useTabBarInset();
  const { items, toggle } = useFavorites();
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  return (
    <WarmAppShell>
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        {previewProduct ? (
          <ProductPreviewSheet
            product={previewProduct}
            visible
            onClose={() => setPreviewProduct(null)}
          />
        ) : null}

        {items.length === 0 ? (
          <>
            <PageContainer>
              <ScreenHeader
                title="Favoritos"
                icon="favorite"
                subtitle="Nenhum produto salvo"
                variant="warm"
              />
            </PageContainer>
            <EmptyState
              icon="favorite-border"
              message="Você ainda não salvou nenhum produto."
              variant="warm"
            />
          </>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.list, { paddingBottom: contentBottomInset + layout.lg }]}
            ListHeaderComponent={
              <PageContainer>
                <ScreenHeader
                  title="Favoritos"
                  icon="favorite"
                  subtitle={`${items.length} produto(s) salvos`}
                  variant="warm"
                />
              </PageContainer>
            }
            renderItem={({ item }) => (
              <PageContainer>
                <FavoriteGlassCard
                  product={item}
                  variant="warm"
                  onToggleFavorite={() => toggle(item)}
                  onPress={() => setPreviewProduct(item)}
                />
              </PageContainer>
            )}
          />
        )}
      </SafeAreaView>
    </WarmAppShell>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  list: {
    alignItems: 'center',
  },
});
