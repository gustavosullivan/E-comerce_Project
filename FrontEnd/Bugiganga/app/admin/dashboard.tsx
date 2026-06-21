import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { PageContainer } from '@/src/components/layout/PageContainer';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { WarmAppShell } from '@/src/components/layout/WarmAppShell';
import { useAuthStore } from '@/src/store/authStore';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { orderService, AdminSalesSummary } from '@/src/services/orderService';
import { fontSizes, fonts, layout, loginGlass, radius } from '@/src/theme';
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
        const message =
          err instanceof Error ? err.message : 'Não foi possível carregar o painel de vendas.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSalesSummary();
  }, [user?.id]);

  if (isLoading) {
    return (
      <WarmAppShell>
        <SafeAreaView style={styles.centered} edges={['top', 'left', 'right']}>
          <ActivityIndicator size="large" color={loginGlass.gold} />
          <Text style={styles.loadingText}>Carregando painel de vendas...</Text>
        </SafeAreaView>
      </WarmAppShell>
    );
  }

  if (error) {
    return (
      <WarmAppShell>
        <SafeAreaView style={styles.centered} edges={['top', 'left', 'right']}>
          <Text style={styles.errorText}>{error}</Text>
        </SafeAreaView>
      </WarmAppShell>
    );
  }

  return (
    <WarmAppShell>
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: contentBottomInset + layout.lg },
          ]}
          showsVerticalScrollIndicator={false}>
          <PageContainer>
            <ScreenHeader
              title="Vendas"
              subtitle="Acompanhe o desempenho das suas vendas."
              icon="leaderboard"
              variant="warm"
            />

            <ProfilePaper
              title="Resumo"
              subtitle="Total acumulado no marketplace"
              showStamp={false}
              variant="warm">
              <View style={styles.summaryInner}>
                <Text style={styles.summaryLabel}>Valor Total das Vendas</Text>
                <Text style={styles.totalSalesValue}>
                  {formatCurrency(salesSummary?.totalSalesValue || 0)}
                </Text>
              </View>
            </ProfilePaper>

            <ProfilePaper
              title="Produtos Vendidos"
              subtitle={
                salesSummary?.soldProducts?.length
                  ? `${salesSummary.soldProducts.length} itens`
                  : 'Nenhuma venda registrada'
              }
              delay={60}
              showStamp={false}
              variant="warm">
              {salesSummary?.soldProducts && salesSummary.soldProducts.length > 0 ? (
                <FlatList
                  data={salesSummary.soldProducts}
                  keyExtractor={(item) => item.product.id.toString()}
                  renderItem={({ item }) => <SoldProductItem item={item} />}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.noDataText}>Nenhum produto vendido ainda.</Text>
              )}
            </ProfilePaper>
          </PageContainer>
        </ScrollView>
      </SafeAreaView>
    </WarmAppShell>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  content: {
    paddingTop: layout.sm,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: loginGlass.textMuted,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: '#F5A8A0',
    textAlign: 'center',
  },
  summaryInner: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: loginGlass.textMuted,
    marginBottom: 6,
  },
  totalSalesValue: {
    fontFamily: fonts.sans,
    fontSize: 32,
    fontWeight: '800',
    color: loginGlass.goldLight,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: loginGlass.formFieldBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    padding: 12,
    marginBottom: 10,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: 'rgba(45, 30, 20, 0.4)',
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: loginGlass.text,
  },
  productDetails: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    marginTop: 4,
  },
  noDataText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: loginGlass.textMuted,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
