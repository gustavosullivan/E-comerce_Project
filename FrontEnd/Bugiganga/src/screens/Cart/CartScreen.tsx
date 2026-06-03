import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { colors, fonts } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

export default function CartScreen() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const total = useCartStore((s) => s.getTotal());
  const setFromCart = useCheckoutStore((s) => s.setFromCart);

  const handleCheckout = () => {
    setFromCart();
    router.push('/checkout');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {items.length === 0 ? (
        <EmptyState icon="shopping-cart" message="Seu carrinho está vazio." />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.product.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image source={{ uri: item.product.imageUrl }} style={styles.thumb} />
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.price}>{formatCurrency(item.product.price)}</Text>
                  <View style={styles.qtyRow}>
                    <Pressable onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <MaterialIcons name="remove-circle-outline" size={24} color={colors.primary} />
                    </Pressable>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <Pressable onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <MaterialIcons name="add-circle-outline" size={24} color={colors.primary} />
                    </Pressable>
                    <Pressable
                      style={styles.removeBtn}
                      onPress={() => removeItem(item.product.id)}>
                      <MaterialIcons name="delete-outline" size={22} color={colors.danger} />
                    </Pressable>
                  </View>
                  <Text style={styles.subline}>
                    Subtotal: {formatCurrency(item.product.price * item.quantity)}
                  </Text>
                </View>
              </View>
            )}
          />
          <View style={styles.summary}>
            <View style={styles.row}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelTotal}>Total</Text>
              <Text style={styles.valueTotal}>{formatCurrency(total)}</Text>
            </View>
            <PrimaryButton label="Finalizar Compra" onPress={handleCheckout} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 8 },
  item: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
  },
  thumb: { width: 72, height: 72, borderRadius: 2 },
  info: { flex: 1 },
  name: { fontFamily: fonts.serif, fontSize: 14, fontWeight: '600', color: colors.text },
  price: { fontSize: 14, color: colors.primary, marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  qty: { fontSize: 16, fontWeight: '700', color: colors.text, minWidth: 24, textAlign: 'center' },
  removeBtn: { marginLeft: 'auto' },
  subline: { fontSize: 12, color: colors.textMuted, marginTop: 6 },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: colors.textMuted },
  value: { color: colors.text },
  labelTotal: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '700', color: colors.text },
  valueTotal: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '700', color: colors.primary },
});
