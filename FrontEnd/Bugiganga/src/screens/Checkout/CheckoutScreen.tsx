import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { orderService } from '@/src/services/orderService';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { snackbar } from '@/src/store/snackbarStore';
import { useCartStore } from '@/src/store/cartStore';
import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

export default function CheckoutScreen() {
  const items = useCheckoutStore((s) => s.items);
  const mode = useCheckoutStore((s) => s.mode);
  const total = useCheckoutStore((s) => s.getTotal());
  const clearCheckout = useCheckoutStore((s) => s.clear);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await orderService.createOrder(orderService.fromCartItems(items));
      if (mode === 'cart') clearCart();
      clearCheckout();
      snackbar.success('Compra realizada com sucesso!');
      router.replace('/(tabs)');
    } catch {
      snackbar.error('Não foi possível confirmar a compra');
    } finally {
      setIsConfirming(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <EmptyState icon="shopping-bag" message="Nenhum item para finalizar." />
        <View style={styles.emptyAction}>
          <PrimaryButton label="Voltar à home" onPress={() => router.replace('/(tabs)')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <Text style={styles.title}>Confirmar compra</Text>
      <Text style={styles.subtitle}>Revise seus itens antes de finalizar</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.product.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.product.imageUrl }} style={styles.thumb} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.product.name}</Text>
              <Text style={styles.meta}>
                Qtd: {item.quantity} · {formatCurrency(item.product.price)} un.
              </Text>
              <Text style={styles.lineTotal}>
                {formatCurrency(item.product.price * item.quantity)}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Valor total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <PrimaryButton label="Confirmar compra" onPress={handleConfirm} isLoading={isConfirming} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  emptyAction: { padding: 16 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 16, paddingBottom: 8 },
  backText: { fontSize: fontSizes.md, color: colors.primary, fontWeight: '600' },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: 16,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  item: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    ...shadows.sm,
  },
  thumb: { width: 72, height: 72, borderRadius: radius.md },
  info: { flex: 1 },
  name: { fontFamily: fonts.sans, fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  meta: { fontSize: fontSizes.sm, color: colors.textMuted, marginTop: 4 },
  lineTotal: { fontSize: fontSizes.md, fontWeight: '700', color: colors.primary, marginTop: 6 },
  footer: {
    padding: 20,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    gap: 14,
    ...shadows.lg,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: fonts.sans, fontSize: fontSizes.lg, color: colors.text },
  totalValue: { fontFamily: fonts.sans, fontSize: fontSizes.xl, fontWeight: '800', color: colors.primary },
});
