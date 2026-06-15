import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { AdminProductCard } from '@/src/components/cards/AdminProductCard';
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
import { useAuthStore } from '@/src/store/authStore';
import { isAdmin } from '@/src/types/auth';
import { useProducts } from '@/src/hooks/useProducts'; // This hook is for buyer products
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { snackbar } from '@/src/store/snackbarStore';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors, fontSizes, fonts, layout, textStyles } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { productService } from '@/src/services/productService';
import { routes } from '@/src/navigation/routes';
import { confirmAction } from '@/src/utils/confirm';

interface AdminProductItemProps {
  product: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const AdminProductItem = ({ product, onEdit, onDelete }: AdminProductItemProps) => (
  <AdminProductCard
    product={product}
    compact
    onEdit={() => onEdit(product.id)}
    onDelete={() => onDelete(product.id)}
  />
);

export default function HomeScreen() {
  const { contentBottomInset } = useTabBarInset();
  const { user } = useAuthStore();
  const isCurrentUserAdmin = isAdmin(user);

  // Buyer specific states and functions
  const { products, isLoading, error, reload } = useProducts();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const toggle = useFavoritesStore((s) => s.toggle);
  const favoriteCount = useFavoritesStore((s) => s.items.length);

  // Admin specific states and functions
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Unified refreshing state

  const fetchAdminProducts = useCallback(async () => {
    if (!user?.id) {
      setAdminError('Usuário ADMIN não autenticado.');
      setAdminLoading(false);
      return;
    }
    setAdminLoading(true);
    setAdminError(null);
    try {
      const fetchedProducts = await productService.getAdminProducts(user.id);
      setAdminProducts(fetchedProducts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível carregar seus produtos.';
      setAdminError(message);
    } finally {
      setAdminLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (isCurrentUserAdmin) {
        void fetchAdminProducts();
      } else {
        void reload();
      }
    }, [fetchAdminProducts, isCurrentUserAdmin, reload]),
  );

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
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
          <View style={styles.stickyToolbar}>
            <PageContainer>
              <HomeToolbar userName={displayName} isAdmin={isCurrentUserAdmin} />
            </PageContainer>
          </View>
          <View style={styles.scrollArea}>
            <PageContainer style={adminStyles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={adminStyles.loadingText}>Carregando seus produtos...</Text>
            </PageContainer>
          </View>
        </SafeAreaView>
      );
    }

    if (adminError) {
      return (
        <SafeAreaView style={styles.screen}>
          <ErrorState message={adminError} onRetry={fetchAdminProducts} />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <View style={styles.stickyToolbar}>
          <PageContainer>
            <HomeToolbar userName={displayName} isAdmin={isCurrentUserAdmin} />
          </PageContainer>
        </View>

        <View style={styles.scrollArea}>
          {filteredAdminProducts.length > 0 ? (
            <ProductGrid
              products={filteredAdminProducts}
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
                  <SearchBar
                    value={adminSearchQuery}
                    onChangeText={setAdminSearchQuery}
                    placeholder="Buscar meus produtos..."
                  />
                  <Text style={[textStyles.sectionTitle, adminStyles.adminSectionTitle]}>
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
              />
              <Text style={[textStyles.sectionTitle, adminStyles.adminSectionTitle]}>
                Seus Produtos (0)
              </Text>
              <View style={adminStyles.noProductsContainer}>
                <MaterialIcons name="inventory-2" size={50} color={colors.textMuted} />
                <Text style={adminStyles.noProductsText}>Nenhum produto cadastrado ainda.</Text>
                <Pressable
                  onPress={() => router.push(routes.adminProductNew)}
                  style={adminStyles.addProductButton}>
                  <Text style={adminStyles.addProductButtonText}>Adicionar Novo Produto</Text>
                </Pressable>
              </View>
            </PageContainer>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Buyer View
  if (isLoading && products.length === 0) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <View style={styles.stickyToolbar}>
          <PageContainer>
            <HomeToolbar userName={displayName} isAdmin={isCurrentUserAdmin} />
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
          <HomeToolbar userName={displayName} isAdmin={isCurrentUserAdmin} />
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

const adminStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textMuted,
  },
  adminSectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addProductButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addProductButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
