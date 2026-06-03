import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { ErrorState } from '@/src/components/layout/ErrorState';
import { Loading } from '@/src/components/layout/Loading';
import { QuantitySelector } from '@/src/components/layout/QuantitySelector';
import { useProduct } from '@/src/hooks/useProducts';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { colors, fonts } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);
  const { product, isLoading, error } = useProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const setBuyNow = useCheckoutStore((s) => s.setBuyNow);

  const handleClose = () => router.back();

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    router.replace('/(tabs)');
  };

  const handleBuyNow = () => {
    if (!product) return;
    setBuyNow(product, quantity);
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Loading />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.screen}>
        <ErrorState message={error ?? 'Produto não encontrado'} />
      </SafeAreaView>
    );
  }

  const lineTotal = product.price * quantity;

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable style={styles.closeBtn} onPress={handleClose} hitSlop={12}>
        <MaterialIcons name="close" size={28} color={colors.text} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.unitPrice}>Unitário: {formatCurrency(product.price)}</Text>

        <QuantitySelector
          quantity={quantity}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncrease={() => setQuantity((q) => q + 1)}
        />

        <Text style={styles.total}>Total: {formatCurrency(lineTotal)}</Text>

        <View style={styles.actions}>
          <PrimaryButton label="Comprar Agora" onPress={handleBuyNow} />
          <SecondaryButton label="Adicionar ao Carrinho" onPress={handleAddToCart} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 16,
    zIndex: 10,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scroll: { padding: 16, paddingTop: 48, paddingBottom: 32 },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    marginTop: 10,
  },
  unitPrice: { fontSize: 14, color: colors.secondary, marginTop: 8 },
  total: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: { gap: 12 },
});
