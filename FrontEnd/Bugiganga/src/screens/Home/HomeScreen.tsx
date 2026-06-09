import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { BannerCarousel } from '@/src/components/layout/BannerCarousel';
import { CategoryChips } from '@/src/components/layout/CategoryChips';
import { ErrorState } from '@/src/components/layout/ErrorState';
import { HomeHeader } from '@/src/components/layout/HomeHeader';
import { SearchBar } from '@/src/components/forms/SearchBar';
import { FadeInView } from '@/src/components/ui/FadeInView';
import { ProductGridSkeleton } from '@/src/components/ui/SkeletonBlock';
import { useAuth } from '@/src/hooks/useAuth';
import { useProducts } from '@/src/hooks/useProducts';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { routes } from '@/src/navigation/routes';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors, fonts, textStyles } from '@/src/theme';
import { productGrid } from '@/src/utils/productGrid';

const ITEM_WIDTH = productGrid.getItemWidth();

export default function HomeScreen() {
  const { user } = useAuth();
  const { products, isLoading, error, reload } = useProducts();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  const filtered = useMemo(() => {
    let list = products;
    if (categoryId != null) {
      list = list.filter((p) => p.categoryId === categoryId);
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }, [products, query, categoryId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  if (isLoading && products.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.skeletonPad}>
          <HomeHeader userName={user?.name ?? 'Visitante'} />
          <SearchBar value="" onChangeText={() => {}} editable={false} />
          <ProductGridSkeleton columns={productGrid.columns} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && products.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <ErrorState message={error} onRetry={reload} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={productGrid.columns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <FadeInView index={0}>
            <HomeHeader userName={user?.name ?? 'Visitante'} />
            <SearchBar value={query} onChangeText={setQuery} />
            <BannerCarousel />
            <CategoryChips
              categories={MOCK_CATEGORIES}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
            <View style={styles.sectionHead}>
              <Text style={textStyles.sectionTitle}>
                {categoryId ? 'Filtrados' : 'Destaques'}
              </Text>
              <Text style={styles.count}>{filtered.length} itens</Text>
            </View>
          </FadeInView>
        }
        ListEmptyComponent={
          <FadeInView>
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Nada por aqui</Text>
              <Text style={styles.emptyText}>Tente outra busca ou categoria.</Text>
            </View>
          </FadeInView>
        }
        renderItem={({ item, index }) => (
          <View style={[styles.cell, { width: ITEM_WIDTH }]}>
            <FadeInView index={index % productGrid.columns}>
              <ProductCard
                product={item}
                grid
                width={ITEM_WIDTH}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={() => toggle(item)}
                onBuyPress={() => router.push(routes.productDetails(item.id))}
              />
            </FadeInView>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  skeletonPad: {
    paddingHorizontal: productGrid.paddingH,
    paddingTop: 4,
  },
  list: {
    paddingHorizontal: productGrid.paddingH,
    paddingBottom: 28,
  },
  row: {
    gap: productGrid.gap,
    marginBottom: productGrid.gap,
  },
  cell: {},
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
