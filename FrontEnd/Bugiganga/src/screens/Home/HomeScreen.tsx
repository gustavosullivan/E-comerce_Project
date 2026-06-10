import { useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { ProductPreviewSheet } from '@/src/components/cards/ProductPreviewSheet';
import { SearchBar } from '@/src/components/forms/SearchBar';
import { BannerCarousel } from '@/src/components/layout/BannerCarousel';
import { CategoryChips } from '@/src/components/layout/CategoryChips';
import { ErrorState } from '@/src/components/layout/ErrorState';
import {
  HOME_STICKY_TOOLBAR_HEIGHT,
  HomeHero,
  HomeToolbar,
} from '@/src/components/layout/HomeHeader';
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
  const favoriteCount = useFavoritesStore((s) => s.items.length);

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

  const displayName = user?.name ?? 'Visitante';

  if (isLoading && products.length === 0) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <View style={styles.stickyToolbar}>
          <PageContainer>
            <HomeToolbar userName={displayName} />
          </PageContainer>
        </View>
        <View style={styles.scrollArea}>
          <PageContainer>
            <SearchBar value="" onChangeText={() => {}} editable={false} />
            <ProductGridSkeleton columns={2} />
          </PageContainer>
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
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {previewProduct ? (
        <ProductPreviewSheet
          product={previewProduct}
          visible
          onClose={() => setPreviewProduct(null)}
        />
      ) : null}

      <View style={styles.stickyToolbar}>
        <PageContainer>
          <HomeToolbar userName={displayName} />
        </PageContainer>
      </View>

      <View style={styles.scrollArea}>
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
              <HomeHero
                userName={displayName}
                productCount={products.length}
                favoriteCount={favoriteCount}
              />
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
              onToggleFavorite={() => toggle(item)}
              onPress={() => setPreviewProduct(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const TOOLBAR_SLOT = HOME_STICKY_TOOLBAR_HEIGHT + layout.md;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  stickyToolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingTop: layout.xs,
    paddingBottom: layout.xs,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  scrollArea: {
    flex: 1,
    paddingTop: TOOLBAR_SLOT,
  },
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
