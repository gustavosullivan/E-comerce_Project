import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { WarmGlassSurface } from '@/src/components/layout/WarmGlassSurface';
import { ProductStockBadge } from '@/src/components/ui/ProductStockBadge';
import { snackbar } from '@/src/store/snackbarStore';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { fontSizes, fonts, loginGlass, radius, shadows } from '@/src/theme';
import { glassBlur } from '@/src/theme/loginGlass';
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
  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (outOfStock) {
      snackbar.error('Produto sem estoque disponível');
      return;
    }
    addItem(product, 1);
    snackbar.success(`${product.name} adicionado ao carrinho`);
    onClose();
  };

  const handleBuyNow = () => {
    if (outOfStock) {
      snackbar.error('Produto sem estoque disponível');
      return;
    }
    setBuyNow(product, 1);
    snackbar.info('Indo para o checkout…');
    onClose();
    router.push('/checkout');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView
          intensity={
            Platform.OS === 'android' ? glassBlur.android.modal : glassBlur.ios.modal
          }
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.dim} />

        <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" />

        <View style={styles.paperWrap}>
          <WarmGlassSurface
            level="card"
            variant="modal"
            style={styles.paper}
            contentStyle={styles.paperContent}>
            <View style={styles.imageWrap}>
              <Pressable
                style={styles.closeBtn}
                onPress={onClose}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Fechar">
                <MaterialIcons name="close" size={20} color={loginGlass.text} />
              </Pressable>
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
            </View>

            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            <View style={styles.stockWrap}>
              <ProductStockBadge stock={product.stock} variant="warm" />
            </View>
            <Text style={styles.description} numberOfLines={4}>
              {product.description}
            </Text>

            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  outOfStock && styles.btnDisabled,
                  pressed && !outOfStock && styles.primaryBtnPressed,
                ]}
                onPress={handleBuyNow}
                disabled={outOfStock}>
                <Text style={styles.primaryBtnText}>Comprar agora</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  outOfStock && styles.btnDisabled,
                  pressed && !outOfStock && styles.secondaryBtnPressed,
                ]}
                onPress={handleAddToCart}
                disabled={outOfStock}>
                <Text style={styles.secondaryBtnText}>Adicionar ao carrinho</Text>
              </Pressable>
            </View>
          </WarmGlassSurface>
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
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: `blur(${glassBlur.web.modal})`,
          WebkitBackdropFilter: `blur(${glassBlur.web.modal})`,
        }
      : {}),
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.modalOverlay,
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
    borderRadius: radius.lg,
    ...shadows.lg,
  },
  paperContent: {
    padding: 16,
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    marginBottom: 14,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 3,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: loginGlass.formFieldBg,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    backgroundColor: loginGlass.formFieldBg,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: loginGlass.text,
    marginBottom: 6,
  },
  price: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: loginGlass.goldLight,
    marginBottom: 8,
  },
  stockWrap: {
    marginBottom: 10,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    color: loginGlass.textMuted,
    marginBottom: 18,
  },
  actions: {
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: loginGlass.formButtonPrimary,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderWidth: 1,
    borderColor: loginGlass.formButtonPrimaryBorder,
    ...shadows.sm,
  },
  primaryBtnPressed: {
    backgroundColor: loginGlass.formButtonPrimaryPressed,
    opacity: 0.96,
  },
  primaryBtnText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: loginGlass.text,
  },
  secondaryBtn: {
    backgroundColor: loginGlass.formButtonSecondaryBg,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
  },
  secondaryBtnPressed: {
    backgroundColor: 'rgba(45, 30, 20, 0.72)',
    opacity: 0.96,
  },
  secondaryBtnText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: loginGlass.goldLight,
  },
  btnDisabled: {
    opacity: 0.45,
  },
});
