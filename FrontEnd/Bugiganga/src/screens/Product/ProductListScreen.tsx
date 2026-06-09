import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { SearchBar } from '@/src/components/forms/SearchBar';
import { ErrorState } from '@/src/components/layout/ErrorState';
import { Loading } from '@/src/components/layout/Loading';
import { useProducts } from '@/src/hooks/useProducts';
import { routes } from '@/src/navigation/routes';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors } from '@/src/theme';
import { productGrid } from '@/src/utils/productGrid';

const ITEM_WIDTH = productGrid.getItemWidth();

export default function ProductListScreen() {
  const { products, isLoading, error, reload } = useProducts();
  const [query, setQuery] = useState('');
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.toolbar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={26} color={colors.primary} />
        </Pressable>
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
        <Pressable style={styles.filterBtn}>
          <MaterialIcons name="tune" size={24} color={colors.primary} />
        </Pressable>
      </View>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          numColumns={productGrid.columns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={{ width: ITEM_WIDTH }}>
              <ProductCard
                product={item}
                grid
                width={ITEM_WIDTH}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={() => toggle(item)}
                onBuyPress={() => router.push(routes.productDetails(item.id))}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchWrap: { flex: 1 },
  filterBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 3,
    backgroundColor: colors.card,
  },
  list: {
    paddingHorizontal: productGrid.paddingH,
    paddingBottom: 24,
  },
  row: {
    gap: productGrid.gap,
    marginBottom: productGrid.gap,
  },
});
