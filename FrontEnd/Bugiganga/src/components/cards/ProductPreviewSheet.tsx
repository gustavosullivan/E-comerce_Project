import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { snackbar } from '@/src/store/snackbarStore';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { formatCurrency } from '@/src/utils/formatCurrency';

type ProductPreviewSheetProps = {
  product: Product;
  visible: boolean;
  onClose: () => void;
};

export function ProductPreviewSheet({ product, visible, onClose }: ProductPreviewSheetProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setBuyNow = useCheckoutStore((s) => s.setBuyNow);

  const handleAddToCart = () => {
    addItem(product, 1);
    snackbar.success(`${product.name} adicionado ao carrinho`);
    onClose();
  };

  const handleBuyNow = () => {
    setBuyNow(product, 1);
    snackbar.info('Indo para o checkout…');
    onClose();
    router.push('/checkout');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView
          intensity={Platform.OS === 'web' ? 24 : 48}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.dim} />

        <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" />

        <View style={styles.paperWrap}>
          <View style={styles.paper}>
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Fechar">
              <MaterialIcons name="close" size={20} color={colors.white} />
            </Pressable>

            <Image
              source={{ uri: product.imageUrl }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />

            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            <Text style={styles.description} numberOfLines={4}>
              {product.description}
            </Text>

            <View style={styles.actions}>
              <PrimaryButton label="Comprar agora" onPress={handleBuyNow} />
              <SecondaryButton label="Adicionar ao carrinho" onPress={handleAddToCart} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  paperWrap: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  paper: {
    backgroundColor: colors.glass,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 16,
    ...shadows.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 3,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.glassImageBg,
    marginBottom: 14,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 6,
  },
  price: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 10,
  },
  description: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
    color: colors.glassMuted,
    marginBottom: 18,
  },
  actions: {
    gap: 10,
  },
});
