import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { FadeInView } from '@/src/components/ui/FadeInView';
import { routes } from '@/src/navigation/routes';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors, textStyles } from '@/src/theme';
import { productGrid } from '@/src/utils/productGrid';

const ITEM_WIDTH = productGrid.getItemWidth();

export default function FavoritesScreen() {
  const items = useFavoritesStore((s) => s.items);
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <ScreenContainer contentStyle={styles.pad}>
      <Text style={[textStyles.pageTitle, styles.title]}>Favoritos</Text>
      {items.length > 0 ? (
        <Text style={styles.subtitle}>{items.length} item(ns) salvos</Text>
      ) : null}
      {items.length === 0 ? (
        <EmptyState
          icon="favorite-border"
          title="Nenhum favorito"
          message="Toque no coração nos produtos para salvá-los aqui."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          numColumns={productGrid.columns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ width: ITEM_WIDTH }}>
              <FadeInView index={index % productGrid.columns}>
                <ProductCard
                  product={item}
                  grid
                  width={ITEM_WIDTH}
                  isFavorite
                  onToggleFavorite={() => toggle(item)}
                  onBuyPress={() => router.push(routes.productDetails(item.id))}
                />
              </FadeInView>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pad: { flex: 1, paddingTop: 8 },
  title: { marginBottom: 4 },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
    fontWeight: '600',
  },
  list: { paddingBottom: 24 },
  row: {
    gap: productGrid.gap,
    marginBottom: productGrid.gap,
  },
});
