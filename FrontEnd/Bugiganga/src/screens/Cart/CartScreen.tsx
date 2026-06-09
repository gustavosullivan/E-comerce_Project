import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { FadeInView } from '@/src/components/ui/FadeInView';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { textStyles } from '@/src/theme';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { cardStyles, colors, fonts, layout, shadow } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { selectionFeedback } from '@/src/utils/haptics';

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

  if (items.length === 0) {
    return (
      <ScreenContainer contentStyle={styles.emptyPad}>
        <Text style={[textStyles.pageTitle, styles.pageTitle]}>Carrinho</Text>
        <EmptyState
          icon="shopping-cart"
          title="Carrinho vazio"
          message="Adicione bugigangas na Home e volte para finalizar sua compra."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.screenPad}>
      <Text style={[textStyles.pageTitle, styles.pageTitle]}>Carrinho</Text>
      <Text style={styles.subtitle}>{items.length} produto(s) selecionado(s)</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.product.id)}
        contentContainerStyle={styles.list}
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeInView index={index}>
            <View style={styles.item}>
              <Image source={{ uri: item.product.imageUrl }} style={styles.thumb} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.product.name}
                </Text>
                <Text style={styles.price}>{formatCurrency(item.product.price)}</Text>
                <View style={styles.qtyRow}>
                  <ScalePressable
                    style={styles.qtyBtn}
                    onPress={() => {
                      selectionFeedback();
                      updateQuantity(item.product.id, item.quantity - 1);
                    }}>
                    <MaterialIcons name="remove" size={18} color={colors.primary} />
                  </ScalePressable>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <ScalePressable
                    style={styles.qtyBtn}
                    onPress={() => {
                      selectionFeedback();
                      updateQuantity(item.product.id, item.quantity + 1);
                    }}>
                    <MaterialIcons name="add" size={18} color={colors.primary} />
                  </ScalePressable>
                  <ScalePressable
                    style={styles.removeBtn}
                    onPress={() => {
                      selectionFeedback();
                      removeItem(item.product.id);
                    }}>
                    <MaterialIcons name="delete-outline" size={20} color={colors.danger} />
                  </ScalePressable>
                </View>
                <Text style={styles.subline}>
                  Subtotal: {formatCurrency(item.product.price * item.quantity)}
                </Text>
              </View>
            </View>
          </FadeInView>
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screenPad: { flex: 1, paddingTop: 8 },
  emptyPad: { paddingTop: 8 },
  pageTitle: { marginBottom: 4 },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
    fontWeight: '600',
  },
  list: { paddingBottom: 8 },
  item: {
    flexDirection: 'row',
    gap: 12,
    ...cardStyles.vintage,
    padding: 12,
    marginBottom: 10,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  info: { flex: 1 },
  name: { fontFamily: fonts.serif, fontSize: 14, fontWeight: '700', color: colors.text },
  price: { fontSize: 14, color: colors.primary, marginTop: 4, fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { fontSize: 16, fontWeight: '800', color: colors.text, minWidth: 24, textAlign: 'center' },
  removeBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  subline: { fontSize: 12, color: colors.textMuted, marginTop: 6, fontWeight: '600' },
  summary: {
    padding: layout.screenPadding,
    paddingTop: 14,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: 10,
    marginHorizontal: -layout.screenPadding,
    marginBottom: -layout.screenPadding,
    ...shadow.lift,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: colors.textMuted, fontWeight: '600' },
  value: { color: colors.text, fontWeight: '700' },
  labelTotal: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '700', color: colors.text },
  valueTotal: { fontFamily: fonts.serif, fontSize: 20, fontWeight: '800', color: colors.primary },
});
