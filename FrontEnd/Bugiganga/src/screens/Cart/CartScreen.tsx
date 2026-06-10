import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { CartGlassItem } from '@/src/components/cards/CartGlassItem';
import { CartSummaryGlass } from '@/src/components/cards/CartSummaryGlass';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { snackbar } from '@/src/store/snackbarStore';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { colors, layout } from '@/src/theme';

export default function CartScreen() {
  const { contentBottomInset } = useTabBarInset();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const total = useCartStore((s) => s.getTotal());
  const setFromCart = useCheckoutStore((s) => s.setFromCart);

  const handleCheckout = () => {
    setFromCart();
    snackbar.info('Indo para o checkout…');
    router.push('/checkout');
  };

  const handleRemove = (productId: number, productName: string) => {
    removeItem(productId);
    snackbar.info(`${productName} removido do carrinho`);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={[styles.content, { marginBottom: contentBottomInset }]}>
        <PageContainer>
          <ScreenHeader
            title="Carrinho"
            subtitle={items.length === 0 ? 'Nenhum item ainda' : `${itemCount} unidade(s) · ${items.length} produto(s)`}
          />
        </PageContainer>

        {items.length === 0 ? (
          <EmptyState icon="shopping-bag" message="Seu carrinho está vazio. Explore produtos na home!" />
        ) : (
          <View style={styles.body}>
            <FlatList
              style={styles.listFlex}
              data={items}
              keyExtractor={(item) => String(item.product.id)}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <PageContainer>
                  <CartGlassItem
                    item={item}
                    onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
                    onRemove={() => handleRemove(item.product.id, item.product.name)}
                  />
                </PageContainer>
              )}
            />

            <View style={styles.summaryDock}>
              <PageContainer>
                <CartSummaryGlass
                  subtotal={subtotal}
                  total={total}
                  onCheckout={handleCheckout}
                />
              </PageContainer>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  body: { flex: 1 },
  listFlex: { flex: 1 },
  summaryDock: {
    flexShrink: 0,
    paddingTop: layout.xs,
    paddingBottom: layout.xs,
  },
  list: {
    paddingTop: layout.sm,
    paddingBottom: layout.md,
    alignItems: 'center',
  },
});
