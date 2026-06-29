import { AdminProductCard } from '@/src/components/cards/AdminProductCard';
import { ProductCard } from '@/src/components/cards/ProductCard';
import { ProductPreviewSheet } from '@/src/components/cards/ProductPreviewSheet';
import { PriceFilterChips } from '@/src/components/forms/ProductFiltersSheet';
import { SearchBar } from '@/src/components/forms/SearchBar';
import { CategoryChips } from '@/src/components/layout/CategoryChips';
import { ErrorState } from '@/src/components/layout/ErrorState';
import {
    HomeHero,
    HomeToolbar,
} from '@/src/components/layout/HomeHeader';
import { LoginGlassBackground } from '@/src/components/layout/LoginGlassBackground';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ProductGrid } from '@/src/components/layout/ProductGrid';
import { ProductGridSkeleton } from '@/src/components/ui/SkeletonBlock';
import { useFavorites } from '@/src/hooks/useFavorites';
import { useProducts } from '@/src/hooks/useProducts'; // This hook is for buyer products
import { useTabBarInset, useTopChromeInset } from '@/src/hooks/useTabBarInset';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { routes } from '@/src/navigation/routes';
import { productService } from '@/src/services/productService';
import { useAdminProductsStore } from '@/src/store/adminProductsStore';
import { useAuthStore } from '@/src/store/authStore';
import { useCurrencyStore } from '@/src/store/currencyStore';
import { snackbar } from '@/src/store/snackbarStore';
import { fontSizes, fonts, layout, loginGlass } from '@/src/theme';
import { isAdmin } from '@/src/types/auth';
import type { Product } from '@/src/types/product';
import { EMPTY_PRODUCT_FILTERS, type ProductFilters } from '@/src/types/productFilters';
import { confirmAction } from '@/src/utils/confirm';
import { applyProductFilters, countActiveProductFilters } from '@/src/utils/productFilters';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

interface AdminProductItemProps {
  product: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const AdminProductItem = ({ product, onEdit, onDelete }: AdminProductItemProps) => (
  <AdminProductCard
    product={product}
    compact
    variant="warm"
    onEdit={() => onEdit(product.id)}
    onDelete={() => onDelete(product.id)}
  />
);

function HomeScreenLayout({
  toolbar,
  children,
}: {
  toolbar: ReactNode;
  children: ReactNode;
}) {
  const { stickyToolbarStyle } = useTopChromeInset();

  return (
    <View style={styles.screen}>
      <View style={[styles.topChrome, stickyToolbarStyle]}>
        <PageContainer>{toolbar}</PageContainer>
      </View>
      <View style={styles.scrollArea}>{children}</View>
    </View>
  );
}

export default function HomeScreen() {
  const { contentBottomInset } = useTabBarInset();
  const { topInset } = useTopChromeInset();
  const { user } = useAuthStore();
  const isCurrentUserAdmin = isAdmin(user);

  // Buyer specific states and functions
  const { products, isLoading, error, reload } = useProducts();
  const [query, setQuery] = useState('');
  const [productFilters, setProductFilters] = useState<ProductFilters>(EMPTY_PRODUCT_FILTERS);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // Sync preview product when products list updates (e.g., currency change)
  useEffect(() => {
    if (previewProduct) {
      const updated = products.find((p) => p.id === previewProduct.id);
      if (updated && updated.price !== previewProduct.price) {
        setPreviewProduct(updated);
      }
    }
  }, [products, previewProduct]);

  const { toggle, count: favoriteCount } = useFavorites();

  // Admin specific states and functions
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Unified refreshing state

  const currency = useCurrencyStore((s) => s.currency);

  const fetchAdminProducts = useCallback(async () => {
    if (!user?.id) {
      setAdminError('Usuário ADMIN não autenticado.');
      setAdminLoading(false);
      return;
    }
    setAdminLoading(true);
    setAdminError(null);
    try {
      const fetchedProducts = await productService.getAdminProducts(user.id, currency);
      const myProductIdsRecord = useAdminProductsStore.getState().myProductIds;
      const myProductIds = myProductIdsRecord[user.id] || [];
      setAdminProducts(fetchedProducts.filter(p => myProductIds.includes(p.id)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível carregar seus produtos.';
      setAdminError(message);
    } finally {
      setAdminLoading(false);
    }
  }, [user?.id, currency]);

  useFocusEffect(
    useCallback(() => {
      if (isCurrentUserAdmin) {
        void fetchAdminProducts();
      } else {
        void reload();
      }
    }, [fetchAdminProducts, isCurrentUserAdmin, reload]),
  );

  // Recarrega os produtos de admin automaticamente quando a moeda muda
  // (useFocusEffect não reage a dependências se a tela já estiver em foco)
  useEffect(() => {
    if (isCurrentUserAdmin) {
      void fetchAdminProducts();
    }
  }, [fetchAdminProducts, isCurrentUserAdmin]);

  const filteredAdminProducts = useMemo(() => {
    const q = adminSearchQuery.trim().toLowerCase();
    if (!q) return adminProducts;
    return adminProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }, [adminProducts, adminSearchQuery]);

  const handleAdminProductEdit = (id: number) => {
    router.push(routes.adminProductEdit(id));
  };

  const handleAdminProductDelete = (id: number) => {
    confirmAction({
      title: 'Confirmar Exclusão',
      message: 'Tem certeza de que deseja excluir este produto? Esta ação não pode ser desfeita.',
      confirmLabel: 'Excluir',
      onConfirm: async () => {
        try {
          await productService.deleteProduct(id);
          snackbar.success('Produto excluído com sucesso!');
          void fetchAdminProducts();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Não foi possível excluir o produto.';
          snackbar.error(message);
        }
      },
    });
  };

  const filtered = useMemo(
    () => applyProductFilters(products, query, productFilters),
    [products, query, productFilters],
  );

  const activeFilterCount = countActiveProductFilters(productFilters);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (isCurrentUserAdmin) {
      await fetchAdminProducts();
    } else {
      await reload();
    }
    setRefreshing(false);
    snackbar.info('Lista atualizada');
  };

  const displayName = user?.name ?? 'Visitante';

  if (isCurrentUserAdmin) {
    if (adminLoading) {
      return (
        <HomeShell>
          <HomeScreenLayout
            toolbar={<HomeToolbar userName={displayName} isAdmin={isCurrentUserAdmin} />}>
            <PageContainer style={adminStyles.loadingContainer}>
              <ActivityIndicator size="large" color={loginGlass.gold} />
              <Text style={adminStyles.loadingText}>Carregando seus produtos...</Text>
            </PageContainer>
          </HomeScreenLayout>
        </HomeShell>
      );
    }

    if (adminError) {
      return (
        <HomeShell>
          <View style={[styles.screen, { paddingTop: topInset }]}>
            <ErrorState message={adminError} onRetry={fetchAdminProducts} />
          </View>
        </HomeShell>
      );
    }

    return (
      <HomeShell>
        <HomeScreenLayout
          toolbar={<HomeToolbar userName={displayName} isAdmin={isCurrentUserAdmin} />}>
          {filteredAdminProducts.length > 0 ? (
            <ProductGrid
              products={filteredAdminProducts}
              contentBottomInset={contentBottomInset}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={loginGlass.gold}
                  colors={[loginGlass.gold]}
                />
              }
              ListHeaderComponent={
                <PageContainer>
                  <SearchBar
                    value={adminSearchQuery}
                    onChangeText={setAdminSearchQuery}
                    placeholder="Buscar meus produtos..."
                    variant="warm"
                  />
                  <Text style={adminStyles.adminSectionTitle}>
                    Seus Produtos ({filteredAdminProducts.length})
                  </Text>
                </PageContainer>
              }
              renderCard={(item) => (
                <AdminProductItem
                  product={item}
                  onEdit={handleAdminProductEdit}
                  onDelete={handleAdminProductDelete}
                />
              )}
            />
          ) : (
            <PageContainer>
              <SearchBar
                value={adminSearchQuery}
                onChangeText={setAdminSearchQuery}
                placeholder="Buscar meus produtos..."
                variant="warm"
              />
              <Text style={adminStyles.adminSectionTitle}>Seus Produtos (0)</Text>
              <View style={adminStyles.noProductsContainer}>
                <MaterialIcons name="inventory-2" size={50} color={loginGlass.goldMuted} />
                <Text style={adminStyles.noProductsText}>Nenhum produto cadastrado ainda.</Text>
                <Pressable
                  onPress={() => router.push(routes.adminProductNew)}
                  style={adminStyles.addProductButton}>
                  <Text style={adminStyles.addProductButtonText}>Adicionar Novo Produto</Text>
                </Pressable>
              </View>
            </PageContainer>
          )}
        </HomeScreenLayout>
      </HomeShell>
    );
  }

  // Buyer View
  if (isLoading && products.length === 0) {
    return (
      <HomeShell>
        <HomeScreenLayout
          toolbar={<HomeToolbar userName={displayName} isAdmin={isCurrentUserAdmin} />}>
          <PageContainer>
            <SearchBar value="" onChangeText={() => { }} editable={false} variant="warm" />
            <ProductGridSkeleton columns={2} />
          </PageContainer>
        </HomeScreenLayout>
      </HomeShell>
    );
  }

  if (error && products.length === 0) {
    return (
      <HomeShell>
        <View style={[styles.screen, { paddingTop: topInset }]}>
          <ErrorState message={error} onRetry={reload} />
        </View>
      </HomeShell>
    );
  }

  return (
    <HomeShell>
      {previewProduct ? (
        <ProductPreviewSheet
          product={previewProduct}
          visible
          onClose={() => setPreviewProduct(null)}
        />
      ) : null}

      <HomeScreenLayout
        toolbar={<HomeToolbar userName={displayName} />}>
        <ProductGrid
          products={filtered}
          contentBottomInset={contentBottomInset}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={loginGlass.gold}
              colors={[loginGlass.gold]}
            />
          }
          ListHeaderComponent={
            <PageContainer>
              <HomeHero
                userName={displayName}
                productCount={products.length}
                favoriteCount={favoriteCount}
              />
              <SearchBar value={query} onChangeText={setQuery} variant="warm" />
              <CategoryChips
                categories={MOCK_CATEGORIES}
                selectedId={productFilters.categoryId}
                onSelect={(categoryId) =>
                  setProductFilters((current) => ({ ...current, categoryId }))
                }
                variant="warm"
              />
              <PriceFilterChips
                value={productFilters.priceRange}
                onChange={(priceRange) =>
                  setProductFilters((current) => ({ ...current, priceRange }))
                }
                variant="warm"
              />
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>
                  {activeFilterCount > 0 ? 'Filtrados' : 'Destaques'}
                </Text>
                <View style={styles.sectionMeta}>
                  <Text style={styles.count}>{filtered.length} itens</Text>
                  {activeFilterCount > 0 ? (
                    <Pressable
                      onPress={() => setProductFilters(EMPTY_PRODUCT_FILTERS)}
                      hitSlop={8}>
                      <Text style={styles.clearFilters}>Limpar filtros</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </PageContainer>
          }
          renderCard={(item) => (
            <ProductCard
              product={item}
              compact
              variant="warm"
              onToggleFavorite={() => toggle(item)}
              onPress={() => setPreviewProduct(item)}
            />
          )}
        />
      </HomeScreenLayout>
    </HomeShell>
  );
}

function HomeShell({ children }: { children: ReactNode }) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LoginGlassBackground />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: loginGlass.background },
  screen: { flex: 1, backgroundColor: 'transparent' },
  topChrome: {
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  scrollArea: {
    flex: 1,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: layout.sm,
    marginBottom: layout.sm,
    paddingBottom: layout.xs,
    borderBottomWidth: 1,
    borderBottomColor: loginGlass.shellBorder,
  },
  sectionTitle: {
    fontFamily: fonts.gothic,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: loginGlass.text,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: loginGlass.textMuted,
  },
  sectionMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  clearFilters: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: loginGlass.goldLight,
    textDecorationLine: 'underline',
  },
});

const adminStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: loginGlass.textMuted,
  },
  adminSectionTitle: {
    marginTop: layout.sm,
    marginBottom: layout.sm,
    fontFamily: fonts.gothic,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: loginGlass.text,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
    backgroundColor: loginGlass.cardGlass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    marginTop: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: loginGlass.textMuted,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addProductButton: {
    backgroundColor: loginGlass.button,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: loginGlass.shellBorder,
  },
  addProductButtonText: {
    color: loginGlass.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
