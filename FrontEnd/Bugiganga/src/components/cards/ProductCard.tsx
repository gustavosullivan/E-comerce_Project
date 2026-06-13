import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button">
        {Platform.OS === 'web' ? (
          <View style={styles.webGlass} />
        ) : (
          <BlurView
            intensity={Platform.OS === 'android' ? 28 : 36}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={styles.tint} />
        <View style={styles.highlight} />

        <View style={styles.cardContent}>
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
    backgroundColor: colors.cartGlass,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cartGlassBorder,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.985 }],
  },
  webGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cartGlass,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cartGlassTint,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: colors.cartGlassHighlight,
    zIndex: 1,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    zIndex: 2,
  },
  imageWrap: {
    position: 'relative',
    height: IMAGE_HEIGHT,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cartGlassAccentSoft,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cartGlassAccentBorder,
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
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
    height: 36,
  },
  category: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    height: 16,
    lineHeight: 16,
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
    color: colors.cartGlassAccent,
    minWidth: 0,
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...shadows.sm,
  },
  cartBtnAdded: {
    backgroundColor: colors.primaryDark,
  },
});
