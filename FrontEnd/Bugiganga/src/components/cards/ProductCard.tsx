import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useCartStore } from '@/src/store/cartStore';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors, fontSizes, fonts, loginGlass, radius, shadows } from '@/src/theme';
import { glassBlur } from '@/src/theme/loginGlass';
import type { Product } from '@/src/types/product';
import { formatCurrency } from '@/src/utils/formatCurrency';

export const PRODUCT_CARD_HEIGHT = 268;
const IMAGE_HEIGHT = 130;

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  onToggleFavorite: () => void;
  compact?: boolean;
  variant?: 'default' | 'warm';
};

export function ProductCard({
  product,
  onPress,
  onToggleFavorite,
  compact,
  variant = 'default',
}: ProductCardProps) {
  const warm = variant === 'warm';
  const warmBlurIntensity =
    Platform.OS === 'android' ? glassBlur.android.card : glassBlur.ios.card;
  const warmWebBlur = glassBlur.web.card;
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
        style={({ pressed }) => [
          styles.card,
          warm && styles.cardWarm,
          warm &&
            Platform.OS === 'web' && {
              backdropFilter: `blur(${warmWebBlur})`,
              WebkitBackdropFilter: `blur(${warmWebBlur})`,
            },
          pressed && styles.cardPressed,
        ]}
        accessibilityRole="button">
        {Platform.OS === 'web' ? (
          <View style={[styles.webGlass, warm && styles.webGlassWarm]} />
        ) : (
          <BlurView
            intensity={warm ? warmBlurIntensity : Platform.OS === 'android' ? 28 : 36}
            tint={warm ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={[styles.tint, warm && styles.tintWarm]} />
        <View style={[styles.highlight, warm && styles.highlightWarm]} />

        <View style={styles.cardContent}>
          <View style={styles.imageWrap}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
            <Pressable
              style={[styles.favBtn, warm && styles.favBtnWarm]}
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
                color={isFavorite ? colors.danger : warm ? loginGlass.goldMuted : colors.textMuted}
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.textBlock}>
              <Text style={[styles.name, warm && styles.nameWarm]} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={[styles.category, warm && styles.categoryWarm]} numberOfLines={1}>
                {product.categoryName}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={[styles.price, warm && styles.priceWarm]} numberOfLines={1}>
                {formatCurrency(product.price)}
              </Text>
              <Pressable
                style={[styles.cartBtn, warm && styles.cartBtnWarm, justAdded && styles.cartBtnAdded]}
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
  cardWarm: {
    backgroundColor: loginGlass.cardGlass,
    borderColor: loginGlass.cardBorder,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.985 }],
  },
  webGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cartGlass,
  },
  webGlassWarm: {
    backgroundColor: loginGlass.glassWebFill,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cartGlassTint,
  },
  tintWarm: {
    backgroundColor: loginGlass.cardTint,
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
  highlightWarm: {
    backgroundColor: loginGlass.shellHighlight,
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
  favBtnWarm: {
    backgroundColor: 'rgba(45, 30, 20, 0.55)',
    borderColor: loginGlass.cardBorder,
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
  nameWarm: {
    color: loginGlass.text,
  },
  category: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    height: 16,
    lineHeight: 16,
  },
  categoryWarm: {
    color: loginGlass.textMuted,
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
  priceWarm: {
    color: loginGlass.goldLight,
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
  cartBtnWarm: {
    backgroundColor: loginGlass.button,
  },
  cartBtnAdded: {
    backgroundColor: colors.primaryDark,
  },
});
