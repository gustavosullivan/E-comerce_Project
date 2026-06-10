import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useCartStore } from '@/src/store/cartStore';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { formatCurrency } from '@/src/utils/formatCurrency';

export const PRODUCT_CARD_HEIGHT = 268;
const IMAGE_HEIGHT = 130;

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  onToggleFavorite: () => void;
  compact?: boolean;
};

export function ProductCard({
  product,
  onPress,
  onToggleFavorite,
  compact,
}: ProductCardProps) {
  const isFavorite = useFavoritesStore((s) => s.items.some((p) => p.id === product.id));
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <View style={[styles.shell, compact && styles.shellCompact]}>
      <Pressable
        onPress={onPress}
        style={styles.card}
        accessibilityRole="button">
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
          <Pressable
            style={styles.favBtn}
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={18}
              color={isFavorite ? colors.danger : colors.textMuted}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.textBlock}>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.category} numberOfLines={1}>
              {product.categoryName}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price} numberOfLines={1}>
              {formatCurrency(product.price)}
            </Text>
            <Pressable
              style={[styles.cartBtn, justAdded && styles.cartBtnAdded]}
              onPress={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Adicionar ao carrinho">
              <MaterialIcons
                name={justAdded ? 'check' : 'add-shopping-cart'}
                size={18}
                color={colors.white}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: 160,
    height: PRODUCT_CARD_HEIGHT,
    marginRight: 12,
  },
  shellCompact: {
    width: '100%',
    height: PRODUCT_CARD_HEIGHT,
    marginRight: 0,
  },
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 10,
    overflow: 'hidden',
    ...shadows.lg,
  },
  imageWrap: {
    position: 'relative',
    height: IMAGE_HEIGHT,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: radius.md,
    backgroundColor: colors.inputBg,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    padding: 6,
    ...shadows.sm,
  },
  content: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'space-between',
    minHeight: 0,
  },
  textBlock: {
    flexShrink: 1,
    minHeight: 52,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.white,
    lineHeight: 18,
    height: 36,
  },
  category: {
    fontSize: fontSizes.xs,
    color: colors.white,
    marginTop: 2,
    height: 16,
    lineHeight: 16,
    opacity: 0.85,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    gap: 8,
    marginTop: 8,
  },
  price: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: colors.white,
    minWidth: 0,
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    borderWidth: 1,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cartBtnAdded: {
    backgroundColor: '#0D9668',
    borderColor: '#0D9668',
  },
});
