import { useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { ProductPreviewSheet } from '@/src/components/cards/ProductPreviewSheet';
import { SearchBar } from '@/src/components/forms/SearchBar';
import { BannerCarousel } from '@/src/components/layout/BannerCarousel';
import { CategoryChips } from '@/src/components/layout/CategoryChips';
import { ErrorState } from '@/src/components/layout/ErrorState';
import { HomeHeader } from '@/src/components/layout/HomeHeader';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ProductGrid } from '@/src/components/layout/ProductGrid';
import { Loading } from '@/src/components/layout/Loading';
import { ProductGridSkeleton } from '@/src/components/ui/SkeletonBlock';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { useAuth } from '@/src/hooks/useAuth';
import { useProducts } from '@/src/hooks/useProducts';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { snackbar } from '@/src/store/snackbarStore';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors, fontSizes, fonts, layout, textStyles } from '@/src/theme';
import type { Product } from '@/src/types/product';

export default function HomeScreen() {
  const { contentBottomInset } = useTabBarInset();
  const { user } = useAuth();
  const { products, isLoading, error, reload } = useProducts();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
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
    snackbar.info('Lista atualizada');
  };

  if (isLoading && products.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <PageContainer>
          <HomeHeader userName={user?.name ?? 'Visitante'} />
          <SearchBar value="" onChangeText={() => {}} editable={false} />
          <ProductGridSkeleton columns={2} />
        </PageContainer>
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
      {previewProduct ? (
        <ProductPreviewSheet
          product={previewProduct}
          visible
          onClose={() => setPreviewProduct(null)}
        />
      ) : null}

      <ProductGrid
        products={filtered}
        contentBottomInset={contentBottomInset}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <PageContainer>
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
          </PageContainer>
        }
        renderCard={(item) => (
          <ProductCard
            product={item}
            compact
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggle(item)}
            onPress={() => setPreviewProduct(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: layout.sm,
    marginBottom: layout.sm,
    paddingBottom: layout.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
