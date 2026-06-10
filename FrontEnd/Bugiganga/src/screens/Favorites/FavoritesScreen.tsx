import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FavoriteGlassCard } from '@/src/components/cards/FavoriteGlassCard';
import { ProductPreviewSheet } from '@/src/components/cards/ProductPreviewSheet';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors, layout } from '@/src/theme';
import type { Product } from '@/src/types/product';

export default function FavoritesScreen() {
  const items = useFavoritesStore((s) => s.items);
  const toggle = useFavoritesStore((s) => s.toggle);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  return (
    <SafeAreaView style={styles.screen}>
      {previewProduct ? (
        <ProductPreviewSheet
          product={previewProduct}
          visible
          onClose={() => setPreviewProduct(null)}
        />
      ) : null}

      {items.length === 0 ? (
        <EmptyState icon="favorite-border" message="Você ainda não salvou nenhum produto." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <PageContainer>
              <ScreenHeader
                title="Favoritos"
                subtitle={`${items.length} produto(s) salvos`}
              />
            </PageContainer>
          }
          renderItem={({ item }) => (
            <PageContainer>
              <FavoriteGlassCard
                product={item}
                onToggleFavorite={() => toggle(item)}
                onPress={() => setPreviewProduct(item)}
              />
            </PageContainer>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: {
    paddingBottom: layout.lg,
    alignItems: 'center',
  },
});
