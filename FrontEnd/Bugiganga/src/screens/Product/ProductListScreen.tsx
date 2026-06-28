import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { ProductPreviewSheet } from '@/src/components/cards/ProductPreviewSheet';
import {
  PriceFilterChips,
  ProductFiltersSheet,
  hasActiveProductFilters,
} from '@/src/components/forms/ProductFiltersSheet';
import { SearchBar } from '@/src/components/forms/SearchBar';
import { CategoryChips } from '@/src/components/layout/CategoryChips';
import { ErrorState } from '@/src/components/layout/ErrorState';
import { Loading } from '@/src/components/layout/Loading';
import { ProductGrid } from '@/src/components/layout/ProductGrid';
import { useProducts } from '@/src/hooks/useProducts';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { useFavorites } from '@/src/hooks/useFavorites';
import { colors, fontSizes, fonts } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { EMPTY_PRODUCT_FILTERS, type ProductFilters } from '@/src/types/productFilters';
import { applyProductFilters, countActiveProductFilters } from '@/src/utils/productFilters';

export default function ProductListScreen() {
  const { products, isLoading, error, reload } = useProducts();
  const [query, setQuery] = useState('');
  const [productFilters, setProductFilters] = useState<ProductFilters>(EMPTY_PRODUCT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const { toggle } = useFavorites();

  const filtered = useMemo(
    () => applyProductFilters(products, query, productFilters),
    [products, query, productFilters],
  );

  const activeFilterCount = countActiveProductFilters(productFilters);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.toolbar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={26} color={colors.primary} />
        </Pressable>
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
        <Pressable
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setFiltersOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir filtros">
          <MaterialIcons name="tune" size={24} color={colors.primary} />
          {activeFilterCount > 0 ? (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <View style={styles.filtersBar}>
        <CategoryChips
          categories={MOCK_CATEGORIES}
          selectedId={productFilters.categoryId}
          onSelect={(categoryId) =>
            setProductFilters((current) => ({ ...current, categoryId }))
          }
        />
        <PriceFilterChips
          value={productFilters.priceRange}
          onChange={(priceRange) =>
            setProductFilters((current) => ({ ...current, priceRange }))
          }
        />
        {hasActiveProductFilters(productFilters) ? (
          <Pressable onPress={() => setProductFilters(EMPTY_PRODUCT_FILTERS)} hitSlop={8}>
            <Text style={styles.clearFilters}>Limpar filtros</Text>
          </Pressable>
        ) : null}
      </View>

      <ProductFiltersSheet
        visible={filtersOpen}
        filters={productFilters}
        onClose={() => setFiltersOpen(false)}
        onApply={setProductFilters}
      />

      {previewProduct ? (
        <ProductPreviewSheet
          product={previewProduct}
          visible
          onClose={() => setPreviewProduct(null)}
        />
      ) : null}

      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <ProductGrid
          products={filtered}
          ListHeaderComponent={
            <Text style={styles.resultCount}>{filtered.length} produto(s) encontrado(s)</Text>
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
  filterBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontFamily: fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    color: colors.textInverse,
  },
  filtersBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  clearFilters: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.primary,
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
  },
  resultCount: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
});
