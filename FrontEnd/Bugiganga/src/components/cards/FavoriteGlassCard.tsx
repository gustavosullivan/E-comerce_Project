import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useCartStore } from '@/src/store/cartStore';
import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { formatCurrency } from '@/src/utils/formatCurrency';

type FavoriteGlassCardProps = {
  product: Product;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export function FavoriteGlassCard({ product, onPress, onToggleFavorite }: FavoriteGlassCardProps) {
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
      <View style={styles.glass}>
        <BlurView
          intensity={Platform.OS === 'web' ? 18 : Platform.OS === 'android' ? 28 : 36}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tint} />
        <View style={styles.highlight} />

        <View style={styles.row}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={180}
          />

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.category} numberOfLines={1}>
              {product.categoryName}
            </Text>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.favBtn}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Remover dos favoritos">
              <MaterialIcons name="favorite" size={18} color={colors.accent} />
            </Pressable>

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
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(238, 242, 255, 0.42)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: colors.favoriteGlassHighlight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(91, 95, 239, 0.12)',
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
  category: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  price: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
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
    borderColor: 'rgba(91, 95, 239, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  cartBtnAdded: {
    backgroundColor: '#0D9668',
  },
});
