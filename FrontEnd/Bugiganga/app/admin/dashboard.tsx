import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { useAuthStore } from '@/src/store/authStore';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { orderService, AdminSalesSummary } from '@/src/services/orderService';
import { colors, textStyles, cardStyles, radius } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { Product } from '@/src/types/product';

interface SoldProductItemProps {
  item: {
    product: Product;
    quantity: number;
    totalPrice: number;
  };
}

const SoldProductItem = ({ item }: SoldProductItemProps) => (
  <View style={styles.productItem}>
    <Image source={{ uri: item.product.imageUrl }} style={styles.productImage} contentFit="cover" />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{item.product.name}</Text>
      <Text style={styles.productDetails}>
        Qtd: {item.quantity} · {formatCurrency(item.totalPrice)}
      </Text>
    </View>
  </View>
);

export default function AdminDashboardScreen() {
  const { user } = useAuthStore();
  const { contentBottomInset } = useTabBarInset();
  const [salesSummary, setSalesSummary] = useState<AdminSalesSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSalesSummary() {
      if (!user?.id) {
        setError('Usuário ADMIN não autenticado.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const summary = await orderService.getAdminSalesSummary(user.id);
        setSalesSummary(summary);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível carregar o painel de vendas.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSalesSummary();
  }, [user?.id]);

  if (isLoading) {
    return (
      <ScreenContainer style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando painel de vendas...</Text>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll contentStyle={{ paddingBottom: contentBottomInset }}>
      <ScreenHeader
        title="Vendas"
        subtitle="Acompanhe o desempenho das suas vendas."
        icon="leaderboard"
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Valor Total das Vendas</Text>
        <Text style={styles.totalSalesValue}>
          {formatCurrency(salesSummary?.totalSalesValue || 0)}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Produtos Vendidos</Text>
      {salesSummary?.soldProducts && salesSummary.soldProducts.length > 0 ? (
        <FlatList
          data={salesSummary.soldProducts}
          keyExtractor={(item) => item.product.id.toString()}
          renderItem={({ item }) => <SoldProductItem item={item} />}
          contentContainerStyle={styles.productList}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noDataText}>Nenhum produto vendido ainda.</Text>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
  },
  container: {
    padding: 20,
  },
  summaryCard: {
    ...cardStyles.shadow,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 5,
  },
  totalSalesValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  productList: {
    paddingBottom: 20,
  },
  productItem: {
    ...cardStyles.inset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  productDetails: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 5,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});