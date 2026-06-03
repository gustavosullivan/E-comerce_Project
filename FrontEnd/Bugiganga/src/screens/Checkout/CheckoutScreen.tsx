import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { orderService } from '@/src/services/orderService';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useCartStore } from '@/src/store/cartStore';
import { colors, fonts } from '@/src/theme';
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
      Alert.alert('Compra realizada com sucesso.', '', [
        {
          text: 'OK',
          onPress: () => {
            if (mode === 'cart') clearCart();
            clearCheckout();
            router.replace('/(tabs)');
          },
        },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível confirmar a compra. Tente novamente.');
    } finally {
      setIsConfirming(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <EmptyState icon="shopping-bag" message="Nenhum item para finalizar." />
        <PrimaryButton label="Voltar à Home" onPress={() => router.replace('/(tabs)')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <Text style={styles.title}>Confirmar compra</Text>

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
        <PrimaryButton label="Confirmar Compra" onPress={handleConfirm} isLoading={isConfirming} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 16 },
  backText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  item: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    padding: 12,
    marginBottom: 10,
  },
  thumb: { width: 64, height: 64, borderRadius: 2 },
  info: { flex: 1 },
  name: { fontFamily: fonts.serif, fontSize: 15, fontWeight: '600', color: colors.text },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  lineTotal: { fontSize: 15, fontWeight: '700', color: colors.primary, marginTop: 6 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: 12,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: fonts.serif, fontSize: 18, color: colors.text },
  totalValue: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.primary },
});
