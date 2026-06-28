import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { ErrorState } from '@/src/components/layout/ErrorState';
import { Loading } from '@/src/components/layout/Loading';
import { ProductModalGallery } from '@/src/components/layout/ProductModalGallery';
import { ProductPaper } from '@/src/components/layout/ProductPaper';
import { QuantitySelector } from '@/src/components/layout/QuantitySelector';
import { AnimatedPrice } from '@/src/components/ui/AnimatedPrice';
import { ProductStockBadge } from '@/src/components/ui/ProductStockBadge';
import { useProduct } from '@/src/hooks/useProducts';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { colors, fonts } from '@/src/theme';
import { useFormatCurrency } from '@/src/utils/formatCurrency';
import { snackbar } from '@/src/store/snackbarStore';
import { successFeedback } from '@/src/utils/haptics';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);
  const { product, isLoading, error } = useProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const setBuyNow = useCheckoutStore((s) => s.setBuyNow);
  const formatCurrency = useFormatCurrency();

  const handleClose = () => router.back();

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem(product, quantity);
    successFeedback();
    snackbar.success(
      quantity > 1
        ? `${quantity}× ${product.name} no carrinho`
        : `${product.name} adicionado ao carrinho`,
    );
    router.replace('/(tabs)');
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    setBuyNow(product, quantity);
    snackbar.info('Indo para o checkout…');
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <ProductPaper onClose={handleClose} large>
        <Loading />
      </ProductPaper>
    );
  }

  if (error || !product) {
    return (
      <ProductPaper onClose={handleClose} large>
        <ErrorState message={error ?? 'Produto não encontrado'} />
      </ProductPaper>
    );
  }

  const lineTotal = product.price * quantity;
  const outOfStock = product.stock <= 0;
  const maxQuantity = Math.max(product.stock, 1);

  return (
    <ProductPaper onClose={handleClose} large hideClose>
      <Animated.View entering={FadeInUp.duration(350)} style={styles.content}>
        <ProductModalGallery product={product} onClose={handleClose} />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
          <Text style={styles.unitPrice}>{formatCurrency(product.price)} / un.</Text>
          <View style={styles.stockWrap}>
            <ProductStockBadge stock={product.stock} />
          </View>
        </View>

        <View style={styles.purchaseBar}>
          <QuantitySelector
            compact
            quantity={quantity}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            onIncrease={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
          />
          <View style={styles.totalWrap}>
            <Text style={styles.totalLabel}>Total</Text>
            <AnimatedPrice value={lineTotal} />
          </View>
        </View>

        <View style={styles.actions}>
          <View style={styles.actionSlot}>
            <PrimaryButton
              compact
              label="Comprar Agora"
              onPress={handleBuyNow}
              disabled={outOfStock}
            />
          </View>
          <View style={styles.actionSlot}>
            <SecondaryButton
              compact
              label="Carrinho"
              onPress={handleAddToCart}
              disabled={outOfStock}
            />
          </View>
        </View>
      </Animated.View>
    </ProductPaper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 4,
    gap: 10,
  },
  info: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 4,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  unitPrice: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  stockWrap: {
    marginTop: 8,
    alignItems: 'center',
  },
  purchaseBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 3,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  totalWrap: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionSlot: {
    flex: 1,
  },
});
