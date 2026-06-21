import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useCartStore } from '@/src/store/cartStore';
import { colors, fontSizes, fonts, loginGlass, radius, shadows } from '@/src/theme';
import { glassBlur } from '@/src/theme/loginGlass';
import type { Product } from '@/src/types/product';
import { formatCurrency } from '@/src/utils/formatCurrency';

type FavoriteGlassCardProps = {
  product: Product;
  onPress: () => void;
  onToggleFavorite: () => void;
  variant?: 'default' | 'warm';
};

export function FavoriteGlassCard({
  product,
  onPress,
  onToggleFavorite,
  variant = 'default',
}: FavoriteGlassCardProps) {
  const warm = variant === 'warm';
  const blurIntensity =
    Platform.OS === 'android' ? glassBlur.android.card : glassBlur.ios.card;
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shell, pressed && styles.shellPressed]}
      accessibilityRole="button">
      <View
        style={[
          styles.glass,
          warm && styles.glassWarm,
          warm &&
            Platform.OS === 'web' && {
              backdropFilter: `blur(${glassBlur.web.card})`,
              WebkitBackdropFilter: `blur(${glassBlur.web.card})`,
            },
        ]}>
        {Platform.OS === 'web' ? (
          <View style={[styles.webFill, warm && styles.webFillWarm]} />
        ) : (
          <BlurView
            intensity={warm ? blurIntensity : Platform.OS === 'android' ? 28 : 36}
            tint={warm ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={[styles.tint, warm && styles.tintWarm]} />
        <View style={[styles.highlight, warm && styles.highlightWarm]} />

        <View style={styles.row}>
          <Image
            source={{ uri: product.imageUrl }}
            style={[styles.image, warm && styles.imageWarm]}
            contentFit="cover"
            transition={180}
          />

          <View style={styles.info}>
            <Text style={[styles.name, warm && styles.nameWarm]} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={[styles.category, warm && styles.categoryWarm]} numberOfLines={1}>
              {product.categoryName}
            </Text>
            <Text style={[styles.price, warm && styles.priceWarm]}>
              {formatCurrency(product.price)}
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[styles.favBtn, warm && styles.favBtnWarm]}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Remover dos favoritos">
              <MaterialIcons name="favorite" size={18} color={colors.danger} />
            </Pressable>

            <Pressable
              style={[
                styles.cartBtn,
                warm && styles.cartBtnWarm,
                justAdded && styles.cartBtnAdded,
              ]}
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
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    marginBottom: 12,
  },
  shellPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  glass: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.favoriteGlassBorder,
    overflow: 'hidden',
    backgroundColor: colors.favoriteGlass,
    ...shadows.md,
  },
  glassWarm: {
    backgroundColor: loginGlass.cardGlass,
    borderColor: loginGlass.cardBorder,
  },
  webFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.favoriteGlass,
  },
  webFillWarm: {
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
    backgroundColor: colors.favoriteGlassHighlight,
  },
  highlightWarm: {
    backgroundColor: loginGlass.shellHighlight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    zIndex: 1,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cartGlassAccentSoft,
  },
  imageWarm: {
    borderColor: loginGlass.cardBorder,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
  },
  nameWarm: {
    color: loginGlass.text,
  },
  category: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  categoryWarm: {
    color: loginGlass.textMuted,
  },
  price: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: colors.cartGlassAccent,
    marginTop: 4,
  },
  priceWarm: {
    color: loginGlass.goldLight,
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingLeft: 4,
  },
  favBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: colors.cartGlassAccentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtnWarm: {
    backgroundColor: loginGlass.formFieldBg,
    borderColor: loginGlass.cardBorder,
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  cartBtnWarm: {
    backgroundColor: loginGlass.button,
  },
  cartBtnAdded: {
    backgroundColor: colors.primaryDark,
  },
});
